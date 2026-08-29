import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, ArrowRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-surface border border-stroke rounded-3xl overflow-hidden shadow-2xl flex flex-col z-10"
          >
            {/* Top Bar with Close Button */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stroke bg-surface/90 backdrop-blur-sm sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#89AACC] px-2.5 py-1 rounded-full bg-stroke/60">
                  {project.category}
                </span>
                <span className="text-xs text-muted font-mono">{project.year}</span>
              </div>

              <button
                id="close-project-modal-btn"
                onClick={onClose}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full bg-stroke/50 hover:bg-stroke text-muted hover:text-text-primary flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
              {/* Header Title */}
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display italic text-text-primary mb-3">
                  {project.title}
                </h2>
                <p className="text-base text-muted max-w-2xl leading-relaxed">
                  {project.tagline}
                </p>
              </div>

              {/* Cover Image */}
              <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden border border-stroke relative">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 halftone-overlay opacity-15 pointer-events-none" />
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-bg border border-stroke text-xs">
                <div>
                  <span className="text-muted block mb-1">Client</span>
                  <span className="text-text-primary font-medium">{project.client}</span>
                </div>
                <div>
                  <span className="text-muted block mb-1">Timeline</span>
                  <span className="text-text-primary font-medium">{project.year}</span>
                </div>
                <div>
                  <span className="text-muted block mb-1">Impact</span>
                  <span className="text-[#89AACC] font-medium">{project.metrics || 'High Performance'}</span>
                </div>
                <div>
                  <span className="text-muted block mb-1">Role</span>
                  <span className="text-text-primary font-medium">Lead Designer & Technologist</span>
                </div>
              </div>

              {/* Detailed Overview */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-text-primary">Project Overview</h3>
                <p className="text-sm sm:text-base text-muted leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Challenge & Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-bg border border-stroke/80 space-y-2">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-text-primary">
                    The Challenge
                  </h4>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    {project.challenge}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-bg border border-stroke/80 space-y-2">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-[#89AACC]">
                    The Solution
                  </h4>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              </div>

              {/* Deliverables & Tags */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-text-primary">Core Deliverables</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted">
                  {project.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4E85BF]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-stroke flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] text-muted bg-bg px-2.5 py-1 rounded-full border border-stroke"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href="mailto:info.ros310@gmail.com?subject=Inquiry%20regarding%20Portfolio%20Work"
                  className="inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-full bg-text-primary text-bg hover:opacity-90 transition-opacity"
                >
                  <span>Inquire about similar project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
