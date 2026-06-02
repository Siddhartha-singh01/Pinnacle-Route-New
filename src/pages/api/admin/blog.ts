export const prerender = false;
import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    if (!verifySessionToken(cookies.get(SESSION_COOKIE)?.value)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await request.json();
    
    // Basic validation
    if (!data.title || !data.content || !data.category) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Format current date as YYYY-MM-DD
    const pubDate = new Date().toISOString().split('T')[0];

    // Construct markdown content with frontmatter
    const fileContent = `---
title: "${data.title.replace(/"/g, '\\"')}"
description: "${(data.description || '').replace(/"/g, '\\"')}"
pubDate: ${pubDate}
category: "${data.category}"
readTime: ${Number(data.readTime) || 5}
featured: false
author: "Pinnacle Route Team"
views: 0
---

${data.content}
`;

    // Path to the blog content directory
    const contentDir = path.join(process.cwd(), 'src/content/blog');
    
    // Ensure directory exists
    await fs.mkdir(contentDir, { recursive: true });
    
    const filePath = path.join(contentDir, `${slug}.md`);

    // Write file
    await fs.writeFile(filePath, fileContent, 'utf-8');

    return new Response(JSON.stringify({ success: true, slug }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {

    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
