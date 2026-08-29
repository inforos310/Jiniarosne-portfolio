import { VisitorSession, ClickEvent } from '../types';

const SESSIONS_STORAGE_KEY = 'jinia_portfolio_analytics_sessions_v1';
const VISITOR_ID_KEY = 'jinia_portfolio_visitor_id';
const SESSION_ID_KEY = 'jinia_portfolio_current_session_id';

let currentSession: VisitorSession | null = null;
const listeners: Set<(sessions: VisitorSession[]) => void> = new Set();

// Mock geographic & device data for initial seeding so dashboard is rich
const SEED_SESSIONS: VisitorSession[] = [
  {
    sessionId: 'sess_seed_001',
    visitorId: 'vis_seed_01',
    ip: '198.51.100.42',
    location: {
      city: 'San Francisco',
      country: 'United States',
      countryCode: 'US',
      flag: '🇺🇸',
    },
    device: {
      type: 'Desktop',
      browser: 'Chrome 124',
      os: 'macOS Sonoma',
      screenResolution: '2560x1440',
    },
    referrer: 'https://news.ycombinator.com',
    language: 'en-US',
    startTime: Date.now() - 1000 * 60 * 45,
    lastActiveTime: Date.now() - 1000 * 60 * 39,
    durationSeconds: 382,
    isOnline: false,
    maxScrollDepth: 100,
    visitedSections: ['hero', 'work', 'explorations', 'stats', 'contact'],
    clicks: [
      {
        id: 'clk_1',
        timestamp: Date.now() - 1000 * 60 * 44,
        timeFormatted: '00:15',
        target: 'hero-see-works-btn',
        label: 'Clicked "See Works" CTA',
        section: 'hero',
        elementType: 'button',
      },
      {
        id: 'clk_2',
        timestamp: Date.now() - 1000 * 60 * 43,
        timeFormatted: '00:48',
        target: 'project-brand-identity-design',
        label: 'Opened Case Study: Brand Identity Design',
        section: 'work',
        elementType: 'card',
      },
      {
        id: 'clk_3',
        timestamp: Date.now() - 1000 * 60 * 41,
        timeFormatted: '02:30',
        target: 'exploration-card-exp-1',
        label: 'Zoomed Exploration: Kinetic Monogram 01',
        section: 'explorations',
        elementType: 'card',
      },
      {
        id: 'clk_4',
        timestamp: Date.now() - 1000 * 60 * 40,
        timeFormatted: '04:12',
        target: 'contact-email-btn',
        label: 'Clicked direct email "info.ros310@gmail.com"',
        section: 'contact',
        elementType: 'link',
      },
    ],
    notes: 'Recruiter from San Francisco design agency. High intent on Brand Identity and Contact CTA.',
  },
  {
    sessionId: 'sess_seed_002',
    visitorId: 'vis_seed_02',
    ip: '82.165.197.1',
    location: {
      city: 'London',
      country: 'United Kingdom',
      countryCode: 'GB',
      flag: '🇬🇧',
    },
    device: {
      type: 'Desktop',
      browser: 'Safari 17.4',
      os: 'macOS Ventura',
      screenResolution: '1920x1080',
    },
    referrer: 'https://dribbble.com/jinia-alam',
    language: 'en-GB',
    startTime: Date.now() - 1000 * 60 * 120,
    lastActiveTime: Date.now() - 1000 * 60 * 115,
    durationSeconds: 245,
    isOnline: false,
    maxScrollDepth: 85,
    visitedSections: ['hero', 'work', 'journal'],
    clicks: [
      {
        id: 'clk_5',
        timestamp: Date.now() - 1000 * 60 * 119,
        timeFormatted: '00:22',
        target: 'project-ai-creative-work',
        label: 'Viewed Case Study: AI-Powered Creative Work',
        section: 'work',
        elementType: 'card',
      },
      {
        id: 'clk_6',
        timestamp: Date.now() - 1000 * 60 * 117,
        timeFormatted: '01:50',
        target: 'journal-item-1',
        label: 'Read Article: The Future of Brand Identity in the Age of Autonomous AI',
        section: 'journal',
        elementType: 'article',
      },
    ],
    notes: 'Creative Director exploring AI design case studies and journal.',
  },
  {
    sessionId: 'sess_seed_003',
    visitorId: 'vis_seed_03',
    ip: '103.145.112.5',
    location: {
      city: 'Dhaka',
      country: 'Bangladesh',
      countryCode: 'BD',
      flag: '🇧🇩',
    },
    device: {
      type: 'Mobile',
      browser: 'Mobile Safari',
      os: 'iOS 18',
      screenResolution: '390x844',
    },
    referrer: 'https://linkedin.com',
    language: 'en-US',
    startTime: Date.now() - 1000 * 60 * 250,
    lastActiveTime: Date.now() - 1000 * 60 * 247,
    durationSeconds: 160,
    isOnline: false,
    maxScrollDepth: 100,
    visitedSections: ['hero', 'work', 'stats', 'contact'],
    clicks: [
      {
        id: 'clk_7',
        timestamp: Date.now() - 1000 * 60 * 249,
        timeFormatted: '00:10',
        target: 'nav-say-hi-btn',
        label: 'Tapped Navbar "Say hi" button',
        section: 'navbar',
        elementType: 'button',
      },
      {
        id: 'clk_8',
        timestamp: Date.now() - 1000 * 60 * 248,
        timeFormatted: '01:15',
        target: 'footer-resume-btn',
        label: 'Opened Curriculum Vitae / Resume modal',
        section: 'contact',
        elementType: 'button',
      },
    ],
    notes: 'Mobile LinkedIn referral reviewing credentials and CV.',
  },
];

