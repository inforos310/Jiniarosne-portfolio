import { Project, JournalArticle, ExplorationItem, StatItem } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'brand-identity-design',
    title: 'Brand Identity Design',
    category: 'Visual Identity & Systems',
    tagline: 'Precision typography & bespoke visual architecture for modern brands',
    colSpan: 'md:col-span-7',
    aspectRatio: 'aspect-[16/10]',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
    tags: ['Brand Strategy', 'Visual Identity', 'Typography', 'Design Systems'],
    description: 'A comprehensive brand identity framework crafted for discerning modern enterprises. Developed a holistic visual language spanning bespoke monogram geometry, typographic scales, tactile editorial collateral, and guidelines.',
    challenge: 'Translating legacy brand heritage into a minimalist, future-proof aesthetic that scales seamlessly across digital interfaces, physical packaging, and global campaigns.',
    solution: 'Engineered a modular typography system paired with a restrained monochromatic palette and refined blue accent gradients to evoke quiet authority and elevated craft.',
    deliverables: ['Logo & Monogram Architecture', 'Comprehensive Brand Guidelines (120+ pages)', 'Stationery & Packaging Prototypes', 'Digital Design Tokens'],
    year: '2026',
    client: 'Aura Luxury Group',
    metrics: '+180% Brand Recognition in Q1',
    link: 'https://dribbble.com'
  },
  {
    id: 'ai-creative-work',
    title: 'AI-Powered Creative Work',
    category: 'Generative Art & Campaign Direction',
    tagline: 'Fusing bespoke generative pipelines with human creative direction',
    colSpan: 'md:col-span-5',
    aspectRatio: 'aspect-[4/3]',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop',
    tags: ['Generative AI', 'Art Direction', 'Motion Design', '3D Visuals'],
    description: 'Experimental visual campaigns generated through custom LoRA models and ComfyUI latent diffusion pipelines, curated and art-directed for high-impact editorial storytelling.',
    challenge: 'Overcoming generic AI visual clichés to deliver bespoke, cohesive, and brand-aligned visual assets with consistent lighting and material texture.',
    solution: 'Designed multi-stage latent refinement pipelines combined with hand-painted digital matte touches and high-res upscaling to achieve gallery-grade fidelity.',
    deliverables: ['Hero Key Visuals (8K)', 'Social Campaign Motion Loops', 'Custom Diffusion Style Models', 'Editorial Layouts'],
    year: '2026',
    client: 'Synthetix Studios',
    metrics: '3.4M Impressions across global launch',
    link: 'https://dribbble.com'
  },
  {
    id: 'ai-automation',
    title: 'AI Automation',
    category: 'Smart Workflows & Autonomous Systems',
    tagline: 'Autonomous creative workflows & high-efficiency agentic pipelines',
    colSpan: 'md:col-span-5',
    aspectRatio: 'aspect-[4/3]',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop', // alternative aesthetic
    tags: ['Agentic Workflows', 'Prompt Architecture', 'Tool Integration', 'Process Design'],
    description: 'Architecting intelligent autonomous pipelines that eliminate redundant production tasks, automate multi-channel asset distribution, and orchestrate real-time content synthesis.',
    challenge: 'Connecting disparate creative software suites with AI reasoning loops while maintaining strict human-in-the-loop quality controls.',
    solution: 'Built custom webhook-driven automation nodes connecting Figma, Cloud storage, and LLM orchestration layers to accelerate turnaround times by 80%.',
    deliverables: ['Automated Content Dispatcher', 'Asset Variation Generator', 'Figma AI Plugin Architecture', 'Analytics Webhook Pipeline'],
    year: '2025 - 2026',
    client: 'Nexus Digital Ventures',
    metrics: '84% Reduction in production cycle time',
    link: 'https://github.com'
  },
  {
    id: 'digital-solutions',
    title: 'Digital Solutions',
    category: 'Interactive Web & Product Experience',
    tagline: 'Ultra-fast, motion-rich digital interfaces that captivate and convert',
    colSpan: 'md:col-span-7',
    aspectRatio: 'aspect-[16/10]',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop',
    tags: ['Frontend Architecture', 'Motion Graphics', 'UI/UX Design', 'Performance'],
    description: 'High-performance interactive web experience with smooth scroll choreography, micro-interactions, responsive fluid typography, and sub-second load times.',
    challenge: 'Delivering heavy visual fidelity and complex cinematic shaders without compromising 60fps frame rates or accessibility across low-power mobile devices.',
    solution: 'Implemented hardware-accelerated transforms, headless component primitives, and progressive HLS stream rendering for silky smooth performance.',
    deliverables: ['Custom Web Platform', 'Interactive Design System', 'Motion Choreography Spec', 'Lighthouse 99+ Performance Score'],
    year: '2026',
    client: 'Vanguard Interfaces',
    metrics: '0.4s First Contentful Paint',
    link: 'https://dribbble.com'
  }
];

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 'journal-1',
    title: 'The Future of Brand Identity in the Age of Autonomous AI',
    slug: 'future-of-brand-identity-ai',
    readTime: '4 min read',
    date: 'Aug 2026',
    category: 'Design Philosophy',
    summary: 'How generative technology shifts the role of the brand designer from manual pixel executor to high-leverage visual strategist and curator.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    content: [
      'In an era where generative models can produce thousands of variations in seconds, the differentiator of true brand identity is no longer the ability to render an image — it is taste, restraint, and intentional conceptual alignment.',
      'Bespoke visual identity is becoming more like architecture: establishing the immutable spatial and harmonic rules that govern an entire visual ecosystem across every touchpoint.',
      'As designers, mastering AI automation allows us to transcend tedious execution and focus entirely on emotional resonance, optical precision, and distinctive storytelling.'
    ]
  },
  {
    id: 'journal-2',
    title: 'Bridging Aesthetics and High-Speed Automation Workflows',
    slug: 'bridging-aesthetics-and-automation',
    readTime: '6 min read',
    date: 'Jul 2026',
    category: 'AI & Systems',
    summary: 'A deep-dive into setting up automated creative pipelines without compromising human craftsmanship, nuances, or brand integrity.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    content: [
      'Automation should never feel robotic. The secret to building smart digital solutions lies in embedding deterministic constraints around non-deterministic AI models.',
      'By defining rigorous typography bounds, color harmony algorithms, and layout grids, we allow AI to explore endless permutations while guaranteeing that every output meets our pristine standard.',
      'The result is a hybrid workflow where creative velocity increases tenfold without losing the soulful nuance of human direction.'
    ]
  },
  {
    id: 'journal-3',
    title: 'Crafting Visual Systems for Next-Generation Digital Products',
    slug: 'crafting-visual-systems-next-gen',
    readTime: '5 min read',
    date: 'Jun 2026',
    category: 'UI/UX Architecture',
    summary: 'Principles for designing responsive, dark-mode first design tokens and subtle tactile micro-interactions.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    content: [
      'Dark UI design requires a sophisticated understanding of luminance, contrast ratios, and optical weight. Pure blacks often crush detail, while poorly calibrated gray palettes feel flat.',
      'By utilizing subtle HSL saturation shifts and warm/cool undertones, we create interfaces with immense spatial depth that remain easy on the eyes during prolonged creative sessions.',
      'Layering subtle frosted glass backdrops and refined linear gradients transforms functional screens into immersive digital artifacts.'
    ]
  },
  {
    id: 'journal-4',
    title: 'The Philosophy of Negative Space in Modern Minimalist Design',
    slug: 'philosophy-of-negative-space',
    readTime: '3 min read',
    date: 'May 2026',
    category: 'Editorial & Typography',
    summary: 'Why what you leave out is infinitely more impactful than what you pack in.',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800&auto=format&fit=crop',
    content: [
      'Negative space is not empty space; it is active breathing room. It dictates the visual rhythm, pacing the viewer’s eye and giving critical moments of typography their monumental gravitas.',
      'When paired with high-contrast serif headlines and disciplined geometric sans-serif body copy, spacious padding creates an unmistakable aura of luxury and confidence.',
      'Every pixel must justify its presence. When in doubt, strip away the ornament and let typography and composition speak.'
    ]
  }
];

