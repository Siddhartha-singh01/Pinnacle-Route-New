// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

import db from "@astrojs/db";

// https://astro.build
export default defineConfig({
  site: "https://pinnacleroute.com",
  output: "static",
  adapter: vercel(),
  integrations: [react(), sitemap(), db()],
  compressHTML: true,
  prefetch: { prefetchAll: true, defaultStrategy: "viewport" },
  vite: {
    plugins: [tailwindcss()],
  },
});