import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  KeyRound,
  History,
  Download,
  Upload,
  RotateCcw,
  ShieldAlert,
  Check,
  AlertCircle,
  Clock,
  ArrowRight,
  Database,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const AdminSettingsTab: React.FC = () => {
  const {
    adminToken,
    changeAdminPin,
    resetToDefaults,
    rollbackToVersion,
    publishedVersion,
    publishedAt,
    data,
  } = usePortfolio();

  // PIN Form
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinStatus, setPinStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [updatingPin, setUpdatingPin] = useState(false);

  // Version History
  const [history, setHistory] = useState<Array<{ version: number; publishedAt: string; note?: string }>>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchHistory = async () => {
    if (!adminToken) return;
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/portfolio/history', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const json = await res.json();
      if (json.success && json.history) {
        setHistory(json.history);
      }
    } catch (e) {
      console.error('Failed to load version history:', e);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [adminToken]);

  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinStatus(null);

    if (newPin !== confirmPin) {
      setPinStatus({ type: 'error', message: 'New PIN and Confirm PIN do not match.' });
      return;
    }

    if (newPin.length < 4) {
      setPinStatus({ type: 'error', message: 'New PIN must be at least 4 digits.' });
      return;
    }

    setUpdatingPin(true);
    const res = await changeAdminPin(oldPin, newPin);
    setUpdatingPin(false);

    if (res.success) {
      setPinStatus({ type: 'success', message: 'Admin passcode successfully updated!' });
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
    } else {
      setPinStatus({ type: 'error', message: res.error || 'Failed to update passcode' });
    }
  };

  const handleDownloadBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `jinia_portfolio_backup_v${publishedVersion}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleRollback = async (v: number) => {
    if (confirm(`Are you sure you want to rollback the live website to version ${v}?`)) {
      const res = await rollbackToVersion(v);
      if (res.success) {
        alert(`Successfully rolled back to version ${v}!`);
        fetchHistory();
      } else {
        alert(res.error || 'Rollback failed.');
      }
    }
  };

  const handleResetDefaults = async () => {
    if (
      confirm(
        'WARNING: This will reset all portfolio data back to the default initial seed. Are you sure you want to proceed?'
      )
    ) {
      const res = await resetToDefaults();
      if (res.success) {
        alert('Portfolio reset to initial seed state.');
        fetchHistory();
      } else {
        alert(res.error || 'Reset failed.');
      }
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#141414] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display italic text-white">System Settings & Security</h2>
          <p className="text-xs text-white/40 mt-1">
            Manage admin credentials, version backups, and rollback points.
          </p>
        </div>
        <div className="text-xs font-mono text-white/40">
          Database Version: <strong className="text-white">v{publishedVersion}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Passcode Security */}
        <div className="p-6 rounded-3xl bg-[#141414] border border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-[#89AACC]">
              <KeyRound size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Change Admin Passcode</h3>
              <p className="text-xs text-white/40">Default PIN is 2026</p>
            </div>
          </div>

          <form onSubmit={handleUpdatePin} className="space-y-3 pt-2">
            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1">
                Current Passcode / PIN
              </label>
              <input
                type="password"
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value)}
                placeholder="Enter current PIN (e.g. 2026)"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1">
                New Passcode / PIN
              </label>
              <input
                type="password"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Enter new 4+ digit PIN"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1">
                Confirm New Passcode
              </label>
              <input
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Confirm new PIN"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
                required
              />
            </div>

            {pinStatus && (
              <div
                className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                  pinStatus.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}
              >
                {pinStatus.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
                <span>{pinStatus.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={updatingPin}
              className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-[#89AACC] hover:text-white transition-colors disabled:opacity-40"
            >
              {updatingPin ? 'Updating PIN...' : 'Update Passcode'}
            </button>
          </form>
        </div>

        {/* Database Backups & Export */}
        <div className="p-6 rounded-3xl bg-[#141414] border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400">
                <Database size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Database Backup & Export</h3>
                <p className="text-xs text-white/40">Download a full JSON snapshot of your website</p>
              </div>
            </div>

            <p className="text-xs text-white/50 leading-relaxed">
              Exporting saves your entire state including projects, journal posts, hero copy,
              explorations, resume, custom styling, and site configuration.
            </p>

            <button
              onClick={handleDownloadBackup}
              className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-white/10"
            >
              <Download size={15} />
              <span>Download JSON Backup</span>
            </button>
          </div>

          <div className="pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-red-400 block">Factory Reset</span>
                <span className="text-[11px] text-white/30">Restore original portfolio state</span>
              </div>
              <button
                onClick={handleResetDefaults}
                className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-mono transition-colors"
              >
                Reset Database
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Version History & Rollback Points */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#141414] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400">
              <History size={18} />
            </div>
            <div>
              <h3 className="text-base font-display italic text-white">Version History & Rollbacks</h3>
              <p className="text-xs text-white/40">Restore any previous published version with 1 click.</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {history.length > 0 ? (
            history.map((entry) => {
              const isCurrent = entry.version === publishedVersion;
              return (
                <div
                  key={entry.version}
                  className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-white px-2 py-1 rounded bg-white/5">
                      v{entry.version}
                    </span>
                    <div>
                      <span className="text-xs text-white font-medium block">
                        {entry.note || `Release version ${entry.version}`}
                      </span>
                      <span className="text-[10px] text-white/40 font-mono">
                        {new Date(entry.publishedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {isCurrent ? (
                    <span className="text-[10px] font-mono text-emerald-400 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                      CURRENT LIVE
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRollback(entry.version)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white text-xs font-mono flex items-center gap-1 transition-colors"
                    >
                      <span>Rollback</span>
                      <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-6 text-center text-xs text-white/40 font-mono">
              No version history entries available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
