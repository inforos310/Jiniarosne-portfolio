import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Eye,
  MousePointer,
  Clock,
  RefreshCw,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Laptop,
  ChevronDown,
  ChevronUp,
  Flame,
  ArrowUpRight,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { usePortfolio } from '../../context/PortfolioContext';
import { AnalyticsDashboardData, VisitorSession } from '../../types';

export const AdminAnalyticsTab: React.FC = () => {
  const { adminToken } = usePortfolio();
  const [data, setData] = useState<AnalyticsDashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchAnalytics = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const res = await fetch('/api/analytics/dashboard', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch (e) {
      console.error('Failed to load analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    if (autoRefresh) {
      const interval = setInterval(fetchAnalytics, 15000);
      return () => clearInterval(interval);
    }
  }, [adminToken, autoRefresh]);

  const summary = data?.summary || {
    totalVisitors: 0,
    uniqueVisitors: 0,
    visitorsToday: 0,
    avgDurationSeconds: 0,
    totalPageViews: 0,
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

  const getDeviceIcon = (type: string) => {
    if (type === 'Mobile') return <Smartphone size={14} className="text-amber-400" />;
    if (type === 'Tablet') return <Laptop size={14} className="text-purple-400" />;
    return <Monitor size={14} className="text-[#89AACC]" />;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#141414] border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#89AACC]">
              Telemetry & Visitor Intelligence
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE TELEMETRY
            </span>
          </div>
          <h2 className="text-xl font-display italic text-white">Audience Insights & Clickstream</h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-colors ${
              autoRefresh
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                : 'bg-white/5 text-white/50 border-white/10'
            }`}
          >
            Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
            title="Refresh now"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-[#89AACC]' : ''} />
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Visitors */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-white/40">
            <span className="text-[11px] font-mono uppercase tracking-wider">Total Visitors</span>
            <Users size={16} className="text-[#89AACC]" />
          </div>
          <div className="text-3xl font-display italic text-white">{summary.totalVisitors}</div>
          <div className="text-[10px] text-white/40 font-mono">
            {summary.uniqueVisitors} Unique • {summary.visitorsToday} Today
          </div>
        </div>

        {/* Avg Dwell Time */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-white/40">
            <span className="text-[11px] font-mono uppercase tracking-wider">Avg Time on Site</span>
            <Clock size={16} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-display italic text-white">
            {formatDuration(summary.avgDurationSeconds)}
          </div>
          <div className="text-[10px] text-white/40 font-mono">
            {summary.returningVisitors} Returning Visitors
          </div>
        </div>

        {/* Total Pageviews */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-white/40">
            <span className="text-[11px] font-mono uppercase tracking-wider">Pageviews</span>
            <Eye size={16} className="text-indigo-400" />
          </div>
          <div className="text-3xl font-display italic text-white">{summary.totalPageViews}</div>
          <div className="text-[10px] text-white/40 font-mono uppercase">
            Top Section: <strong className="text-white">{summary.mostViewedSection}</strong>
          </div>
        </div>

        {/* Interactions & Clicks */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-white/40">
            <span className="text-[11px] font-mono uppercase tracking-wider">Total Clicks</span>
            <MousePointer size={16} className="text-amber-400" />
          </div>
          <div className="text-3xl font-display italic text-white">{summary.totalClicks}</div>
          <div className="text-[10px] text-white/40 font-mono truncate">
            Top: <strong className="text-white">{summary.mostClickedButton}</strong>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitors & Pageviews Time Series (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#141414] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-display italic text-white">Traffic Activity (Last 7 Days)</h3>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-[#89AACC]">
                <span className="w-2 h-2 rounded-full bg-[#89AACC]" />
                Visitors
              </span>
              <span className="flex items-center gap-1.5 text-indigo-400">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                Pageviews
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            {data?.timeSeries && data.timeSeries.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.timeSeries} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#89AACC" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#89AACC" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="pageviewGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="date" stroke="#ffffff40" fontSize={10} tickLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1c1c1c',
                      borderColor: '#ffffff20',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#fff',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#89AACC"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#visitorGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pageViews"
                    stroke="#818cf8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#pageviewGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-white/40">
                Awaiting visitor activity data...
              </div>
            )}
          </div>
        </div>

        {/* Top Clicked Elements (1 col) */}
        <div className="p-6 rounded-3xl bg-[#141414] border border-white/10 space-y-4">
          <h3 className="text-base font-display italic text-white flex items-center gap-2">
            <Flame size={16} className="text-amber-400" />
            <span>Top Clicked Elements</span>
          </h3>

          <div className="space-y-3">
            {data?.topElements && data.topElements.length > 0 ? (
              data.topElements.map((el, i) => (
                <div key={el.elementId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white font-medium truncate max-w-[180px]">
                      {el.label || el.elementId}
                    </span>
                    <span className="text-amber-300 font-mono text-[11px]">{el.count} clicks</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-[#89AACC] rounded-full"
                      style={{
                        width: `${Math.min(100, Math.max(15, (el.count / (summary.totalClicks || 1)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-white/40">
                No clicks registered yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real Visitor Sessions Activity Feed */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#141414] border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-display italic text-white">Live Visitor Sessions Feed</h3>
            <p className="text-xs text-white/40 mt-0.5">
              Real-time audit log showing active duration, browser, device, sections traversed, and exact clickstream.
            </p>
          </div>
          <span className="text-xs font-mono text-white/40">
            {data?.recentSessions?.length || 0} Recorded Sessions
          </span>
        </div>

        <div className="space-y-3">
          {data?.recentSessions && data.recentSessions.length > 0 ? (
            data.recentSessions.map((session: VisitorSession) => {
              const isExpanded = expandedSessionId === session.sessionId;
              return (
                <div
                  key={session.sessionId}
                  className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden hover:border-white/15 transition-all"
                >
                  {/* Session Row */}
                  <div
                    onClick={() => setExpandedSessionId(isExpanded ? null : session.sessionId)}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                  >
                    {/* Visitor & Device */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                        {getDeviceIcon(session.device?.type || 'Desktop')}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white font-mono">
                            {session.visitorId?.substring(0, 12)}...
                          </span>
                          {session.isOnline ? (
                            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-mono border border-emerald-500/20 flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                              ACTIVE NOW
                            </span>
                          ) : (
                            <span className="text-[10px] text-white/30 font-mono">Completed</span>
                          )}
                        </div>

                        <div className="text-[11px] text-white/40 font-mono truncate mt-0.5">
                          {session.device?.browser} on {session.device?.os} • {session.device?.screenResolution} • {session.referrer}
                        </div>
                      </div>
                    </div>

                    {/* Stats & Path */}
                    <div className="flex items-center gap-6 self-end md:self-center">
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-white/40 block">Time on site</span>
                        <span className="text-xs font-mono text-emerald-400 font-semibold">
                          {formatDuration(session.durationSeconds)}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono text-white/40 block">Clicks</span>
                        <span className="text-xs font-mono text-amber-300 font-semibold">
                          {session.clicks?.length || 0}
                        </span>
                      </div>

                      <div className="p-1 rounded-lg bg-white/5 text-white/40 hover:text-white">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Clickstream & Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5 p-4 bg-black/40 space-y-3"
                      >
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block mb-1.5">
                            Visited Sections Journey
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {(session.visitedSections || ['hero']).map((sec, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2.5 py-1 rounded-lg bg-white/5 text-white/80 text-[11px] font-mono uppercase border border-white/10"
                              >
                                {sIdx + 1}. {sec}
                              </span>
                            ))}
                          </div>
                        </div>

                        {session.clicks && session.clicks.length > 0 ? (
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block mb-1.5">
                              Chronological Clicks ({session.clicks.length})
                            </span>
                            <div className="space-y-1.5 max-h-48 overflow-y-auto">
                              {session.clicks.map((clk, cIdx) => (
                                <div
                                  key={cIdx}
                                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-xs font-mono text-white/70"
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <span className="text-[#89AACC]">#{cIdx + 1}</span>
                                    <span className="text-white font-medium">{clk.label || clk.elementId}</span>
                                    <span className="text-[10px] text-white/40">[{clk.section}]</span>
                                  </div>
                                  <span className="text-[10px] text-white/40">{clk.timeFormatted}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-white/30 font-mono py-2">
                            No clicks recorded in this session.
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-xs text-white/40">
              No visitor sessions recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
