# Pinnacle Route - Premium Digital Studio Platform

![Pinnacle Route Banner](public/assets/client-proof/designer-club.png)

Pinnacle Route is a state-of-the-art, premium digital studio portfolio and corporate platform. Designed with performance, modern aesthetics, and liquid-smooth animations in mind, this codebase serves as a comprehensive marketing site, CMS, and admin dashboard.

---

## 🚀 Complete Technology Stack

This project is built using a modern, hybrid rendering stack designed for blazing-fast performance and seamless developer experience:

### Core Framework & Routing
- **[Astro](https://astro.build/) (v4+)**: The core framework. Used for Static Site Generation (SSG) of marketing pages and Server-Side Rendering (SSR) for the secure admin dashboard. Astro provides the Zero-JS by default approach.
- **TypeScript**: Strictly typed across all components, data stores, and API routes for maximum stability.

### UI & Styling
- **[Tailwind CSS](https://tailwindcss.com/) (v4)**: Utility-first CSS framework for rapid UI development. Integrated via `@tailwindcss/vite`.
- **[Tailwind Typography](https://tailwindcss.com/docs/typography-plugin)**: `@tailwindcss/typography` used to render beautiful, legible markdown in the blog and documentation pages (`prose` classes).
- **Vanilla CSS (`global.css`)**: Used for defining CSS variables (design tokens), base resets, and custom `@layer` utilities.

### Interactivity & Components
- **[React 19](https://react.dev/)**: Integrated via `@astrojs/react`. Used exclusively for highly interactive, state-heavy client components (e.g., the secure Admin Dashboard, Feature Toggles, and Blog Editors).
- **Astro Components (`.astro`)**: Used for 90% of the UI (layouts, grids, cards, SEO) to ensure zero client-side JavaScript overhead.

### Animations & UX
- **[GSAP](https://gsap.com/)**: The industry standard for high-performance animations. Powers the scroll reveals, parallax imagery, and complex sequenced animations on page load.
- **[Lenis](https://lenis.studiofreight.com/)**: Provides buttery-smooth, native-feeling smooth scrolling across the entire application.

### Data & Content Management
- **Astro Content Collections**: Type-safe Markdown management with Zod schema validation (`src/content.config.ts`) for the Blog.
- **Local JSON & TS Data Stores**: A fully decoupled data layer (`src/data/*`) that acts as a headless CMS without the database overhead.

---

## 📂 Detailed Architecture & File Structure

The project strictly follows a decoupled architectural pattern: separating data, logic, and presentation.

```text
/src
├── /components       # UI Building Blocks
│   ├── /admin        # React-based interactive admin tools (BlogEditor, FeatureToggles)
│   ├── /blog         # Blog-specific UI (BlogCard, FilterBar, Sidebar)
│   ├── /layout       # Global layouts (Header, Footer, Navigation overlays)
│   ├── /sections     # Reusable page sections (Hero, Accordion, ImageTextSplit, Marquee, ToolStrip)
│   └── /ui           # Micro-components (Buttons, Icons, StickyNav)
├── /content          # Markdown content collections (Blog posts)
├── /data             # The Data Layer (acts as a headless CMS)
├── /layouts          # Base page wrappers containing SEO and global tags
├── /pages            # File-based routing (Marketing pages, Admin views, API endpoints)
└── /types.ts         # Global TypeScript interfaces
```

---

## 🗃️ The Data Layer (`src/data/`)

Every piece of text, image path, and configuration on the website is controlled via a centralized data layer.

1. **`company.ts`**: Contains the core stats (e.g., "120+ Projects Delivered"), partner statistics, and the "What we do" accordion data for the Our Company page.
2. **`expertise.ts`**: Defines the 4 main service pillars (Technology, Design, Strategy, Growth), their descriptions, visual assets, and nested sub-services.
3. **`services.ts` & `service-details.ts`**: The top-level service definitions and the granular, full-page copy/layouts for dynamic `/services/[slug]` pages.
4. **`solutions.ts` & `solution-details.ts`**: Contains configurations for the 8 detailed solution pages. Includes specific layout toggles for each page (e.g., reversing the hero, alternating feature grids).
5. **`tools.ts`**: The array of technology brand logos used in the infinite scrolling `ToolStrip.astro` and `Marquee.astro` components.
6. **`work.ts`**: The portfolio items (Borrowed Luxe, Designer Club, Mandaean App, AVP Global, Hawkeye Media) rendered in the `WorkShowcase.astro` grid.
7. **`navigation.ts`**: A unified structure that generates the Header dropdowns, mobile navigation, and multi-column Footer links.
8. **`site.ts`**: Global SEO metadata, site title, and OpenGraph defaults.
9. **`users.json` & `settings.json`**: Flat-file database used by the secure Admin API for authentication and global site toggles.

---

## 🌐 Pages & Routing (`src/pages/`)

### Marketing & Public Pages
- **`/` (Homepage)**: Composes the Hero, ExpertiseGrid, Marquee, WorkShowcase, ToolStrip, and CtaBanner into a high-converting landing page.
- **`/our-company`**: Focuses on company culture, statistics, and partnerships.
- **`/our-expertise`**: Deep dive into the 4 service pillars with a sticky sub-navigation.
- **`/solutions/[slug]`**: Dynamic routing that generates 8 unique solution pages based on `solution-details.ts`.
- **`/services/[slug]`**: Dynamic routing for individual service deep-dives.
- **`/strategy-call`**: A high-intent lead capture form page styled with glassmorphism.
- **`/referral`**: A dual-step referral form capturing both the referrer and the prospect's details.
- **`/privacy-policy`**: A beautifully formatted, legally compliant privacy and data protection page.
- **`/maintenance`**: A fallback page automatically triggered via the Admin dashboard when the site is placed in maintenance mode.

### Content (Blog)
- **`/blog`**: The main index featuring a grid of markdown posts, search filtering, and category sorting.
- **`/blog/[slug]`**: Dynamically generates full articles from `src/content/blog/`, injecting a newsletter sidebar and rich typography.

### Secure Admin Area
- **`/admin/login`**: Authenticates users against `users.json` and issues a secure JWT cookie.
- **`/admin/settings`**: A React-powered dashboard to manage global site configurations, feature toggles, and user access.
- **`/admin/blog`**: Index of all written content.
- **`/admin/blog/new`**: A full Markdown WYSIWYG editor built in React to write and publish new articles.
- **`/api/*`**: Astro server endpoints (SSR) handling login, logout, settings persistence, and user management.

---

## 🎨 Design System & Aesthetics

Pinnacle Route employs a highly customized aesthetic heavily reliant on CSS variables (`global.css`) and Tailwind:

- **Color Palette**: Dark mode biased (Ink, Surface, Surface-2) accented with striking Gold highlights and soft greys for typography.
- **Typography**: Uses modern, sleek fonts (`font-display` and `font-sans`) sized dynamically using CSS `clamp()` functions for perfect responsiveness across all devices.
- **Micro-Interactions**: Custom mask utilities (`mask-arch`, `mask-tl`, `mask-blob`) are used to create non-standard, organic bounding boxes for images and videos.
- **Animations**:
  - `data-reveal`: Elements fade and slide up sequentially on scroll.
  - `data-parallax`: Images move at a different speed than the scroll axis to create depth.
  - `data-magnetic`: Buttons and links attract the cursor for a premium, tactile feel.

---

## ⚙️ Getting Started & Scripts

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Development Server**
   Runs Astro in development mode with HMR (Hot Module Replacement).
   ```bash
   npm run dev
   ```

3. **Production Build**
   Compiles Astro components to static HTML/CSS and bundles React components for the client.
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

---

## 📄 License

MIT License

Copyright (c) 2026 Pinnacle Route

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
