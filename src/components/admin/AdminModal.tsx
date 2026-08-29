import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  Edit3,
  Code2,
  Lock,
  X,
  Eye,
  LogOut,
  Shield,
  KeyRound,
  Check,
  AlertCircle,
} from 'lucide-react';
import { AnalyticsTab } from './AnalyticsTab';
import { ContentManagerTab } from './ContentManagerTab';
import { CodeEditorTab } from './CodeEditorTab';
import { usePortfolio } from '../../context/PortfolioContext';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminMainTab = 'analytics' | 'content' | 'code' | 'security';

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const { lockAdmin, changeAdminPin, adminPinHint } = usePortfolio();
  const [activeTab, setActiveTab] = useState<AdminMainTab>('analytics');

  // Security Tab state
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinStatus, setPinStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin !== confirmPin) {
      setPinStatus({ type: 'error', message: 'New PIN and Confirm PIN do not match.' });
      return;
    }
    const res = changeAdminPin(oldPin, newPin);
    if (res.success) {
      setPinStatus({ type: 'success', message: 'Admin passcode updated successfully!' });
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
      setTimeout(() => setPinStatus(null), 3000);
    } else {
      setPinStatus({ type: 'error', message: res.error || 'Failed to update PIN.' });
    }
  };

  const handleLogout = () => {
    lockAdmin();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="admin-modal-root" className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-5 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-lg"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-7xl max-h-[94vh] bg-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col z-10"
          >
            {/* Top Navigation Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 border-b border-white/10 bg-[#141414]/95 backdrop-blur-md sticky top-0 z-20 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#89AACC]">
                  <Shield size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-display italic text-white text-glow">
                      Portfolio Admin Studio
                    </h2>
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-mono border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-white/40">
                    Real-time visitor telemetry, content CMS & code editor
                  </p>
                </div>
              </div>

              {/* Main Tab Switcher */}
              <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/5 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    activeTab === 'analytics'
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Activity size={13} />
                  <span>Visitor Analytics</span>
                </button>

                <button
                  onClick={() => setActiveTab('content')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    activeTab === 'content'
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Edit3 size={13} />
                  <span>Content CMS</span>
                </button>

                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    activeTab === 'code'
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Code2 size={13} />
                  <span>Code & Styles</span>
                </button>

                <button
                  onClick={() => setActiveTab('security')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    activeTab === 'security'
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <KeyRound size={13} />
                  <span>Passcode</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  title="View Live Website"
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors border border-white/5"
                >
                  <Eye size={13} />
                  <span className="hidden sm:inline">Preview Site</span>
                </button>

                <button
                  onClick={handleLogout}
                  title="Lock Admin Studio"
                  className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors border border-white/5"
                >
                  <LogOut size={15} />
                </button>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors border border-white/5"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Body with dynamic Tab views */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 md:p-8">
              {activeTab === 'analytics' && <AnalyticsTab />}
              {activeTab === 'content' && <ContentManagerTab />}
              {activeTab === 'code' && <CodeEditorTab />}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-[#141414] border border-white/10 space-y-6 text-white text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#89AACC]">
                    <Lock size={24} />
                  </div>

                  <div>
                    <h3 className="text-xl font-display italic text-white text-glow">
                      Change Admin Passcode
                    </h3>
                    <p className="text-xs text-white/40 mt-1">
                      Set a custom 4+ digit PIN to protect your visitor analytics and code studio.
                    </p>
                  </div>

                  {pinStatus && (
                    <div
                      className={`p-3 rounded-xl text-xs flex items-center justify-center gap-2 ${
                        pinStatus.type === 'success'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {pinStatus.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
                      <span>{pinStatus.message}</span>
                    </div>
                  )}

                  <form onSubmit={handleUpdatePin} className="space-y-4 text-left">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                        Current PIN
                      </label>
                      <input
                        type="password"
                        required
                        value={oldPin}
                        onChange={(e) => setOldPin(e.target.value)}
                        placeholder="Enter current PIN (e.g. 2026)"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white font-mono placeholder-white/20 focus:outline-none focus:border-[#89AACC]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                        New PIN
                      </label>
                      <input
                        type="password"
                        required
                        minLength={4}
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        placeholder="Enter new 4+ digit PIN"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white font-mono placeholder-white/20 focus:outline-none focus:border-[#89AACC]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                        Confirm New PIN
                      </label>
                      <input
                        type="password"
                        required
                        minLength={4}
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value)}
                        placeholder="Re-enter new PIN"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white font-mono placeholder-white/20 focus:outline-none focus:border-[#89AACC]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#89AACC] hover:text-white transition-colors"
                    >
                      Update Passcode
                    </button>
                  </form>

                  <p className="text-[11px] text-white/30 font-mono">{adminPinHint}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
