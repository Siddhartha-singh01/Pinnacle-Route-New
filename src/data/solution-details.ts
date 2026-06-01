/**
 * Solution detail content
 * -----------------------
 * Full page content for every /solutions/[slug] page, keyed by slug.
 * Rendered by src/pages/solutions/[slug].astro.
 */
import type { SolutionDetail, SolutionLayout } from "@/types";

// Shared line-icon glyph paths (24x24 viewBox, stroked).
const g = {
  funnel: "M3 5h18l-7 8v5l-4 2v-7z",
  target: "M12 21a9 9 0 110-18 9 9 0 010 18zM12 16a4 4 0 110-8 4 4 0 010 8z",
  chat: "M4 5h16v10H8l-4 4z",
  calendar: "M4 6h16v14H4zM4 10h16M8 4v4M16 4v4",
  chart: "M4 19h16M7 16V9M12 16V5M17 16v-4",
  bolt: "M13 3 5 14h6l-1 7 9-12h-6z",
  layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  shield: "M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z",
  arrowUp: "M12 20V6M6 12l6-6 6 6",
  check: "M5 12l4 4 10-10",
  link: "M9 15l6-6M8 12l-2 2a3 3 0 004 4l2-2M16 12l2-2a3 3 0 00-4-4l-2 2",
  users: "M9 11a3 3 0 100-6 3 3 0 000 6zM4 20a5 5 0 0110 0M16 11a3 3 0 100-6M20 20a5 5 0 00-4-4.9",
  clock: "M12 7v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  search: "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3",
  box: "M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10",
  pipeline: "M4 7h16M4 12h16M4 17h10",
  dashboard: "M4 4h16v7H4zM4 15h7v5H4zM15 15h5v5h-5z",
};