// Helper to generate UUIDs
function generateId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}

// Get or create persistent visitor ID
function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = generateId('vis');
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

// Detect device info
function detectDevice() {
  const ua = navigator.userAgent;
  let type: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';
  if (/iPad|Tablet|PlayBook/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua))) {
    type = 'Tablet';
  } else if (/Mobi|Android|iPhone|iPod/i.test(ua)) {
    type = 'Mobile';
  }

  let browser = 'Chrome';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Microsoft Edge';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';

  let os = 'Unknown OS';
  if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Linux')) os = 'Linux';

  return {
    type,
    browser,
    os,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
  };
}

// Approximate country from timezone/locale
function detectLocation() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Dhaka') || tz.includes('Asia/Dhaka')) {
      return { city: 'Dhaka', country: 'Bangladesh', countryCode: 'BD', flag: '🇧🇩' };
    }
    if (tz.includes('New_York') || tz.includes('America/New_York')) {
      return { city: 'New York', country: 'United States', countryCode: 'US', flag: '🇺🇸' };
    }
    if (tz.includes('Los_Angeles') || tz.includes('America/Los_Angeles')) {
      return { city: 'Los Angeles', country: 'United States', countryCode: 'US', flag: '🇺🇸' };
    }
    if (tz.includes('London') || tz.includes('Europe/London')) {
      return { city: 'London', country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧' };
    }
    if (tz.includes('Berlin') || tz.includes('Europe/Berlin') || tz.includes('Paris')) {
      return { city: 'Berlin', country: 'Germany', countryCode: 'DE', flag: '🇩🇪' };
    }
    if (tz.includes('Singapore') || tz.includes('Asia/Singapore')) {
      return { city: 'Singapore', country: 'Singapore', countryCode: 'SG', flag: '🇸🇬' };
    }
    if (tz.includes('Tokyo') || tz.includes('Asia/Tokyo')) {
      return { city: 'Tokyo', country: 'Japan', countryCode: 'JP', flag: '🇯🇵' };
    }
    if (tz.includes('Sydney') || tz.includes('Australia/Sydney')) {
      return { city: 'Sydney', country: 'Australia', countryCode: 'AU', flag: '🇦🇺' };
    }
    if (tz.includes('Toronto') || tz.includes('America/Toronto')) {
      return { city: 'Toronto', country: 'Canada', countryCode: 'CA', flag: '🇨🇦' };
    }
  } catch {
    // fallback
  }
  return { city: 'Global Viewer', country: 'International', countryCode: 'UN', flag: '🌐' };
}

