# Pinnacle Route - Premium Digital Studio Platform

![Pinnacle Route Banner](public/assets/client-proof/designer-club.png)

Pinnacle Route is a state-of-the-art, premium digital studio portfolio and corporate platform. Designed with performance, modern aesthetics, and liquid-smooth animations in mind, this codebase serves as a comprehensive marketing site, headless CMS, and secure admin dashboard.

---

## 🚀 Complete Technology Stack

This project is built using a modern, hybrid rendering stack designed for blazing-fast performance, zero-JS by default frontend, and a secure backend developer experience:

### Core Framework & Database
- **[Astro](https://astro.build/) (v4+)**: The core framework. Used for Static Site Generation (SSG) of marketing pages and Server-Side Rendering (SSR) for the secure admin dashboard.
- **[Astro DB](https://astro.build/db/)**: A fully managed, libSQL-powered database (SQLite) integrated directly into Astro. Powers the entire headless CMS, navigation data, and lead management.
- **TypeScript**: Strictly typed across all components, database schemas, and API routes for maximum stability.

### UI & Styling
- **[Tailwind CSS](https://tailwindcss.com/) (v4)**: Utility-first CSS framework for rapid UI development. Integrated via `@tailwindcss/vite`.
- **Vanilla CSS (`global.css`)**: Used for defining CSS variables (design tokens), base resets, and custom `@layer` utilities.

### Interactivity & Components
- **[React 19](https://react.dev/)**: Integrated via `@astrojs/react`. Used exclusively for highly interactive, state-heavy client components (e.g., the secure Admin Dashboard, Feature Toggles, Lead Management, and Blog Editors).
- **Astro Components (`.astro`)**: Used for 90% of the UI (layouts, grids, cards, SEO) to ensure zero client-side JavaScript overhead.

### Animations & UX
- **[GSAP](https://gsap.com/)**: The industry standard for high-performance animations. Powers the scroll reveals, parallax imagery, and complex sequenced animations on page load.
- **[Lenis](https://lenis.studiofreight.com/)**: Provides buttery-smooth, native-feeling smooth scrolling across the entire application.

### Security & Integrations
- **Resend**: Integrated for reliable transactional email delivery (Strategy Call and Contact forms).
- **Google reCAPTCHA v3**: Invisible spam protection integrated into all frontend lead capture forms.
- **JWT (JSON Web Tokens)**: Secure HTTP-only cookies utilized for Admin dashboard authentication and session persistence.

---

## 📂 Detailed Architecture & File Structure

The project strictly follows a decoupled architectural pattern: separating the database schema, logic, and presentation.

```text
/
├── db/                   # Astro DB Configuration
│   ├── config.ts         # Centralized database schema definitions (libSQL)
│   └── seed.ts           # Development & Production seed data
├── src/
│   ├── components/       # UI Building Blocks
│   │   ├── admin/        # React-based interactive admin tools (BlogEditor, LeadManager)
│   │   ├── layout/       # Global layouts (Header, Footer, Navigation overlays)
│   │   ├── sections/     # Reusable page sections (Hero, ImageTextSplit, Marquee)
│   │   └── ui/           # Micro-components (Buttons, Icons, CustomCursor)
│   ├── layouts/          # Base HTML document wrappers containing SEO and global tags
│   ├── pages/            # File-based routing (Marketing pages, Admin views, API endpoints)
│   ├── scripts/          # Vanilla JS logic for GSAP, Lenis, and UI interactions
│   └── styles/           # Global CSS variables and font declarations
└── astro.config.mjs      # Framework configuration (Integrations, Vercel Adapter)
```

---

## 🗃️ Astro DB & The Content Layer

Pinnacle Route operates as a full headless CMS powered by Astro DB. Every piece of text, navigation link, and configuration is controlled via the centralized database layer.

### Core Database Tables (`db/config.ts`):
1. **`SiteSettings`**: Global configuration (Maintenance mode, reCAPTCHA toggles, SEO defaults).
2. **`Navigation`**: Dynamically powers the Main Menu, Mega-Menus, and Footer layout.
3. **`ExpertiseCategory` & `ServiceDetails`**: Powers the 4 main service pillars and the granular, full-page copy/layouts for dynamic `/services/[slug]` pages.
4. **`SolutionDetails`**: Contains configurations for the detailed solution landing pages.
5. **`BlogPosts`**: Complete schema for the Markdown-powered blog.
6. **`Inquiries`**: The Lead Management table capturing data from the Strategy Call and Referral forms.
7. **`Users`**: Secure authentication table for Admin access.

*Note: You can easily reset or modify the default site data by editing `db/seed.ts`.*

---

## 🔒 Secure Admin Dashboard

The platform includes a protected `/admin` route tailored for managing the platform without touching the codebase.

- **Authentication**: JWT-based secure login (`/admin/login`).
- **Site Settings Manager**: Toggle maintenance mode, enable/disable reCAPTCHA, and update global SEO metadata.
- **Blog Editor**: A full WYSIWYG React editor with Markdown support, auto-slug generation, and category management.
- **Lead Management**: A dedicated CRM-style interface (`/admin/leads`) to view, manage, and track form submissions (Strategy calls, Contact requests) directly from the database.

---

## 🌐 Pages & Routing (`src/pages/`)

### Marketing & Public Pages
- **`/` (Homepage)**: Composes the Hero, ExpertiseGrid, Marquee, WorkShowcase, ToolStrip, and CtaBanner into a high-converting landing page.
- **`/our-company`**: Focuses on company culture, statistics, and partnerships.
- **`/solutions/[slug]`** & **`/services/[slug]`**: Dynamic routing generating unique, database-driven landing pages based on the `SolutionDetails` and `ServiceDetails` tables.
- **`/strategy-call`**: A high-intent lead capture form page styled with glassmorphism and connected to the `Inquiries` database.
- **`/referral`**: A dual-step referral form capturing both the referrer and the prospect's details.

### API Endpoints (SSR)
- **`/api/contact`**: Secure endpoint for handling form submissions, executing reCAPTCHA validation, inserting into Astro DB, and dispatching Resend emails.
- **`/api/admin/*`**: Suite of protected endpoints handling authentication, blog CRUD operations, and setting modifications.

---

## ⚙️ Getting Started & Scripts

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in the required credentials:
   ```env
   # Admin Authentication
   JWT_SECRET="your-super-secret-jwt-key"
   ADMIN_EMAIL="admin@pinnacleroute.com"
   ADMIN_PASSWORD="secure-password-here"

   # Email Delivery (Resend)
   RESEND_API_KEY="re_..."

   # Google reCAPTCHA v3
   PUBLIC_RECAPTCHA_SITE_KEY="your-site-key"
   RECAPTCHA_SECRET_KEY="your-secret-key"
   ```

3. **Initialize the Database (Seed)**
   Run this to populate the local Astro DB with the default services, solutions, and navigation structure.
   ```bash
   npm run db:seed
   ```

4. **Development Server**
   Runs Astro in development mode with HMR and local database access.
   ```bash
   npm run dev
   ```

5. **Production Build**
   Compiles Astro components to static HTML/CSS and bundles React components for the client/server edge.
   ```bash
   npm run build
   ```

---

## 🚀 Deployment (Vercel)

Pinnacle Route is fully optimized for **Vercel** using the `@astrojs/vercel/serverless` adapter.

1. Connect your repository to Vercel.
2. Ensure you add all environment variables (`JWT_SECRET`, `RESEND_API_KEY`, `PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`) to the Vercel project settings.
3. Vercel will automatically build the project and provision the remote Astro DB instance.
4. **Pushing Database Schema to Production**:
   ```bash
   npm run db:push
   ```

---

## 🎨 Design System & Aesthetics

Pinnacle Route employs a highly customized aesthetic heavily reliant on CSS variables (`global.css`) and Tailwind:

- **Color Palette**: Dark mode biased (Ink, Surface, Surface-2) accented with striking Gold highlights and soft greys for typography.
- **Typography**: Uses modern, sleek fonts (`Inter Tight` and `Inter`) sized dynamically using CSS `clamp()` functions for perfect responsiveness across all devices.
- **Micro-Interactions**: Custom mask utilities (`mask-arch`, `mask-tl`, `mask-blob`) are used to create non-standard, organic bounding boxes for images and videos.

---

## 📄 License

MIT License

Copyright (c) 2026 Pinnacle Route

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
