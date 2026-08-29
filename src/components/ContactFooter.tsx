import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import gsap from 'gsap';
import { Lock } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface ContactFooterProps {
  onOpenResume?: () => void;
  onOpenAdmin?: () => void;
}

const HLS_SOURCE = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';
const MARQUEE_TEXT = 'BUILDING SMART DIGITAL SOLUTIONS • ';

export const ContactFooter: React.FC<ContactFooterProps> = ({ onOpenResume, onOpenAdmin }) => {
  const { data } = usePortfolio();
  const { hero, socialLinks } = data;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);

  // Initialize flipped HLS video stream
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;
    const source = hero.videoUrl || HLS_SOURCE;

    if (Hls.isSupported()) {
      hls = new Hls({
        autoStartLoad: true,
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => {});
      });
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [hero.videoUrl]);

  // GSAP Marquee animation: xPercent: -50, duration: 40, ease: "none", repeat: -1
  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const anim = gsap.to(marquee, {
      xPercent: -50,
      duration: 40,
      ease: 'none',
      repeat: -1,
    });

    return () => {
      anim.kill();
    };
  }, []);

  return (
    <footer
      id="contact"
      className="relative bg-[#0a0a0a] pt-20 md:pt-32 pb-8 md:pb-12 overflow-hidden text-[#f5f5f5] border-t border-white/5"
    >
      {/* Background Video (Flipped vertically scale-y-[-1] with heavier dark overlay) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 scale-y-[-1] opacity-35"
        />
        {/* Dark overlay & blur */}
        <div className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-[2px]" />
        <div className="absolute inset-0 blur-overlay" />
        {/* Top gradient blend */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
      </div>

      {/* Marquee Banner */}
      <div className="relative z-10 w-full overflow-hidden whitespace-nowrap mb-16 md:mb-24 py-4 border-y border-white/5 bg-[#141414]/30 backdrop-blur-sm">
        <div ref={marqueeRef} className="inline-flex w-max will-change-transform">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/30 px-6 select-none"
            >
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>

      {/* Main Contact CTA Area */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12 text-center flex flex-col items-center mb-20 md:mb-28">
        <span className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-medium mb-6">
          Have a vision in mind?
        </span>

        <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display italic text-white mb-10 max-w-3xl leading-[0.95] tracking-tight text-glow">
          Let&apos;s build something extraordinary together.
        </h2>

        {/* Email CTA Button with accent ring on hover */}
        <a
          id="contact-email-btn"
          href={`mailto:${hero.email || 'info.ros310@gmail.com'}`}
          className="group relative inline-flex items-center rounded-full text-[11px] font-bold uppercase tracking-[0.2em] cursor-pointer select-none transition-all duration-300 hover:scale-105"
        >
          {/* Accent ring */}
          <div className="absolute inset-[-1px] rounded-full accent-ring opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative z-10 flex items-center gap-3 bg-white text-black group-hover:bg-[#141414] group-hover:text-white px-8 sm:px-10 py-4 rounded-full font-bold transition-all duration-300 border border-transparent group-hover:border-white/20 shadow-2xl">
            <span>{hero.email || 'info.ros310@gmail.com'}</span>
            <span className="text-[11px] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
              ↗
            </span>
          </div>
        </a>

        {/* Sub text */}
        <p className="text-[11px] text-white/40 uppercase tracking-widest mt-6 max-w-xs">
          Direct inquiries • Typical response within 24 hours
        </p>
      </div>

      {/* Footer Bar */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Availability Badge */}
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className="text-[10px] text-white/50 uppercase tracking-[0.1em] font-medium">
            {hero.availabilityText || 'Available for projects'}
          </span>
          <span className="text-[10px] text-white/30 uppercase tracking-[0.1em] hidden sm:inline">• Worldwide</span>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-6 sm:gap-8">
          {(socialLinks || []).map((link) => (
            <a
              key={link.name}
              id={`social-link-${link.name.toLowerCase()}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-white/40 hover:text-white uppercase tracking-[0.1em] transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
          {onOpenResume && (
            <button
              onClick={onOpenResume}
              className="text-[10px] text-white/40 hover:text-white uppercase tracking-[0.1em] transition-colors duration-200 cursor-pointer"
            >
              Resume
            </button>
          )}

          {/* Admin Studio Trigger */}
          {onOpenAdmin && (
            <button
              id="footer-admin-trigger-btn"
              onClick={onOpenAdmin}
              title="Open Admin Studio (Alt+A)"
              className="group flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[10px] text-white/40 hover:text-white uppercase font-mono tracking-wider transition-all duration-200 border border-white/5 hover:border-white/15 cursor-pointer"
            >
              <Lock size={10} className="text-[#89AACC] group-hover:rotate-12 transition-transform" />
              <span>Admin Studio</span>
            </button>
          )}
        </div>

        {/* Copyright */}
        <div className="text-[10px] text-white/30 font-mono uppercase tracking-wider">
          © {new Date().getFullYear()} {hero.name || 'Jinia Alam Rosne'}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
