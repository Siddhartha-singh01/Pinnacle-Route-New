export const prerender = false;
import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

export const GET: APIRoute = async () => {
  const filePath = path.join(process.cwd(), 'src/data/settings.json');
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    // Only return public flags, not sensitive data if we ever add any
    return new Response(data, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify([]), { status: 200 });
  }
};
