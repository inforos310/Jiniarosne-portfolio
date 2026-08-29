export interface NavbarConfig {
  initials: string;
  name: string;
  role: string;
  links: Array<{ label: string; target: string }>;
  sayHiText: string;
  sayHiTarget: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  tagline: string;
  colSpan?: string; // e.g. "md:col-span-7" | "md:col-span-5"
  aspectRatio?: string;
  image: string;
  gallery?: string[];
  tags: string[];
  description: string;
  challenge: string;
  solution: string;
  deliverables: string[];
  year: string;
  client: string;
  metrics?: string;
  link?: string;
  displayOrder?: number;
  status?: 'published' | 'draft';
  published?: boolean;
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
  displayOrder?: number;
  status?: 'published' | 'draft';
  published?: boolean;
}

export interface ExplorationItem {
  id: string;
  title: string;
  category: string;
  image: string;
  rotation?: string;
  description: string;
  tags: string[];
  displayOrder?: number;
}

export interface StatItem {
  id: string;
  value: string;
  suffix?: string;
  label: string;
  description: string;
  displayOrder?: number;
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
  navbar?: NavbarConfig;
  projects: Project[];
  articles: JournalArticle[];
  explorations: ExplorationItem[];
  stats: StatItem[];
  socialLinks: SocialLink[];
  resume: ResumeData;
  customCode: CustomCodeConfig;
}

export interface MediaItem {
  id: string;
  fileName: string;
  originalName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  mimeType: string;
  storageProvider?: 'supabase' | 'local';
  bucketName?: string;
  storagePath?: string;
  caption?: string;
  dimensions?: { width?: number; height?: number };
  createdAt: string;
}

export interface SupabaseStorageConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
  bucket: string;
  isEnabled: boolean;
}

export interface ClickEvent {
  id: string;
  timestamp: number;
  timeFormatted: string;
  target?: string;
  elementId?: string;
  eventName?: string;
  label: string;
  section: string;
  elementType?: string;
  coordinates?: { x: number; y: number };
  metadata?: Record<string, any>;
}

export interface VisitorSession {
  sessionId: string;
  visitorId: string;
  ip: string;
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
  isReturning: boolean;
  pageViews: number;
  visitedSections: string[];
  maxScrollDepth: number;
  clicks: ClickEvent[];
  createdAt?: string;
}

export interface AnalyticsDashboardData {
  summary: {
    totalVisitors: number;
    uniqueVisitors: number;
    visitorsToday: number;
    avgDurationSeconds: number;
    totalPageViews: number;
    totalClicks: number;
    mostViewedSection: string;
    mostClickedButton: string;
    returningVisitors: number;
  };
  topElements: Array<{
    elementId: string;
    label: string;
    section: string;
    count: number;
  }>;
  timeSeries: Array<{
    date: string;
    visitors: number;
    pageViews: number;
    clicks: number;
  }>;
  recentSessions: VisitorSession[];
  recentEvents: ClickEvent[];
}
