import React from 'react';
import { motion } from 'motion/react';
import { STATS } from '../data/portfolioData';

export const Stats: React.FC = () => {
  return (
    <section id="stats" className="bg-[#0a0a0a] py-20 md:py-32 relative border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-3 mb-16"
        >
          <span className="w-8 h-px bg-white/10" />
          <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-medium">
            Impact & Reach
          </span>
          <span className="w-8 h-px bg-white/10" />
        </motion.div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
          {STATS.map((stat, index) => {
            return (
              <motion.div
                key={stat.id}
                id={`stat-card-${stat.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.15,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="group relative p-8 sm:p-10 rounded-3xl bg-[#141414]/40 border border-white/5 hover:border-white/15 transition-all duration-300 flex flex-col items-center justify-center backdrop-blur-xl"
              >
                {/* Background glow on hover */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#89AACC]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Big number with display serif italic */}
                <div className="text-5xl sm:text-6xl lg:text-7xl font-display italic text-white tracking-tight mb-2 text-glow">
                  <span>{stat.value}</span>
                </div>

                {/* Label */}
                <span className="text-[10px] sm:text-[11px] text-white/40 uppercase tracking-[0.2em] font-medium mt-1 mb-2">
                  {stat.label}
                </span>

                {/* Description */}
                <p className="text-xs text-white/50 max-w-[240px] leading-relaxed">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
