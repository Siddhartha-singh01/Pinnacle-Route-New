export const prerender = false;
import type { APIRoute } from 'astro';
import { db, BlogPosts, eq } from 'astro:db';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

/** Generate a URL-safe slug from a title. */
function safeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 80);
}

const ALLOWED_CATEGORIES = ['AI Automation', 'Business Growth', 'eCommerce', 'Case Studies', 'SaaS', 'Strategy'];

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    if (!verifySessionToken(cookies.get(SESSION_COOKIE)?.value)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await request.json();

    // ── Validation ───────────────────────────────────────────
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Title is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Content is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const category = typeof data.category === 'string' ? data.category : 'Strategy';
    if (!ALLOWED_CATEGORIES.includes(category)) {
      return new Response(JSON.stringify({ error: 'Invalid category' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const title = data.title.trim().slice(0, 200);
    const description = (typeof data.description === 'string' ? data.description : '').trim().slice(0, 500);
    const readTime = Math.max(1, Math.min(60, Number(data.readTime) || 5));
    const content = data.content.trim().slice(0, 100_000);

    const slug = safeSlug(title);
    if (!slug || slug.length < 2) {
      return new Response(JSON.stringify({ error: 'Title must produce a valid slug (at least 2 chars)' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // ── Upsert into the DB (works on read-only/serverless hosts) ──
    const existing = await db.select().from(BlogPosts).where(eq(BlogPosts.slug, slug));
    if (existing.length > 0) {
      // Update content but preserve original pubDate, views, author, featured.
      await db.update(BlogPosts)
        .set({ title, description, category, readTime, content })
        .where(eq(BlogPosts.slug, slug));
    } else {
      await db.insert(BlogPosts).values({
        slug,
        title,
        description,
        pubDate: new Date(),
        category,
        readTime,
        author: 'Pinnacle Route Team',
        featured: false,
        views: 0,
        content,
      });
    }

    return new Response(JSON.stringify({ success: true, slug }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    console.error('Admin blog API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
};
