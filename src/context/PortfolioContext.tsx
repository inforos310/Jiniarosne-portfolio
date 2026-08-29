import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  PortfolioDataState,
  Project,
  JournalArticle,
  ExplorationItem,
  StatItem,
  SocialLink,
  ResumeData,
  HeroConfig,
  NavbarConfig,
  CustomCodeConfig,
} from '../types';
import {
  PROJECTS,
  JOURNAL_ARTICLES,
  EXPLORATIONS,
  STATS,
  SOCIAL_LINKS,
  RESUME_DATA,
} from '../data/portfolioData';

const DEFAULT_HERO_CONFIG: HeroConfig = {
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

const DEFAULT_NAVBAR_CONFIG: NavbarConfig = {
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
.card-glow-boost:hover {
  box-shadow: 0 0 40px rgba(137, 170, 204, 0.25);
}
`,
  customJs: `// Custom JavaScript / Webhook script
console.log('Portfolio Custom Script Loaded.');
`,
  primaryAccent: '#89AACC',
  secondaryAccent: '#4E85BF',
  glowIntensity: 0.28,
  borderRadiusScale: 24,
};

const FALLBACK_STATE: PortfolioDataState = {
  hero: DEFAULT_HERO_CONFIG,
  navbar: DEFAULT_NAVBAR_CONFIG,
  projects: PROJECTS,
  articles: JOURNAL_ARTICLES,
  explorations: EXPLORATIONS,
  stats: STATS,
  socialLinks: SOCIAL_LINKS,
  resume: RESUME_DATA,
  customCode: DEFAULT_CUSTOM_CODE,
};

interface PortfolioContextType {
  // Public Published Data (Single Source of Truth)
  data: PortfolioDataState;
  publishedVersion: number;
  publishedAt: string;
  isLoading: boolean;
  refetchPublishedData: () => Promise<void>;

  // Draft Data for Admin CMS
  draftData: PortfolioDataState;
  isDraftModified: boolean;
  isPreviewMode: boolean;
  setIsPreviewMode: (val: boolean) => void;
  
  // Draft Mutation functions (Admin modifies draft)
  updateHeroDraft: (hero: Partial<HeroConfig>) => void;
  updateNavbarDraft: (navbar: Partial<NavbarConfig>) => void;
  updateProjectsDraft: (projects: Project[]) => void;
  updateProjectDraft: (id: string, project: Partial<Project>) => void;
  addProjectDraft: (project: Project) => void;
  deleteProjectDraft: (id: string) => void;
  
  updateArticlesDraft: (articles: JournalArticle[]) => void;
  updateArticleDraft: (id: string, article: Partial<JournalArticle>) => void;
  addArticleDraft: (article: JournalArticle) => void;
  deleteArticleDraft: (id: string) => void;

  updateExplorationsDraft: (explorations: ExplorationItem[]) => void;
  addExplorationDraft: (item: ExplorationItem) => void;
  deleteExplorationDraft: (id: string) => void;

  updateStatsDraft: (stats: StatItem[]) => void;
  updateResumeDraft: (resume: ResumeData) => void;
  updateSocialLinksDraft: (links: SocialLink[]) => void;
  updateCustomCodeDraft: (code: Partial<CustomCodeConfig>) => void;

  // Persistence Actions
  saveDraftToDatabase: () => Promise<{ success: boolean; message?: string; error?: string }>;
  publishToLiveWebsite: (note?: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  resetToDefaults: () => Promise<{ success: boolean; message?: string; error?: string }>;
  rollbackToVersion: (version: number) => Promise<{ success: boolean; message?: string; error?: string }>;

  // Admin Auth
  isAdminAuthenticated: boolean;
  isUnlocked: boolean;
  adminToken: string | null;
  loginAdmin: (pin: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  changeAdminPin: (oldPin: string, newPin: string) => Promise<{ success: boolean; error?: string }>;
  adminPinHint: string;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publishedData, setPublishedData] = useState<PortfolioDataState>(FALLBACK_STATE);
  const [publishedVersion, setPublishedVersion] = useState<number>(1);
  const [publishedAt, setPublishedAt] = useState<string>(new Date().toISOString());
  
  const [draftData, setDraftData] = useState<PortfolioDataState>(FALLBACK_STATE);
  const [isDraftModified, setIsDraftModified] = useState<boolean>(false);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem('jinia_admin_token') || null;
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  // 1. Fetch published data from backend API (Single Source of Truth)
  const fetchPublishedData = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setPublishedData(json.data);
          setPublishedVersion(json.version || 1);
          setPublishedAt(json.publishedAt || new Date().toISOString());
          return;
        }
      }
    } catch (e) {
      console.warn('Could not fetch from /api/portfolio, using cached state:', e);
    }
  }, []);

  // 2. Fetch draft data from backend if authenticated
  const fetchDraftData = useCallback(async (token: string) => {
    try {
      const res = await fetch('/api/portfolio/draft', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setDraftData(json.data);
          setIsDraftModified(!!json.isModified);
        }
      }
    } catch (e) {
      console.warn('Could not fetch draft data:', e);
    }
  }, []);

  // 3. Verify token on startup
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      await fetchPublishedData();

      const token = sessionStorage.getItem('jinia_admin_token');
      if (token) {
        try {
          const res = await fetch('/api/admin/verify', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const json = await res.json();
          if (json.authenticated) {
            setIsAdminAuthenticated(true);
            setAdminToken(token);
            await fetchDraftData(token);
          } else {
            sessionStorage.removeItem('jinia_admin_token');
            setIsAdminAuthenticated(false);
            setAdminToken(null);
          }
        } catch (e) {
          // Token verification failed
        }
      }
      setIsLoading(false);
    }
    init();
  }, [fetchPublishedData, fetchDraftData]);

  // Inject custom CSS live into document head
  const activeCustomCode = isPreviewMode ? draftData.customCode : publishedData.customCode;
  useEffect(() => {
    let styleEl = document.getElementById('jinia-custom-styles') as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'jinia-custom-styles';
      document.head.appendChild(styleEl);
    }

    const { customCss, primaryAccent, secondaryAccent } = activeCustomCode;
    styleEl.textContent = `
      :root {
        --custom-primary-accent: ${primaryAccent || '#89AACC'};
        --custom-secondary-accent: ${secondaryAccent || '#4E85BF'};
      }
      ${customCss || ''}
    `;
  }, [activeCustomCode]);

  // Auth functions
  const loginAdmin = useCallback(async (pin: string) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const json = await res.json();
      if (json.success && json.token) {
        sessionStorage.setItem('jinia_admin_token', json.token);
        setAdminToken(json.token);
        setIsAdminAuthenticated(true);
        await fetchDraftData(json.token);
        return { success: true };
      }
      return { success: false, error: json.error || 'Invalid passcode' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Login failed' };
    }
  }, [fetchDraftData]);

  const logoutAdmin = useCallback(() => {
    sessionStorage.removeItem('jinia_admin_token');
    setAdminToken(null);
    setIsAdminAuthenticated(false);
    setIsPreviewMode(false);
  }, []);

  const changeAdminPin = useCallback(async (oldPin: string, newPin: string) => {
    if (!adminToken) return { success: false, error: 'Not authenticated' };
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ oldPin, newPin }),
      });
      const json = await res.json();
      if (json.success) {
        return { success: true };
      }
      return { success: false, error: json.error || 'Failed to update PIN' };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [adminToken]);

  // Draft Mutations
  const updateHeroDraft = useCallback((hero: Partial<HeroConfig>) => {
    setDraftData((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...hero },
    }));
    setIsDraftModified(true);
  }, []);

  const updateNavbarDraft = useCallback((navbar: Partial<NavbarConfig>) => {
    setDraftData((prev) => ({
      ...prev,
      navbar: { ...prev.navbar, ...DEFAULT_NAVBAR_CONFIG, ...navbar },
    }));
    setIsDraftModified(true);
  }, []);

  const updateProjectsDraft = useCallback((projects: Project[]) => {
    setDraftData((prev) => ({ ...prev, projects }));
    setIsDraftModified(true);
  }, []);

  const updateProjectDraft = useCallback((id: string, updated: Partial<Project>) => {
    setDraftData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updated } : p)),
    }));
    setIsDraftModified(true);
  }, []);

  const addProjectDraft = useCallback((project: Project) => {
    setDraftData((prev) => ({
      ...prev,
      projects: [project, ...prev.projects],
    }));
    setIsDraftModified(true);
  }, []);

  const deleteProjectDraft = useCallback((id: string) => {
    setDraftData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
    setIsDraftModified(true);
  }, []);

  const updateArticlesDraft = useCallback((articles: JournalArticle[]) => {
    setDraftData((prev) => ({ ...prev, articles }));
    setIsDraftModified(true);
  }, []);

  const updateArticleDraft = useCallback((id: string, updated: Partial<JournalArticle>) => {
    setDraftData((prev) => ({
      ...prev,
      articles: prev.articles.map((a) => (a.id === id ? { ...a, ...updated } : a)),
    }));
    setIsDraftModified(true);
  }, []);

  const addArticleDraft = useCallback((article: JournalArticle) => {
    setDraftData((prev) => ({
      ...prev,
      articles: [article, ...prev.articles],
    }));
    setIsDraftModified(true);
  }, []);

  const deleteArticleDraft = useCallback((id: string) => {
    setDraftData((prev) => ({
      ...prev,
      articles: prev.articles.filter((a) => a.id !== id),
    }));
    setIsDraftModified(true);
  }, []);

  const updateExplorationsDraft = useCallback((explorations: ExplorationItem[]) => {
    setDraftData((prev) => ({ ...prev, explorations }));
    setIsDraftModified(true);
  }, []);

  const addExplorationDraft = useCallback((item: ExplorationItem) => {
    setDraftData((prev) => ({
      ...prev,
      explorations: [item, ...prev.explorations],
    }));
    setIsDraftModified(true);
  }, []);

  const deleteExplorationDraft = useCallback((id: string) => {
    setDraftData((prev) => ({
      ...prev,
      explorations: prev.explorations.filter((e) => e.id !== id),
    }));
    setIsDraftModified(true);
  }, []);

  const updateStatsDraft = useCallback((stats: StatItem[]) => {
    setDraftData((prev) => ({ ...prev, stats }));
    setIsDraftModified(true);
  }, []);

  const updateResumeDraft = useCallback((resume: ResumeData) => {
    setDraftData((prev) => ({ ...prev, resume }));
    setIsDraftModified(true);
  }, []);

  const updateSocialLinksDraft = useCallback((socialLinks: SocialLink[]) => {
    setDraftData((prev) => ({ ...prev, socialLinks }));
    setIsDraftModified(true);
  }, []);

  const updateCustomCodeDraft = useCallback((customCode: Partial<CustomCodeConfig>) => {
    setDraftData((prev) => ({
      ...prev,
      customCode: { ...prev.customCode, ...customCode },
    }));
    setIsDraftModified(true);
  }, []);

  // Save Draft directly to Database
  const saveDraftToDatabase = useCallback(async () => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch('/api/portfolio/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(draftData),
      });
      const json = await res.json();
      if (json.success) {
        setIsDraftModified(false);
        return { success: true, message: 'Draft saved permanently in database.' };
      }
      return { success: false, error: json.error || 'Failed to save draft' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error saving draft' };
    }
  }, [adminToken, draftData]);

  // Publish to Live Website (Single Source of Truth update)
  const publishToLiveWebsite = useCallback(async (note?: string) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch('/api/portfolio/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          note: note || `Published on ${new Date().toLocaleTimeString()}`,
          draftOverride: draftData,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setPublishedData(json.data);
        setPublishedVersion(json.version);
        setPublishedAt(json.publishedAt);
        setDraftData(json.data);
        setIsDraftModified(false);
        setIsPreviewMode(false);
        return { success: true, message: 'Changes are now LIVE on the public website!' };
      }
      return { success: false, error: json.error || 'Failed to publish' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error during publish' };
    }
  }, [adminToken, draftData]);

  // Reset to Defaults
  const resetToDefaults = useCallback(async () => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch('/api/portfolio/reset', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const json = await res.json();
      if (json.success && json.data) {
        setPublishedData(json.data);
        setDraftData(json.data);
        setIsDraftModified(false);
        setIsPreviewMode(false);
        return { success: true, message: 'Reset to default seed state' };
      }
      return { success: false, error: json.error || 'Failed to reset' };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [adminToken]);

  // Rollback
  const rollbackToVersion = useCallback(async (version: number) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch('/api/portfolio/rollback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ version }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setPublishedData(json.data);
        setDraftData(json.data);
        setIsDraftModified(false);
        return { success: true, message: `Rolled back to version ${version}` };
      }
      return { success: false, error: json.error || 'Rollback failed' };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [adminToken]);

  const activeData = isPreviewMode ? draftData : publishedData;

  return (
    <PortfolioContext.Provider
      value={{
        data: activeData,
        publishedVersion,
        publishedAt,
        isLoading,
        refetchPublishedData: fetchPublishedData,

        draftData,
        isDraftModified,
        isPreviewMode,
        setIsPreviewMode,

        updateHeroDraft,
        updateNavbarDraft,
        updateProjectsDraft,
        updateProjectDraft,
        addProjectDraft,
        deleteProjectDraft,

        updateArticlesDraft,
        updateArticleDraft,
        addArticleDraft,
        deleteArticleDraft,

        updateExplorationsDraft,
        addExplorationDraft,
        deleteExplorationDraft,

        updateStatsDraft,
        updateResumeDraft,
        updateSocialLinksDraft,
        updateCustomCodeDraft,

        saveDraftToDatabase,
        publishToLiveWebsite,
        resetToDefaults,
        rollbackToVersion,

        isAdminAuthenticated,
        isUnlocked: isAdminAuthenticated,
        adminToken,
        loginAdmin,
        logoutAdmin,
        changeAdminPin,
        adminPinHint: 'Default PIN is 2026',
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
