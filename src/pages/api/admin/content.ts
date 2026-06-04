export const prerender = false;
import type { APIRoute } from 'astro';
import { db, SiteSettings, Navigation, TechStack, ExpertiseCategory, FAQCategory, WorkItem, CompanyInfo, ServiceDetails, SolutionDetails, eq } from 'astro:db';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

// ── Validation helpers ─────────────────────────────────────

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function isString(v: unknown): v is string {
  return typeof v === 'string';
}

function isNonEmptyString(v: unknown): v is string {
  return isString(v) && v.trim().length > 0;
}

function validateSiteSettings(body: unknown): string | null {
  if (!isObject(body)) return 'Body must be an object';
  const fields = ['siteName', 'description', 'contactEmail', 'contactPhone', 'address'];
  for (const f of fields) {
    if (body[f] !== undefined && !isString(body[f])) return `${f} must be a string`;
  }
  return null;
}

function validateFAQCategories(body: unknown): string | null {
  if (!Array.isArray(body)) return 'Body must be an array of FAQ categories';
  for (let i = 0; i < body.length; i++) {
    const cat = body[i];
    if (!isObject(cat)) return `Item ${i}: must be an object`;
    if (!isNonEmptyString(cat.id)) return `Item ${i}: id is required`;
    if (!isNonEmptyString(cat.title)) return `Item ${i}: title is required`;
    if (!Array.isArray(cat.itemsJson) && typeof cat.itemsJson !== 'object') return `Item ${i}: itemsJson is required`;
    if (typeof cat.orderIndex !== 'number') return `Item ${i}: orderIndex must be a number`;
  }
  return null;
}

function validateWorkItems(body: unknown): string | null {
  if (!Array.isArray(body)) return 'Body must be an array of work items';
  for (let i = 0; i < body.length; i++) {
    const item = body[i];
    if (!isObject(item)) return `Item ${i}: must be an object`;
    if (!isNonEmptyString(item.id)) return `Item ${i}: id is required`;
    if (!isNonEmptyString(item.title)) return `Item ${i}: title is required`;
    if (!isNonEmptyString(item.tag)) return `Item ${i}: tag is required`;
    if (!isNonEmptyString(item.img)) return `Item ${i}: img is required`;
    if (!isNonEmptyString(item.href)) return `Item ${i}: href is required`;
    if (typeof item.orderIndex !== 'number') return `Item ${i}: orderIndex must be a number`;
  }
  return null;
}

function validateCompanyInfo(body: unknown): string | null {
  if (!isObject(body)) return 'Body must be an object';
  if (body.careStatsJson !== undefined && typeof body.careStatsJson !== 'object') return 'careStatsJson must be a JSON object/array';
  if (body.partnerStatsJson !== undefined && typeof body.partnerStatsJson !== 'object') return 'partnerStatsJson must be a JSON object/array';
  if (body.whatWeDoJson !== undefined && typeof body.whatWeDoJson !== 'object') return 'whatWeDoJson must be a JSON object/array';
  return null;
}

function validateServiceDetails(body: unknown): string | null {
  if (!Array.isArray(body)) return 'Body must be an array of services';
  for (let i = 0; i < body.length; i++) {
    const s = body[i];
    if (!isObject(s)) return `Item ${i}: must be an object`;
    if (!isNonEmptyString(s.slug)) return `Item ${i}: slug is required`;
    if (!isNonEmptyString(s.label)) return `Item ${i}: label is required`;
  }
  return null;
}

function validateSolutionDetails(body: unknown): string | null {
  if (!Array.isArray(body)) return 'Body must be an array of solutions';
  for (let i = 0; i < body.length; i++) {
    const s = body[i];
    if (!isObject(s)) return `Item ${i}: must be an object`;
    if (!isNonEmptyString(s.slug)) return `Item ${i}: slug is required`;
    if (!isNonEmptyString(s.label)) return `Item ${i}: label is required`;
  }
  return null;
}

