/**
 * FAQ Data
 * --------
 * 40 frequently asked questions structured into 4 categories.
 */

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  title: string;
  items: FaqItem[];
}

export const faqData: FaqCategory[] = [
  {
    title: "General & Strategy",
    items: [
      {
        question: "What exactly does Pinnacle Route do?",
        answer: "We are a digital studio specializing in premium custom software development, AI automation, mobile apps, and enterprise systems (ERP/CRM). We partner with ambitious businesses to build scalable, high-performance technology."
      },
      {
        question: "Who are your typical clients?",
        answer: "We work with startups, established enterprises, and specialized agencies globally. Our clients are typically looking to modernize their technology stack, automate workflows, or build entirely new digital products from the ground up."
      },
      {
        question: "Where is Pinnacle Route based?",
        answer: "Our core team is distributed globally, allowing us to collaborate with clients across North America, Europe, and Asia-Pacific. We leverage asynchronous workflows and dedicated account managers to bridge time zones."
      },
      {
        question: "Do you only build software, or do you handle strategy too?",
        answer: "We are a strategy-led agency. Before we write a single line of code, we conduct deep product discovery to ensure we are building the right solution for your specific business goals and target audience."
      },
      {
        question: "What makes your approach different?",
        answer: "We don't believe in offshore 'body shopping'. We operate as a high-end, dedicated product team. We focus heavily on clean architecture, premium UI/UX design, and AI-driven automation to deliver award-grade products."
      },
      {
        question: "Do you offer white-label services for other agencies?",
        answer: "Yes, we partner with marketing, design, and consulting agencies as their dedicated technical arm. We handle the complex engineering while you maintain the client relationship."
      },
      {
        question: "Can you rescue an existing project that is failing?",
        answer: "Yes. We offer legacy modernization and code rescue services. We will audit your existing codebase, stabilize it, and create a roadmap to refactor and launch the product successfully."
      },
      {
        question: "Will I own the intellectual property (IP)?",
        answer: "Absolutely. Once the project is fully paid for, the intellectual property, including the source code, is transferred entirely to you. We do not hold your code hostage."
      },
      {
        question: "How do you handle data privacy and security?",
        answer: "Security is built into our architecture from day one. We follow industry best practices for data encryption, secure authentication (OAuth/JWT), and compliance with major privacy regulations like GDPR and CCPA."
      },
      {
        question: "What is your primary communication method?",
        answer: "We typically set up dedicated Slack or Microsoft Teams channels for real-time collaboration, backed by regular video check-ins and project management boards (like Jira or Linear) for complete transparency."
      }
    ]
  },
  {
    title: "Services & Technology",
    items: [
      {
        question: "What technologies do you use for web development?",
        answer: "We build modern, lightning-fast web applications using React, Next.js, and Astro. On the backend, we typically leverage Node.js, TypeScript, and serverless cloud architecture on AWS or Vercel."
      },
      {
        question: "Do you build native or cross-platform mobile apps?",
        answer: "We do both. We build cross-platform apps using React Native for speed and budget efficiency. For highly complex or hardware-intensive applications, we build native iOS (Swift) and Android (Kotlin) apps."
      },
      {
        question: "What kind of AI automation do you offer?",
        answer: "We integrate Large Language Models (LLMs) into your business. This includes custom AI support agents, automated data extraction, predictive analytics dashboards, and internal workflow automation."
      },
      {
        question: "Can you integrate with our existing CRM/ERP?",
        answer: "Yes. Systems integration is one of our core strengths. We build robust APIs to connect disparate systems, ensuring your data flows seamlessly between Salesforce, HubSpot, SAP, or custom platforms."
      },
      {
        question: "Do you use templates for UI/UX design?",
        answer: "Never. Every interface we design is bespoke. We create custom design systems tailored to your brand identity, ensuring a unique, premium experience that stands out in the market."
      },
      {
        question: "What platforms do you use for ecommerce development?",
        answer: "For fast deployments, we leverage Shopify Plus. For highly customized or complex retail experiences, we build headless commerce platforms using Next.js combined with modern backends like Medusa or Stripe."
      },
      {
        question: "Can you help us migrate to the cloud?",
        answer: "Yes, we architect and execute zero-downtime cloud migrations. We specialize in AWS, Google Cloud, and Azure, optimizing your infrastructure for scalability, security, and cost-efficiency."
      },
      {
        question: "Do you build SaaS platforms from scratch?",
        answer: "Yes. We handle everything from the multi-tenant database architecture to subscription billing (Stripe) and user role management, delivering a production-ready SaaS product."
      },
      {
        question: "What is your approach to quality assurance (QA)?",
        answer: "We employ comprehensive testing strategies, including automated unit testing, integration testing, and manual exploratory testing. We do not deploy to production until the code passes our rigorous quality gates."
      },
      {
        question: "Do you provide DevOps and hosting services?",
        answer: "Yes. We set up robust CI/CD pipelines so your product can be updated seamlessly. We manage the infrastructure, ensuring high availability, load balancing, and automated backups."
      }
    ]
  },
  {
    title: "Process & Timelines",
    items: [
      {
        question: "How long does a typical project take?",
        answer: "Timelines vary wildly based on scope. A simple marketing site might take 4-6 weeks. A complex MVP for a SaaS product or mobile app typically takes 3-5 months to launch."
      },
      {
        question: "What does the initial onboarding look like?",
        answer: "We start with a kickoff call to align on goals, followed by a deep-dive discovery phase where we map out user journeys, technical architecture, and design wires before development begins."
      },
      {
        question: "Do you work in Agile or Waterfall?",
        answer: "We use an Agile methodology. We break the project into 2-week sprints, delivering usable software incrementally. This allows us to pivot quickly based on your feedback and market testing."
      },
      {
        question: "How involved do I need to be during development?",
        answer: "We handle the heavy lifting, but we need your domain expertise. Expect a weekly sync to review progress, unblock questions, and provide feedback on the latest sprint deliverables."
      },
      {
        question: "What happens if we want to change a feature mid-project?",
        answer: "Agile is built for change. If a new requirement arises, we will assess the impact on the timeline and budget, and work with you to prioritize it within the upcoming sprints."
      },
      {
        question: "How do I track the progress of my project?",
        answer: "You will have full visibility. We provide access to our project management board (where you can see every task), a staging environment to click through the live build, and regular status reports."
      },
      {
        question: "Do you provide post-launch support and maintenance?",
        answer: "Absolutely. Software is never truly 'finished'. We offer ongoing retainer agreements for maintenance, bug fixes, server monitoring, and continuous feature development."
      },
      {
        question: "How do you handle bug fixes after launch?",
        answer: "We provide a standard warranty period immediately after launch to resolve any critical issues at no extra cost. After that, bugs are handled under an ongoing maintenance agreement."
      },
      {
        question: "Can we scale the team up or down?",
        answer: "Yes. Our engagement models are flexible. If you need to accelerate development to hit a deadline, we can seamlessly augment the team with additional engineers or designers."
      },
      {
        question: "Do you help with launching to the App Store?",
        answer: "Yes. We handle the entire deployment process, including App Store Optimization (ASO), compliance checks, and managing the submission process for both iOS and Google Play."
      }
    ]
  },
  {
    title: "Pricing & Engagement",
    items: [
      {
        question: "How much does a custom software project cost?",
        answer: "Because every project is bespoke, pricing varies. We don't provide blind quotes. After our initial strategy call, we will provide a detailed proposal with a customized budget range based on the scope and technical complexity."
      },
      {
        question: "Do you offer fixed-price contracts?",
        answer: "We generally avoid fixed-price contracts for large software builds because requirements inevitably evolve. Instead, we offer time-and-materials or dedicated team retainers, ensuring flexibility and preventing compromised quality."
      },
      {
        question: "What is a 'dedicated team' engagement?",
        answer: "Under a dedicated team model, you hire a cross-functional squad (e.g., a PM, designer, and two engineers) for a flat monthly fee. They function as your internal tech team, fully dedicated to your product roadmap."
      },
      {
        question: "Do you require a deposit to start?",
        answer: "Yes. To secure your spot in our production schedule and kick off the discovery phase, we require an initial deposit, typically equivalent to the first month of the engagement or a percentage of the total estimate."
      },
      {
        question: "How are payments structured?",
        answer: "For retainer models, we invoice on a monthly basis. For milestone-based projects, payments are tied to specific, agreed-upon deliverables (e.g., Design Sign-off, MVP Launch)."
      },
      {
        question: "Can you work within a strict budget?",
        answer: "Yes, but we adjust the scope, not the quality. If you have a strict budget constraint, we will work with you during discovery to prioritize the absolutely essential features for your MVP to launch within budget."
      },
      {
        question: "Do you take equity in exchange for development?",
        answer: "In 99% of cases, we operate strictly on a cash basis. We may consider hybrid cash/equity models only for highly vetted startups with substantial backing or a proven track record."
      },
      {
        question: "Are there any hidden costs (like hosting or third-party APIs)?",
        answer: "We are entirely transparent. While you will be responsible for the direct costs of third-party services (like AWS hosting, Stripe fees, or OpenAI API usage), we outline these anticipated operational costs in our initial proposal."
      },
      {
        question: "Do you offer smaller consultation or audit engagements?",
        answer: "Yes. If you aren't ready for a full build, we offer paid technical audits, UX reviews, and architecture planning sessions to help you map out your strategy before committing to development."
      },
      {
        question: "How do we get started?",
        answer: "The first step is to schedule a free, no-obligation strategy call. We'll discuss your vision, assess technical feasibility, and determine if our studio is the right fit for your ambitious goals."
      }
    ]
  }
];
