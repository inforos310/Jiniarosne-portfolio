import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Mail, MapPin, Briefcase, GraduationCap, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { data } = usePortfolio();
  const resume = data.resume;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[92vh] bg-surface border border-stroke rounded-3xl overflow-hidden shadow-2xl flex flex-col z-10"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stroke bg-surface/95 backdrop-blur-sm sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase tracking-widest text-[#89AACC] px-3 py-1 rounded-full bg-stroke/60">
                  Curriculum Vitae
                </span>
                <span className="text-xs text-muted font-mono hidden sm:inline">2026 Edition</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 text-xs font-medium bg-stroke/40 hover:bg-stroke text-text-primary px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>

                <button
                  id="close-resume-modal-btn"
                  onClick={onClose}
                  aria-label="Close Resume"
                  className="w-8 h-8 rounded-full bg-stroke/50 hover:bg-stroke text-muted hover:text-text-primary flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 sm:p-10 space-y-10">
              {/* Header Profile */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-stroke">
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-display italic text-text-primary mb-2">
                    {resume.name}
                  </h1>
                  <p className="text-sm sm:text-base text-[#89AACC] font-medium mb-3">
                    {resume.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{resume.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{resume.email}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex sm:flex-col items-start sm:items-end gap-2">
                  <span className="text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full font-mono">
                    ● Available for Hire
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-3">
                <h2 className="text-xs uppercase tracking-[0.2em] font-mono text-muted">
                  Executive Summary
                </h2>
                <p className="text-sm sm:text-base text-muted/95 leading-relaxed">
                  {resume.summary}
                </p>
              </div>

              {/* Core Skills */}
              <div className="space-y-4">
                <h2 className="text-xs uppercase tracking-[0.2em] font-mono text-muted">
                  Core Expertise & Tooling
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(resume.coreSkills || []).map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-bg border border-stroke/70 text-xs text-text-primary font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#89AACC] shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Timeline */}
              <div className="space-y-6">
                <h2 className="text-xs uppercase tracking-[0.2em] font-mono text-muted flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Work Experience</span>
                </h2>

                <div className="space-y-6">
                  {(resume.experience || []).map((exp, idx) => (
                    <div
                      key={idx}
                      className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-stroke last:before:bottom-2"
                    >
                      <div className="absolute left-[-4px] top-2 w-2.5 h-2.5 rounded-full bg-[#4E85BF] ring-4 ring-surface" />
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1.5">
                        <h3 className="text-base font-medium text-text-primary">{exp.role}</h3>
                        <span className="text-xs font-mono text-muted">{exp.period}</span>
                      </div>
                      <div className="text-xs font-medium text-[#89AACC] mb-2">{exp.company}</div>
                      <p className="text-xs sm:text-sm text-muted leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="space-y-4 pt-4 border-t border-stroke">
                <h2 className="text-xs uppercase tracking-[0.2em] font-mono text-muted flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Education</span>
                </h2>
                {(resume.education || []).map((edu, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-bg border border-stroke/70">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-text-primary">{edu.degree}</h3>
                        <p className="text-xs text-muted">{edu.institution}</p>
                      </div>
                      <span className="text-xs font-mono text-muted">{edu.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

