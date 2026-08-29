import React, { useState, useEffect } from 'react';
import {
  Users,
  Clock,
  MousePointer,
  Activity,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Download,
  Trash2,
  Search,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowUpRight,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { VisitorSession } from '../../types';
import {
  getStoredSessions,
  subscribeToAnalytics,
  clearAnalyticsLogs,
  formatDuration,
} from '../../utils/analytics';

export const AnalyticsTab: React.FC = () => {
  const [sessions, setSessions] = useState<VisitorSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState<'ALL' | 'Desktop' | 'Mobile' | 'Tablet'>('ALL');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAnalytics((data) => {
      setSessions(data);
      if (data.length > 0 && !selectedSessionId) {
        setSelectedSessionId(data[0].sessionId);
      }
    });
    return () => unsubscribe();
  }, [selectedSessionId]);

  const activeSessions = sessions.filter((s) => s.isOnline);
  const totalClicks = sessions.reduce((acc, s) => acc + (s.clicks ? s.clicks.length : 0), 0);
  const totalDuration = sessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
  const avgDurationSeconds = sessions.length > 0 ? Math.round(totalDuration / sessions.length) : 0;

  // Filtered session list
  const filteredSessions = sessions.filter((s) => {
    const matchDevice = deviceFilter === 'ALL' || s.device.type === deviceFilter;
    const matchSearch =
      searchQuery === '' ||
      s.location.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.ip.includes(searchQuery) ||
      s.referrer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.device.browser.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDevice && matchSearch;
  });

  const selectedSession = sessions.find((s) => s.sessionId === selectedSessionId) || sessions[0];

  // Element click frequency aggregation
  const clickCounts: Record<string, { label: string; count: number; section: string }> = {};
  sessions.forEach((s) => {
    s.clicks?.forEach((c) => {
      const key = c.label;
      if (!clickCounts[key]) {
        clickCounts[key] = { label: c.label, count: 0, section: c.section };
      }
      clickCounts[key].count += 1;
    });
  });
  const sortedClicks = Object.values(clickCounts).sort((a, b) => b.count - a.count);

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(sessions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitor-analytics-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = ['Session ID', 'Visitor ID', 'IP', 'City', 'Country', 'Device', 'OS', 'Browser', 'Duration (s)', 'Scroll Depth %', 'Total Clicks', 'Referrer', 'Date'];
    const rows = sessions.map((s) => [
      s.sessionId,
      s.visitorId,
      s.ip,
      s.location.city,
      s.location.country,
      s.device.type,
      s.device.os,
      s.device.browser,
      s.durationSeconds,
      s.maxScrollDepth,
      s.clicks?.length || 0,
      `"${s.referrer}"`,
      new Date(s.startTime).toISOString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitor-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 text-white">
      {/* Real-time Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Active Now */}
        <div className="p-4 rounded-2xl bg-[#1a1a1a]/80 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Live Active</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-display italic text-emerald-400">
            {activeSessions.length || 1}
          </div>
          <span className="text-[10px] text-white/40 mt-1">Visitors browsing right now</span>
        </div>

        {/* Total Visitors */}
        <div className="p-4 rounded-2xl bg-[#1a1a1a]/80 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Total Visitors</span>
            <Users size={14} className="text-[#89AACC]" />
          </div>
          <div className="text-2xl sm:text-3xl font-display italic text-white">
            {sessions.length}
          </div>
          <span className="text-[10px] text-white/40 mt-1">Recorded sessions</span>
        </div>

        {/* Avg Stay Duration */}
        <div className="p-4 rounded-2xl bg-[#1a1a1a]/80 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Avg Dwell Time</span>
            <Clock size={14} className="text-[#89AACC]" />
          </div>
          <div className="text-2xl sm:text-3xl font-display italic text-[#89AACC]">
            {formatDuration(avgDurationSeconds)}
          </div>
          <span className="text-[10px] text-white/40 mt-1">Time spent on portfolio</span>
        </div>

        {/* Total Clicks Tracked */}
        <div className="p-4 rounded-2xl bg-[#1a1a1a]/80 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Clicks Tracked</span>
            <MousePointer size={14} className="text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display italic text-amber-400">
            {totalClicks}
          </div>
          <span className="text-[10px] text-white/40 mt-1">Buttons & cards clicked</span>
        </div>

        {/* Avg Scroll Depth */}
        <div className="p-4 rounded-2xl bg-[#1a1a1a]/80 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Avg Scroll</span>
            <Layers size={14} className="text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display italic text-purple-300">
            {sessions.length > 0
              ? Math.round(sessions.reduce((a, s) => a + (s.maxScrollDepth || 0), 0) / sessions.length)
              : 0}
            %
          </div>
          <span className="text-[10px] text-white/40 mt-1">Page engagement depth</span>
        </div>

        {/* Top Destination */}
        <div className="p-4 rounded-2xl bg-[#1a1a1a]/80 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Top Section</span>
            <Activity size={14} className="text-sky-400" />
          </div>
          <div className="text-xl sm:text-2xl font-display italic text-sky-300 truncate">
            Works / Hero
          </div>
          <span className="text-[10px] text-white/40 mt-1">Highest user focus</span>
        </div>
      </div>

      {/* Main Two-Column Layout: Visitor Directory & Detailed Audit Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visitor Directory (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                Visitor Sessions
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60 font-mono">
                {filteredSessions.length}
              </span>
            </div>

            {/* Device Filter */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
              {(['ALL', 'Desktop', 'Mobile'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDeviceFilter(d)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg uppercase tracking-wider transition-colors ${
                    deviceFilter === d
                      ? 'bg-[#89AACC] text-black font-semibold'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search IP, country, city, referrer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#89AACC]"
            />
          </div>

          {/* Session Cards List */}
          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredSessions.map((session) => {
              const isSelected = session.sessionId === selectedSession?.sessionId;
              const deviceIcon =
                session.device.type === 'Mobile' ? (
                  <Smartphone size={13} />
                ) : session.device.type === 'Tablet' ? (
                  <Tablet size={13} />
                ) : (
                  <Monitor size={13} />
                );

              return (
                <div
                  key={session.sessionId}
                  onClick={() => setSelectedSessionId(session.sessionId)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-[#1a2332] border-[#89AACC]/60 shadow-lg shadow-[#89AACC]/10'
                      : 'bg-[#141414]/90 border-white/5 hover:border-white/15 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{session.location.flag}</span>
                      <span className="text-xs font-semibold text-white">
                        {session.location.city}, {session.location.country}
                      </span>
                      {session.isOnline && (
                        <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          ONLINE
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-white/40">
                      {new Date(session.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-white/50">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-white/60">
                        {deviceIcon}
                        <span>{session.device.os}</span>
                      </span>
                      <span>•</span>
                      <span>{session.device.browser}</span>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[#89AACC]">
                        {formatDuration(session.durationSeconds)}
                      </span>
                      <span className="text-white/30">•</span>
                      <span className="text-amber-400">
                        {session.clicks?.length || 0} clicks
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-white/30 truncate flex items-center gap-1">
                    <Globe size={11} className="shrink-0" />
                    <span>Referrer: {session.referrer}</span>
                  </div>
                </div>
              );
            })}

            {filteredSessions.length === 0 && (
              <div className="p-8 text-center text-white/30 text-xs rounded-2xl bg-white/5">
                No visitor sessions match your search.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Selected Visitor Detailed Audit Log (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {selectedSession ? (
            <div className="p-5 sm:p-6 rounded-3xl bg-[#141414] border border-white/10 flex flex-col space-y-6">
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                    {selectedSession.location.flag}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-display italic text-white text-glow">
                        {selectedSession.location.city}, {selectedSession.location.country}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-white/40">
                        {selectedSession.ip}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/40 mt-0.5">
                      Session ID: {selectedSession.sessionId} • Landed at{' '}
                      {new Date(selectedSession.startTime).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-center">
                    <div className="text-[9px] font-mono uppercase text-white/40">Stay Duration</div>
                    <div className="text-sm font-display italic text-[#89AACC] font-semibold">
                      {formatDuration(selectedSession.durationSeconds)}
                    </div>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-center">
                    <div className="text-[9px] font-mono uppercase text-white/40">Scroll Depth</div>
                    <div className="text-sm font-display italic text-purple-300 font-semibold">
                      {selectedSession.maxScrollDepth}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Hardware & Network Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white/5 p-3.5 rounded-2xl border border-white/5">
                <div>
                  <span className="text-[10px] uppercase font-mono text-white/40 block">Device / OS</span>
                  <span className="text-white/90 font-medium">
                    {selectedSession.device.type} ({selectedSession.device.os})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-white/40 block">Browser</span>
                  <span className="text-white/90 font-medium">{selectedSession.device.browser}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-white/40 block">Resolution</span>
                  <span className="text-white/90 font-mono">{selectedSession.device.screenResolution}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-white/40 block">Referral Source</span>
                  <span className="text-[#89AACC] truncate block">{selectedSession.referrer}</span>
                </div>
              </div>

              {/* Visited Sections Breakdown */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-2">
                  Sections Explored by Visitor
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedSession.visitedSections.map((sec) => (
                    <span
                      key={sec}
                      className="px-3 py-1 rounded-full text-xs font-mono bg-[#89AACC]/10 text-[#89AACC] border border-[#89AACC]/20 capitalize"
                    >
                      #{sec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chronological Click & Action Stream */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                    Chronological Interaction Timeline (What They Clicked)
                  </span>
                  <span className="text-[10px] font-mono text-amber-400">
                    {selectedSession.clicks?.length || 0} Total Actions
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                  {selectedSession.clicks && selectedSession.clicks.length > 0 ? (
                    selectedSession.clicks.map((click, idx) => (
                      <div
                        key={click.id || idx}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-xs hover:bg-white/10 transition-colors"
                      >
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#89AACC]/20 text-[#89AACC] shrink-0 mt-0.5">
                          {click.timeFormatted || '00:00'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-white">{click.label}</span>
                            <span className="text-[10px] text-white/40 font-mono capitalize">
                              in #{click.section}
                            </span>
                          </div>
                          <p className="text-[10px] text-white/40 font-mono mt-0.5 truncate">
                            Target: {click.target} • Type: {click.elementType}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-white/30 text-xs rounded-xl bg-white/5">
                      No explicit button clicks recorded yet in this session. The visitor is viewing page content.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-white/40 rounded-3xl bg-[#141414] border border-white/10">
              Select a visitor session on the left to inspect their complete telemetry log.
            </div>
          )}

          {/* Click Frequency Ranking */}
          <div className="p-5 rounded-3xl bg-[#141414] border border-white/10">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Most Clicked Portfolio Elements (Click Heatmap)
            </h4>
            <div className="space-y-2">
              {sortedClicks.slice(0, 5).map((item, idx) => {
                const percentage = totalClicks > 0 ? Math.round((item.count / totalClicks) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/90 truncate">{item.label}</span>
                      <span className="text-white/50 font-mono">{item.count} clicks ({percentage}%)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#89AACC] to-[#4E85BF] rounded-full"
                        style={{ width: `${Math.max(8, percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {sortedClicks.length === 0 && (
                <div className="text-xs text-white/30 py-2">No clicks recorded yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Controls: Export & Reset */}
      <div className="flex flex-wrap items-center justify-between pt-6 border-t border-white/10 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-2 transition-colors"
          >
            <Download size={14} />
            <span>Export JSON Log</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-2 transition-colors"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to clear visitor telemetry logs?')) {
              clearAnalyticsLogs();
            }
          }}
          className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <Trash2 size={14} />
          <span>Clear Analytics Logs</span>
        </button>
      </div>
    </div>
  );
};
