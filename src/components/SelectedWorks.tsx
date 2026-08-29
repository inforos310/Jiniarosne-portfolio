import React from 'react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { PROJECTS } from '../data/portfolioData';

interface SelectedWorksProps {
  onSelectProject: (project: Project) => void;
  onViewAll?: () => void;
}

export const SelectedWorks: React.FC<SelectedWorksProps> = ({
  onSelectProject,
  onViewAll,
}) => {
  return (
    <section id="work" className="bg-[#0a0a0a] py-16 md:py-28 relative">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        {/* Header with Framer Motion scroll entrance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16"
        >
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-white/10" />
              <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-medium">
                Selected Work
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal text-white tracking-tight text-glow">
              Featured <span className="font-display italic text-white">projects</span>
            </h2>

            {/* Subtext */}
            <p className="text-xs sm:text-[13px] text-white/40 max-w-lg mt-3 uppercase tracking-wider">
              A selection of projects I&apos;ve worked on, from concept to launch.
            </p>
          </div>

          {/* "View all work" button (desktop only, hidden on mobile) */}
          <div className="hidden md:block">
            <button
              id="view-all-work-btn"
              onClick={() => {
                if (onViewAll) onViewAll();
                else onSelectProject(PROJECTS[0]);
              }}
              className="group relative inline-flex items-center justify-center cursor-pointer select-none"
            >
              {/* Accent ring */}
              <div className="absolute inset-[-1px] rounded-full accent-ring opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative px-5 py-2 bg-[#141414] rounded-full border border-white/10 flex items-center gap-2 group-hover:border-transparent transition-all">
                <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-white">
                  View all work
                </span>
                <span className="text-[10px] text-white/70 transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Bento Grid: 12 cols with alternating 7/5/5/7 spans */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {PROJECTS.map((project, index) => {
            return (
              <motion.div
                key={project.id}
                id={`project-card-${project.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                onClick={() => onSelectProject(project)}
                className={`${project.colSpan} group relative bg-[#141414]/80 border border-white/5 hover:border-white/15 rounded-3xl overflow-hidden cursor-pointer transform-gpu transition-all duration-300`}
              >
                <div className={`w-full ${project.aspectRatio} relative overflow-hidden`}>
                  {/* Background Image with smooth zoom on hover */}
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-100"
                  />

                  {/* Halftone Pattern Overlay */}
                  <div className="absolute inset-0 halftone-overlay opacity-25 mix-blend-multiply pointer-events-none" />

                  {/* Ambient Bottom Gradient for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/20 to-transparent pointer-events-none" />

                  {/* Static Card Details (Visible always at bottom for quick scanning) */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col justify-end z-10 transition-opacity duration-300 group-hover:opacity-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] text-white/50 tracking-[0.1em] uppercase bg-[#0a0a0a]/80 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                        {project.category}
                      </span>
                      <span className="text-[10px] text-white/30 tracking-wider">{project.year}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-display italic text-white text-glow">
                      {project.title}
                    </h3>
                  </div>

                  {/* Hover Backdrop Overlay */}
                  <div className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-6 md:p-8 z-20">
                    {/* Top tags on hover */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] uppercase tracking-wider text-white/80 bg-white/10 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Centered / Lower Hover Label Pill */}
                    <div className="my-auto text-center flex flex-col items-center">
                      <div className="relative inline-flex items-center justify-center">
                        <div className="absolute inset-[-1px] rounded-full accent-ring" />
                        <div className="relative bg-white text-black px-6 py-2.5 rounded-full flex items-center gap-2 font-bold shadow-2xl">
                          <span className="text-[10px] tracking-widest uppercase">View</span>
                          <span className="text-xs text-black/30">—</span>
                          <span className="text-sm font-display italic font-semibold">
                            {project.title}
                          </span>
                          <span className="text-xs ml-1">↗</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-white/40 max-w-xs mt-3 uppercase tracking-wide hidden sm:block">
                        {project.tagline}
                      </p>
                    </div>

                    {/* Bottom Client and Deliverables Preview */}
                    <div className="flex items-center justify-between text-[11px] text-white/40 pt-4 border-t border-white/10 uppercase tracking-wider">
                      <span>Client: {project.client}</span>
                      <span className="text-white/80 font-medium">Explore Case Study</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