// Read stored sessions
export function getStoredSessions(): VisitorSession[] {
  try {
    const data = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to read stored analytics sessions:', e);
  }
  // If no saved sessions yet, seed with initial history
  localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(SEED_SESSIONS));
  return SEED_SESSIONS;
}

// Save sessions & notify listeners
function saveSessions(sessions: VisitorSession[]) {
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    listeners.forEach((cb) => cb(sessions));
  } catch (e) {
    console.error('Failed to save analytics sessions:', e);
  }
}

// Initialize live visitor tracking
export function initAnalytics(): () => void {
  const visitorId = getVisitorId();
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  const now = Date.now();

  const sessions = getStoredSessions();
  const existing = sessions.find((s) => s.sessionId === sessionId);

  if (existing) {
    currentSession = existing;
    currentSession.isOnline = true;
    currentSession.lastActiveTime = now;
  } else {
    sessionId = generateId('sess');
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);

    currentSession = {
      sessionId,
      visitorId,
      ip: `192.0.2.${Math.floor(Math.random() * 200) + 10}`,
      location: detectLocation(),
      device: detectDevice(),
      referrer: document.referrer || 'Direct / Bookmark',
      language: navigator.language || 'en-US',
      startTime: now,
      lastActiveTime: now,
      durationSeconds: 0,
      isOnline: true,
      maxScrollDepth: 0,
      visitedSections: ['hero'],
      clicks: [],
      notes: 'Live Active Visitor on site right now.',
    };

    // Put current session first
    const updated = [currentSession, ...sessions.filter((s) => s.sessionId !== sessionId)];
    saveSessions(updated);
  }

  // Heartbeat interval to update duration & keep online status
  const intervalId = setInterval(() => {
    if (!currentSession) return;
    const currentTime = Date.now();
    currentSession.lastActiveTime = currentTime;
    currentSession.durationSeconds = Math.floor((currentTime - currentSession.startTime) / 1000);
    currentSession.isOnline = true;

    const allSessions = getStoredSessions();
    const idx = allSessions.findIndex((s) => s.sessionId === currentSession?.sessionId);
    if (idx !== -1) {
      allSessions[idx] = { ...currentSession };
      saveSessions(allSessions);
    }
  }, 2000);

  // Global click tracker for all user interactions
  const handleGlobalClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Find closest interactive element
    const interactive = target.closest('button, a, [role="button"], input, .cursor-pointer') as HTMLElement | null;
    if (!interactive) return;

    // Avoid logging internal admin panel inputs
    if (interactive.closest('#admin-modal-root') || interactive.closest('#admin-auth-modal')) {
      return;
    }

    const label =
      interactive.getAttribute('aria-label') ||
      interactive.getAttribute('title') ||
      interactive.getAttribute('data-track') ||
      (interactive.innerText ? interactive.innerText.replace(/\s+/g, ' ').trim().slice(0, 40) : '') ||
      interactive.id ||
      interactive.tagName.toLowerCase();

    const targetId = interactive.id || interactive.getAttribute('href') || interactive.className.slice(0, 30);
    const elementType = interactive.tagName.toLowerCase();

    // Find section
    const sectionEl = interactive.closest('section, nav, footer, header');
    const section = sectionEl ? sectionEl.id || sectionEl.tagName.toLowerCase() : 'page';

    recordClick({
      target: targetId || 'element',
      label: `Clicked "${label}"`,
      section,
      elementType,
      coordinates: { x: Math.round(e.clientX), y: Math.round(e.clientY) },
    });
  };

  // Scroll depth tracker
  const handleScroll = () => {
    if (!currentSession) return;
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollPercent = Math.min(100, Math.round(((scrollTop + winHeight) / docHeight) * 100));

    if (scrollPercent > currentSession.maxScrollDepth) {
      currentSession.maxScrollDepth = scrollPercent;
    }
  };

  window.addEventListener('click', handleGlobalClick, { capture: true });
  window.addEventListener('scroll', handleScroll, { passive: true });

  // On page unload / hide, set isOnline to false
  const handleUnload = () => {
    if (currentSession) {
      currentSession.isOnline = false;
      currentSession.lastActiveTime = Date.now();
      const allSessions = getStoredSessions();
      const idx = allSessions.findIndex((s) => s.sessionId === currentSession?.sessionId);
      if (idx !== -1) {
        allSessions[idx] = { ...currentSession, isOnline: false };
        try {
          localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(allSessions));
        } catch {
          // ignore
        }
      }
    }
  };

  window.addEventListener('beforeunload', handleUnload);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      handleUnload();
    } else if (currentSession) {
      currentSession.isOnline = true;
    }
  });

  return () => {
    clearInterval(intervalId);
    window.removeEventListener('click', handleGlobalClick, { capture: true });
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('beforeunload', handleUnload);
  };
}