export const EXPLORATIONS: ExplorationItem[] = [
  {
    id: 'exp-1',
    title: 'Kinetic Monogram 01',
    category: 'Type Geometry',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    rotation: '-rotate-2',
    description: 'Parametric letterform experiment studying fluid motion curves in vector space.',
    tags: ['Typography', 'Monogram', 'Vectors']
  },
  {
    id: 'exp-2',
    title: 'Latent Chromatics 02',
    category: 'Generative Shaders',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800&auto=format&fit=crop',
    rotation: 'rotate-3',
    description: 'Bespoke diffusion color palette exploring iridescent lighting and translucent surfaces.',
    tags: ['Generative', 'Shaders', 'Color']
  },
  {
    id: 'exp-3',
    title: 'Editorial Grid Matrix 03',
    category: 'Layout Systems',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    rotation: '-rotate-1',
    description: 'High-density architectural editorial layout with asymmetrical balance and golden ratios.',
    tags: ['Editorial', 'Swiss Style', 'Print']
  },
  {
    id: 'exp-4',
    title: 'Holographic Glass Specimen 04',
    category: '3D Materials',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    rotation: 'rotate-2',
    description: 'Refraction rendering exploring multi-layer frosted dispersion across dark canvases.',
    tags: ['3D', 'Materials', 'Refraction']
  },
  {
    id: 'exp-5',
    title: 'Neural Node Topology 05',
    category: 'AI Interfaces',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
    rotation: '-rotate-3',
    description: 'Visual map representing autonomous decision trees in agentic creative pipelines.',
    tags: ['Neural', 'Network', 'AI UX']
  },
  {
    id: 'exp-6',
    title: 'Minimalist Package Mock 06',
    category: 'Packaging Concept',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop',
    rotation: 'rotate-1',
    description: 'Tactile blind-debossed foil packaging prototype for high-end artisanal fragrance.',
    tags: ['Packaging', 'Craft', 'Print']
  }
];

