export const prerender = false;
import type { APIRoute } from 'astro';
import { db, Inquiries, eq } from 'astro:db';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

export const DELETE: APIRoute = async ({ request, cookies, params }) => {
  try {
    const token = cookies.get(SESSION_COOKIE)?.value;
    if (!verifySessionToken(token)) return new Response('Unauthorized', { status: 401 });

    const { id } = params;
    if (!id) return new Response('ID is required', { status: 400 });

    await db.delete(Inquiries).where(eq(Inquiries.id, id));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized or error deleting lead' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
