export const prerender = false;
import type { APIRoute } from 'astro';
import { db, SiteSettings, Navigation, TechStack, ExpertiseCategory, eq } from 'astro:db';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    if (!verifySessionToken(cookies.get(SESSION_COOKIE)?.value)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    if (type === 'settings') {
      const data = await db.select().from(SiteSettings);
      return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    
    if (type === 'navigation') {
      const data = await db.select().from(Navigation);
      return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (type === 'techstack') {
      const data = await db.select().from(TechStack);
      return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (type === 'expertise') {
      const data = await db.select().from(ExpertiseCategory);
      return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Invalid type parameter' }), { status: 400 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    if (!verifySessionToken(cookies.get(SESSION_COOKIE)?.value)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const body = await request.json();

    if (type === 'settings') {
      // Upsert the site settings
      const existing = await db.select().from(SiteSettings).where(eq(SiteSettings.id, 'global-settings'));
      if (existing.length > 0) {
        await db.update(SiteSettings).set(body).where(eq(SiteSettings.id, 'global-settings'));
      } else {
        await db.insert(SiteSettings).values({ id: 'global-settings', ...body });
      }
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // Additional POST handlers for Navigation, TechStack, Expertise can be added here
    
    return new Response(JSON.stringify({ error: 'Not implemented' }), { status: 501 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
