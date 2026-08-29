import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExplorationItem } from '../types';
import { usePortfolio } from '../context/PortfolioContext';

gsap.registerPlugin(ScrollTrigger);

interface ExplorationsProps {
  onSelectExploration: (item: ExplorationItem) => void;
}

export const Explorations: React.FC<ExplorationsProps> = ({ onSelectExploration }) => {
  const { data } = usePortfolio();
  const explorations = data.explorations;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinnedContentRef = useRef<HTMLDivElement | null>(null);
  const colLeftRef = useRef<HTMLDivElement | null>(null);
  const colRightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const pinnedContent = pinnedContentRef.current;
    const colLeft = colLeftRef.current;
    const colRight = colRightRef.current;

    if (!container || !pinnedContent || !colLeft || !colRight) return;

    const ctx = gsap.context(() => {
      // Pin the center text header throughout the parallax scroll range
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        pin: pinnedContent,
        pinSpacing: false,
      });

      // Parallax movement for Left column: starts lower, moves upward faster
      gsap.fromTo(
        colLeft,
        { y: 150 },
        {
          y: -250,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );

      // Parallax movement for Right column: starts higher, moves upward with different offset
      gsap.fromTo(
        colRight,
        { y: 350 },
        {
          y: -150,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.4,
          },
        }
      );
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  const leftItems = explorations.filter((_, idx) => idx % 2 === 0);
  const rightItems = explorations.filter((_, idx) => idx % 2 !== 0);

  return (
    <section
      id="explorations"
      ref={containerRef}
      className="relative min-h-[300vh] bg-[#0a0a0a] overflow-hidden border-t border-white/5"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#4E85BF]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Layer 1: Pinned Center Content (z-10) */}
      <div
        ref={pinnedContentRef}
        className="h-screen w-full flex flex-col items-center justify-center text-center px-6 z-10 pointer-events-none"
      >
        <div className="max-w-xl mx-auto flex flex-col items-center pointer-events-auto">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-white/10" />
            <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-medium">
              Explorations
            </span>
            <span className="w-8 h-px bg-white/10" />
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-display italic text-white tracking-tight mb-4 text-glow">
            Visual playground
          </h2>

          {/* Subtext */}
          <p className="text-xs sm:text-[13px] text-white/40 max-w-md mx-auto mb-8 uppercase tracking-wider leading-relaxed">
            Unfiltered design studies, generative shaders, and kinetic type iterations crafted in creative flow.
          </p>

          {/* Dribbble button */}
          <a
            id="explorations-dribbble-btn"
            href="https://dribbble.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center cursor-pointer select-none"
          >
            <div className="absolute inset-[-1px] rounded-full accent-ring opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative px-6 py-2.5 bg-[#141414] rounded-full border border-white/10 flex items-center gap-2 group-hover:border-transparent transition-all">
              <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-white">
                View on Dribbble
              </span>
              <span className="text-[10px] text-white/70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </div>
          </a>
        </div>
      </div>

      {/* Layer 2: Parallax Columns (z-20) */}
      <div className="absolute inset-0 max-w-[1300px] mx-auto px-4 sm:px-6 md:px-12 pointer-events-none z-20">
        <div className="grid grid-cols-2 gap-6 sm:gap-12 md:gap-24 w-full h-full pt-[20vh] pb-[20vh]">
          {/* Left Parallax Column */}
          <div
            ref={colLeftRef}
            className="flex flex-col items-center sm:items-start gap-20 sm:gap-32 pointer-events-auto"
          >
            {leftItems.map((item) => (
              <div
                key={item.id}
                id={`exploration-card-${item.id}`}
                onClick={() => onSelectExploration(item)}
                className={`group relative aspect-square w-full max-w-[260px] sm:max-w-[320px] rounded-2xl overflow-hidden bg-[#141414]/90 border border-white/10 hover:border-white/20 shadow-2xl p-2.5 cursor-pointer transform-gpu ${item.rotation || '-rotate-2'} hover:rotate-0 hover:scale-105 transition-all duration-500`}
              >
                {/* Image container */}
                <div className="w-full h-full rounded-xl overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                  />
                  {/* Subtle noise/halftone */}
                  <div className="absolute inset-0 halftone-overlay opacity-20 pointer-events-none" />

                  {/* Dark gradient for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="text-[10px] text-[#89AACC] uppercase tracking-wider font-mono">
                      {item.category}
                    </span>
                    <h4 className="text-sm sm:text-base font-display italic text-white font-medium">
                      {item.title}
                    </h4>
                  </div>
                </div>

                {/* Click to expand pill tag */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] bg-[#0a0a0a]/90 text-white px-2.5 py-1 rounded-full border border-white/20 backdrop-blur-sm shadow-md flex items-center gap-1 font-mono">
                    Zoom ⤢
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Parallax Column */}
          <div
            ref={colRightRef}
            className="flex flex-col items-center sm:items-end gap-24 sm:gap-36 pointer-events-auto"
          >
            {rightItems.map((item) => (
              <div
                key={item.id}
                id={`exploration-card-${item.id}`}
                onClick={() => onSelectExploration(item)}
                className={`group relative aspect-square w-full max-w-[260px] sm:max-w-[320px] rounded-2xl overflow-hidden bg-[#141414]/90 border border-white/10 hover:border-white/20 shadow-2xl p-2.5 cursor-pointer transform-gpu ${item.rotation || 'rotate-2'} hover:rotate-0 hover:scale-105 transition-all duration-500`}
              >
                {/* Image container */}
                <div className="w-full h-full rounded-xl overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                  />
                  {/* Subtle noise/halftone */}
                  <div className="absolute inset-0 halftone-overlay opacity-20 pointer-events-none" />

                  {/* Dark gradient for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="text-[10px] text-[#89AACC] uppercase tracking-wider font-mono">
                      {item.category}
                    </span>
                    <h4 className="text-sm sm:text-base font-display italic text-white font-medium">
                      {item.title}
                    </h4>
                  </div>
                </div>

                {/* Click to expand pill tag */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] bg-[#0a0a0a]/90 text-white px-2.5 py-1 rounded-full border border-white/20 backdrop-blur-sm shadow-md flex items-center gap-1 font-mono">
                    Zoom ⤢
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
