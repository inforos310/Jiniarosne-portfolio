import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import gsap from 'gsap';
import { usePortfolio } from '../context/PortfolioContext';

interface HeroProps {
  onSeeWorks: () => void;
  onReachOut: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSeeWorks, onReachOut }) => {
  const { data } = usePortfolio();
  const { hero } = data;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const heroContainerRef = useRef<HTMLDivElement | null>(null);
  const [roleIndex, setRoleIndex] = useState(0);

  const roles = hero.roles && hero.roles.length > 0 ? hero.roles : ['Brand Identity Designer'];
  const hlsSource = hero.videoUrl || 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';

  // Initialize HLS video stream
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        autoStartLoad: true,
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(hlsSource);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsSource;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => {});
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [hlsSource]);

  // Role cycler every 2s
  useEffect(() => {
    if (roles.length <= 1) return;
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [roles.length]);

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.name-reveal',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.1 }
      );

      tl.fromTo(
        '.blur-in',
        { opacity: 0, filter: 'blur(10px)', y: 20 },
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1.0, stagger: 0.1 },
        0.3
      );
    }, heroContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroContainerRef}
      className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden bg-[#0a0a0a] text-[#f5f5f5] px-6"
    >
      {/* Video & Ambient Background Layers */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 opacity-70"
        />
        
        {/* Dark overlay & blur overlay from theme */}
        <div className="absolute inset-0 bg-[#0a0a0a]/40 z-10" />
        <div className="absolute inset-0 blur-overlay z-10" />
        
        {/* Ambient deep radial background */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-[120%] h-[120%] bg-gradient-to-tr from-[#0a0a0a] via-[#141414] to-[#0d1a2a] opacity-50 blur-3xl" />
        </div>

        {/* Bottom smooth fade to content */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0a0a0a] to-transparent z-20" />
      </div>

      {/* Hero Content (Centered, z-10) */}
      <main className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center pt-24 pb-16">
        {/* Eyebrow */}
        <span className="blur-in text-[10px] text-white/40 uppercase tracking-[0.4em] mb-8 block select-none">
          {hero.collectionYear || "COLLECTION '26"}
        </span>

        {/* Name Reveal with text glow */}
        <h1 className="name-reveal text-6xl sm:text-7xl md:text-8xl lg:text-[100px] font-display italic leading-[0.85] tracking-tight text-white mb-8 text-glow select-none">
          {hero.name || 'Jinia Alam Rosne'}
        </h1>

        {/* Role cycler */}
        <div className="blur-in h-8 mb-6 flex items-center justify-center">
          <p className="text-base sm:text-lg font-light text-white/90">
            A{' '}
            <span
              key={roleIndex}
              className="font-display italic text-[#89AACC] animate-role-fade-in inline-block"
            >
              {roles[roleIndex % roles.length]}
            </span>{' '}
            {hero.locationText || 'based in Bangladesh.'}
          </p>
        </div>

        {/* Description */}
        <p className="blur-in text-[13px] text-white/40 max-w-[420px] leading-relaxed mb-12 uppercase tracking-wide">
          {hero.bio || 'Specializing in AI Automation and Digital Solutions, creating clear visual identities and smart digital experiences.'}
        </p>

        {/* CTA Buttons */}
        <div className="blur-in flex flex-wrap items-center justify-center gap-5">
          <button
            id="hero-see-works-btn"
            onClick={onSeeWorks}
            className="px-8 sm:px-10 py-3.5 sm:py-4 bg-white text-black rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-transparent hover:text-white border border-transparent hover:border-white/20 transition-all cursor-pointer select-none"
          >
            {hero.primaryCtaText || 'See Works'}
          </button>
          <button
            id="hero-reach-out-btn"
            onClick={onReachOut}
            className="px-8 sm:px-10 py-3.5 sm:py-4 border border-white/20 text-white rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all cursor-pointer select-none"
          >
            {hero.secondaryCtaText || 'Reach out'}
          </button>
        </div>
      </main>

      {/* Scroll Indicator (Bottom-center) */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-8 flex flex-col items-center gap-4 pointer-events-none select-none z-20">
        <span className="text-[9px] text-white/30 uppercase tracking-[0.3em]">
          Scroll
        </span>
        <div className="w-[1px] h-12 bg-white/10 relative overflow-hidden">
          <div className="absolute inset-0 scroll-line w-full" />
        </div>
      </div>
    </section>
  );
};

