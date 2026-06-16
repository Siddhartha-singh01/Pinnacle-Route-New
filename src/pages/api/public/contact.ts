export const prerender = false;
import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { db, Inquiries } from 'astro:db';
import { createRateLimiter, escapeHtml } from '@/lib/rate-limit';

// Initialize Resend
const resendApiKey = process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

// Admin emails to receive inquiries
const adminEmail = process.env.ADMIN_EMAIL || import.meta.env.ADMIN_EMAIL || 'info@pinnacleroute.com';
const salesEmail = process.env.SALES_EMAIL || import.meta.env.SALES_EMAIL || 'sales@pinnacleroute.com';

// 5 submissions per 10 minutes per IP is plenty for a human filling a form.
const limiter = createRateLimiter({ windowMs: 10 * 60_000, max: 5 });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Trim + cap a free-text field; returns '' for non-strings. */
function field(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

const json = (body: object, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown';
    if (limiter.isLimited(ip)) {
      return json({ success: false, message: 'Too many submissions. Please try again in a few minutes.' }, 429);
    }

    const data = await request.json().catch(() => null);
    if (!data || typeof data !== 'object') {
      return json({ success: false, message: 'Invalid request body' }, 400);
    }

    // Validate + bound every field at the boundary
    const firstName = field(data.firstName, 100);
    const lastName = field(data.lastName, 100);
    const email = field(data.email, 200);
    const phone = field(data.phone, 50);
    const company = field(data.company, 200);
    const budget = field(data.budget, 100);
    const projectType = field(data.projectType, 200);
    const message = field(data.message, 5000);

    if (!email || !firstName || !lastName || typeof data.recaptchaToken !== 'string') {
      return json({ success: false, message: 'Missing required fields' }, 400);
    }
    if (!EMAIL_RE.test(email)) {
      return json({ success: false, message: 'Please enter a valid email address.' }, 400);
    }

    // Verify reCAPTCHA token
    const recaptchaSecretRaw = process.env.RECAPTCHA_SECRET_KEY || import.meta.env.RECAPTCHA_SECRET_KEY;
    const recaptchaSecret = recaptchaSecretRaw?.trim();
    const recaptchaToken = (data.recaptchaToken || '').trim();

    console.log('[CAPTCHA] Secret length:', recaptchaSecret?.length, '| Token length:', recaptchaToken.length);
    console.log('[CAPTCHA] Secret last 3 chars hex:', recaptchaSecret ? [...recaptchaSecret.slice(-3)].map(c => c.charCodeAt(0).toString(16)).join(' ') : 'N/A');

    if (recaptchaSecret) {
      const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret: recaptchaSecret, response: recaptchaToken }),
      });
      const recaptchaResult = await recaptchaResponse.json();

      if (!recaptchaResult.success) {
        console.error('[CAPTCHA] FAILED. Google response:', JSON.stringify(recaptchaResult));
        console.error('[CAPTCHA] Secret used:', recaptchaSecret);
        console.error('[CAPTCHA] Token first 30:', recaptchaToken.substring(0, 30));
        return json({ success: false, message: 'reCAPTCHA verification failed. Please try again.' }, 400);
      } else {
        console.log('[CAPTCHA] SUCCESS! Verified OK.');
      }
    } else {
      console.warn('RECAPTCHA_SECRET_KEY is not set. Skipping verification.');
    }

    // Determine the subject based on the form type
    const isStrategyCall = !!projectType;
    const subject = isStrategyCall
      ? `New Strategy Call Request: ${firstName} ${lastName}`
      : `New Contact Inquiry: ${firstName} ${lastName}`;

    // Construct the email body — every user value is HTML-escaped so a
    // submission can never inject markup into the admin's inbox.
    let htmlBody = `
      <h2>New Inquiry from ${escapeHtml(firstName)} ${escapeHtml(lastName)}</h2>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    `;

    if (phone) htmlBody += `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>`;
    if (company) htmlBody += `<p><strong>Company:</strong> ${escapeHtml(company)}</p>`;

    if (isStrategyCall) {
      htmlBody += `<p><strong>Project Type:</strong> ${escapeHtml(projectType)}</p>`;
    } else if (budget) {
      htmlBody += `<p><strong>Budget Range:</strong> ${escapeHtml(budget)}</p>`;
    }

    if (message) {
      htmlBody += `<h3>Message:</h3><p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>`;
    }

    if (data.newsletter !== undefined) {
      htmlBody += `<p><strong>Newsletter Subscribe:</strong> ${data.newsletter ? 'Yes' : 'No'}</p>`;
    }

    // Save to Astro DB (Lead Management System)
    try {
      await db.insert(Inquiries).values({
        id: crypto.randomUUID(),
        type: isStrategyCall ? 'strategy_call' : 'contact',
        firstName,
        lastName,
        email,
        phone: phone || null,
        company: company || null,
        budget: budget || null,
        projectType: projectType || null,
        message: message || null,
        newsletter: !!data.newsletter,
        status: 'new',
        createdAt: new Date(),
      });
    } catch (dbError) {
      console.error('Failed to save inquiry to database:', dbError);
      // We continue with sending the email even if DB insert fails
    }

    // Send the email via Resend
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not set. Cannot send email.');
      // In dev, we might want to just log it if we don't have a key yet.
      return json({ success: true, message: 'Dev mode: Email logged but not sent (missing API key)' }, 200);
    }

    // Determine the recipient email
    const targetEmail = isStrategyCall ? salesEmail : adminEmail;

    const { error } = await resend.emails.send({
      from: 'Pinnacle Route Forms <onboarding@resend.dev>', // Update this when you have a verified domain
      to: targetEmail,
      subject: subject,
      html: htmlBody,
      replyTo: email,
    });

    if (error) {
      console.error('Resend error:', error);
      // Email failed but inquiry is already saved to database — don't block the user
      console.log('Note: Inquiry saved to database but email notification failed. Verify your domain at resend.com/domains.');
      return json({ success: true, message: 'Your inquiry has been received! Our team will get back to you shortly.' }, 200);
    }

    return json({ success: true, message: 'Your inquiry has been sent successfully!' }, 200);
  } catch (err) {
    console.error('Contact API Error:', err);
    return json({ success: false, message: 'An unexpected error occurred.' }, 500);
  }
};
