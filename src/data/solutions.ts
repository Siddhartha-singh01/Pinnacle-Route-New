/**
 * Solutions
 * ---------
 * All solution offerings with labels and URL slugs.
 * Used by: Nav dropdown, Footer links.
 */

import type { Solution } from "@/types";

export const solutions: Solution[] = [
  { label: "AI Sales Funnels", slug: "ai-powered-sales-funnels" },
  { label: "Executive Dashboards", slug: "executive-dashboards" },
  { label: "Customer Support", slug: "automated-customer-support" },
  { label: "Marketplaces", slug: "multi-vendor-marketplaces" },
  { label: "Booking Platforms", slug: "booking-rental-platforms" },
  { label: "Inventory Systems", slug: "inventory-management-platforms" },
  { label: "CRM Pipelines", slug: "crm-sales-pipeline-systems" },
  { label: "Workflow Automation", slug: "internal-workflow-automation" },
];

/** Helper — returns the full href for a solution. */
export function solutionHref(slug: string): string {
  return `/solutions/${slug}/`;
}
