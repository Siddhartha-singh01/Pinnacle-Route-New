/**
 * Services
 * --------
 * All service offerings with labels, URL slugs, and icon glyphs.
 * Used by: Nav dropdown, Footer links, home expertise grid.
 */

import type { Service } from "@/types";

export const services: Service[] = [
  { label: "Custom Software", slug: "custom-software-development", glyph: "M8 9l-3 3 3 3M16 9l3 3-3 3" },
  { label: "AI & Automation", slug: "ai-automation", glyph: "M12 4v3M12 17v3M4 12h3M17 12h3M7 7l2 2M15 15l2 2" },
  { label: "Mobile Apps", slug: "mobile-app-development", glyph: "M8 3h8v18H8zM11 18h2" },
  { label: "CRM Development", slug: "crm-development", glyph: "M4 7h16v10H4zM4 11h16" },
  { label: "ERP Systems", slug: "erp-development", glyph: "M4 6h16v12H4zM4 10h16M10 6v12" },
  { label: "UI/UX Design", slug: "ui-ux-design", glyph: "M4 5h16v11H4zM4 20h16" },
  { label: "Ecommerce", slug: "ecommerce-development", glyph: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18" },
  { label: "SaaS Development", slug: "saas-development", glyph: "M18 10h-4V4h-4v6H6l6 6 6-6z" },
];

/** Helper — returns the full href for a service. */
export function serviceHref(slug: string): string {
  return `/services/${slug}/`;
}