function validateNavigation(body: unknown): string | null {
  if (!Array.isArray(body)) return 'Body must be an array of navigation items';
  for (let i = 0; i < body.length; i++) {
    const item = body[i];
    if (!isObject(item)) return `Item ${i}: must be an object`;
    if (!isNonEmptyString(item.id)) return `Item ${i}: id is required`;
    if (!isNonEmptyString(item.label)) return `Item ${i}: label is required`;
    if (!isNonEmptyString(item.href)) return `Item ${i}: href is required`;
  }
  return null;
}

function validateTechStack(body: unknown): string | null {
  if (!Array.isArray(body)) return 'Body must be an array of tech stack items';
  for (let i = 0; i < body.length; i++) {
    const item = body[i];
    if (!isObject(item)) return `Item ${i}: must be an object`;
    if (typeof item.id !== 'number') return `Item ${i}: id must be a number`;
    if (!isNonEmptyString(item.name)) return `Item ${i}: name is required`;
    if (!isNonEmptyString(item.iconUrl)) return `Item ${i}: iconUrl is required`;
  }
  return null;
}

// ── GET handler ────────────────────────────────────────────

export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    if (!verifySessionToken(cookies.get(SESSION_COOKIE)?.value)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    if (type === 'settings') {
      const data = await db.select().from(SiteSettings);
      return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    
    if (type === 'navigation') {
      const data = await db.select().from(Navigation);
      return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (type === 'techstack') {
      const data = await db.select().from(TechStack);
      return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (type === 'expertise') {
      const data = await db.select().from(ExpertiseCategory);
      return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (type === 'faq') {
      const data = await db.select().from(FAQCategory);
      return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (type === 'portfolio') {
      const data = await db.select().from(WorkItem);
      return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (type === 'company') {
      const data = await db.select().from(CompanyInfo);
      return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (type === 'services') {
      const data = await db.select().from(ServiceDetails);
      return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (type === 'solutions') {
      const data = await db.select().from(SolutionDetails);
      return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Invalid type parameter' }), { status: 400 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

// ── POST handler ───────────────────────────────────────────

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    if (!verifySessionToken(cookies.get(SESSION_COOKIE)?.value)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const body = await request.json();

    // ── Site Settings (upsert) ─────────────────────────────
    if (type === 'settings') {
      const err = validateSiteSettings(body);
      if (err) return new Response(JSON.stringify({ error: err }), { status: 400 });

      const existing = await db.select().from(SiteSettings).where(eq(SiteSettings.id, 'global-settings'));
      if (existing.length > 0) {
        await db.update(SiteSettings).set(body).where(eq(SiteSettings.id, 'global-settings'));
      } else {
        await db.insert(SiteSettings).values({ id: 'global-settings', ...body });
      }
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // ── FAQ Categories (safe sync: insert new, then delete old) ─
    if (type === 'faq') {
      const err = validateFAQCategories(body);
      if (err) return new Response(JSON.stringify({ error: err }), { status: 400 });

      // Safe sync: snapshot old IDs, insert/upsert new, delete stale
      const oldRows = await db.select({ id: FAQCategory.id }).from(FAQCategory);
      const oldIds = new Set(oldRows.map(r => r.id));
      const newIds = new Set<string>();

      for (const cat of body) {
        newIds.add(cat.id);
        const existing = await db.select().from(FAQCategory).where(eq(FAQCategory.id, cat.id));
        if (existing.length > 0) {
          await db.update(FAQCategory).set(cat).where(eq(FAQCategory.id, cat.id));
        } else {
          await db.insert(FAQCategory).values(cat);
        }
      }
      // Remove categories that are no longer present
      for (const oldId of oldIds) {
        if (!newIds.has(oldId)) {
          await db.delete(FAQCategory).where(eq(FAQCategory.id, oldId));
        }
      }
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // ── Portfolio / Work Items (safe sync) ──────────────────
    if (type === 'portfolio') {
      const err = validateWorkItems(body);
      if (err) return new Response(JSON.stringify({ error: err }), { status: 400 });

      const oldRows = await db.select({ id: WorkItem.id }).from(WorkItem);
      const oldIds = new Set(oldRows.map(r => r.id));
      const newIds = new Set<string>();

      for (const item of body) {
        newIds.add(item.id);
        const existing = await db.select().from(WorkItem).where(eq(WorkItem.id, item.id));
        if (existing.length > 0) {
          await db.update(WorkItem).set(item).where(eq(WorkItem.id, item.id));
        } else {
          await db.insert(WorkItem).values(item);
        }
      }
      for (const oldId of oldIds) {
        if (!newIds.has(oldId)) {
          await db.delete(WorkItem).where(eq(WorkItem.id, oldId));
        }
      }
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // ── Company Info (upsert) ──────────────────────────────
    if (type === 'company') {
      const err = validateCompanyInfo(body);
      if (err) return new Response(JSON.stringify({ error: err }), { status: 400 });

      const existing = await db.select().from(CompanyInfo).where(eq(CompanyInfo.id, 'company-stats'));
      if (existing.length > 0) {
        await db.update(CompanyInfo).set(body).where(eq(CompanyInfo.id, 'company-stats'));
      } else {
        await db.insert(CompanyInfo).values({ id: 'company-stats', ...body });
      }
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // ── Service Details (upsert by slug) ───────────────────
    if (type === 'services') {
      const err = validateServiceDetails(body);
      if (err) return new Response(JSON.stringify({ error: err }), { status: 400 });

      for (const s of body) {
        const existing = await db.select().from(ServiceDetails).where(eq(ServiceDetails.slug, s.slug));
        if (existing.length > 0) {
          await db.update(ServiceDetails).set(s).where(eq(ServiceDetails.slug, s.slug));
        } else {
          await db.insert(ServiceDetails).values(s);
        }
      }
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // ── Solution Details (upsert by slug) ──────────────────
    if (type === 'solutions') {
      const err = validateSolutionDetails(body);
      if (err) return new Response(JSON.stringify({ error: err }), { status: 400 });

      for (const s of body) {
        const existing = await db.select().from(SolutionDetails).where(eq(SolutionDetails.slug, s.slug));
        if (existing.length > 0) {
          await db.update(SolutionDetails).set(s).where(eq(SolutionDetails.slug, s.slug));
        } else {
          await db.insert(SolutionDetails).values(s);
        }
      }
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
    
    // ── Navigation (safe sync) ─────────────────────────────
    if (type === 'navigation') {
      const err = validateNavigation(body);
      if (err) return new Response(JSON.stringify({ error: err }), { status: 400 });

      const oldRows = await db.select({ id: Navigation.id }).from(Navigation);
      const oldIds = new Set(oldRows.map(r => r.id));
      const newIds = new Set<string>();

      for (let i = 0; i < body.length; i++) {
        const item = { ...body[i], orderIndex: i };
        newIds.add(item.id);
        const existing = await db.select().from(Navigation).where(eq(Navigation.id, item.id));
        if (existing.length > 0) {
          await db.update(Navigation).set(item).where(eq(Navigation.id, item.id));
        } else {
          await db.insert(Navigation).values(item);
        }
      }
      for (const oldId of oldIds) {
        if (!newIds.has(oldId)) {
          await db.delete(Navigation).where(eq(Navigation.id, oldId));
        }
      }
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // ── Tech Stack (safe sync) ─────────────────────────────
    if (type === 'techstack') {
      const err = validateTechStack(body);
      if (err) return new Response(JSON.stringify({ error: err }), { status: 400 });

      const oldRows = await db.select({ id: TechStack.id }).from(TechStack);
      const oldIds = new Set(oldRows.map(r => r.id));
      const newIds = new Set<number>();

      for (let i = 0; i < body.length; i++) {
        const item = { ...body[i], orderIndex: i };
        newIds.add(item.id);
        const existing = await db.select().from(TechStack).where(eq(TechStack.id, item.id));
        if (existing.length > 0) {
          await db.update(TechStack).set(item).where(eq(TechStack.id, item.id));
        } else {
          await db.insert(TechStack).values(item);
        }
      }
      for (const oldId of oldIds) {
        if (!newIds.has(oldId)) {
          await db.delete(TechStack).where(eq(TechStack.id, oldId));
        }
      }
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
    
    return new Response(JSON.stringify({ error: 'Not implemented' }), { status: 501 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