export const solutionDetails: Record<string, SolutionDetail> = {
  "ai-powered-sales-funnels": {
    slug: "ai-powered-sales-funnels",
    label: "AI Sales Funnels",
    eyebrow: "Solutions · Growth",
    title: "AI Sales",
    titleDim: "Funnels",
    tagline:
      "Turn cold traffic into booked calls with intelligent funnels that qualify, nurture, and convert on autopilot.",
    image: "/assets/client-proof/avp-global.png",
    overviewHeading: "Every lead, scored and",
    overviewHeadingDim: "nurtured automatically",
    overviewBody:
      "We design end to end funnels that capture intent, qualify leads with AI, and route the best ones straight to your calendar. No more chasing cold lists or guessing who is ready to buy.",
    featuresHeading: "Everything your funnel needs to convert",
    features: [
      { title: "Smart Lead Capture", desc: "High converting landing pages and forms tuned to your offer.", glyph: g.funnel },
      { title: "AI Qualification", desc: "Models score and segment every lead by intent and fit in real time.", glyph: g.target },
      { title: "Automated Nurture", desc: "Behaviour based email and message sequences that warm leads up.", glyph: g.chat },
      { title: "Calendar Routing", desc: "Sales ready leads booked straight into the right rep's calendar.", glyph: g.calendar },
      { title: "Conversion Analytics", desc: "See exactly where revenue comes from and where it leaks.", glyph: g.chart },
      { title: "Continuous Testing", desc: "Always on testing of copy, creative, and offers for compounding lift.", glyph: g.bolt },
    ],
    processHeading: "From cold click to booked call",
    steps: [
      { title: "Map", desc: "We map your offer, audience, and buying journey." },
      { title: "Build", desc: "We build the funnel, pages, automations, and scoring." },
      { title: "Launch", desc: "We launch, integrate your CRM, and start capturing." },
      { title: "Optimize", desc: "We test and refine for compounding conversion gains." },
    ],
    stats: [
      { value: "3.4x", label: "Average conversion lift" },
      { value: "60%", label: "Less manual follow up" },
      { value: "24/7", label: "Always on capture" },
    ],
    ctaHeadline: "Ready to fill your",
    ctaHeadlineDim: "pipeline?",
  },

  "executive-dashboards": {
    slug: "executive-dashboards",
    label: "Executive Dashboards",
    eyebrow: "Solutions · Intelligence",
    title: "Executive",
    titleDim: "Dashboards",
    tagline:
      "One source of truth for your whole business. Real time metrics that turn scattered data into confident decisions.",
    image: "/assets/client-proof/designer-club.png",
    overviewHeading: "Your entire business at",
    overviewHeadingDim: "a single glance",
    overviewBody:
      "We unify data from your tools into a clean, real time dashboard built for decision makers. No spreadsheets, no waiting on reports, just the numbers that matter, live.",
    featuresHeading: "Clarity for the people who decide",
    features: [
      { title: "Unified Data", desc: "Connect CRM, finance, ops, and marketing into one view.", glyph: g.layers },
      { title: "Real Time Metrics", desc: "Live KPIs that update the moment your business moves.", glyph: g.chart },
      { title: "Role Based Views", desc: "Tailored dashboards for founders, sales, and operations.", glyph: g.grid },
      { title: "Alerts & Anomalies", desc: "Automatic flags when a metric drifts off target.", glyph: g.shield },
      { title: "Forecasting", desc: "Trends and projections to plan ahead with confidence.", glyph: g.arrowUp },
      { title: "One Click Reports", desc: "Board ready reports generated whenever you need them.", glyph: g.check },
    ],
    processHeading: "From scattered data to one screen",
    steps: [
      { title: "Audit", desc: "We audit your data sources and key metrics." },
      { title: "Model", desc: "We model and connect your data pipelines." },
      { title: "Design", desc: "We design dashboards around your decisions." },
      { title: "Deliver", desc: "We deliver, train your team, and maintain." },
    ],
    stats: [
      { value: "1", label: "Source of truth" },
      { value: "Real time", label: "Always current" },
      { value: "10+", label: "Tools unified" },
    ],
    ctaHeadline: "See your business",
    ctaHeadlineDim: "clearly",
  },

  "automated-customer-support": {
    slug: "automated-customer-support",
    label: "Automated Customer Support",
    eyebrow: "Solutions · Service",
    title: "Automated Customer",
    titleDim: "Support",
    tagline:
      "Answer every customer instantly with AI support that resolves the routine and routes the rest to your team.",
    image: "/assets/client-proof/hawkeye-media.jpg",
    overviewHeading: "Instant answers,",
    overviewHeadingDim: "happier customers",
    overviewBody:
      "We deploy AI assistants trained on your knowledge base that handle the common questions around the clock, and hand off seamlessly to a human the moment it matters.",
    featuresHeading: "Support that never sleeps",
    features: [
      { title: "AI Assistant", desc: "Trained on your docs to answer accurately, instantly.", glyph: g.chat },
      { title: "Omnichannel", desc: "Web, WhatsApp, email, and chat in one inbox.", glyph: g.link },
      { title: "Smart Handoff", desc: "Escalates to the right human with full context.", glyph: g.users },
      { title: "Living Knowledge Base", desc: "A help centre that improves with every ticket.", glyph: g.layers },
      { title: "Round The Clock", desc: "Coverage that never queues and never sleeps.", glyph: g.clock },
      { title: "Ticket Insights", desc: "Spot trends to fix problems at the source.", glyph: g.search },
    ],
    processHeading: "From overloaded inbox to instant replies",
    steps: [
      { title: "Train", desc: "We train the assistant on your content and tone." },
      { title: "Connect", desc: "We connect your channels and help desk." },
      { title: "Automate", desc: "We automate the routine and set up handoffs." },
      { title: "Improve", desc: "We refine answers as your knowledge grows." },
    ],
    stats: [
      { value: "80%", label: "Tickets auto resolved" },
      { value: "<30s", label: "Average response" },
      { value: "24/7", label: "Coverage" },
    ],
    ctaHeadline: "Support that scales",
    ctaHeadlineDim: "with you",
  },

  "multi-vendor-marketplaces": {
    slug: "multi-vendor-marketplaces",
    label: "Multi Vendor Marketplaces",
    eyebrow: "Solutions · Platforms",
    title: "Multi Vendor",
    titleDim: "Marketplaces",
    tagline:
      "Launch a marketplace where vendors list, customers buy, and payments split automatically. Built to scale from day one.",
    image: "/assets/client-proof/borrowed-luxe.webp",
    overviewHeading: "A marketplace built to",
    overviewHeadingDim: "scale",
    overviewBody:
      "We build multi vendor platforms with vendor onboarding, catalog management, secure checkout, and automated payouts, so you can focus on growing supply and demand.",
    featuresHeading: "Everything a two sided platform needs",
    features: [
      { title: "Vendor Onboarding", desc: "Self serve sign up, verification, and storefronts.", glyph: g.users },
      { title: "Catalog Management", desc: "Powerful listings, search, and categorisation.", glyph: g.grid },
      { title: "Split Payments", desc: "Automatic commission and vendor payouts.", glyph: g.check },
      { title: "Ratings & Trust", desc: "Reviews, disputes, and trust signals built in.", glyph: g.shield },
      { title: "Secure Checkout", desc: "Fast, reliable, and fraud aware payments.", glyph: g.bolt },
      { title: "Admin Control", desc: "Full oversight of vendors, orders, and revenue.", glyph: g.dashboard },
    ],
    processHeading: "From idea to live marketplace",
    steps: [
      { title: "Scope", desc: "We define your model, fees, and core flows." },
      { title: "Build", desc: "We build the platform, storefronts, and admin." },
      { title: "Onboard", desc: "We onboard your first vendors and listings." },
      { title: "Scale", desc: "We grow supply, demand, and reliability." },
    ],
    stats: [
      { value: "Unlimited", label: "Vendors supported" },
      { value: "Auto", label: "Commission payouts" },
      { value: "99.9%", label: "Uptime" },
    ],
    ctaHeadline: "Launch your",
    ctaHeadlineDim: "marketplace",
  },

  "booking-rental-platforms": {
    slug: "booking-rental-platforms",
    label: "Booking & Rental Platforms",
    eyebrow: "Solutions · Platforms",
    title: "Booking & Rental",
    titleDim: "Platforms",
    tagline:
      "Let customers book, reserve, and pay in seconds. Real time availability, zero double bookings, fully automated.",
    image: "/assets/client-proof/mandaean-app.jpg",
    overviewHeading: "Reservations that run",
    overviewHeadingDim: "themselves",
    overviewBody:
      "We build booking and rental platforms with live availability, instant payments, and automated reminders, removing the back and forth and the no shows.",
    featuresHeading: "Built for bookings at any scale",
    features: [
      { title: "Real Time Availability", desc: "Live calendars that prevent double bookings.", glyph: g.calendar },
      { title: "Instant Payments", desc: "Deposits and full payments at the point of booking.", glyph: g.check },
      { title: "Automated Reminders", desc: "Cut no shows with timely notifications.", glyph: g.clock },
      { title: "Dynamic Pricing", desc: "Adjust rates by season, demand, or duration.", glyph: g.arrowUp },
      { title: "Multi Resource", desc: "Manage staff, rooms, vehicles, or equipment.", glyph: g.grid },
      { title: "Self Service", desc: "Customers reschedule and cancel without calling.", glyph: g.users },
    ],
    processHeading: "From manual booking to autopilot",
    steps: [
      { title: "Plan", desc: "We map your resources, rules, and pricing." },
      { title: "Build", desc: "We build the booking engine and calendars." },
      { title: "Integrate", desc: "We connect payments and notifications." },
      { title: "Launch", desc: "We launch and tune for conversions." },
    ],
    stats: [
      { value: "0", label: "Double bookings" },
      { value: "40%", label: "Fewer no shows" },
      { value: "24/7", label: "Self booking" },
    ],
    ctaHeadline: "Open your",
    ctaHeadlineDim: "calendar",
  },

  "inventory-management-platforms": {
    slug: "inventory-management-platforms",
    label: "Inventory Management",
    eyebrow: "Solutions · Operations",
    title: "Inventory",
    titleDim: "Management",
    tagline:
      "Always know what you have, where it is, and when to reorder. Real time inventory across every location.",
    image: "/assets/client-proof/avp-global.png",
    overviewHeading: "Never run out, never",
    overviewHeadingDim: "over order",
    overviewBody:
      "We build inventory platforms that track stock in real time across warehouses and channels, automate reordering, and give you the visibility to cut waste and stockouts.",
    featuresHeading: "Total visibility over your stock",
    features: [
      { title: "Real Time Tracking", desc: "Live stock levels across every location.", glyph: g.box },
      { title: "Auto Reordering", desc: "Reorder points that trigger purchase orders.", glyph: g.arrowUp },
      { title: "Multi Location", desc: "Warehouses, stores, and channels in sync.", glyph: g.grid },
      { title: "Barcode & SKU", desc: "Fast scanning and accurate counts.", glyph: g.search },
      { title: "Demand Forecasting", desc: "Predict what you need before you need it.", glyph: g.chart },
      { title: "Supplier Management", desc: "Track suppliers, lead times, and costs.", glyph: g.users },
    ],
    processHeading: "From guesswork to precision",
    steps: [
      { title: "Audit", desc: "We audit your stock, locations, and flows." },
      { title: "Model", desc: "We model SKUs, suppliers, and thresholds." },
      { title: "Automate", desc: "We automate counts and reordering." },
      { title: "Optimize", desc: "We tune levels to cut waste and stockouts." },
    ],
    stats: [
      { value: "99%", label: "Stock accuracy" },
      { value: "30%", label: "Less waste" },
      { value: "Real time", label: "Visibility" },
    ],
    ctaHeadline: "Take control of your",
    ctaHeadlineDim: "stock",
  },

  "crm-sales-pipeline-systems": {
    slug: "crm-sales-pipeline-systems",
    label: "CRM & Sales Pipelines",
    eyebrow: "Solutions · Sales",
    title: "CRM & Sales",
    titleDim: "Pipelines",
    tagline:
      "A CRM your team actually uses. Visual pipelines, automated follow ups, and never a dropped lead again.",
    image: "/assets/client-proof/hawkeye-media.jpg",
    overviewHeading: "Every deal, moving",
    overviewHeadingDim: "forward",
    overviewBody:
      "We build and configure CRM systems around how your team really sells, with visual pipelines, automated reminders, and reporting that shows what actually closes.",
    featuresHeading: "A pipeline that runs itself",
    features: [
      { title: "Visual Pipelines", desc: "Drag and drop stages tailored to your process.", glyph: g.pipeline },
      { title: "Automated Follow Up", desc: "Tasks and reminders so nothing slips.", glyph: g.clock },
      { title: "Lead Scoring", desc: "Focus reps on the deals most likely to close.", glyph: g.target },
      { title: "Email & Call Sync", desc: "Every touchpoint logged automatically.", glyph: g.link },
      { title: "Sales Reporting", desc: "Forecasts and win rates you can trust.", glyph: g.chart },
      { title: "Team Workflows", desc: "Handoffs and approvals built around your team.", glyph: g.users },
    ],
    processHeading: "From messy spreadsheets to a real system",
    steps: [
      { title: "Discover", desc: "We learn how your team really sells." },
      { title: "Configure", desc: "We configure pipelines and automations." },
      { title: "Migrate", desc: "We migrate your contacts and history." },
      { title: "Enable", desc: "We train your team and drive adoption." },
    ],
    stats: [
      { value: "0", label: "Dropped leads" },
      { value: "2x", label: "Rep productivity" },
      { value: "100%", label: "Activity logged" },
    ],
    ctaHeadline: "Close more,",
    ctaHeadlineDim: "chase less",
  },

  "internal-workflow-automation": {
    slug: "internal-workflow-automation",
    label: "Internal Workflow Automation",
    eyebrow: "Solutions · Operations",
    title: "Internal Workflow",
    titleDim: "Automation",
    tagline:
      "Automate the busywork. Connect your tools and let repetitive tasks run themselves, so your team does work that matters.",
    image: "/assets/client-proof/designer-club.png",
    overviewHeading: "Let the busywork",
    overviewHeadingDim: "run itself",
    overviewBody:
      "We map your manual processes and automate them across the tools you already use, removing copy paste, handoffs, and errors, and freeing your team for high value work.",
    featuresHeading: "Automation built around your team",
    features: [
      { title: "Process Mapping", desc: "We document and streamline before we automate.", glyph: g.layers },
      { title: "Tool Integration", desc: "Connect the apps your team already uses.", glyph: g.link },
      { title: "Trigger Automation", desc: "Events that kick off the right actions instantly.", glyph: g.bolt },
      { title: "Approvals & Routing", desc: "Tasks routed to the right person at the right time.", glyph: g.users },
      { title: "Error Handling", desc: "Reliable runs with alerts when a human is needed.", glyph: g.shield },
      { title: "Audit Trails", desc: "Full visibility into every automated action.", glyph: g.search },
    ],
    processHeading: "From manual grind to autopilot",
    steps: [
      { title: "Map", desc: "We document and streamline the process." },
      { title: "Connect", desc: "We integrate the tools involved." },
      { title: "Automate", desc: "We build and test the automations." },
      { title: "Monitor", desc: "We monitor, alert, and keep it reliable." },
    ],
    stats: [
      { value: "20+", label: "Hours saved weekly" },
      { value: "90%", label: "Fewer errors" },
      { value: "24/7", label: "Always running" },
    ],
    ctaHeadline: "Automate the",
    ctaHeadlineDim: "busywork",
  },
};

