import React, { useState, useEffect } from 'react';
import {
  Code,
  FileCode,
  Palette,
  Save,
  Check,
  AlertCircle,
  Sparkles,
  Download,
  Upload,
  RefreshCw,
  Copy,
  Sliders,
  Terminal,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const CodeEditorTab: React.FC = () => {
  const {
    data,
    updateCustomCode,
    importFromJSON,
    exportToJSON,
    resetToDefaults,
  } = usePortfolio();

  const [activeCodeMode, setActiveCodeMode] = useState<'json' | 'css' | 'js' | 'tokens'>('json');
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Sync local JSON editor text when data changes or tab opens
  useEffect(() => {
    setJsonText(exportToJSON());
  }, [exportToJSON]);

  const handleApplyJSON = () => {
    setJsonError(null);
    const res = importFromJSON(jsonText);
    if (res.success) {
      setSaveStatus('Master JSON applied and updated across website!');
      setTimeout(() => setSaveStatus(null), 3000);
    } else {
      setJsonError(res.error || 'Failed to parse JSON.');
    }
  };

  const handleFormatJSON = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (e: any) {
      setJsonError(`Cannot format invalid JSON: ${e.message}`);
    }
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(jsonText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportToJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-full-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setJsonText(content);
        const res = importFromJSON(content);
        if (res.success) {
          setSaveStatus('Portfolio data successfully restored from backup file!');
          setTimeout(() => setSaveStatus(null), 3000);
        } else {
          setJsonError(res.error || 'Invalid file format');
        }
      }
    };
    reader.readAsText(file);
  };

  // Preset CSS snippets
  const applyCssPreset = (snippet: string) => {
    const current = data.customCode.customCss || '';
    const updated = `${current.trim()}\n\n${snippet.trim()}\n`;
    updateCustomCode({ customCss: updated });
    setSaveStatus('CSS snippet applied live!');
    setTimeout(() => setSaveStatus(null), 2500);
  };

  return (
    <div className="space-y-6 text-white">
      {/* Code Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          {[
            { id: 'json', label: 'Master JSON Code', icon: FileCode },
            { id: 'css', label: 'Custom CSS Injector', icon: Code },
            { id: 'js', label: 'Custom Scripts / Webhooks', icon: Terminal },
            { id: 'tokens', label: 'Visual Color Tokens', icon: Palette },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCodeMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCodeMode(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-white text-black font-semibold shadow-lg'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadBackup}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
          >
            <Download size={13} />
            <span>Download Backup</span>
          </button>
          <label className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs flex items-center gap-1.5 cursor-pointer transition-colors">
            <Upload size={13} />
            <span>Restore Backup</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Notification status */}
      {saveStatus && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check size={14} />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Error status */}
      {jsonError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle size={14} />
          <span>{jsonError}</span>
        </div>
      )}

      {/* TAB 1: MASTER JSON CODE EDITOR */}
      {activeCodeMode === 'json' && (
        <div className="p-6 rounded-3xl bg-[#141414] border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-display italic text-white text-glow">
                Raw JSON Global State Code
              </h3>
              <p className="text-xs text-white/40 mt-0.5">
                Directly inspect and modify all projects, journal entries, hero text, resume details, and custom styles in raw JSON.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleFormatJSON}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white/70 hover:text-white transition-colors"
              >
                Format / Prettify
              </button>
              <button
                onClick={handleCopyJSON}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white/70 hover:text-white transition-colors flex items-center gap-1"
              >
                {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleApplyJSON}
                className="px-4 py-1.5 rounded-xl bg-white text-black font-semibold text-xs flex items-center gap-1.5 hover:bg-[#89AACC] hover:text-white transition-colors"
              >
                <Save size={13} />
                <span>Save JSON Changes</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={22}
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value);
                setJsonError(null);
              }}
              spellCheck={false}
              className="w-full p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 text-xs font-mono text-[#89AACC] leading-relaxed focus:outline-none focus:border-[#89AACC] resize-y selection:bg-[#4E85BF] selection:text-white"
            />
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOM CSS INJECTOR */}
      {activeCodeMode === 'css' && (
        <div className="p-6 rounded-3xl bg-[#141414] border border-white/10 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-display italic text-white text-glow">
                Live Custom CSS Stylesheet
              </h3>
              <p className="text-xs text-white/40 mt-0.5">
                Write custom CSS rules. Changes are injected live into the document head immediately.
              </p>
            </div>

            <button
              onClick={() => {
                setSaveStatus('Custom CSS rules saved and compiled!');
                setTimeout(() => setSaveStatus(null), 2500);
              }}
              className="px-4 py-1.5 rounded-xl bg-white text-black font-semibold text-xs flex items-center gap-1.5 hover:bg-[#89AACC] hover:text-white transition-colors"
            >
              <Save size={13} />
              <span>Save Stylesheet</span>
            </button>
          </div>

          {/* Quick Snippet Injectors */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
              Quick CSS Presets & Utilities (Click to Insert):
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  applyCssPreset(`/* Glowing Cyan Accent Effect */
.glow-cyan-highlight {
  box-shadow: 0 0 35px rgba(0, 240, 255, 0.3) !important;
  border-color: rgba(0, 240, 255, 0.4) !important;
}`)
                }
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-[#89AACC] border border-white/5"
              >
                + Neon Glow Class
              </button>
              <button
                onClick={() =>
                  applyCssPreset(`/* Custom Glassmorphism Boost */
.backdrop-glass-super {
  backdrop-filter: blur(28px) saturate(180%) !important;
  background: rgba(20, 20, 20, 0.75) !important;
}`)
                }
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-[#89AACC] border border-white/5"
              >
                + Glassmorphism Boost
              </button>
              <button
                onClick={() =>
                  applyCssPreset(`/* Smooth Text Hover Lift */
.hover-lift-fx:hover {
  transform: translateY(-4px);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}`)
                }
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-[#89AACC] border border-white/5"
              >
                + Hover Lift Animation
              </button>
            </div>
          </div>

          <textarea
            rows={18}
            value={data.customCode.customCss}
            onChange={(e) => updateCustomCode({ customCss: e.target.value })}
            spellCheck={false}
            className="w-full p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 text-xs font-mono text-emerald-300 leading-relaxed focus:outline-none focus:border-[#89AACC] resize-y"
          />
        </div>
      )}

      {/* TAB 3: CUSTOM SCRIPTS & WEBHOOKS */}
      {activeCodeMode === 'js' && (
        <div className="p-6 rounded-3xl bg-[#141414] border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-display italic text-white text-glow">
                Custom JavaScript & Webhook Script
              </h3>
              <p className="text-xs text-white/40 mt-0.5">
                Inject custom analytics pixels, external webhooks, or dynamic client-side scripts.
              </p>
            </div>

            <button
              onClick={() => {
                setSaveStatus('Custom Script saved.');
                setTimeout(() => setSaveStatus(null), 2500);
              }}
              className="px-4 py-1.5 rounded-xl bg-white text-black font-semibold text-xs flex items-center gap-1.5 hover:bg-[#89AACC] hover:text-white transition-colors"
            >
              <Save size={13} />
              <span>Save Script</span>
            </button>
          </div>

          <textarea
            rows={16}
            value={data.customCode.customJs}
            onChange={(e) => updateCustomCode({ customJs: e.target.value })}
            spellCheck={false}
            className="w-full p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 text-xs font-mono text-amber-300 leading-relaxed focus:outline-none focus:border-[#89AACC] resize-y"
          />
        </div>
      )}

      {/* TAB 4: VISUAL COLOR TOKENS */}
      {activeCodeMode === 'tokens' && (
        <div className="p-6 rounded-3xl bg-[#141414] border border-white/10 space-y-6">
          <h3 className="text-base font-display italic text-white text-glow">
            Visual Brand Tokens & Atmosphere
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
              <label className="text-[11px] font-mono uppercase text-white/50 block">
                Primary Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={data.customCode.primaryAccent}
                  onChange={(e) => updateCustomCode({ primaryAccent: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={data.customCode.primaryAccent}
                  onChange={(e) => updateCustomCode({ primaryAccent: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
              <label className="text-[11px] font-mono uppercase text-white/50 block">
                Secondary Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={data.customCode.secondaryAccent}
                  onChange={(e) => updateCustomCode({ secondaryAccent: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={data.customCode.secondaryAccent}
                  onChange={(e) => updateCustomCode({ secondaryAccent: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase text-white/50">
                  Glow Atmospheric Intensity
                </label>
                <span className="text-xs font-mono text-[#89AACC]">
                  {Math.round(data.customCode.glowIntensity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={data.customCode.glowIntensity}
                onChange={(e) =>
                  updateCustomCode({ glowIntensity: parseFloat(e.target.value) })
                }
                className="w-full accent-[#89AACC]"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase text-white/50">
                  Card Border Radius
                </label>
                <span className="text-xs font-mono text-[#89AACC]">
                  {data.customCode.borderRadiusScale}px
                </span>
              </div>
              <input
                type="range"
                min={8}
                max={36}
                step={2}
                value={data.customCode.borderRadiusScale}
                onChange={(e) =>
                  updateCustomCode({ borderRadiusScale: parseInt(e.target.value, 10) })
                }
                className="w-full accent-[#89AACC]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Global Danger Zone / Reset */}
      <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-red-400">Reset All Portfolio Content</h4>
          <p className="text-xs text-white/40 mt-0.5">
            Restores all original case studies, journal articles, and default styling.
          </p>
        </div>
        <button
          onClick={() => {
            if (
              window.confirm(
                'Are you sure you want to reset all portfolio data back to original factory defaults?'
              )
            ) {
              resetToDefaults();
              setSaveStatus('Portfolio state reset to factory defaults.');
              setTimeout(() => setSaveStatus(null), 3000);
            }
          }}
          className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold flex items-center gap-2 transition-colors shrink-0"
        >
          <RefreshCw size={14} />
          <span>Reset Factory Defaults</span>
        </button>
      </div>
    </div>
  );
};
