import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Eye,
  MousePointer,
  Clock,
  TrendingUp,
  FolderGit2,
  BookOpen,
  Image as ImageIcon,
  Code2,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Layers,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { AnalyticsDashboardData } from '../../types';

interface AdminOverviewTabProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({ onNavigateTab }) => {
  const {
    data,
    publishedVersion,
    publishedAt,
    isDraftModified,
    adminToken,
    publishToLiveWebsite,
  } = usePortfolio();

  const [analytics, setAnalytics] = useState<AnalyticsDashboardData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    if (!adminToken) return;
    setLoadingAnalytics(true);
    try {
      const res = await fetch('/api/analytics/dashboard', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAnalytics(json.data);
      }
    } catch (e) {
      console.error('Failed to fetch analytics:', e);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [adminToken]);

  const handleQuickPublish = async () => {
    setPublishing(true);
    const res = await publishToLiveWebsite('Quick publish from Overview');
    setPublishing(false);
    if (res.success) {
      setPublishMessage('Website updated live successfully!');
      setTimeout(() => setPublishMessage(null), 4000);
    }
  };

  const summary = analytics?.summary || {
    totalVisitors: 1,
    uniqueVisitors: 1,
    visitorsToday: 1,
    avgDurationSeconds: 45,
    totalPageViews: 1,
    totalClicks: 0,
    mostViewedSection: 'hero',
    mostClickedButton: 'See Works',
    returningVisitors: 0,
  };

