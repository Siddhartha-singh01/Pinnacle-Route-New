import { db, SiteSettings, Navigation, TechStack, ExpertiseCategory } from 'astro:db';

export default async function seed() {
  // 1. Site Settings
  await db.insert(SiteSettings).values([
    {
      id: 'global-settings',
      siteName: 'Pinnacle Route',
      description: 'We engineer robust, scalable systems. Custom software, AI automation, and cloud platforms built to perform under real world load.',
      contactEmail: 'info@pinnacleroute.com',
      contactPhone: '+91 9621391943',
      address: 'USA',
      logoUrl: '/assets/brand/logo.png',
    }
  ]);

  // 2. Navigation
  await db.insert(Navigation).values([
    { id: 'nav-about', label: 'About', href: '/our-company', orderIndex: 0 },
    { id: 'nav-solutions', label: 'Solutions', href: '/#solutions', orderIndex: 1 },
    { id: 'nav-work', label: 'Work', href: '/#work', orderIndex: 2 },
    { id: 'nav-services', label: 'Services', href: '/our-expertise', orderIndex: 3 },
    { id: 'nav-blog', label: 'Blog', href: '/blog', orderIndex: 4 },
    { id: 'nav-faq', label: 'FAQ', href: '/faq', orderIndex: 5 },
    { id: 'nav-contact', label: 'Contact', href: '/contact', orderIndex: 6 },
  ]);

  // 3. Tech Stack (First 10 for seeding demo)
  const techStacks = [
    "https://cdn.simpleicons.org/react",
    "https://cdn.simpleicons.org/nextdotjs",
    "https://cdn.simpleicons.org/typescript",
    "https://cdn.simpleicons.org/python",
    "https://cdn.simpleicons.org/nodedotjs",
    "https://cdn.simpleicons.org/docker",
    "https://cdn.simpleicons.org/amazonwebservices",
    "https://cdn.simpleicons.org/supabase",
    "https://cdn.simpleicons.org/stripe",
    "https://cdn.simpleicons.org/shopify",
  ];
  
  await db.insert(TechStack).values(
    techStacks.map((url, i) => ({
      id: i + 1,
      name: url.split('/').pop() || `Tech ${i}`,
      iconUrl: url,
      orderIndex: i,
    }))
  );

  // 4. Expertise Category
  await db.insert(ExpertiseCategory).values([
    {
      id: 'engineering',
      titleLine1: 'Software',
      titleLine2: 'Engineering',
      description: 'Custom platforms built for scale, performance, and reliability.',
      mediaUrl: '/assets/videos/compressed/engineering.mp4',
      servicesJson: [
        { label: "Custom Software", icon: "code" },
        { label: "Mobile Apps", icon: "smartphone" },
        { label: "AI Integration", icon: "cpu" }
      ],
      orderIndex: 0
    }
  ]);

  console.log('Seed data inserted successfully!');
}
