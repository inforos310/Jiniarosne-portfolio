// Real Privacy-Conscious Visitor Telemetry & Tracking Engine

const VISITOR_ID_KEY = 'jinia_visitor_id_v2';
const SESSION_ID_KEY = 'jinia_session_id_v2';
const SESSION_START_KEY = 'jinia_session_start_v2';

let currentSessionId = '';
let currentVisitorId = '';
let sessionStartTime = Date.now();
let activeSeconds = 0;
let lastActiveTimestamp = Date.now();
let heartbeatTimer: any = null;
let maxScrollDepthRecorded = 0;
const visitedSectionsSet = new Set<string>();

// Deduplicate clicks within 300ms
const recentClicks = new Map<string, number>();

function getOrCreateVisitorId(): { visitorId: string; isReturning: boolean } {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  let isReturning = false;
  if (!visitorId) {
    visitorId = `vid_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  } else {
    isReturning = true;
  }
  return { visitorId, isReturning };
}

function getOrCreateSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = `ses_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    sessionStorage.setItem(SESSION_START_KEY, String(Date.now()));
  }
  return sessionId;
}

function detectDevice(): {
  type: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  os: string;
  screenResolution: string;
} {
  if (typeof window === 'undefined') {
    return { type: 'Desktop', browser: 'Unknown', os: 'Unknown', screenResolution: '1920x1080' };
  }

  const ua = navigator.userAgent || '';
  let type: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';
  if (/iPad|tablet|(android(?!.*mobile))/i.test(ua)) {
    type = 'Tablet';
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/i.test(ua)) {
    type = 'Mobile';
  }

  let browser = 'Chrome';
  if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Edg/i.test(ua)) browser = 'Edge';
  else if (/OPR|Opera/i.test(ua)) browser = 'Opera';

  let os = 'Windows';
  if (/Mac/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua)) os = 'Linux';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';

  const screenResolution = `${window.screen.width || window.innerWidth}x${window.screen.height || window.innerHeight}`;

  return { type, browser, os, screenResolution };
}

export function initAnalytics() {
  if (typeof window === 'undefined') return;

  const { visitorId, isReturning } = getOrCreateVisitorId();
  const sessionId = getOrCreateSessionId();
  currentVisitorId = visitorId;
  currentSessionId = sessionId;

  const storedStart = sessionStorage.getItem(SESSION_START_KEY);
  sessionStartTime = storedStart ? Number(storedStart) : Date.now();
  lastActiveTimestamp = Date.now();

  const device = detectDevice();
  const referrer = document.referrer ? new URL(document.referrer, window.location.origin).hostname : 'Direct Visit';
  const language = navigator.language || 'en-US';

  // Send initial session payload to backend
  try {
    fetch('/api/analytics/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        visitorId,
        device,
        referrer,
        language,
        startTime: sessionStartTime,
        isReturning,
        pageViews: 1,
        visitedSections: ['hero'],
      }),
    }).catch(() => {});
  } catch (e) {}

  // Track max scroll depth
  const handleScroll = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const scrollPercent = Math.round((window.scrollY / totalHeight) * 100);
      if (scrollPercent > maxScrollDepthRecorded) {
        maxScrollDepthRecorded = scrollPercent;
      }
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // IntersectionObserver for tracking sections
  const sectionIds = ['hero', 'work', 'journal', 'explorations', 'stats', 'contact'];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id && !visitedSectionsSet.has(id)) {
            visitedSectionsSet.add(id);
            trackEvent('section_view', {
              elementId: `section_${id}`,
              section: id,
              label: `Viewed section: ${id.toUpperCase()}`,
            });
          }
        }
      });
    },
    { threshold: 0.3 }
  );

  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  // Track active time heartbeat
  const startHeartbeat = () => {
    if (heartbeatTimer) clearInterval(heartbeatTimer);
    heartbeatTimer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        const delta = Math.floor((now - lastActiveTimestamp) / 1000);
        if (delta < 60) {
          activeSeconds += Math.min(delta, 15);
        }
        lastActiveTimestamp = now;

        const duration = Math.floor((now - sessionStartTime) / 1000);
        try {
          fetch('/api/analytics/heartbeat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: currentSessionId,
              durationSeconds: duration,
              maxScrollDepth: maxScrollDepthRecorded,
            }),
          }).catch(() => {});
        } catch (e) {}
      }
    }, 15000);
  };

  startHeartbeat();

  // Activity listeners to update last active timestamp
  const recordActivity = () => {
    lastActiveTimestamp = Date.now();
  };
  window.addEventListener('mousemove', recordActivity, { passive: true });
  window.addEventListener('keydown', recordActivity, { passive: true });
  window.addEventListener('click', recordActivity, { passive: true });
  window.addEventListener('touchstart', recordActivity, { passive: true });

  // Handle visibility change and exit beacon
  const sendFinalBeacon = () => {
    const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
    const payload = JSON.stringify({
      sessionId: currentSessionId,
      durationSeconds: duration,
      maxScrollDepth: maxScrollDepthRecorded,
      isOnline: false,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/beacon', payload);
    } else {
      try {
        fetch('/api/analytics/beacon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      } catch (e) {}
    }
  };

  window.addEventListener('pagehide', sendFinalBeacon);
  window.addEventListener('beforeunload', sendFinalBeacon);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendFinalBeacon();
    } else {
      lastActiveTimestamp = Date.now();
    }
  });
}

export function trackEvent(
  eventName: string,
  metadata?: {
    elementId?: string;
    section?: string;
    label?: string;
    [key: string]: any;
  }
) {
  if (typeof window === 'undefined') return;

  const elementId = metadata?.elementId || eventName;
  const now = Date.now();

  // Deduplicate rapid clicks
  const lastClicked = recentClicks.get(elementId) || 0;
  if (now - lastClicked < 300) {
    return;
  }
  recentClicks.set(elementId, now);

  const sessionId = currentSessionId || sessionStorage.getItem(SESSION_ID_KEY) || 'ses_guest';
  const visitorId = currentVisitorId || localStorage.getItem(VISITOR_ID_KEY) || 'vid_guest';

  try {
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        visitorId,
        eventName,
        elementId,
        section: metadata?.section || 'global',
        metadata: {
          label: metadata?.label || elementId,
          url: window.location.href,
          pathname: window.location.pathname,
          ...metadata,
        },
      }),
    }).catch(() => {});
  } catch (e) {}
}
