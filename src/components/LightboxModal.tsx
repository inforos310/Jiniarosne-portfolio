import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { ExplorationItem } from '../types';

interface LightboxModalProps {
  item: ExplorationItem | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ item, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (item) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Lightbox Content Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative max-w-2xl w-full bg-surface border border-stroke rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stroke bg-surface/90">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#89AACC] px-2.5 py-1 rounded-full bg-stroke/60">
                  {item.category}
                </span>
                <h3 className="text-base font-display italic text-text-primary">
                  {item.title}
                </h3>
              </div>

              <button
                id="close-lightbox-btn"
                onClick={onClose}
                aria-label="Close Lightbox"
                className="w-8 h-8 rounded-full bg-stroke/50 hover:bg-stroke text-muted hover:text-text-primary flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image Preview */}
            <div className="relative aspect-square w-full bg-bg overflow-hidden flex items-center justify-center p-4">
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain rounded-2xl shadow-xl"
              />
            </div>

            {/* Caption & Tags */}
            <div className="p-6 border-t border-stroke bg-surface/60 space-y-3">
              <p className="text-xs sm:text-sm text-muted/90 leading-relaxed">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] sm:text-[11px] text-muted bg-bg px-2.5 py-1 rounded-full border border-stroke"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
