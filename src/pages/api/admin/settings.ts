export const prerender = false;
import type { APIRoute } from 'astro';
import { db, FeatureFlags } from 'astro:db';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

// ── Validation ─────────────────────────────────────────────

interface SettingPayload {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

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
// Flags live in Astro DB (FeatureFlags table) — a JSON file is not writable
// on serverless hosts like Vercel, and wouldn't be shared between instances.

export const GET: APIRoute = async ({ cookies }) => {
  if (!verifySessionToken(cookies.get(SESSION_COOKIE)?.value)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const rows = await db.select().from(FeatureFlags);
    rows.sort((a, b) => a.orderIndex - b.orderIndex);
    const flags = rows.map(({ id, name, description, active }) => ({ id, name, description, active }));
    return new Response(JSON.stringify(flags), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Settings GET error:', error);
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

    // The client always sends the full list — replace the whole set,
    // preserving display order from the submitted array.
    await db.delete(FeatureFlags);
    if (sanitized.length > 0) {
      await db.insert(FeatureFlags).values(sanitized.map((s, i) => ({ ...s, orderIndex: i })));
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Settings POST error:', error);
    return new Response(JSON.stringify({ error: 'Failed to save settings' }), { status: 500 });
  }
};
