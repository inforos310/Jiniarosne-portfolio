import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence } from 'motion/react';
import { Shield, Sparkles } from 'lucide-react';

import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SelectedWorks } from './components/SelectedWorks';
import { Journal } from './components/Journal';
import { Explorations } from './components/Explorations';
import { Stats } from './components/Stats';
import { ContactFooter } from './components/ContactFooter';
import { ProjectModal } from './components/ProjectModal';
import { JournalModal } from './components/JournalModal';
import { LightboxModal } from './components/LightboxModal';
import { ResumeModal } from './components/ResumeModal';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { AdminModal } from './components/admin/AdminModal';

import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { initAnalytics } from './utils/analytics';
import { Project, JournalArticle, ExplorationItem } from './types';

gsap.registerPlugin(ScrollTrigger);

function PortfolioMain() {
  const { isUnlocked } = usePortfolio();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle | null>(null);
  const [selectedExploration, setSelectedExploration] = useState<ExplorationItem | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);

  // Admin Panels state
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Telemetry Analytics tracking engine
  useEffect(() => {
    initAnalytics();
  }, []);

  // Initialize Lenis smooth scroll and connect to GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const rafTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Update active section based on scroll position
  useEffect(() => {
    const sections = ['hero', 'work', 'journal', 'explorations', 'stats', 'contact'];

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut listener for opening Admin panel (Alt + A or Ctrl + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        handleOpenAdmin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isUnlocked]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(element, { offset: 0, duration: 1.2 });
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenAdmin = () => {
    if (isUnlocked) {
      setIsAdminModalOpen(true);
    } else {
      setIsAdminAuthOpen(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-bg text-text-primary selection:bg-[#4E85BF] selection:text-white font-body">
      {/* Loading Screen Overlay */}
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Floating Navbar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenContact={() => scrollToSection('contact')}
      />

      {/* Main Content Sections */}
      <main className="w-full overflow-x-hidden">
        {/* Section 2: Hero */}
        <Hero
          onSeeWorks={() => scrollToSection('work')}
          onReachOut={() => scrollToSection('contact')}
        />

        {/* Section 3: Selected Works */}
        <SelectedWorks
          onSelectProject={(project) => setSelectedProject(project)}
          onViewAll={() => scrollToSection('work')}
        />

        {/* Section 4: Journal */}
        <Journal onSelectArticle={(article) => setSelectedArticle(article)} />

        {/* Section 5: Explorations (Parallax Gallery) */}
        <Explorations
          onSelectExploration={(item) => setSelectedExploration(item)}
        />

        {/* Section 6: Stats */}
        <Stats />

        {/* Section 7: Contact / Footer */}
        <ContactFooter
          onOpenResume={() => setIsResumeOpen(true)}
          onOpenAdmin={handleOpenAdmin}
        />
      </main>

      {/* Floating Admin Access Badge */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          id="floating-admin-trigger-btn"
          onClick={handleOpenAdmin}
          title="Open Admin Studio & Analytics (Alt+A)"
          className="group relative flex items-center gap-2 p-2.5 sm:px-4 sm:py-2.5 rounded-full bg-[#141414]/90 hover:bg-[#1a1a1a] border border-white/10 hover:border-white/20 text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <Shield size={14} className="text-[#89AACC] group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline text-[11px] font-mono tracking-wider uppercase text-white/80 group-hover:text-white">
            Admin Studio
          </span>
          <span className="hidden md:inline text-[9px] px-1.5 py-0.5 rounded bg-white/10 font-mono text-white/40">
            Alt+A
          </span>
        </button>
      </div>

      {/* Modals */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <JournalModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      <LightboxModal
        item={selectedExploration}
        onClose={() => setSelectedExploration(null)}
      />

      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      {/* Admin Passcode Auth Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={() => {
          setIsAdminAuthOpen(false);
          setIsAdminModalOpen(true);
        }}
      />

      {/* Full Admin Studio & Analytics Dashboard Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioMain />
    </PortfolioProvider>
  );
}