  const formatDuration = (sec: number) => {
    if (sec < 60) return `${sec}s`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner: Status & Quick Actions */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#141414] via-[#161616] to-[#121820] border border-white/10 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#89AACC]">
              Centralized Live Engine
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              DATABASE SYNCED
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display italic text-white text-glow mb-2">
            Welcome to Jinia Studio Dashboard
          </h2>

          <p className="text-xs text-white/50 max-w-2xl leading-relaxed">
            All edits saved here write directly to your persistent database. Changes published to
            the live website (v{publishedVersion}) update the public single source of truth immediately.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-[11px] text-white/40 font-mono">
            <span>Published Version: <strong className="text-white">v{publishedVersion}</strong></span>
            <span>•</span>
            <span>Last Published: {new Date(publishedAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          {isDraftModified ? (
            <button
              onClick={handleQuickPublish}
              disabled={publishing}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#89AACC] to-[#4E85BF] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <Sparkles size={14} />
              <span>{publishing ? 'Publishing...' : 'Publish Draft Now'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-emerald-300 font-mono">
              <CheckCircle2 size={15} />
              <span>Website is up to date</span>
            </div>
          )}

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center gap-2 transition-colors border border-white/10"
          >
            <span>View Public Site</span>
            <ArrowUpRight size={14} />
          </a>
        </div>

        {publishMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-2 left-6 text-xs text-emerald-400 font-mono"
          >
            {publishMessage}
          </motion.div>
        )}
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Visitors */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/5 space-y-2 hover:border-white/15 transition-colors">
          <div className="flex items-center justify-between text-white/40">
            <span className="text-[11px] font-mono uppercase tracking-wider">Total Visitors</span>
            <Users size={16} className="text-[#89AACC]" />
          </div>
          <div className="text-2xl sm:text-3xl font-display italic text-white">
            {summary.totalVisitors}
          </div>
          <div className="text-[10px] text-white/40 font-mono">
            {summary.uniqueVisitors} Unique • {summary.visitorsToday} Today
          </div>
        </div>

        {/* Avg Duration */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/5 space-y-2 hover:border-white/15 transition-colors">
          <div className="flex items-center justify-between text-white/40">
            <span className="text-[11px] font-mono uppercase tracking-wider">Avg Time on Site</span>
            <Clock size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display italic text-white">
            {formatDuration(summary.avgDurationSeconds)}
          </div>
          <div className="text-[10px] text-white/40 font-mono">
            {summary.returningVisitors} Returning Visitors
          </div>
        </div>

        {/* Pageviews */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/5 space-y-2 hover:border-white/15 transition-colors">
          <div className="flex items-center justify-between text-white/40">
            <span className="text-[11px] font-mono uppercase tracking-wider">Page Views</span>
            <Eye size={16} className="text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display italic text-white">
            {summary.totalPageViews}
          </div>
          <div className="text-[10px] text-white/40 font-mono">
            Most Viewed: <span className="text-white uppercase">{summary.mostViewedSection}</span>
          </div>
        </div>

        {/* Clicks */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/5 space-y-2 hover:border-white/15 transition-colors">
          <div className="flex items-center justify-between text-white/40">
            <span className="text-[11px] font-mono uppercase tracking-wider">Total Clicks</span>
            <MousePointer size={16} className="text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display italic text-white">
            {summary.totalClicks}
          </div>
          <div className="text-[10px] text-white/40 font-mono truncate">
            Top: <span className="text-white">{summary.mostClickedButton}</span>
          </div>
        </div>
      </div>

      {/* Module Shortcuts Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display italic text-white">Management Sections</h3>
          <span className="text-xs text-white/40 font-mono">Click a card to edit</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Projects */}
          <div
            onClick={() => onNavigateTab('projects')}
            className="group p-5 rounded-2xl bg-[#141414] border border-white/5 hover:border-[#89AACC]/40 hover:bg-[#181818] cursor-pointer transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#89AACC] group-hover:scale-110 transition-transform">
              <FolderGit2 size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white group-hover:text-[#89AACC] transition-colors">
                Selected Works ({data.projects.length})
              </h4>
              <p className="text-xs text-white/40 mt-1">
                Manage featured portfolio case studies, galleries, and categories.
              </p>
            </div>
          </div>

          {/* Journal */}
          <div
            onClick={() => onNavigateTab('journal')}
            className="group p-5 rounded-2xl bg-[#141414] border border-white/5 hover:border-[#89AACC]/40 hover:bg-[#181818] cursor-pointer transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <BookOpen size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                Journal Articles ({data.articles.length})
              </h4>
              <p className="text-xs text-white/40 mt-1">
                Publish articles, design thoughts, and creative systems insights.
              </p>
            </div>
          </div>

          {/* Content CMS */}
          <div
            onClick={() => onNavigateTab('content')}
            className="group p-5 rounded-2xl bg-[#141414] border border-white/5 hover:border-[#89AACC]/40 hover:bg-[#181818] cursor-pointer transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Layers size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                Hero & General CMS
              </h4>
              <p className="text-xs text-white/40 mt-1">
                Edit bio, roles, video background, navbar, footer, and resume.
              </p>
            </div>
          </div>

          {/* Media Library */}
          <div
            onClick={() => onNavigateTab('media')}
            className="group p-5 rounded-2xl bg-[#141414] border border-white/5 hover:border-[#89AACC]/40 hover:bg-[#181818] cursor-pointer transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <ImageIcon size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                Media Library
              </h4>
              <p className="text-xs text-white/40 mt-1">
                Upload and organize video assets, photography, and graphics.
              </p>
            </div>
          </div>

          {/* Analytics */}
          <div
            onClick={() => onNavigateTab('analytics')}
            className="group p-5 rounded-2xl bg-[#141414] border border-white/5 hover:border-[#89AACC]/40 hover:bg-[#181818] cursor-pointer transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Activity size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                Visitor Intelligence
              </h4>
              <p className="text-xs text-white/40 mt-1">
                Live sessions, click telemetry, dwell time, and interaction heatmaps.
              </p>
            </div>
          </div>

          {/* Code Editor */}
          <div
            onClick={() => onNavigateTab('code')}
            className="group p-5 rounded-2xl bg-[#141414] border border-white/5 hover:border-[#89AACC]/40 hover:bg-[#181818] cursor-pointer transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Code2 size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                Code & Tokens Studio
              </h4>
              <p className="text-xs text-white/40 mt-1">
                Inject custom CSS/JS and tweak accent colors and border tokens.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
