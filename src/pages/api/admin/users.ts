export const prerender = false;
import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

// ── Validation ─────────────────────────────────────────────

interface UserPayload {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

const ALLOWED_ROLES = ['Super Admin', 'Admin', 'Editor', 'Author', 'Guest'];
const ALLOWED_STATUSES = ['Active', 'Suspended', 'Offline'];

function validateUsers(body: unknown): string | null {
  if (!Array.isArray(body)) return 'Body must be an array of users';
  if (body.length > 100) return 'Cannot exceed 100 users';

  for (let i = 0; i < body.length; i++) {
    const u = body[i];
    if (typeof u !== 'object' || u === null || Array.isArray(u)) return `User ${i}: must be an object`;
    if (typeof u.id !== 'number') return `User ${i}: id must be a number`;
    if (typeof u.name !== 'string' || u.name.trim().length === 0) return `User ${i}: name is required`;
    if (typeof u.email !== 'string' || u.email.trim().length === 0) return `User ${i}: email is required`;
    if (typeof u.role !== 'string' || !ALLOWED_ROLES.includes(u.role)) return `User ${i}: invalid role`;
    if (typeof u.status !== 'string' || !ALLOWED_STATUSES.includes(u.status)) return `User ${i}: invalid status`;
    if (typeof u.lastLogin !== 'string') return `User ${i}: lastLogin must be a string`;
  }
  return null;
}

/** Strip HTML tags from a string to prevent stored XSS. */
function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, '').trim();
}

function sanitizeUsers(users: UserPayload[]): UserPayload[] {
  return users.map(u => ({
    id: u.id,
    name: stripHtml(u.name).slice(0, 100),
    email: stripHtml(u.email).slice(0, 200),
    role: u.role,
    status: u.status,
    lastLogin: stripHtml(u.lastLogin).slice(0, 50),
  }));
}

// ── Handlers ───────────────────────────────────────────────

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
    const body = await request.json();

    const err = validateUsers(body);
    if (err) {
      return new Response(JSON.stringify({ error: err }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const sanitized = sanitizeUsers(body);
    const filePath = path.join(process.cwd(), 'src/data/users.json');
    await fs.writeFile(filePath, JSON.stringify(sanitized, null, 2), 'utf-8');
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to save users' }), { status: 500 });
  }
};