export const STATS: StatItem[] = [
  {
    id: 'stat-1',
    value: '20+',
    label: 'Brand & Digital Projects',
    description: 'Delivered for ambitious clients worldwide with strict focus on craft and conversion.'
  },
  {
    id: 'stat-2',
    value: '4+',
    label: 'Core Digital Services',
    description: 'Brand Identity, AI Automation, Creative Direction & Custom Interactive Solutions.'
  },
  {
    id: 'stat-3',
    value: '100%',
    label: 'Creative Focus',
    description: 'Every detail deliberately placed to ensure unmatched aesthetic and technical execution.'
  }
];

export const SOCIAL_LINKS = [
  { name: 'Fiverr', url: 'https://www.fiverr.com', icon: 'Sparkles' },
  { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin' },
  { name: 'Dribbble', url: 'https://dribbble.com', icon: 'Dribbble' },
  { name: 'GitHub', url: 'https://github.com', icon: 'Github' }
];

export const RESUME_DATA = {
  name: 'Jinia Alam Rosne',
  title: 'Brand Identity Designer & AI Automation Specialist',
  location: 'Bangladesh (Available Worldwide)',
  email: 'info.ros310@gmail.com',
  summary: 'Multidisciplinary designer and creative technologist specializing in brand identity systems, AI-driven automation workflows, and high-performance digital experiences. Bringing 5+ years of combined experience across visual arts, modern design tooling, and autonomous workflow architecture.',
  coreSkills: [
    'Brand Identity & Systems',
    'AI Automation & Prompt Pipelines',
    'Generative Art & Campaign Direction',
    'UI/UX & Interactive Design',
    'Typography & Editorial Layouts',
    'GSAP & Motion Choreography',
    'Figma, ComfyUI, Midjourney & Stable Diffusion',
    'React, Tailwind CSS & Modern Web Stack'
  ],
  experience: [
    {
      role: 'Lead Brand & AI Automation Designer',
      company: 'Independent Practice',
      period: '2024 — Present',
      description: 'Consulting with international clients on full-spectrum brand launches, identity systems, and custom automated design pipelines that scale creative throughput.'
    },
    {
      role: 'Senior Visual & Creative Designer',
      company: 'Creative Studio Collective',
      period: '2022 — 2024',
      description: 'Directed visual identity rollouts, packaging concepts, and interactive digital interfaces for luxury lifestyle, tech, and retail brands.'
    },
    {
      role: 'Digital Designer & Brand Strategist',
      company: 'Digital Solutions Lab',
      period: '2020 — 2022',
      description: 'Crafted digital design systems, marketing collateral, and responsive user experiences.'
    }
  ],
  education: [
    {
      degree: 'B.Sc. in Computer Science & Creative Technology',
      institution: 'Premier University',
      year: '2020'
    }
  ]
};
