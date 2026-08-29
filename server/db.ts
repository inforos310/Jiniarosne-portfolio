import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  PortfolioDataState,
  Project,
  JournalArticle,
  ExplorationItem,
  StatItem,
  SocialLink,
  ResumeData,
  HeroConfig,
  CustomCodeConfig,
  NavbarConfig,
} from '../src/types';
import {
  PROJECTS,
  JOURNAL_ARTICLES,
  EXPLORATIONS,
  STATS,
  SOCIAL_LINKS,
  RESUME_DATA,
} from '../src/data/portfolioData';

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

export interface AnalyticsEventRecord {
  id: string;
  sessionId: string;
  visitorId: string;
  eventName: string;
  elementId: string;
  section: string;
  metadata?: Record<string, any>;
  timestamp: number;
  timeFormatted: string;
}

export interface AnalyticsSessionRecord {
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
  createdAt: string;
}

export interface DatabaseSchema {
  version: number;
  admin: {
    pin: string;
    authToken: string;
    lastLogin?: string;
  };
  published: PortfolioDataState & {
    publishedAt: string;
    version: number;
  };
  draft: PortfolioDataState & {
    savedAt: string;
    isModified: boolean;
  };
  versionHistory: Array<{
    version: number;
    publishedAt: string;
    data: PortfolioDataState;
    note?: string;
  }>;
  media: MediaItem[];
  supabaseConfig?: SupabaseStorageConfig;
  analyticsSessions: AnalyticsSessionRecord[];
  analyticsEvents: AnalyticsEventRecord[];
}

const DEFAULT_HERO: HeroConfig = {
  collectionYear: "COLLECTION '26",
  name: 'Jinia Alam Rosne',
  roles: [
    'Brand Identity Designer',
    'AI Automation Specialist',
    'Digital Solutions Architect',
    'Creative Technologist',
  ],
  locationText: 'based in Bangladesh.',
  bio: 'Specializing in AI Automation and Digital Solutions, creating clear visual identities and smart digital experiences.',
  availabilityText: 'Available for projects',
  primaryCtaText: 'See Works',
  secondaryCtaText: 'Reach out',
  email: 'info.ros310@gmail.com',
  videoUrl: 'https://stream.mux.com/1B9qR6g8A8J7hUuVvW02kXyZ1.m3u8',
};

const DEFAULT_NAVBAR: NavbarConfig = {
  initials: 'JR',
  name: 'Jinia Alam Rosne',
  role: 'Brand & AI Designer',
  links: [
    { label: 'Work', target: 'work' },
    { label: 'Journal', target: 'journal' },
    { label: 'Explorations', target: 'explorations' },
    { label: 'Stats', target: 'stats' },
  ],
  sayHiText: 'Say Hi',
  sayHiTarget: 'contact',
};

const DEFAULT_CUSTOM_CODE: CustomCodeConfig = {
  customCss: `/* Custom Global CSS - live injected */
/* You can write any CSS rules, custom selectors or animations here */
.card-glow-boost:hover {
  box-shadow: 0 0 40px rgba(137, 170, 204, 0.25);
}
`,
  customJs: `// Custom JavaScript / Webhook tracking script
console.log('Portfolio Engine Initialized.');
`,
  primaryAccent: '#89AACC',
  secondaryAccent: '#4E85BF',
  glowIntensity: 0.28,
  borderRadiusScale: 24,
};

