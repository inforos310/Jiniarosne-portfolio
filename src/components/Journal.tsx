import React from 'react';
import { motion } from 'motion/react';
import { JournalArticle } from '../types';
import { JOURNAL_ARTICLES } from '../data/portfolioData';

interface JournalProps {
  onSelectArticle: (article: JournalArticle) => void;
}

export const Journal: React.FC<JournalProps> = ({ onSelectArticle }) => {
  return (
    <section id="journal" className="bg-[#0a0a0a] py-16 md:py-28 relative border-t border-white/5">
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
                Journal
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal text-white tracking-tight text-glow">
              Recent <span className="font-display italic text-white">thoughts</span>
            </h2>

            {/* Subtext */}
            <p className="text-xs sm:text-[13px] text-white/40 max-w-lg mt-3 uppercase tracking-wider">
              Reflections on design systems, autonomous intelligence, and creative precision.
            </p>
          </div>

          {/* "View all" button */}
          <div className="hidden md:block">
            <button
              id="view-all-journal-btn"
              onClick={() => onSelectArticle(JOURNAL_ARTICLES[0])}
              className="group relative inline-flex items-center justify-center cursor-pointer select-none"
            >
              <div className="absolute inset-[-1px] rounded-full accent-ring opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative px-5 py-2 bg-[#141414] rounded-full border border-white/10 flex items-center gap-2 group-hover:border-transparent transition-all">
                <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-white">
                  View all
                </span>
                <span className="text-[10px] text-white/70 transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </div>
            </button>
          </div>
        </motion.div>

        {/* 4 Horizontal Pill List Items */}
        <div className="flex flex-col gap-4 sm:gap-5">
          {JOURNAL_ARTICLES.map((article, index) => {
            return (
              <motion.div
                key={article.id}
                id={`journal-pill-${article.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                onClick={() => onSelectArticle(article)}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-4 sm:p-5 md:p-6 bg-[#141414]/50 hover:bg-[#141414]/90 border border-white/5 hover:border-white/15 rounded-[32px] sm:rounded-full transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl"
              >
                {/* Subtle Hover Gradient Highlight inside pill */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#89AACC]/10 to-[#4E85BF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-full" />

                {/* Left side: Thumbnail image + Title */}
                <div className="flex items-center gap-4 sm:gap-6 z-10 min-w-0">
                  {/* Article thumbnail */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden shrink-0 border border-white/10 group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={article.image}
                      alt={article.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>

                  {/* Title & category */}
                  <div className="min-w-0">
                    <span className="text-[10px] text-white/40 tracking-widest uppercase font-medium mb-1 block">
                      {article.category}
                    </span>
                    <h3 className="text-base sm:text-lg md:text-xl font-medium text-white/90 group-hover:text-white transition-colors truncate">
                      {article.title}
                    </h3>
                  </div>
                </div>

                {/* Right side: Read time, Date, and Arrow */}
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 z-10 shrink-0 text-xs text-white/40">
                  <div className="flex items-center gap-4">
                    <span className="text-white/40">{article.readTime}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-white/50 font-mono text-[10px] sm:text-xs">
                      {article.date}
                    </span>
                  </div>

                  {/* Arrow circle */}
                  <div className="w-8 h-8 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center text-white/70 group-hover:bg-white group-hover:text-black group-hover:border-transparent transition-all duration-300">
                    <span className="text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      ↗
                    </span>
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