// Record an explicit or automated click event
export function recordClick(eventData: Omit<ClickEvent, 'id' | 'timestamp' | 'timeFormatted'>) {
  if (!currentSession) return;

  const now = Date.now();
  const elapsedSeconds = Math.floor((now - currentSession.startTime) / 1000);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const clickEvent: ClickEvent = {
    id: generateId('clk'),
    timestamp: now,
    timeFormatted,
    ...eventData,
  };

  currentSession.clicks.push(clickEvent);
  currentSession.lastActiveTime = now;
  currentSession.durationSeconds = elapsedSeconds;

  if (eventData.section && !currentSession.visitedSections.includes(eventData.section)) {
    currentSession.visitedSections.push(eventData.section);
  }

  const allSessions = getStoredSessions();
  const idx = allSessions.findIndex((s) => s.sessionId === currentSession?.sessionId);
  if (idx !== -1) {
    allSessions[idx] = { ...currentSession };
    saveSessions(allSessions);
  }
}

// Record section visit
export function recordSectionVisit(sectionId: string) {
  if (!currentSession) return;
  if (!currentSession.visitedSections.includes(sectionId)) {
    currentSession.visitedSections.push(sectionId);
    const allSessions = getStoredSessions();
    const idx = allSessions.findIndex((s) => s.sessionId === currentSession?.sessionId);
    if (idx !== -1) {
      allSessions[idx] = { ...currentSession };
      saveSessions(allSessions);
    }
  }
}

// Subscribe to analytics updates
export function subscribeToAnalytics(callback: (sessions: VisitorSession[]) => void): () => void {
  listeners.add(callback);
  callback(getStoredSessions());
  return () => {
    listeners.delete(callback);
  };
}

// Clear all visitor logs
export function clearAnalyticsLogs(): void {
  const visitorId = getVisitorId();
  const sessionId = sessionStorage.getItem(SESSION_ID_KEY) || generateId('sess');
  const now = Date.now();

  currentSession = {
    sessionId,
    visitorId,
    ip: '192.0.2.1',
    location: detectLocation(),
    device: detectDevice(),
    referrer: 'Direct / Cleared Session',
    language: navigator.language || 'en-US',
    startTime: now,
    lastActiveTime: now,
    durationSeconds: 0,
    isOnline: true,
    maxScrollDepth: 0,
    visitedSections: ['hero'],
    clicks: [],
    notes: 'Fresh session after logs cleared.',
  };

  saveSessions([currentSession]);
}

// Format duration helper (e.g. 185s -> "3m 05s")
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}
