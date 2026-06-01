// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";

// https://astro.build
export default defineConfig({
  site: "https://pinnacleroute.com",
  output: "static",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [react(), sitemap()],
  prefetch: { prefetchAll: true, defaultStrategy: "viewport" },
  vite: {
    plugins: [tailwindcss()],
  },
});
