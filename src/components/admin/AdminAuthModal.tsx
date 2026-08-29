import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, KeyRound, X, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { unlockAdmin, adminPinHint } = usePortfolio();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
      setErrorMessage('');
    }
  }, [isOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin) {
      setError(true);
      setErrorMessage('Please enter your 4-digit PIN.');
      return;
    }

    const success = unlockAdmin(pin);
    if (success) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setErrorMessage('Incorrect PIN. (Hint: Default is 2026)');
      setPin('');
    }
  };

  const handleKeyPress = (num: string) => {
    if (pin.length < 8) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      if (newPin.length === 4) {
        // Auto-check if 4 digits
        setTimeout(() => {
          const success = unlockAdmin(newPin);
          if (success) {
            onSuccess();
          }
        }, 150);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="admin-auth-modal" className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md bg-[#141414] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 flex flex-col items-center text-center overflow-hidden"
          >
            {/* Ambient subtle glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#4E85BF]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={16} />
            </button>

            {/* Shield / Lock Icon */}
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 text-[#89AACC]">
              <Lock size={24} />
            </div>

            <h3 className="text-xl sm:text-2xl font-display italic text-white mb-1.5 text-glow">
              Portfolio Admin Studio
            </h3>
            <p className="text-xs text-white/50 max-w-xs mb-6 uppercase tracking-wider">
              Enter Owner Passcode to access live visitor analytics, content manager, and code editor.
            </p>

            {/* PIN Dots Indicator */}
            <div className="flex items-center justify-center gap-3 mb-6">
              {[0, 1, 2, 3].map((idx) => {
                const filled = pin.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                      filled
                        ? 'bg-[#89AACC] scale-110 shadow-[0_0_10px_rgba(137,170,204,0.6)]'
                        : error
                        ? 'bg-red-500/40 border border-red-500/60'
                        : 'bg-white/10 border border-white/20'
                    }`}
                  />
                );
              })}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-xs text-red-400 mb-4 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20"
              >
                <AlertCircle size={14} />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2.5 w-full max-w-[280px] mb-6">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeyPress(num)}
                  className="h-12 rounded-2xl bg-white/5 hover:bg-white/15 active:scale-95 border border-white/5 text-lg font-medium text-white transition-all flex items-center justify-center"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPin('')}
                className="h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-mono uppercase text-white/40 transition-colors flex items-center justify-center"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                className="h-12 rounded-2xl bg-white/5 hover:bg-white/15 active:scale-95 border border-white/5 text-lg font-medium text-white transition-all flex items-center justify-center"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-mono text-white/60 transition-colors flex items-center justify-center"
              >
                ⌫
              </button>
            </div>

            {/* Direct Input option (for keyboard users) */}
            <form onSubmit={handleSubmit} className="w-full flex gap-2 mb-4">
              <input
                type="password"
                maxLength={8}
                placeholder="Or type PIN..."
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-center text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-[#89AACC]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-white text-black font-semibold rounded-xl text-xs uppercase tracking-wider hover:bg-[#89AACC] hover:text-white transition-colors flex items-center gap-1.5"
              >
                <span>Enter</span>
                <ArrowRight size={14} />
              </button>
            </form>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/30 font-mono">
              <KeyRound size={12} />
              <span>{adminPinHint}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
