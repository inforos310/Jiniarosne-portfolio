import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const ROTATING_WORDS = ['Design', 'Create', 'Inspire'];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [count, setCount] = useState<number>(0);
  const [wordIndex, setWordIndex] = useState<number>(0);

  // Counter animation from 0 to 100 over 2700ms using requestAnimationFrame
  useEffect(() => {
    const duration = 2700;
    const startTime = performance.now();

    let animationFrameId: number;

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for natural acceleration/deceleration
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const currentCount = Math.floor(easeProgress * 100);
      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounter);
      } else {
        setCount(100);
        // 400ms delay after hitting 100 before calling onComplete
        const timer = setTimeout(() => {
          onComplete();
        }, 400);
        return () => clearTimeout(timer);
      }
    };

    animationFrameId = requestAnimationFrame(updateCounter);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete]);

  // Rotate words every 900ms
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 900);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      id="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] } }}
      className="fixed inset-0 z-[9999] bg-bg flex flex-col justify-between p-6 md:p-12 select-none overflow-hidden"
    >
      {/* Top Left: Portfolio label */}
      <div className="flex justify-between items-start">
        <motion.span
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-xs text-muted uppercase tracking-[0.3em] font-medium"
        >
          Portfolio
        </motion.span>
        
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xs text-muted/60 tracking-widest hidden sm:inline-block uppercase"
        >
          Collection &apos;26
        </motion.span>
      </div>

      {/* Center: Rotating Words */}
      <div className="relative h-24 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={wordIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-display italic text-text-primary/80 tracking-wide text-center"
          >
            {ROTATING_WORDS[wordIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Row: Info and Counter Display */}
      <div className="flex items-end justify-between">
        <div className="text-xs text-muted/70 max-w-[200px] hidden md:block">
          Jinia Alam Rosne<br />
          <span className="text-muted/40">Visual Systems & AI</span>
        </div>

        {/* Bottom Right: Counter Display */}
        <div className="text-6xl md:text-7xl lg:text-8xl font-display text-text-primary tabular-nums tracking-tighter leading-none">
          {String(count).padStart(3, "0")}
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-stroke/50">
        <div
          className="h-full accent-gradient transition-transform duration-75 origin-left"
          style={{
            transform: `scaleX(${count / 100})`,
            boxShadow: '0 0 8px rgba(137, 170, 204, 0.35)',
          }}
        />
      </div>
    </motion.div>
  );
};
