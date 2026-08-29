export interface Project {
  id: string;
  title: string;
  category: string;
  tagline: string;
  colSpan: string; // e.g. "md:col-span-7" | "md:col-span-5"
  aspectRatio: string;
  image: string;
  tags: string[];
  description: string;
  challenge: string;
  solution: string;
  deliverables: string[];
  year: string;
  client: string;
  metrics?: string;
  link?: string;
}

export interface JournalArticle {
  id: string;
  title: string;
  slug: string;
  readTime: string;
  date: string;
  category: string;
  summary: string;
  image: string;
  content: string[];
}

export interface ExplorationItem {
  id: string;
  title: string;
  category: string;
  image: string;
  rotation: string;
  description: string;
  tags: string[];
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  description: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon?: string;
}

export interface ResumeData {
  name: string;
  title: string;
  location: string;
  email: string;
  summary: string;
  coreSkills: string[];
  experience: {
    role: string;
    company: string;
    period: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
}

export interface HeroConfig {
  collectionYear: string;
  name: string;
  roles: string[];
  locationText: string;
  bio: string;
  availabilityText: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  email: string;
  videoUrl: string;
}

export interface CustomCodeConfig {
  customCss: string;
  customJs: string;
  primaryAccent: string;
  secondaryAccent: string;
  glowIntensity: number; // 0 to 1
  borderRadiusScale: number; // in px
}

export interface PortfolioDataState {
  hero: HeroConfig;
  projects: Project[];
  articles: JournalArticle[];
  explorations: ExplorationItem[];
  stats: StatItem[];
  socialLinks: SocialLink[];
  resume: ResumeData;
  customCode: CustomCodeConfig;
}

export interface ClickEvent {
  id: string;
  timestamp: number;
  timeFormatted: string;
  target: string;
  label: string;
  section: string;
  elementType: string;
  coordinates?: { x: number; y: number };
}

export interface VisitorSession {
  sessionId: string;
  visitorId: string;
  ip: string;
  location: {
    city: string;
    country: string;
    countryCode: string;
    flag: string;
  };
  device: {
    type: 'Desktop' | 'Mobile' | 'Tablet';
    browser: string;
    os: string;
    screenResolution: string;
  };
  referrer: string;
  language: string;
  startTime: number;
  lastActiveTime: number;
  durationSeconds: number;
  isOnline: boolean;
  maxScrollDepth: number; // 0 - 100
  visitedSections: string[];
  clicks: ClickEvent[];
  notes?: string;
}
