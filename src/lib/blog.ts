/**
 * Blog data layer
 * ---------------
 * Reads blog posts from Astro DB (so admin-created posts persist on serverless
 * hosts) and renders markdown to HTML at request time using Astro's own
 * markdown pipeline (Shiki highlighting, GFM, heading IDs for the TOC).
 *
 * The returned `BlogPost` shape mirrors a content-collection entry
 * (`{ id, slug, data: {...} }`) so existing card/list components need no changes.
 */
import { db, BlogPosts } from 'astro:db';
import { createMarkdownProcessor, type MarkdownHeading } from '@astrojs/markdown-remark';

export interface BlogData {
  title: string;
  description: string;
  pubDate: Date;
  category: string;
  readTime: number;
  author: string;
  featured: boolean;
  views: number;
  image?: string;
}

export interface BlogPost {
  id: string;   // slug — components link via /blog/${post.id}
  slug: string;
  data: BlogData;
  content: string; // raw markdown body
}

function toBlogPost(row: typeof BlogPosts.$inferSelect): BlogPost {
  return {
    id: row.slug,
    slug: row.slug,
    content: row.content,
    data: {
      title: row.title,
      description: row.description,
      pubDate: row.pubDate instanceof Date ? row.pubDate : new Date(row.pubDate),
      category: row.category,
      readTime: row.readTime,
      author: row.author,
      featured: row.featured,
      views: row.views,
      image: row.image ?? undefined,
    },
  };
}

/** All posts, newest first. */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const rows = await db.select().from(BlogPosts);
  return rows
    .map(toBlogPost)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** A single post by slug, or null. */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const rows = await db.select().from(BlogPosts);
  const row = rows.find((r) => r.slug === slug);
  return row ? toBlogPost(row) : null;
}

// Create the markdown processor once and reuse it (it loads Shiki).
let _processor: Awaited<ReturnType<typeof createMarkdownProcessor>> | null = null;
async function getProcessor() {
  if (!_processor) _processor = await createMarkdownProcessor({});
  return _processor;
}

/** Render a markdown string to HTML + TOC headings. */
export async function renderMarkdown(
  content: string,
): Promise<{ html: string; headings: MarkdownHeading[] }> {
  const processor = await getProcessor();
  const { code, metadata } = await processor.render(content);
  return { html: code, headings: metadata.headings };
}
