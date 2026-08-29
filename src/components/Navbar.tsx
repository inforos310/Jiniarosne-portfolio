import React, { useState, useEffect } from 'react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenResume: () => void;
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenResume,
  onOpenContact,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'Work', id: 'work' },
    { label: 'Resume', id: 'resume', isAction: true },
  ];

  return (
    <header
      id="main-navbar"
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 md:pt-8 px-4 transition-all duration-300 pointer-events-none"
    >
      <nav
        className={`inline-flex items-center rounded-full backdrop-blur-xl border border-white/5 bg-[#141414]/60 px-2 py-2 gap-1 pointer-events-auto transition-all duration-300 ${
          isScrolled ? 'shadow-2xl shadow-black/80 border-white/10 bg-[#141414]/85' : 'shadow-lg shadow-black/30'
        }`}
      >
        {/* Logo with reverse-gradient border on hover */}
        <button
          id="nav-logo-btn"
          onClick={() => onNavigate('hero')}
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
          aria-label="Jinia Alam Rosne Home"
          className="group relative p-[1px] rounded-full cursor-pointer shrink-0 transition-transform duration-300 hover:scale-105"
        >
          <div className={`rounded-full p-[1px] ${logoHovered ? 'accent-gradient-rev' : 'accent-ring'}`}>
            <div className="w-9 h-9 rounded-full bg-[#0a0a0a] flex items-center justify-center">
              <span className="font-display italic text-[13px] tracking-tighter text-white select-none">
                JR
              </span>
            </div>
          </div>
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-white/10 mx-2" />

        {/* Nav links */}
        <div className="flex items-center">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id && !link.isAction;
            return (
              <button
                key={link.label}
                id={`nav-link-${link.id}`}
                onClick={() => {
                  if (link.isAction) {
                    onOpenResume();
                  } else {
                    onNavigate(link.id);
                  }
                }}
                className={`text-[11px] font-medium uppercase tracking-[0.1em] px-4 py-1.5 rounded-full transition-colors duration-200 cursor-pointer select-none ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-white/10 mx-2" />

        {/* "Say hi" button with animated gradient border on hover */}
        <button
          id="nav-say-hi-btn"
          onClick={onOpenContact}
          className="group relative inline-flex items-center justify-center cursor-pointer select-none"
        >
          {/* Accent ring on hover */}
          <div className="absolute inset-[-1px] rounded-full accent-ring opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Inner pill content */}
          <div className="relative px-4 py-1.5 bg-[#141414] rounded-full border border-white/10 flex items-center gap-2 group-hover:border-transparent transition-all">
            <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-white">
              Say hi
            </span>
            <span className="text-[10px] text-white/70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white">
              ↗
            </span>
          </div>
        </button>
      </nav>
    </header>
  );
};
