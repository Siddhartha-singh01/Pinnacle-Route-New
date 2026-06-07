export const prerender = false;
import type { APIRoute } from 'astro';
import { db, BlogPosts, eq } from 'astro:db';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

export const DELETE: APIRoute = async ({ request, cookies, params }) => {
  try {
    const token = cookies.get(SESSION_COOKIE)?.value;
    if (!verifySessionToken(token)) return new Response('Unauthorized', { status: 401 });

    const { id } = params;
    if (!id) return new Response('ID is required', { status: 400 });

    await db.delete(BlogPosts).where(eq(BlogPosts.slug, id));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized or error deleting blog post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request, cookies, params }) => {
  try {
    const token = cookies.get(SESSION_COOKIE)?.value;
    if (!verifySessionToken(token)) return new Response('Unauthorized', { status: 401 });

    const { id } = params;
    if (!id) return new Response('ID is required', { status: 400 });

    const body = await request.json();
    
    // We only update the provided fields. Slug remains the same.
    await db.update(BlogPosts)
      .set({
        title: body.title,
        description: body.description,
        category: body.category,
        readTime: Number(body.readTime),
        content: body.content
      })
      .where(eq(BlogPosts.slug, id));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
