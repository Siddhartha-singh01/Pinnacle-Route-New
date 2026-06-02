import { defineDb, defineTable, column } from 'astro:db';

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

export default defineDb({
  tables: {
    SiteSettings,
    Navigation,
    TechStack,
    ExpertiseCategory,
  }
});
