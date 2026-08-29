import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  FolderGit2,
  BookOpen,
  Layers,
  Image as ImageIcon,
  Activity,
  Code2,
  Settings,
  ArrowUpRight,
  LogOut,
  Sparkles,
  Save,
  Eye,
  CheckCircle2,
  Clock,
  Menu,
  X,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePortfolio } from '../../context/PortfolioContext';
import { AdminOverviewTab } from './AdminOverviewTab';
import { AdminProjectsTab } from './AdminProjectsTab';
import { AdminJournalTab } from './AdminJournalTab';
import { AdminContentTab } from './AdminContentTab';
import { AdminMediaTab } from './AdminMediaTab';
import { AdminAnalyticsTab } from './AdminAnalyticsTab';
import { AdminCodeTab } from './AdminCodeTab';
import { AdminSettingsTab } from './AdminSettingsTab';

interface AdminLayoutProps {
  initialTab?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ initialTab = 'overview' }) => {
  const {
    publishedVersion,
    publishedAt,
    isDraftModified,
    isPreviewMode,
    setIsPreviewMode,
    saveDraftToDatabase,
    publishToLiveWebsite,
    logoutAdmin,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  // Sync tab with URL hash if present
  useEffect(() => {
    const hash = window.location.hash.replace('#/admin/', '').replace('#/admin', '').replace('#', '');
    if (hash && ['overview', 'projects', 'journal', 'content', 'media', 'analytics', 'code', 'settings'].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = `/admin/${tab}`;
    setSidebarOpen(false);
  };

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    const res = await saveDraftToDatabase();
    setSaving(false);
    if (res.success) {
      showToast('Draft changes saved permanently to database.', 'info');
    } else {
      alert(res.error || 'Failed to save draft.');
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    const res = await publishToLiveWebsite();
    setPublishing(false);
    if (res.success) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#89AACC', '#4E85BF', '#ffffff', '#a5b4fc'],
        });
      } catch (e) {}
      showToast('Changes are now LIVE on the public website!', 'success');
    } else {
      alert(res.error || 'Failed to publish changes.');
    }
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Selected Works', icon: FolderGit2 },
    { id: 'journal', label: 'Journal Articles', icon: BookOpen },
    { id: 'content', label: 'General CMS', icon: Layers },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'analytics', label: 'Visitor Telemetry', icon: Activity },
    { id: 'code', label: 'Code & Tokens', icon: Code2 },
    { id: 'settings', label: 'Settings & Security', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#141414] border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-serif text-sm italic text-[#89AACC]">
            JR
          </div>
          <span className="font-display italic text-white font-medium text-sm">
            Admin Studio
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-white/5 text-white"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#111111] border-r border-white/10 p-5 flex flex-col justify-between z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Logo Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-serif text-base italic text-[#89AACC] shadow-inner">
                JR
              </div>
              <div>
                <h1 className="font-display italic text-white font-semibold text-sm">
                  Jinia Studio
                </h1>
                <span className="text-[10px] font-mono text-[#89AACC] block">
                  v{publishedVersion} • Live Engine
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 text-white/40 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-black' : 'text-white/60'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: View Website & Logout */}
        <div className="space-y-2 pt-4 border-t border-white/5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors"
          >
            <span className="flex items-center gap-2">
              <ArrowUpRight size={14} className="text-[#89AACC]" />
              <span>View Public Site</span>
            </span>
            <span className="text-[10px] font-mono text-white/40">v{publishedVersion}</span>
          </a>

          <button
            onClick={logoutAdmin}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-red-400/80 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={14} />
            <span>Lock & Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Operational Status Bar */}
        <header className="sticky top-0 z-30 bg-[#0d0d0d]/90 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status Indicator */}
          <div className="flex items-center gap-3">
            {isDraftModified ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Unpublished Draft Changes
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono">
                <CheckCircle2 size={12} />
                Live Website Synced (v{publishedVersion})
              </span>
            )}

            {isPreviewMode && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30">
                PREVIEW MODE ACTIVE
              </span>
            )}
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-colors ${
                isPreviewMode
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/10'
              }`}
            >
              <Eye size={14} />
              <span>{isPreviewMode ? 'Previewing Draft' : 'Preview'}</span>
            </button>

            <button
              onClick={handleSaveDraft}
              disabled={saving || !isDraftModified}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center gap-1.5 border border-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save size={14} />
              <span>{saving ? 'Saving...' : 'Save Draft'}</span>
            </button>

            <button
              onClick={handlePublish}
              disabled={publishing}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#89AACC] to-[#4E85BF] text-white font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-lg flex items-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles size={14} />
              <span>{publishing ? 'Publishing...' : 'Publish to Live'}</span>
            </button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="p-6 md:p-10 flex-1 overflow-y-auto">
          {activeTab === 'overview' && <AdminOverviewTab onNavigateTab={handleTabChange} />}
          {activeTab === 'projects' && <AdminProjectsTab />}
          {activeTab === 'journal' && <AdminJournalTab />}
          {activeTab === 'content' && <AdminContentTab />}
          {activeTab === 'media' && <AdminMediaTab />}
          {activeTab === 'analytics' && <AdminAnalyticsTab />}
          {activeTab === 'code' && <AdminCodeTab />}
          {activeTab === 'settings' && <AdminSettingsTab />}
        </div>
      </main>

      {/* Floating Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-2xl bg-[#1c1c1c] border border-white/20 text-white text-xs font-mono shadow-2xl flex items-center gap-2.5 backdrop-blur-md"
          >
            <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
