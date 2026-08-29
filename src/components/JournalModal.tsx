import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Calendar, Bookmark } from 'lucide-react';
import { JournalArticle } from '../types';

interface JournalModalProps {
  article: JournalArticle | null;
  onClose: () => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({ article, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (article) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [article, onClose]);

  return (
    <AnimatePresence>
      {article && (
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
            className="relative w-full max-w-3xl max-h-[90vh] bg-surface border border-stroke rounded-3xl overflow-hidden shadow-2xl flex flex-col z-10"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stroke bg-surface/90 backdrop-blur-sm sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#89AACC] px-2.5 py-1 rounded-full bg-stroke/60">
                  {article.category}
                </span>
              </div>

              <button
                id="close-journal-modal-btn"
                onClick={onClose}
                aria-label="Close article"
                className="w-8 h-8 rounded-full bg-stroke/50 hover:bg-stroke text-muted hover:text-text-primary flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
              {/* Header Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-xs text-muted">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal text-text-primary">
                  {article.title}
                </h1>

                <p className="text-base text-muted italic font-display border-l-2 border-[#89AACC] pl-4 py-1">
                  &ldquo;{article.summary}&rdquo;
                </p>
              </div>

              {/* Cover Image */}
              <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden border border-stroke">
                <img
                  src={article.image}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Body Text */}
              <div className="space-y-4 text-sm sm:text-base text-muted/90 leading-relaxed pt-2">
                {article.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* Author Box */}
              <div className="p-5 rounded-2xl bg-bg border border-stroke flex items-center gap-4 mt-8">
                <div className="w-11 h-11 rounded-full accent-gradient p-[1.5px] shrink-0">
                  <div className="w-full h-full rounded-full bg-surface flex items-center justify-center font-display italic text-sm font-bold text-white">
                    JR
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-text-primary">Jinia Alam Rosne</h4>
                  <p className="text-xs text-muted">Brand Identity Designer & AI Automation Specialist</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
