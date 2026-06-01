/**
 * Service detail content
 * ----------------------
 * Full page content for every /services/[slug] page, keyed by slug.
 * Rendered by src/pages/services/[slug].astro.
 */
import type { ServiceDetail } from "@/types";

const I = {
  phone: "M7 3h10a1 1 0 011 1v16a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1zM10 18h4",
  code: "M8 9l-3 3 3 3M16 9l3 3-3 3",
  cloud: "M7 18a4 4 0 010-8 5 5 0 019.6 1.3A3.5 3.5 0 0117 18z",
  link: "M9 15l6-6M8 12l-2 2a3 3 0 004 4l2-2M16 12l2-2a3 3 0 00-4-4l-2 2",
  refresh: "M4 4v6h6M20 20v-6h-6M5 13a7 7 0 0012 4M19 11a7 7 0 00-12-4",
  bot: "M12 7V4M9 4h6M5 9h14v9H5zM9 13h.01M15 13h.01",
  bolt: "M13 3 5 14h6l-1 7 9-12h-6z",
  chart: "M4 19h16M7 16V9M12 16V5M17 16v-4",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5",
  apple: "M15 3c0 2-2 3-2 3M12 8c4 0 6 3 6 7s-3 6-4 6-2-1-3-1-2 1-3 1-4-2-4-6 2-7 6-7",
  android: "M7 10h10v7a1 1 0 01-1 1H8a1 1 0 01-1-1zM9 6a3 3 0 016 0M8 6l-1-2M16 6l1-2M5 11v4M19 11v4",
  layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5",
  search: "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3",
  pipeline: "M4 7h16M4 12h16M4 17h10",
  funnel: "M3 5h18l-7 8v5l-4 2v-7z",
  dashboard: "M4 4h16v7H4zM4 15h7v5H4zM15 15h5v5h-5z",
  box: "M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10",
  coins: "M12 8a4 2 0 100 4 4 2 0 100-4M8 10v4a4 2 0 008 0v-4",
  compass: "M12 21a9 9 0 110-18 9 9 0 010 18zM15 9l-2 6-4 2 2-6z",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  pen: "M4 20l4-1 11-11-3-3L5 16zM14 6l3 3",
  cart: "M6 6h15l-2 9H8zM6 6L5 3H2M9 20h.01M17 20h.01",
  plug: "M9 7V3M15 7V3M7 7h10v5a5 5 0 01-10 0zM12 17v4",
  users: "M9 11a3 3 0 100-6 3 3 0 000 6zM4 20a5 5 0 0110 0M16 11a3 3 0 100-6",
  bulb: "M9 18h6M10 21h4M12 3a6 6 0 00-3 11v2h6v-2a6 6 0 00-3-11z",
};

