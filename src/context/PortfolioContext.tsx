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

const PORTFOLIO_STORAGE_KEY = 'jinia_portfolio_data_v1';
const ADMIN_PIN_STORAGE_KEY = 'jinia_portfolio_admin_pin_v1';
const DEFAULT_PIN = '2026';

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

const DEFAULT_CUSTOM_CODE: CustomCodeConfig = {
  customCss: `/* Custom Global CSS - live injected */
/* You can write any CSS rules, custom selectors or animations here */

/* Example: Extra glow on hover */
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

const DEFAULT_PORTFOLIO_STATE: PortfolioDataState = {
  hero: DEFAULT_HERO_CONFIG,
  projects: PROJECTS,
  articles: JOURNAL_ARTICLES,
  explorations: EXPLORATIONS,
  stats: STATS,
  socialLinks: SOCIAL_LINKS,
  resume: RESUME_DATA,
  customCode: DEFAULT_CUSTOM_CODE,
};

interface PortfolioContextType {
  data: PortfolioDataState;
  // Hero
  updateHero: (hero: Partial<HeroConfig>) => void;
  // Projects
  updateProjects: (projects: Project[]) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  addProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  // Articles
  updateArticles: (articles: JournalArticle[]) => void;
  addArticle: (article: JournalArticle) => void;
  deleteArticle: (id: string) => void;
  // Explorations
  updateExplorations: (explorations: ExplorationItem[]) => void;
  addExploration: (item: ExplorationItem) => void;
  deleteExploration: (id: string) => void;
  // Stats
  updateStats: (stats: StatItem[]) => void;
  // Resume
  updateResume: (resume: ResumeData) => void;
  // Social
  updateSocialLinks: (links: SocialLink[]) => void;
  // Custom Code & Styles
  updateCustomCode: (code: Partial<CustomCodeConfig>) => void;
  // Global actions
  resetToDefaults: () => void;
  importFromJSON: (jsonString: string) => { success: boolean; error?: string };
  exportToJSON: () => string;
  // Admin Auth
  isAdminUnlocked: boolean;
  unlockAdmin: (pin: string) => boolean;
  lockAdmin: () => void;
  changeAdminPin: (oldPin: string, newPin: string) => { success: boolean; error?: string };
  adminPinHint: string;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioDataState>(() => {
    try {
      const saved = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          hero: { ...DEFAULT_HERO_CONFIG, ...parsed.hero },
          projects: parsed.projects || PROJECTS,
          articles: parsed.articles || JOURNAL_ARTICLES,
          explorations: parsed.explorations || EXPLORATIONS,
          stats: parsed.stats || STATS,
          socialLinks: parsed.socialLinks || SOCIAL_LINKS,
          resume: parsed.resume ? { ...RESUME_DATA, ...parsed.resume } : RESUME_DATA,
          customCode: { ...DEFAULT_CUSTOM_CODE, ...parsed.customCode },
        };
      }
    } catch (e) {
      console.error('Failed to load portfolio data from storage:', e);
    }
    return DEFAULT_PORTFOLIO_STATE;
  });

  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('jinia_admin_session_unlocked') === 'true';
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to persist portfolio data:', e);
    }
  }, [data]);

  // Inject custom CSS live into document head
  useEffect(() => {
    let styleEl = document.getElementById('jinia-custom-styles') as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'jinia-custom-styles';
      document.head.appendChild(styleEl);
    }

    const { customCss, primaryAccent, secondaryAccent } = data.customCode;
    styleEl.textContent = `
      :root {
        --custom-primary-accent: ${primaryAccent};
        --custom-secondary-accent: ${secondaryAccent};
      }
      ${customCss || ''}
    `;
  }, [data.customCode]);

  // Unlock Admin
  const unlockAdmin = useCallback((pin: string): boolean => {
    const storedPin = localStorage.getItem(ADMIN_PIN_STORAGE_KEY) || DEFAULT_PIN;
    if (pin.trim() === storedPin.trim()) {
      setIsAdminUnlocked(true);
      sessionStorage.setItem('jinia_admin_session_unlocked', 'true');
      return true;
    }
    return false;
  }, []);

  const lockAdmin = useCallback(() => {
    setIsAdminUnlocked(false);
    sessionStorage.removeItem('jinia_admin_session_unlocked');
  }, []);

  const changeAdminPin = useCallback((oldPin: string, newPin: string) => {
    const storedPin = localStorage.getItem(ADMIN_PIN_STORAGE_KEY) || DEFAULT_PIN;
    if (oldPin.trim() !== storedPin.trim()) {
      return { success: false, error: 'Current PIN is incorrect.' };
    }
    if (!newPin || newPin.trim().length < 4) {
      return { success: false, error: 'New PIN must be at least 4 digits.' };
    }
    localStorage.setItem(ADMIN_PIN_STORAGE_KEY, newPin.trim());
    return { success: true };
  }, []);

  // Update operations
  const updateHero = useCallback((hero: Partial<HeroConfig>) => {
    setData((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...hero },
    }));
  }, []);

  const updateProjects = useCallback((projects: Project[]) => {
    setData((prev) => ({ ...prev, projects }));
  }, []);

  const updateProject = useCallback((id: string, updated: Partial<Project>) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updated } : p)),
    }));
  }, []);

  const addProject = useCallback((project: Project) => {
    setData((prev) => ({
      ...prev,
      projects: [project, ...prev.projects],
    }));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  }, []);

  const updateArticles = useCallback((articles: JournalArticle[]) => {
    setData((prev) => ({ ...prev, articles }));
  }, []);

  const addArticle = useCallback((article: JournalArticle) => {
    setData((prev) => ({
      ...prev,
      articles: [article, ...prev.articles],
    }));
  }, []);

  const deleteArticle = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      articles: prev.articles.filter((a) => a.id !== id),
    }));
  }, []);

  const updateExplorations = useCallback((explorations: ExplorationItem[]) => {
    setData((prev) => ({ ...prev, explorations }));
  }, []);

  const addExploration = useCallback((item: ExplorationItem) => {
    setData((prev) => ({
      ...prev,
      explorations: [item, ...prev.explorations],
    }));
  }, []);

  const deleteExploration = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      explorations: prev.explorations.filter((e) => e.id !== id),
    }));
  }, []);

  const updateStats = useCallback((stats: StatItem[]) => {
    setData((prev) => ({ ...prev, stats }));
  }, []);

  const updateResume = useCallback((resume: ResumeData) => {
    setData((prev) => ({ ...prev, resume }));
  }, []);

  const updateSocialLinks = useCallback((socialLinks: SocialLink[]) => {
    setData((prev) => ({ ...prev, socialLinks }));
  }, []);

  const updateCustomCode = useCallback((customCode: Partial<CustomCodeConfig>) => {
    setData((prev) => ({
      ...prev,
      customCode: { ...prev.customCode, ...customCode },
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setData(DEFAULT_PORTFOLIO_STATE);
    localStorage.removeItem(PORTFOLIO_STORAGE_KEY);
  }, []);

  const importFromJSON = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'Invalid JSON format: must be a JSON object.' };
      }
      setData({
        hero: { ...DEFAULT_HERO_CONFIG, ...(parsed.hero || {}) },
        projects: Array.isArray(parsed.projects) ? parsed.projects : PROJECTS,
        articles: Array.isArray(parsed.articles) ? parsed.articles : JOURNAL_ARTICLES,
        explorations: Array.isArray(parsed.explorations) ? parsed.explorations : EXPLORATIONS,
        stats: Array.isArray(parsed.stats) ? parsed.stats : STATS,
        socialLinks: Array.isArray(parsed.socialLinks) ? parsed.socialLinks : SOCIAL_LINKS,
        resume: parsed.resume ? { ...RESUME_DATA, ...parsed.resume } : RESUME_DATA,
        customCode: { ...DEFAULT_CUSTOM_CODE, ...(parsed.customCode || {}) },
      });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'JSON parsing error' };
    }
  }, []);

  const exportToJSON = useCallback(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  return (
    <PortfolioContext.Provider
      value={{
        data,
        updateHero,
        updateProjects,
        updateProject,
        addProject,
        deleteProject,
        updateArticles,
        addArticle,
        deleteArticle,
        updateExplorations,
        addExploration,
        deleteExploration,
        updateStats,
        updateResume,
        updateSocialLinks,
        updateCustomCode,
        resetToDefaults,
        importFromJSON,
        exportToJSON,
        isAdminUnlocked,
        unlockAdmin,
        lockAdmin,
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
