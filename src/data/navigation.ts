/**
 * Navigation
 * ----------
 * Unified menu structure consumed by Nav.astro and Footer.astro.
 * Imports services & solutions so link data is never duplicated.
 */

import type { MenuItem, FooterColumn, SocialLink } from "@/types";
import { services, serviceHref } from "./services";
import { solutions, solutionHref } from "./solutions";

/* ── Main menu (header nav) ─────────────────────────────── */

export const mainMenu: MenuItem[] = [
  { label: "About Us", href: "/our-company" },
  {
    label: "Solutions",
    href: "/#solutions",
    cols: 2,
    items: solutions.map((s) => ({ label: s.label, href: solutionHref(s.slug) })),
  },
  { label: "Work", href: "/#work" },
  // Logo goes here in the middle
  {
    label: "Services",
    href: "/our-expertise",
    cols: 2,
    items: services.map((s) => ({ label: s.label, href: serviceHref(s.slug) })),
  },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

/* ── Footer columns ─────────────────────────────────────── */

export const footerColumns: FooterColumn[] = [
  {
    title: "Pinnacle Route",
    links: [
      { label: "Our Work", href: "/#work" },
      { label: "Our Expertise", href: "/our-expertise" },
      { label: "Blog", href: "/blog" },
      { label: "Referral", href: "/referral" },
      { label: "Strategy Call", href: "/strategy-call" },
    ],
  },
  {
    title: "Services",
    links: services.slice(0, 6).map((s) => ({ label: s.label, href: serviceHref(s.slug) })),
  },
  {
    title: "Solutions",
    links: solutions.slice(0, 6).map((s) => ({ label: s.label, href: solutionHref(s.slug) })),
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/our-company" },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
      { label: "Referral Program", href: "/referral" },
      { label: "Privacy Policy", href: "/privacy-policy/" },
    ],
  },
];

/* ── Social links ───────────────────────────────────────── */

export const socials: SocialLink[] = [
  { label: "WhatsApp", href: "https://api.whatsapp.com/send/?phone=919621391943&text=Hi+Pinnacle+Route%2C+I+would+like+to+book+a+free+strategy+session.&type=phone_number&app_absent=0" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/pinnacle-route" },
  { label: "Twitter / X", href: "https://x.com/PinnacleRoute" },
  { label: "Instagram", href: "https://www.instagram.com/pinnacle_route/" },
];
