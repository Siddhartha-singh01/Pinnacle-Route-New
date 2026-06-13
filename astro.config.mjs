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
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Three.js is heavy — isolate it so it only ships to pages that need 3D
            if (id.includes('node_modules/three')) return 'vendor-three';
            // GSAP animation library — separate from the main bundle
            if (id.includes('node_modules/gsap')) return 'vendor-gsap';
            // React runtime — used by Chatbot component
            if (id.includes('node_modules/react')) return 'vendor-react';
          },
        },
      },
    },
  },
});