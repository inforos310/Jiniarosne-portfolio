import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, ArrowRight, ShieldCheck, Sparkles, KeyRound, AlertCircle } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

interface AdminLoginViewProps {
  onSuccess?: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onSuccess }) => {
  const { loginAdmin } = usePortfolio();
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;
    setError(null);
    setLoading(true);

    const res = await loginAdmin(pin.trim());
    setLoading(false);

    if (res.success) {
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.hash = '/admin';
      }
    } else {
      setError(res.error || 'Invalid admin passcode.');
    }
  };

  const handleKeypadPress = (digit: string) => {
    if (pin.length < 8) {
      setPin((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#89AACC]/15 to-[#4E85BF]/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#121212] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 space-y-6"
      >
        {/* Monogram Badge */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#89AACC] shadow-inner mb-2">
            <Lock size={24} />
          </div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#89AACC]">
            Protected Admin Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-display italic text-white text-glow">
            Authentication Required
          </h1>
          <p className="text-xs text-white/50 max-w-xs">
            Enter your admin PIN to access the single source of truth CMS and telemetry center.
          </p>
        </div>

        {/* PIN Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter passcode..."
              maxLength={8}
              autoFocus
              className="w-full px-5 py-3.5 bg-white/5 border border-white/15 rounded-2xl text-center text-lg tracking-[0.4em] font-mono text-white placeholder-white/20 focus:outline-none focus:border-[#89AACC] focus:ring-2 focus:ring-[#89AACC]/30 transition-all"
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono text-center flex items-center justify-center gap-2"
            >
              <AlertCircle size={14} />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  if (key === 'C') setPin('');
                  else if (key === '⌫') handleBackspace();
                  else handleKeypadPress(key);
                }}
                className="py-3 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/20 text-white font-mono text-sm transition-all border border-white/5 hover:border-white/15"
              >
                {key}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || !pin}
            className="w-full py-3.5 rounded-2xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#89AACC] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2 mt-4"
          >
            <span>{loading ? 'Verifying...' : 'Authenticate & Unlock'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Footer Hint */}
        <div className="pt-4 border-t border-white/5 text-center flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/40">
            <KeyRound size={12} className="text-[#89AACC]" />
            <span>Default PIN: <strong>2026</strong></span>
          </div>

          <a
            href="/"
            className="text-[11px] text-white/40 hover:text-white transition-colors underline underline-offset-4"
          >
            ← Return to public website
          </a>
        </div>
      </motion.div>
    </div>
  );
};
