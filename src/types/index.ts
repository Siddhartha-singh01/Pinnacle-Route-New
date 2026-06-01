/**
 * Pinnacle Route — Shared TypeScript interfaces
 * -----------------------------------------------
 * Every data file and component imports types from here.
 */

/* ── Navigation ─────────────────────────────────────────── */

export interface SubMenuItem {
  label: string;
  href: string;
}

export interface MenuItem {
  label: string;
  href: string;
  /** Number of columns in the dropdown grid (1 or 2). */
  cols?: number;
  /** If present, renders a dropdown with these sub-items. */
  items?: SubMenuItem[];
}

/* ── Services & Solutions ───────────────────────────────── */

export interface Service {
  label: string;
  slug: string;
  /** SVG path `d` attribute for the inline icon. */
  glyph: string;
}

export interface Solution {
  label: string;
  slug: string;
}

export interface SolutionFeature {
  title: string;
  desc: string;
  /** SVG path `d` attribute for the inline icon. */
  glyph: string;
}

export interface ProcessStep {
  title: string;
  desc: string;
}

/** Per-page layout variation so no two solution pages look alike. */
export interface SolutionLayout {
  hero: "left" | "center" | "split";
  overviewReverse: boolean;
  overviewMask: "tl" | "tr" | "bl" | "arch" | "blob";
  features: "cards" | "rows";
  featuresLight: boolean;
  process: "grid" | "timeline";
}

/** Full content for a single /solutions/[slug] detail page. */
export interface SolutionDetail {
  slug: string;
  label: string;
  eyebrow: string;
  title: string;
  titleDim: string;
  tagline: string;
  image: string;
  overviewHeading: string;
  overviewHeadingDim: string;
  overviewBody: string;
  featuresHeading: string;
  features: SolutionFeature[];
  processHeading: string;
  steps: ProcessStep[];
  stats: Stat[];
  ctaHeadline: string;
  ctaHeadlineDim: string;
}

/* ── Service detail pages ───────────────────────────────── */

export interface ServiceRelated {
  prompt: string;
  label: string;
  href: string;
  /** SVG path d string for the small card icon. */
  icon: string;
}

export interface ServiceSubItem {
  id: string;
  title: string;
  /** SVG path d string for the section icon. */
  icon: string;
  /** One or more paragraphs of detail copy. */
  body: string[];
  related?: ServiceRelated;
}

export interface ServiceDetail {
  slug: string;
  label: string;
  category: string;
  intro: string;
  image: string;
  subItems: ServiceSubItem[];
}

/* ── Portfolio ──────────────────────────────────────────── */

export interface WorkItem {
  title: string;
  tag: string;
  img: string;
}

/* ── Stats & Accordion ──────────────────────────────────── */

export interface Stat {
  value: string;
  label: string;
  sub?: string;
}

export interface AccordionItem {
  label: string;
  desc: string;
  tags: string[];
}

/* ── Social Links ───────────────────────────────────────── */

export interface SocialLink {
  label: string;
  href: string;
}

/* ── Expertise Page ─────────────────────────────────────── */

export interface ExpertiseService {
  label: string;
  /** SVG path d string for the icon */
  icon: string;
}

export interface ExpertiseCategory {
  id: string; // e.g., "technology"
  number: string; // e.g., "1"
  navLabel: string; // e.g., "01 Technology"
  titleLine1: string; // e.g., "Tech &"
  titleLine2: string; // e.g., "Innovation"
  description: string;
  image: string;
  services: ExpertiseService[];
}

/* ── Footer Column ──────────────────────────────────────── */

export interface FooterColumn {
  title: string;
  links: SubMenuItem[];
}
