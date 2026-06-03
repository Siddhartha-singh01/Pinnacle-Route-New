export const prerender = false;
import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

// ── Validation ─────────────────────────────────────────────

interface SettingPayload {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

const ALLOWED_SETTING_IDS = ['maintenance', 'blog_public', 'strategy_booking', 'analytics'];

function validateSettings(body: unknown): string | null {
  if (!Array.isArray(body)) return 'Body must be an array of settings';
  if (body.length > 20) return 'Cannot exceed 20 settings';

  for (let i = 0; i < body.length; i++) {
    const s = body[i];
    if (typeof s !== 'object' || s === null || Array.isArray(s)) return `Setting ${i}: must be an object`;
    if (typeof s.id !== 'string' || s.id.trim().length === 0) return `Setting ${i}: id is required`;
    if (typeof s.name !== 'string' || s.name.trim().length === 0) return `Setting ${i}: name is required`;
    if (typeof s.description !== 'string') return `Setting ${i}: description must be a string`;
    if (typeof s.active !== 'boolean') return `Setting ${i}: active must be a boolean`;
  }
  return null;
}

function sanitizeSettings(settings: SettingPayload[]): SettingPayload[] {
  return settings.map(s => ({
    id: s.id.trim().slice(0, 50),
    name: s.name.trim().slice(0, 100).replace(/<[^>]*>/g, ''),
    description: s.description.trim().slice(0, 500).replace(/<[^>]*>/g, ''),
    active: Boolean(s.active),
  }));
}

// ── Handlers ───────────────────────────────────────────────

export const GET: APIRoute = async ({ cookies }) => {
  if (!verifySessionToken(cookies.get(SESSION_COOKIE)?.value)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const filePath = path.join(process.cwd(), 'src/data/settings.json');
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
    const body = await request.json();

    const err = validateSettings(body);
    if (err) {
      return new Response(JSON.stringify({ error: err }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const sanitized = sanitizeSettings(body);
    const filePath = path.join(process.cwd(), 'src/data/settings.json');
    await fs.writeFile(filePath, JSON.stringify(sanitized, null, 2), 'utf-8');
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to save settings' }), { status: 500 });
  }
};
