export const prerender = false;
import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

export const GET: APIRoute = async ({ cookies }) => {
  if (!verifySessionToken(cookies.get(SESSION_COOKIE)?.value)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const filePath = path.join(process.cwd(), 'src/data/users.json');
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return new Response(data, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify([]), { status: 200 });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!verifySessionToken(cookies.get(SESSION_COOKIE)?.value)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const newUsers = await request.json();
    const filePath = path.join(process.cwd(), 'src/data/users.json');
    await fs.writeFile(filePath, JSON.stringify(newUsers, null, 2), 'utf-8');
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to save users' }), { status: 500 });
  }
};