export const serviceDetails: Record<string, ServiceDetail> = {
  "custom-software-development": {
    slug: "custom-software-development",
    label: "Custom Software Development",
    category: "Tech & Innovation",
    intro:
      "Custom Software Development is at the core of what we do, building bespoke platforms engineered around your exact workflows. We craft scalable, secure, and future ready systems that grow with your business.",
    image: "/assets/client-proof/designer-club.png",
    subItems: [
      {
        id: "bespoke-web-applications",
        title: "Bespoke Web Applications",
        icon: I.code,
        body: [
          "We design and build web applications tailored precisely to your business, not bent around off the shelf software. From internal tools to customer facing platforms, every screen and workflow is shaped around how your team actually works.",
          "Our engineers favour clean architecture, modern frameworks, and rigorous testing, so the product you launch is fast, reliable, and ready to evolve as your needs change.",
        ],
        related: { prompt: "See how we approach product strategy.", label: "Our Expertise", href: "/our-expertise", icon: I.compass },
      },
      {
        id: "saas-platform-engineering",
        title: "SaaS & Platform Engineering",
        icon: I.cloud,
        body: [
          "We build multi tenant platforms designed to serve thousands of users without missing a beat. Authentication, billing, roles, and analytics are engineered in from the start, not bolted on later.",
          "Cloud native by default, our platforms scale horizontally, deploy continuously, and stay observable, so you can ship fast and sleep well.",
        ],
        related: { prompt: "Explore our SaaS development service.", label: "SaaS Development", href: "/services/saas-development/", icon: I.cloud },
      },
      {
        id: "api-systems-integration",
        title: "API & Systems Integration",
        icon: I.link,
        body: [
          "Your tools should talk to each other. We build robust APIs and integrations that connect your CRM, ERP, payment, and marketing systems into one coherent flow, removing manual handoffs and duplicate data.",
          "We handle the messy reality of third party services with resilient, well documented integrations that fail gracefully and recover automatically.",
        ],
        related: { prompt: "Automate the work between your tools.", label: "Workflow Automation", href: "/solutions/internal-workflow-automation/", icon: I.bolt },
      },
      {
        id: "legacy-modernization",
        title: "Legacy Modernization",
        icon: I.refresh,
        body: [
          "Aging software slows everything down. We modernise legacy systems incrementally, migrating data, refactoring critical paths, and rebuilding interfaces without halting your operations.",
          "The result is a system that keeps the institutional knowledge you depend on while gaining the speed, security, and maintainability of a modern stack.",
        ],
        related: { prompt: "Talk through your modernization roadmap.", label: "Book a call", href: "/strategy-call", icon: I.search },
      },
    ],
  },

  "ai-automation": {
    slug: "ai-automation",
    label: "AI & Automation",
    category: "Tech & Innovation",
    intro:
      "AI & Automation is where strategy meets leverage. We build intelligent systems that handle the repetitive work, surface insight from your data, and let your team focus on what only people can do.",
    image: "/assets/client-proof/mandaean-app.png",
    subItems: [
      {
        id: "ai-assistants-agents",
        title: "AI Assistants & Agents",
        icon: I.bot,
        body: [
          "We design AI assistants trained on your own knowledge that answer questions, draft work, and take actions across your tools. They handle the routine instantly and escalate to a human the moment judgement is needed.",
          "Every assistant is grounded in your data with guardrails, so responses stay accurate, on brand, and safe.",
        ],
        related: { prompt: "See automated support in action.", label: "Customer Support", href: "/solutions/automated-customer-support/", icon: I.bot },
      },
      {
        id: "workflow-automation",
        title: "Workflow Automation",
        icon: I.bolt,
        body: [
          "We map the manual processes that drain your team and automate them end to end, connecting the apps you already use so tasks trigger, route, and complete themselves.",
          "With reliable runs, clear audit trails, and alerts when a human is needed, automation becomes something you can trust rather than babysit.",
        ],
        related: { prompt: "Explore internal workflow automation.", label: "Workflow Automation", href: "/solutions/internal-workflow-automation/", icon: I.refresh },
      },
      {
        id: "predictive-analytics",
        title: "Predictive Analytics",
        icon: I.chart,
        body: [
          "We turn your historical data into forward looking signals, forecasting demand, churn, and revenue so you can plan with confidence instead of guesswork.",
          "Models are delivered inside clean dashboards your team will actually use, with the assumptions and accuracy made transparent.",
        ],
        related: { prompt: "Put your metrics on one screen.", label: "Executive Dashboards", href: "/solutions/executive-dashboards/", icon: I.dashboard },
      },
      {
        id: "document-data-processing",
        title: "Document & Data Processing",
        icon: I.doc,
        body: [
          "Invoices, contracts, forms, and emails carry data trapped in unstructured formats. We build pipelines that read, extract, classify, and route that information automatically and accurately.",
          "What used to take hours of manual entry happens in seconds, with confidence scores and human review only where it matters.",
        ],
        related: { prompt: "Discuss your data pipeline.", label: "Book a call", href: "/strategy-call", icon: I.search },
      },
    ],
  },

  "mobile-app-development": {
    slug: "mobile-app-development",
    label: "Mobile App Development",
    category: "Tech & Innovation",
    intro:
      "Mobile App Development is one of our core strengths, crafting elegant, future ready experiences across iOS, Android, and cross platform. We build apps that feel native, perform flawlessly, and keep users coming back.",
    image: "/assets/client-proof/mandaean-app.png",
    subItems: [
      {
        id: "custom-app-development",
        title: "Custom App Development",
        icon: I.phone,
        body: [
          "We specialise in designing and developing mobile applications that blend innovation, functionality, and scalability. We take a strategic approach, working closely with you to turn ideas into intuitive products that meet real business objectives.",
          "Our expertise covers the entire lifecycle, from product strategy and UX through engineering, rigorous testing, and seamless deployment across platforms, so every app is polished and ready for scale.",
        ],
        related: { prompt: "Want to learn more about our design practice?", label: "UI/UX Design", href: "/services/ui-ux-design/", icon: I.pen },
      },
      {
        id: "ios-app-development",
        title: "iOS App Development",
        icon: I.apple,
        body: [
          "We build high performance native iOS apps designed specifically for Apple's ecosystem. With deep expertise in Swift and SwiftUI, we craft experiences that take full advantage of iPhone and iPad capabilities.",
          "We follow Apple's best practices and integrate cleanly with the platform, from notifications and widgets to deeper system features, delivering apps that feel genuinely native and responsive.",
        ],
        related: { prompt: "See how we rebuild flagship apps.", label: "Our Work", href: "/#work", icon: I.search },
      },
      {
        id: "android-app-development",
        title: "Android App Development",
        icon: I.android,
        body: [
          "We create high quality native Android apps tailored to a diverse device ecosystem. With expertise in Kotlin and Jetpack Compose, we build apps that perform smoothly across screen sizes and hardware.",
          "Our approach prioritises technical excellence and adaptability, with rigorous testing and performance tuning so your app stays fast, secure, and reliable everywhere it runs.",
        ],
        related: { prompt: "Explore a real product case study.", label: "Our Work", href: "/#work", icon: I.search },
      },
      {
        id: "cross-platform-development",
        title: "Cross Platform Development",
        icon: I.layers,
        body: [
          "When speed and budget matter, cross platform with React Native lets you ship to iOS and Android from one codebase without sacrificing quality. We know when this is the right call, and when native is worth it.",
          "We architect cross platform apps for performance and maintainability, sharing logic while respecting each platform's conventions.",
        ],
        related: { prompt: "Not sure which approach fits?", label: "Book a call", href: "/strategy-call", icon: I.compass },
      },
      {
        id: "app-store-management-aso",
        title: "App Store Management & ASO",
        icon: I.search,
        body: [
          "Success extends far beyond launch. We manage the full submission process for both the App Store and Google Play, handling compliance, metadata, and creative assets to maximise visibility and downloads.",
          "We analyse rankings, reviews, and competitors to fine tune listings and improve organic discovery, then keep iterating to sustain long term growth.",
        ],
        related: { prompt: "Learn how the store process works.", label: "Read the guide", href: "/blog", icon: I.bulb },
      },
    ],
  },

  "crm-development": {
    slug: "crm-development",
    label: "CRM Development",
    category: "Strategy & Systems",
    intro:
      "CRM Development gives your team a system they actually use. We build and configure CRMs around how you really sell, with visual pipelines, automated follow ups, and reporting that shows what closes.",
    image: "/assets/client-proof/borrowed-luxe.webp",
    subItems: [
      {
        id: "custom-crm-build",
        title: "Custom CRM Build",
        icon: I.pipeline,
        body: [
          "Off the shelf CRMs force your process into their mould. We build CRMs shaped around your stages, fields, and workflows, so adoption is effortless and nothing important gets lost.",
          "Clean interfaces and sensible automation mean your team spends time selling, not wrestling with data entry.",
        ],
        related: { prompt: "See our CRM pipeline solution.", label: "CRM Pipelines", href: "/solutions/crm-sales-pipeline-systems/", icon: I.pipeline },
      },
      {
        id: "sales-pipeline-automation",
        title: "Sales Pipeline Automation",
        icon: I.funnel,
        body: [
          "We automate the busywork around your pipeline, logging activity, scheduling follow ups, and scoring leads so reps always know who to call next.",
          "Deals move forward on their own momentum, and nothing slips through the cracks.",
        ],
        related: { prompt: "Capture and convert more leads.", label: "AI Sales Funnels", href: "/solutions/ai-powered-sales-funnels/", icon: I.funnel },
      },
      {
        id: "crm-integrations",
        title: "CRM Integrations",
        icon: I.link,
        body: [
          "Your CRM is only as good as the data flowing into it. We integrate email, calendars, support, billing, and marketing so every customer touchpoint is captured automatically.",
          "One unified record of every customer, kept current without anyone lifting a finger.",
        ],
        related: { prompt: "Connect the tools you already use.", label: "Workflow Automation", href: "/solutions/internal-workflow-automation/", icon: I.bolt },
      },
      {
        id: "crm-reporting-dashboards",
        title: "Reporting & Dashboards",
        icon: I.dashboard,
        body: [
          "We turn CRM activity into forecasts and win rates you can trust, with dashboards built for reps, managers, and founders alike.",
          "Decisions get made on live numbers, not last month's spreadsheet.",
        ],
        related: { prompt: "Put your metrics on one screen.", label: "Executive Dashboards", href: "/solutions/executive-dashboards/", icon: I.dashboard },
      },
    ],
  },

  "erp-development": {
    slug: "erp-development",
    label: "ERP Systems",
    category: "Strategy & Systems",
    intro:
      "ERP Systems unify your operations, inventory, and finance into one core. We build ERP platforms that give you real time control over the whole business, replacing scattered spreadsheets with a single source of truth.",
    image: "/assets/client-proof/designer-club.png",
    subItems: [
      {
        id: "custom-erp-build",
        title: "Custom ERP Build",
        icon: I.grid,
        body: [
          "We design ERP systems around your operations rather than forcing your business into rigid software. Modules for the workflows you run, connected into one coherent platform.",
          "The result is end to end visibility, from the warehouse floor to the balance sheet, in real time.",
        ],
        related: { prompt: "See how we model complex systems.", label: "Our Expertise", href: "/our-expertise", icon: I.compass },
      },
      {
        id: "inventory-supply-chain",
        title: "Inventory & Supply Chain",
        icon: I.box,
        body: [
          "We build inventory and supply chain modules that track stock in real time across locations, automate reordering, and flag issues before they become stockouts.",
          "Less waste, fewer surprises, and the confidence that comes from always knowing what you have.",
        ],
        related: { prompt: "Explore inventory management.", label: "Inventory Systems", href: "/solutions/inventory-management-platforms/", icon: I.box },
      },
      {
        id: "finance-accounting-modules",
        title: "Finance & Accounting",
        icon: I.coins,
        body: [
          "Invoicing, payments, ledgers, and reporting unified into your ERP, with the controls and audit trails finance teams need.",
          "Close the books faster and trust the numbers you report.",
        ],
        related: { prompt: "Discuss your finance workflows.", label: "Book a call", href: "/strategy-call", icon: I.coins },
      },
      {
        id: "erp-integrations",
        title: "ERP Integrations",
        icon: I.link,
        body: [
          "We connect your ERP to ecommerce, CRM, logistics, and banking, so data flows automatically across the systems that run your business.",
          "No more re keying the same numbers into five places.",
        ],
        related: { prompt: "Connect every system together.", label: "Workflow Automation", href: "/solutions/internal-workflow-automation/", icon: I.plug },
      },
    ],
  },

  "ui-ux-design": {
    slug: "ui-ux-design",
    label: "UI/UX Design",
    category: "Experience & Design",
    intro:
      "UI/UX Design gives your product the polish of a luxury experience. Our designers and strategists turn complex ideas into seamless, engaging interfaces that keep people coming back.",
    image: "/assets/client-proof/borrowed-luxe.webp",
    subItems: [
      {
        id: "product-discovery",
        title: "Product Discovery",
        icon: I.compass,
        body: [
          "Great products start with the right questions. We run discovery to align on users, goals, and constraints before a pixel is drawn, de risking the build and sharpening the vision.",
          "You leave discovery with a clear, validated direction everyone can rally behind.",
        ],
        related: { prompt: "Validate your idea first.", label: "Product Validation", href: "/strategy-call", icon: I.search },
      },
      {
        id: "ux-interaction-design",
        title: "UX & Interaction Design",
        icon: I.layers,
        body: [
          "We craft user experiences that feel effortless, mapping flows, wireframes, and interactions that guide people to their goal without friction.",
          "Every tap, transition, and state is considered, so the product feels intuitive from the first use.",
        ],
        related: { prompt: "See our design led builds.", label: "Our Work", href: "/#work", icon: I.search },
      },
      {
        id: "visual-ui-design",
        title: "Visual & UI Design",
        icon: I.pen,
        body: [
          "We design interfaces with the restraint and polish of a premium brand, typography, colour, motion, and detail working together to feel considered and confident.",
          "The result looks beautiful and, more importantly, communicates trust.",
        ],
        related: { prompt: "Bring your brand to life.", label: "Book a call", href: "/strategy-call", icon: I.pen },
      },
      {
        id: "design-systems",
        title: "Design Systems",
        icon: I.grid,
        body: [
          "We build design systems that keep your product consistent and your team fast, a shared library of components, tokens, and patterns that scale across screens and squads.",
          "Design and engineering speak the same language, and shipping gets quicker over time.",
        ],
        related: { prompt: "Scale your product cleanly.", label: "Our Expertise", href: "/our-expertise", icon: I.grid },
      },
    ],
  },

  "ecommerce-development": {
    slug: "ecommerce-development",
    label: "Ecommerce Development",
    category: "Platforms & Commerce",
    intro:
      "Ecommerce Development builds storefronts that convert. We craft fast, beautiful, and reliable commerce experiences, from custom storefronts to headless architecture, engineered to grow revenue.",
    image: "/assets/client-proof/borrowed-luxe.webp",
    subItems: [
      {
        id: "custom-storefronts",
        title: "Custom Storefronts",
        icon: I.cart,
        body: [
          "We build storefronts tailored to your brand and catalog, fast, mobile first, and designed to turn browsers into buyers.",
          "Every detail, from product pages to checkout, is tuned for speed and conversion.",
        ],
        related: { prompt: "See a commerce project.", label: "Our Work", href: "/#work", icon: I.search },
      },
      {
        id: "headless-commerce",
        title: "Headless Commerce",
        icon: I.layers,
        body: [
          "Headless architecture decouples your storefront from the commerce engine, giving you total design freedom and the speed of a modern front end.",
          "Sell anywhere, customise everything, and scale without the limits of a monolithic platform.",
        ],
        related: { prompt: "Explore our platform engineering.", label: "Custom Software", href: "/services/custom-software-development/", icon: I.code },
      },
      {
        id: "payments-checkout",
        title: "Payments & Checkout",
        icon: I.coins,
        body: [
          "We build fast, secure, fraud aware checkout flows with the payment methods your customers expect, reducing abandonment at the most critical step.",
          "Fewer clicks, more trust, more completed orders.",
        ],
        related: { prompt: "Reduce checkout drop off.", label: "Book a call", href: "/strategy-call", icon: I.coins },
      },
      {
        id: "conversion-optimization",
        title: "Conversion Optimization",
        icon: I.chart,
        body: [
          "Traffic is only half the battle. We run continuous testing on layouts, copy, and flows to lift conversion rate and average order value over time.",
          "Compounding gains, backed by real data.",
        ],
        related: { prompt: "Turn traffic into revenue.", label: "AI Sales Funnels", href: "/solutions/ai-powered-sales-funnels/", icon: I.funnel },
      },
    ],
  },

  "saas-development": {
    slug: "saas-development",
    label: "SaaS Development",
    category: "Platforms & Commerce",
    intro:
      "SaaS Development takes your idea from MVP to scalable product. We build multi tenant platforms with subscriptions, analytics, and the architecture to grow, so you can focus on customers, not infrastructure.",
    image: "/assets/client-proof/mandaean-app.png",
    subItems: [
      {
        id: "mvp-product-build",
        title: "MVP & Product Build",
        icon: I.bolt,
        body: [
          "We help you ship a focused, credible MVP fast, the smallest product that proves value and earns real feedback, without painting you into a corner technically.",
          "From there we iterate toward product market fit with a stack built to scale.",
        ],
        related: { prompt: "Validate before you scale.", label: "Book a call", href: "/strategy-call", icon: I.search },
      },
      {
        id: "multi-tenant-architecture",
        title: "Multi Tenant Architecture",
        icon: I.cloud,
        body: [
          "We architect SaaS platforms to serve many customers securely from one codebase, with isolation, roles, and performance designed in from day one.",
          "Onboard new customers in minutes, not migrations.",
        ],
        related: { prompt: "See our custom software work.", label: "Custom Software", href: "/services/custom-software-development/", icon: I.code },
      },
      {
        id: "subscriptions-billing",
        title: "Subscriptions & Billing",
        icon: I.coins,
        body: [
          "We build subscription, metering, and billing systems that handle plans, trials, upgrades, and dunning reliably, the revenue backbone of any SaaS.",
          "Get paid correctly, automatically, at scale.",
        ],
        related: { prompt: "Discuss your pricing model.", label: "Book a call", href: "/strategy-call", icon: I.coins },
      },
      {
        id: "scaling-devops",
        title: "Scaling & DevOps",
        icon: I.refresh,
        body: [
          "As you grow, reliability becomes the product. We set up CI/CD, monitoring, and infrastructure that let you ship daily and stay up under load.",
          "Confidence to scale, without the 3am surprises.",
        ],
        related: { prompt: "Build for reliability.", label: "Our Expertise", href: "/our-expertise", icon: I.refresh },
      },
    ],
  },
};

export const serviceDetailSlugs = Object.keys(serviceDetails);
