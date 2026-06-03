import { db, SiteSettings, Navigation, TechStack, ExpertiseCategory, FAQCategory, WorkItem, CompanyInfo, ServiceDetails, SolutionDetails } from 'astro:db';
import { faqData } from '../src/data/faq';
import { workItems } from '../src/data/work';
import { careStats, partnerStats, whatWeDo } from '../src/data/company';
import { serviceDetails } from '../src/data/service-details';
import { solutionDetails } from '../src/data/solution-details';
import { tools } from '../src/data/tools';

export default async function seed() {
  // 1. Site Settings
  await db.insert(SiteSettings).values([{
    id: 'global-settings',
    siteName: 'Pinnacle Route',
    description: 'We engineer robust, scalable systems. Custom software, AI automation, and cloud platforms built to perform under real world load.',
    contactEmail: 'info@pinnacleroute.com',
    contactPhone: '+91 9621391943',
    address: 'USA',
    logoUrl: '/assets/brand/logo.png',
  }]);

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

  // 3. Tech Stack
  await db.insert(TechStack).values(
    tools.map((url, i) => ({
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

  // 5. FAQ
  let faqId = 1;
  for (const cat of faqData) {
    await db.insert(FAQCategory).values({
      id: `faq-cat-${faqId}`,
      title: cat.title,
      itemsJson: cat.items,
      orderIndex: faqId,
    });
    faqId++;
  }

  // 6. Work Items
  await db.insert(WorkItem).values(
    workItems.map((work, i) => ({
      id: `work-${i}`,
      title: work.title,
      tag: work.tag,
      img: work.img,
      href: work.href,
      orderIndex: i,
    }))
  );

  // 7. Company Info
  await db.insert(CompanyInfo).values([{
    id: 'company-stats',
    careStatsJson: careStats,
    partnerStatsJson: partnerStats,
    whatWeDoJson: whatWeDo,
  }]);

  // 8. Service Details
  for (const [slug, details] of Object.entries(serviceDetails)) {
    await db.insert(ServiceDetails).values({
      slug,
      label: details.label,
      category: details.category,
      intro: details.intro,
      image: details.image,
      subItemsJson: details.subItems,
    });
  }

  // 9. Solution Details
  for (const [slug, details] of Object.entries(solutionDetails)) {
    await db.insert(SolutionDetails).values({
      slug,
      label: details.label,
      eyebrow: details.eyebrow,
      title: details.title,
      titleDim: details.titleDim,
      tagline: details.tagline,
      image: details.image,
      overviewHeading: details.overviewHeading,
      overviewHeadingDim: details.overviewHeadingDim,
      overviewBody: details.overviewBody,
      featuresHeading: details.featuresHeading,
      featuresJson: details.features,
      processHeading: details.processHeading,
      stepsJson: details.steps,
      statsJson: details.stats,
      ctaHeadline: details.ctaHeadline,
      ctaHeadlineDim: details.ctaHeadlineDim,
    });
  }

  console.log('All static data successfully migrated to Astro DB schema!');
}