export const solutionSlugs = Object.keys(solutionDetails);

/**
 * Layout variant per page — every combination of (hero, features, light/dark,
 * process) is unique, so each of the 8 pages reads differently.
 */
export const solutionLayouts: Record<string, SolutionLayout> = {
  "ai-powered-sales-funnels": { hero: "left", overviewReverse: false, overviewMask: "arch", features: "cards", featuresLight: true, process: "grid" },
  "executive-dashboards": { hero: "split", overviewReverse: true, overviewMask: "tr", features: "rows", featuresLight: false, process: "timeline" },
  "automated-customer-support": { hero: "center", overviewReverse: false, overviewMask: "blob", features: "cards", featuresLight: false, process: "grid" },
  "multi-vendor-marketplaces": { hero: "left", overviewReverse: true, overviewMask: "bl", features: "rows", featuresLight: true, process: "timeline" },
  "booking-rental-platforms": { hero: "split", overviewReverse: false, overviewMask: "tl", features: "cards", featuresLight: true, process: "grid" },
  "inventory-management-platforms": { hero: "center", overviewReverse: true, overviewMask: "arch", features: "rows", featuresLight: false, process: "timeline" },
  "crm-sales-pipeline-systems": { hero: "left", overviewReverse: false, overviewMask: "tr", features: "cards", featuresLight: false, process: "grid" },
  "internal-workflow-automation": { hero: "split", overviewReverse: true, overviewMask: "blob", features: "rows", featuresLight: true, process: "timeline" },
};

export const defaultSolutionLayout: SolutionLayout = {
  hero: "left",
  overviewReverse: false,
  overviewMask: "arch",
  features: "cards",
  featuresLight: true,
  process: "grid",
};
