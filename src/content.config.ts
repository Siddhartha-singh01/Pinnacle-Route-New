import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    category: z.enum(['AI Automation', 'Business Growth', 'eCommerce', 'Case Studies', 'SaaS', 'Strategy']),
    readTime: z.number(),
    author: z.string().default('Pinnacle Route Team'),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    views: z.number().default(0),
  }),
});

export const collections = {
  blog: blogCollection,
};
