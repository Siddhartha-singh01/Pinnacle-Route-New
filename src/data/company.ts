/**
 * Company
 * -------
 * Stats, accordion data, and social links for the "Our Company" page.
 */

import type { Stat, AccordionItem } from "@/types";

/* ── "We care" stats ────────────────────────────────────── */

export const careStats: Stat[] = [
  { value: "120+", label: "Projects Delivered", sub: "2024 to 2026" },
  { value: "30+", label: "Team Specialists", sub: "Remote first · Worldwide" },
];

/* ── Partner stats row ──────────────────────────────────── */

export const partnerStats: Stat[] = [
  { value: "8", label: "Years of craft" },
  { value: "40+", label: "Brands partnered" },
  { value: "1", label: "Obsessive standard" },
];

/* ── "What we do" accordion ─────────────────────────────── */

export const whatWeDo: AccordionItem[] = [
  {
    label: "Technology",
    desc: "We engineer robust, scalable systems. Custom software, AI automation, and cloud platforms built to perform under real world load.",
    tags: ["Custom Software", "AI & Automation", "Web Platforms", "Cloud & APIs", "System Integration"],
  },
  {
    label: "Experience",
    desc: "We craft interfaces with the polish of a luxury product, obsessing over every interaction, motion, and pixel.",
    tags: ["UI/UX Design", "Design Systems", "Prototyping", "Mobile Apps", "Brand Identity"],
  },
  {
    label: "Strategy",
    desc: "We surround clients with product, design, and engineering leaders, with a relentless focus on product fit, growth potential, and technical opportunity.",
    tags: ["Digital Transformation", "Product Validation", "AI Strategy", "Planning & Roadmapping", "Technical Audits"],
  },
  {
    label: "Growth",
    desc: "We turn shipped products into compounding growth with funnels, analytics, and automation that scale revenue.",
    tags: ["AI Sales Funnels", "CRM & Pipelines", "Analytics & Dashboards", "Marketing Automation", "Conversion Optimization"],
  },
];
