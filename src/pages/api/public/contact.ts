export const prerender = false;
import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { db, Inquiries } from 'astro:db';

// Initialize Resend
const resendApiKey = process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

// Admin email to receive inquiries
const adminEmail = process.env.ADMIN_EMAIL || import.meta.env.ADMIN_EMAIL;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Basic validation
    if (!data.email || !data.firstName || !data.lastName || !data.recaptchaToken) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Missing required fields' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify reCAPTCHA token
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY || import.meta.env.RECAPTCHA_SECRET_KEY;
    if (recaptchaSecret) {
      const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${data.recaptchaToken}`;
      const recaptchaResponse = await fetch(verifyUrl, { method: 'POST' });
      const recaptchaResult = await recaptchaResponse.json();

      if (!recaptchaResult.success) {
        return new Response(JSON.stringify({ 
          success: false, 
          message: 'reCAPTCHA verification failed. Please try again.' 
        }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else {
      console.warn("RECAPTCHA_SECRET_KEY is not set. Skipping verification.");
    }

    // Determine the subject based on the form type
    const isStrategyCall = !!data.projectType;
    const subject = isStrategyCall 
      ? `New Strategy Call Request: ${data.firstName} ${data.lastName}`
      : `New Contact Inquiry: ${data.firstName} ${data.lastName}`;

    // Construct the email body
    let htmlBody = `
      <h2>New Inquiry from ${data.firstName} ${data.lastName}</h2>
      <p><strong>Email:</strong> ${data.email}</p>
    `;

    if (data.phone) htmlBody += `<p><strong>Phone:</strong> ${data.phone}</p>`;
    if (data.company) htmlBody += `<p><strong>Company:</strong> ${data.company}</p>`;
    
    if (isStrategyCall) {
      htmlBody += `<p><strong>Project Type:</strong> ${data.projectType}</p>`;
    } else {
      if (data.budget) htmlBody += `<p><strong>Budget Range:</strong> ${data.budget}</p>`;
    }

    if (data.message) {
      htmlBody += `<h3>Message:</h3><p>${data.message.replace(/\\n/g, '<br/>')}</p>`;
    }
    
    if (data.newsletter !== undefined) {
      htmlBody += `<p><strong>Newsletter Subscribe:</strong> ${data.newsletter ? 'Yes' : 'No'}</p>`;
    }

    // Save to Astro DB (Lead Management System)
    try {
      await db.insert(Inquiries).values({
        id: crypto.randomUUID(),
        type: isStrategyCall ? 'strategy_call' : 'contact',
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        budget: data.budget || null,
        projectType: data.projectType || null,
        message: data.message || null,
        newsletter: !!data.newsletter,
        status: 'new',
        createdAt: new Date(),
      });
      console.log('Inquiry saved to database successfully');
    } catch (dbError) {
      console.error('Failed to save inquiry to database:', dbError);
      // We continue with sending the email even if DB insert fails
    }

    // Send the email via Resend
    if (!resendApiKey) {
       console.error("RESEND_API_KEY is not set. Cannot send email.");
       // In dev, we might want to just log it if we don't have a key yet.
       return new Response(JSON.stringify({ 
        success: true, 
        message: 'Dev mode: Email logged but not sent (missing API key)' 
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { error } = await resend.emails.send({
      from: 'Pinnacle Route Forms <onboarding@resend.dev>', // Update this when you have a verified domain
      to: adminEmail || 'admin@pinnacleroute.com',
      subject: subject,
      html: htmlBody,
      replyTo: data.email
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Failed to send email. Please try again later.' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Your inquiry has been sent successfully!' 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Contact API Error:', err);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'An unexpected error occurred.' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
