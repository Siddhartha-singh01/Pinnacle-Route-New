// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

// https://astro.build
export default defineConfig({
  site: "https://pinnacleroute.com",
  output: "static",
  adapter: vercel(),
  integrations: [react(), sitemap()],
  compressHTML: true,
  prefetch: { prefetchAll: true, defaultStrategy: "viewport" },
  vite: {
    plugins: [tailwindcss()],
  },
});
