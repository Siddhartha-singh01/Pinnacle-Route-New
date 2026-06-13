export const prerender = false;
import type { APIRoute } from 'astro';
import { db, FeatureFlags } from 'astro:db';

/**
 * Public feature-flag state (read-only). Exposes only ids + active so the
 * frontend can react (e.g. maintenance redirect) without leaking admin copy.
 */
export const GET: APIRoute = async () => {
  try {
    const rows = await db.select({ id: FeatureFlags.id, active: FeatureFlags.active }).from(FeatureFlags);
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Short CDN cache keeps this endpoint cheap while staying responsive
        // to admin toggles.
        'Cache-Control': 'public, max-age=0, s-maxage=30',
      }
    });
  } catch (error) {
    console.error('Public settings GET error:', error);
    return new Response(JSON.stringify([]), { status: 200 });
  }
};
