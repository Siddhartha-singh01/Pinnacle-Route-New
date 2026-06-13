import { defineDb, defineTable, column } from 'astro:db';

// Admin feature toggles (maintenance mode, blog visibility, …). Stored in the
// DB — NOT a JSON file — because serverless hosts have a read-only filesystem.
const FeatureFlags = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    description: column.text(),
    active: column.boolean({ default: false }),
    orderIndex: column.number({ default: 0 }),
  }
});

const SiteSettings = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    siteName: column.text(),
    description: column.text(),
    contactEmail: column.text(),
    contactPhone: column.text(),
    address: column.text(),
    logoUrl: column.text({ optional: true }),
  }
});

const Navigation = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    label: column.text(),
    href: column.text(),
    orderIndex: column.number(),
    parentId: column.text({ optional: true }), // For sub-menus
  }
});

const TechStack = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    iconUrl: column.text(),
    orderIndex: column.number(),
  }
});

const ExpertiseCategory = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    titleLine1: column.text(),
    titleLine2: column.text(),
    description: column.text(),
    mediaUrl: column.text(),
    servicesJson: column.json(), // Array of services with icons
    orderIndex: column.number(),
  }
});

const FAQCategory = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    title: column.text(),
    itemsJson: column.json(), // Array of {question, answer}
    orderIndex: column.number(),
  }
});

const WorkItem = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    title: column.text(),
    tag: column.text(),
    img: column.text(),
    href: column.text(),
    orderIndex: column.number(),
  }
});

const CompanyInfo = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    careStatsJson: column.json(),
    partnerStatsJson: column.json(),
    whatWeDoJson: column.json(),
  }
});

const ServiceDetails = defineTable({
  columns: {
    slug: column.text({ primaryKey: true }),
    label: column.text(),
    category: column.text(),
    intro: column.text(),
    image: column.text(),
    subItemsJson: column.json(),
  }
});

const SolutionDetails = defineTable({
  columns: {
    slug: column.text({ primaryKey: true }),
    label: column.text(),
    eyebrow: column.text(),
    title: column.text(),
    titleDim: column.text(),
    tagline: column.text(),
    image: column.text(),
    overviewHeading: column.text(),
    overviewHeadingDim: column.text(),
    overviewBody: column.text(),
    featuresHeading: column.text(),
    featuresJson: column.json(),
    processHeading: column.text(),
    stepsJson: column.json(),
    statsJson: column.json(),
    ctaHeadline: column.text(),
    ctaHeadlineDim: column.text(),
  }
});

const Inquiries = defineTable({
  columns: {
    id: column.text({ primaryKey: true }), // UUID
    type: column.text(), // 'contact' or 'strategy_call'
    firstName: column.text(),
    lastName: column.text(),
    email: column.text(),
    phone: column.text({ optional: true }),
    company: column.text({ optional: true }),
    budget: column.text({ optional: true }),
    projectType: column.text({ optional: true }),
    message: column.text({ optional: true }),
    newsletter: column.boolean({ default: false }),
    status: column.text({ default: 'new' }), // 'new', 'contacted', 'closed'
    createdAt: column.date(),
  }
});

const Users = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    email: column.text(),
    role: column.text(),
    status: column.text(),
    lastLogin: column.text(),
  }
});

const BlogPosts = defineTable({
  columns: {
    slug: column.text({ primaryKey: true }),
    title: column.text(),
    description: column.text(),
    pubDate: column.date(),
    category: column.text(),
    readTime: column.number(),
    author: column.text({ default: 'Pinnacle Route Team' }),
    featured: column.boolean({ default: false }),
    views: column.number({ default: 0 }),
    image: column.text({ optional: true }),
    content: column.text(), // markdown body
  }
});

export default defineDb({
  tables: {
    FeatureFlags,
    SiteSettings,
    Navigation,
    TechStack,
    ExpertiseCategory,
    FAQCategory,
    WorkItem,
    CompanyInfo,
    ServiceDetails,
    SolutionDetails,
    Inquiries,
    Users,
    BlogPosts
  }
});
