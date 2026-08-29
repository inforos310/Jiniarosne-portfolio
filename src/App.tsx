import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence } from 'motion/react';

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

import { Project, JournalArticle, ExplorationItem } from './types';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle | null>(null);
  const [selectedExploration, setSelectedExploration] = useState<ExplorationItem | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);

  const lenisRef = useRef<Lenis | null>(null);

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
        <ContactFooter onOpenResume={() => setIsResumeOpen(true)} />
      </main>

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
    </div>
  );
}

