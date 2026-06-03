import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { services, serviceHref } from "@/data/services";
import { solutions, solutionHref } from "@/data/solutions";

export const GET: APIRoute = async () => {
  const index = [];

  // 1. Add static pages (Main Menu)
  const corePages = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/our-company" },
    { label: "Our Expertise", href: "/our-expertise" },
    { label: "Strategy Call", href: "/strategy-call" },
    { label: "Blog", href: "/blog" },
    { label: "Referral Program", href: "/referral" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ];
  
  for (const page of corePages) {
    index.push({
      title: page.label,
      description: "Pinnacle Route core page.",
      url: page.href,
      category: "Page"
    });
  }

  // 2. Add Services
  for (const service of services) {
    index.push({
      title: service.label,
      description: `Learn more about our ${service.label} services.`,
      url: serviceHref(service.slug),
      category: "Service"
    });
  }

  // 3. Add Solutions
  for (const solution of solutions) {
    index.push({
      title: solution.label,
      description: `Explore our ${solution.label} solution.`,
      url: solutionHref(solution.slug),
      category: "Solution"
    });
  }

  // 4. Add Blog Posts
  const blogPosts = await getCollection("blog");
  for (const post of blogPosts) {
    index.push({
      title: post.data.title,
      description: post.data.description,
      url: `/blog/${post.id}`,
      category: "Article"
    });
  }

  return new Response(JSON.stringify(index), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