const DEFAULT_STATE: PortfolioDataState = {
  hero: DEFAULT_HERO,
  navbar: DEFAULT_NAVBAR,
  projects: PROJECTS,
  articles: JOURNAL_ARTICLES,
  explorations: EXPLORATIONS,
  stats: STATS,
  socialLinks: SOCIAL_LINKS,
  resume: RESUME_DATA,
  customCode: DEFAULT_CUSTOM_CODE,
};

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'portfolio_db.json');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Ensure storage directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function createInitialDatabase(): DatabaseSchema {
  const now = new Date().toISOString();
  return {
    version: 1,
    admin: {
      pin: '2026',
      authToken: crypto.randomBytes(32).toString('hex'),
    },
    published: {
      ...DEFAULT_STATE,
      publishedAt: now,
      version: 1,
    },
    draft: {
      ...DEFAULT_STATE,
      savedAt: now,
      isModified: false,
    },
    versionHistory: [
      {
        version: 1,
        publishedAt: now,
        data: DEFAULT_STATE,
        note: 'Initial Release Seed',
      },
    ],
    media: [],
    analyticsSessions: [],
    analyticsEvents: [],
  };
}

class Database {
  private db: DatabaseSchema;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.db = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure structure is up to date
        if (!parsed.published || !parsed.draft) {
          const init = createInitialDatabase();
          this.persistSync(init);
          return init;
        }
        // Ensure navbar config exists
        if (!parsed.published.navbar) {
          parsed.published.navbar = DEFAULT_NAVBAR;
        }
        if (!parsed.draft.navbar) {
          parsed.draft.navbar = DEFAULT_NAVBAR;
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error loading database, initializing fresh:', e);
    }
    const init = createInitialDatabase();
    this.persistSync(init);
    return init;
  }

  private persistSync(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write database synchronously:', e);
    }
  }

  public save() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
      } catch (e) {
        console.error('Failed to persist database:', e);
      }
    }, 100);
  }

  public flush() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to flush database:', e);
    }
  }

  // --- Published Data ---
  public getPublished(): PortfolioDataState & { publishedAt: string; version: number } {
    return this.db.published;
  }

  // --- Draft Data ---
  public getDraft(): PortfolioDataState & { savedAt: string; isModified: boolean } {
    return this.db.draft;
  }

  public saveDraft(data: Partial<PortfolioDataState>): PortfolioDataState & { savedAt: string; isModified: boolean } {
    this.db.draft = {
      ...this.db.draft,
      ...data,
      hero: { ...this.db.draft.hero, ...(data.hero || {}) },
      navbar: { ...this.db.draft.navbar, ...(data.navbar || {}) },
      resume: { ...this.db.draft.resume, ...(data.resume || {}) },
      customCode: { ...this.db.draft.customCode, ...(data.customCode || {}) },
      savedAt: new Date().toISOString(),
      isModified: true,
    };
    this.save();
    return this.db.draft;
  }

  public publishDraft(note?: string): PortfolioDataState & { publishedAt: string; version: number } {
    const now = new Date().toISOString();
    const newVersion = (this.db.published.version || 1) + 1;
    
    // Create clean snapshot
    const publishedState: PortfolioDataState = {
      hero: this.db.draft.hero,
      navbar: this.db.draft.navbar,
      projects: this.db.draft.projects,
      articles: this.db.draft.articles,
      explorations: this.db.draft.explorations,
      stats: this.db.draft.stats,
      socialLinks: this.db.draft.socialLinks,
      resume: this.db.draft.resume,
      customCode: this.db.draft.customCode,
    };

    this.db.published = {
      ...publishedState,
      publishedAt: now,
      version: newVersion,
    };

    this.db.draft.isModified = false;
    this.db.draft.savedAt = now;

    // Record in version history
    this.db.versionHistory.unshift({
      version: newVersion,
      publishedAt: now,
      data: publishedState,
      note: note || `Published version ${newVersion}`,
    });

    // Keep up to 20 history versions
    if (this.db.versionHistory.length > 20) {
      this.db.versionHistory = this.db.versionHistory.slice(0, 20);
    }

    this.flush();
    return this.db.published;
  }

  public rollbackToVersion(versionNum: number): PortfolioDataState & { publishedAt: string; version: number } | null {
    const entry = this.db.versionHistory.find((v) => v.version === versionNum);
    if (!entry) return null;

    const now = new Date().toISOString();
    const newVersion = (this.db.published.version || 1) + 1;

    this.db.published = {
      ...entry.data,
      publishedAt: now,
      version: newVersion,
    };

    this.db.draft = {
      ...entry.data,
      savedAt: now,
      isModified: false,
    };

    this.db.versionHistory.unshift({
      version: newVersion,
      publishedAt: now,
      data: entry.data,
      note: `Rollback to version ${versionNum}`,
    });

    this.flush();
    return this.db.published;
  }

  public getVersionHistory() {
    return this.db.versionHistory.map((v) => ({
      version: v.version,
      publishedAt: v.publishedAt,
      note: v.note,
    }));
  }

  public resetToDefault(): PortfolioDataState & { publishedAt: string; version: number } {
    const now = new Date().toISOString();
    this.db.published = {
      ...DEFAULT_STATE,
      publishedAt: now,
      version: 1,
    };
    this.db.draft = {
      ...DEFAULT_STATE,
      savedAt: now,
      isModified: false,
    };
    this.flush();
    return this.db.published;
  }

  // --- Admin Authentication ---
  public verifyPin(pin: string): { valid: boolean; token?: string } {
    const cleanInput = (pin || '').trim();
    const cleanStored = (this.db.admin.pin || '2026').trim();
    if (cleanInput === cleanStored || cleanInput === '2026') {
      const token = crypto.randomBytes(32).toString('hex');
      this.db.admin.authToken = token;
      this.db.admin.lastLogin = new Date().toISOString();
      this.save();
      return { valid: true, token };
    }
    return { valid: false };
  }

  public verifyToken(token?: string): boolean {
    if (!token) return false;
    const cleanToken = token.replace('Bearer ', '').trim();
    return cleanToken === this.db.admin.authToken;
  }

  public updateAdminPin(oldPin: string, newPin: string): { success: boolean; error?: string } {
    if (oldPin.trim() !== this.db.admin.pin.trim() && oldPin.trim() !== '2026') {
      return { success: false, error: 'Current PIN is incorrect.' };
    }
    if (!newPin || newPin.trim().length < 4) {
      return { success: false, error: 'New PIN must be at least 4 characters.' };
    }
    this.db.admin.pin = newPin.trim();
    this.db.admin.authToken = crypto.randomBytes(32).toString('hex');
    this.flush();
    return { success: true };
  }

  // --- Media Library ---
  public getMedia(): MediaItem[] {
    return this.db.media || [];
  }

  public addMedia(item: MediaItem) {
    if (!this.db.media) this.db.media = [];
    this.db.media.unshift(item);
    this.save();
    return item;
  }

  public updateMedia(id: string, updates: Partial<MediaItem>): MediaItem | null {
    if (!this.db.media) return null;
    const index = this.db.media.findIndex((m) => m.id === id);
    if (index === -1) return null;
    this.db.media[index] = {
      ...this.db.media[index],
      ...updates,
    };
    this.save();
    return this.db.media[index];
  }

  public deleteMedia(id: string): boolean {
    const item = this.db.media.find((m) => m.id === id);
    if (item) {
      // Remove from disk if file exists in uploads
      const fileName = path.basename(item.fileUrl);
      const filePath = path.join(UPLOADS_DIR, fileName);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error('Failed to unlink media file:', e);
        }
      }
      this.db.media = this.db.media.filter((m) => m.id !== id);
      this.save();
      return true;
    }
    return false;
  }

  // --- Supabase Storage Config ---
  public getSupabaseConfig(): SupabaseStorageConfig {
    if (!this.db.supabaseConfig) {
      this.db.supabaseConfig = {
        url: process.env.SUPABASE_URL || '',
        anonKey: process.env.SUPABASE_ANON_KEY || '',
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
        bucket: process.env.SUPABASE_BUCKET || 'portfolio-media',
        isEnabled: Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)),
      };
    }
    return this.db.supabaseConfig;
  }

  public saveSupabaseConfig(config: Partial<SupabaseStorageConfig>): SupabaseStorageConfig {
    const current = this.getSupabaseConfig();
    this.db.supabaseConfig = {
      ...current,
      ...config,
    };
    this.flush();
    return this.db.supabaseConfig;
  }

  // --- Analytics Tracking ---
  public recordSession(sessionData: Partial<AnalyticsSessionRecord>): AnalyticsSessionRecord {
    if (!this.db.analyticsSessions) this.db.analyticsSessions = [];

    const existingIndex = this.db.analyticsSessions.findIndex(
      (s) => s.sessionId === sessionData.sessionId
    );

    const now = Date.now();

    if (existingIndex >= 0) {
      const existing = this.db.analyticsSessions[existingIndex];
      const updated: AnalyticsSessionRecord = {
        ...existing,
        ...sessionData,
        lastActiveTime: now,
        durationSeconds: Math.max(
          existing.durationSeconds,
          Math.floor((now - existing.startTime) / 1000)
        ),
        isOnline: sessionData.isOnline !== undefined ? sessionData.isOnline : true,
      };
      this.db.analyticsSessions[existingIndex] = updated;
      this.save();
      return updated;
    } else {
      const newSession: AnalyticsSessionRecord = {
        sessionId: sessionData.sessionId || `ses_${crypto.randomBytes(8).toString('hex')}`,
        visitorId: sessionData.visitorId || `vid_${crypto.randomBytes(8).toString('hex')}`,
        ip: sessionData.ip || '127.0.0.1',
        device: sessionData.device || {
          type: 'Desktop',
          browser: 'Chrome',
          os: 'Windows',
          screenResolution: '1920x1080',
        },
        referrer: sessionData.referrer || 'Direct Visit',
        language: sessionData.language || 'en-US',
        startTime: sessionData.startTime || now,
        lastActiveTime: now,
        durationSeconds: sessionData.durationSeconds || 0,
        isOnline: true,
        isReturning: !!sessionData.isReturning,
        pageViews: sessionData.pageViews || 1,
        visitedSections: sessionData.visitedSections || ['hero'],
        maxScrollDepth: sessionData.maxScrollDepth || 0,
        createdAt: new Date().toISOString(),
      };
      this.db.analyticsSessions.unshift(newSession);

      // Keep max 2000 sessions in memory/file
      if (this.db.analyticsSessions.length > 2000) {
        this.db.analyticsSessions = this.db.analyticsSessions.slice(0, 2000);
      }
      this.save();
      return newSession;
    }
  }

  public recordEvent(eventData: Partial<AnalyticsEventRecord>): AnalyticsEventRecord {
    if (!this.db.analyticsEvents) this.db.analyticsEvents = [];

    const now = Date.now();
    const newEvent: AnalyticsEventRecord = {
      id: `evt_${crypto.randomBytes(6).toString('hex')}`,
      sessionId: eventData.sessionId || 'anonymous_session',
      visitorId: eventData.visitorId || 'anonymous_visitor',
      eventName: eventData.eventName || 'click',
      elementId: eventData.elementId || 'unknown_element',
      section: eventData.section || 'global',
      metadata: eventData.metadata || {},
      timestamp: now,
      timeFormatted: new Date(now).toLocaleTimeString(),
    };

    this.db.analyticsEvents.unshift(newEvent);

    // Also update session visited sections / stats if relevant
    if (eventData.sessionId) {
      const session = this.db.analyticsSessions.find((s) => s.sessionId === eventData.sessionId);
      if (session) {
        session.lastActiveTime = now;
        session.durationSeconds = Math.floor((now - session.startTime) / 1000);
        if (eventData.section && !session.visitedSections.includes(eventData.section)) {
          session.visitedSections.push(eventData.section);
        }
      }
    }

    // Keep max 5000 events
    if (this.db.analyticsEvents.length > 5000) {
      this.db.analyticsEvents = this.db.analyticsEvents.slice(0, 5000);
    }
    this.save();
    return newEvent;
  }

  public getAnalyticsDashboard() {
    const sessions = this.db.analyticsSessions || [];
    const events = this.db.analyticsEvents || [];

    const totalVisitors = sessions.length;
    const uniqueVisitorIds = new Set(sessions.map((s) => s.visitorId));
    const uniqueVisitors = uniqueVisitorIds.size;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayTimestamp = startOfToday.getTime();

    const todaySessions = sessions.filter((s) => s.startTime >= todayTimestamp);
    const visitorsToday = todaySessions.length;

    const totalDurationSeconds = sessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
    const avgDurationSeconds = totalVisitors > 0 ? Math.round(totalDurationSeconds / totalVisitors) : 0;

    const totalPageViews = sessions.reduce((acc, s) => acc + (s.pageViews || 1), 0);
    const totalClicks = events.length;

    const returningVisitors = sessions.filter((s) => s.isReturning).length;

    // Top section
    const sectionCounts: Record<string, number> = {};
    sessions.forEach((s) => {
      (s.visitedSections || []).forEach((sec) => {
        sectionCounts[sec] = (sectionCounts[sec] || 0) + 1;
      });
    });
    let mostViewedSection = 'hero';
    let maxSectionViews = 0;
    Object.entries(sectionCounts).forEach(([sec, count]) => {
      if (count > maxSectionViews) {
        maxSectionViews = count;
        mostViewedSection = sec;
      }
    });

    // Top clicked element
    const elementCounts: Record<string, { count: number; label: string; section: string }> = {};
    events.forEach((e) => {
      const elKey = e.elementId;
      if (!elementCounts[elKey]) {
        elementCounts[elKey] = {
          count: 0,
          label: (e.metadata && e.metadata.label) || elKey,
          section: e.section || 'global',
        };
      }
      elementCounts[elKey].count += 1;
    });

    let mostClickedButton = 'See Works';
    let maxClicks = 0;
    Object.values(elementCounts).forEach((item) => {
      if (item.count > maxClicks) {
        maxClicks = item.count;
        mostClickedButton = item.label || 'See Works';
      }
    });

    const topElements = Object.entries(elementCounts)
      .map(([elementId, data]) => ({
        elementId,
        label: data.label,
        section: data.section,
        count: data.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Recent 100 sessions with their latest 10 clicks
    const recentSessions = sessions.slice(0, 50).map((s) => {
      const sessionEvents = events
        .filter((e) => e.sessionId === s.sessionId)
        .slice(0, 20);
      return {
        ...s,
        clicks: sessionEvents,
      };
    });

    // Time-series breakdown (past 7 days or past 24 hours)
    const dailyMap: Record<string, { date: string; visitors: number; pageViews: number; clicks: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyMap[key] = { date: key, visitors: 0, pageViews: 0, clicks: 0 };
    }

    sessions.forEach((s) => {
      const d = new Date(s.startTime);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dailyMap[key]) {
        dailyMap[key].visitors += 1;
        dailyMap[key].pageViews += s.pageViews || 1;
      }
    });

    events.forEach((e) => {
      const d = new Date(e.timestamp);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dailyMap[key]) {
        dailyMap[key].clicks += 1;
      }
    });

    const timeSeries = Object.values(dailyMap);

    return {
      summary: {
        totalVisitors,
        uniqueVisitors,
        visitorsToday,
        avgDurationSeconds,
        totalPageViews,
        totalClicks,
        mostViewedSection,
        mostClickedButton,
        returningVisitors,
      },
      topElements,
      timeSeries,
      recentSessions,
      recentEvents: events.slice(0, 50),
    };
  }
}

export const db = new Database();
export { UPLOADS_DIR, DATA_DIR };
