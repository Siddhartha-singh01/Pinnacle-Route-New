export const prerender = false;
import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

/** Sanitize a string for safe use inside YAML double-quoted values. */
function sanitizeYaml(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

/** Generate a filesystem-safe slug from a title. */
function safeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 80); // limit slug length
}

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    if (!verifySessionToken(cookies.get(SESSION_COOKIE)?.value)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await request.json();
    
    // ── Input validation ─────────────────────────────────────
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Title is required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }
    if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Content is required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }
    if (!data.category || typeof data.category !== 'string') {
      return new Response(JSON.stringify({ error: 'Category is required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }

    const title = data.title.trim().slice(0, 200);
    const description = (typeof data.description === 'string' ? data.description : '').trim().slice(0, 500);
    const category = data.category.trim().slice(0, 50);
    const readTime = Math.max(1, Math.min(60, Number(data.readTime) || 5));
    const content = data.content.trim().slice(0, 50_000); // 50KB max

    // ── Slug generation with path-traversal protection ───────
    const slug = safeSlug(title);
    if (!slug || slug.length < 2) {
      return new Response(JSON.stringify({ error: 'Title must produce a valid slug (at least 2 chars)' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }

    const contentDir = path.resolve(process.cwd(), 'src/content/blog');
    const filePath = path.resolve(contentDir, `${slug}.md`);

    // Path traversal guard: resolved path MUST be inside contentDir
    if (!filePath.startsWith(contentDir + path.sep) && filePath !== path.join(contentDir, `${slug}.md`)) {
      return new Response(JSON.stringify({ error: 'Invalid slug — path traversal rejected' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }

    // ── Construct safe markdown with sanitized frontmatter ───
    const pubDate = new Date().toISOString().split('T')[0];
    const fileContent = `---
title: "${sanitizeYaml(title)}"
description: "${sanitizeYaml(description)}"
pubDate: ${pubDate}
category: "${sanitizeYaml(category)}"
readTime: ${readTime}
featured: false
author: "Pinnacle Route Team"
views: 0
---

${content}
`;

    await fs.mkdir(contentDir, { recursive: true });
    await fs.writeFile(filePath, fileContent, 'utf-8');

    return new Response(JSON.stringify({ success: true, slug }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    console.error('Admin blog API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
