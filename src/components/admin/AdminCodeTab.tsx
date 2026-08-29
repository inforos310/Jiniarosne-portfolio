import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Code2,
  Sparkles,
  Sliders,
  FileJson,
  Check,
  AlertCircle,
  Copy,
  RotateCcw,
  Palette,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const AdminCodeTab: React.FC = () => {
  const { draftData, updateCustomCodeDraft } = usePortfolio();
  const customCode = draftData.customCode || {
    customCss: '',
    customJs: '',
    primaryAccent: '#89AACC',
    secondaryAccent: '#4E85BF',
    glowIntensity: 0.28,
    borderRadiusScale: 24,
  };

  const [activeSubTab, setActiveSubTab] = useState<'tokens' | 'css' | 'js' | 'json'>('tokens');
  const [jsonString, setJsonString] = useState(() => JSON.stringify(draftData, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleJsonChange = (val: string) => {
    setJsonString(val);
    try {
      JSON.parse(val);
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(draftData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#141414] border border-white/10">
        <div>
          <h2 className="text-xl font-display italic text-white">Code & Design Tokens Studio</h2>
          <p className="text-xs text-white/40 mt-1">
            Fine-tune visual design tokens, inject custom CSS stylesheet rules, or attach custom tracking scripts.
          </p>
        </div>

        {/* Sub tabs */}
        <div className="flex items-center gap-1 bg-black/40 p-1.5 rounded-2xl border border-white/5 self-start sm:self-auto">
          {[
            { id: 'tokens', label: 'Design Tokens', icon: Sliders },
            { id: 'css', label: 'Custom CSS', icon: Palette },
            { id: 'js', label: 'Custom JS', icon: Code2 },
            { id: 'json', label: 'Raw State JSON', icon: FileJson },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- TOKENS TAB --- */}
      {activeSubTab === 'tokens' && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#141414] border border-white/10 space-y-6">
          <div>
            <h3 className="text-base font-display italic text-white">Theme & Gradient Accent Tokens</h3>
            <p className="text-xs text-white/40 mt-0.5">
              These tokens define the signature glow gradients, button hover states, and atmospheric depth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Primary Accent */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <label className="text-[11px] font-mono uppercase text-white/50 block">
                Primary Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={customCode.primaryAccent || '#89AACC'}
                  onChange={(e) => updateCustomCodeDraft({ primaryAccent: e.target.value })}
                  className="w-12 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={customCode.primaryAccent || '#89AACC'}
                  onChange={(e) => updateCustomCodeDraft({ primaryAccent: e.target.value })}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#89AACC]"
                />
              </div>
              <p className="text-[11px] text-white/40">Used in highlights, badges, and top gradient stop.</p>
            </div>

            {/* Secondary Accent */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <label className="text-[11px] font-mono uppercase text-white/50 block">
                Secondary Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={customCode.secondaryAccent || '#4E85BF'}
                  onChange={(e) => updateCustomCodeDraft({ secondaryAccent: e.target.value })}
                  className="w-12 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={customCode.secondaryAccent || '#4E85BF'}
                  onChange={(e) => updateCustomCodeDraft({ secondaryAccent: e.target.value })}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#89AACC]"
                />
              </div>
              <p className="text-[11px] text-white/40">Used in gradient bottoms and secondary glows.</p>
            </div>
          </div>

          {/* Accent Preview Banner */}
          <div
            className="p-6 rounded-2xl border border-white/10 flex items-center justify-between"
            style={{
              background: `linear-gradient(135deg, ${customCode.primaryAccent}22, ${customCode.secondaryAccent}22)`,
              borderColor: `${customCode.primaryAccent}44`,
            }}
          >
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/60 block mb-1">
                Active Theme Gradient Sample
              </span>
              <h4 className="text-xl font-display italic text-white">
                {customCode.primaryAccent} → {customCode.secondaryAccent}
              </h4>
            </div>
            <button
              style={{
                background: `linear-gradient(to right, ${customCode.primaryAccent}, ${customCode.secondaryAccent})`,
              }}
              className="px-6 py-2.5 rounded-xl text-white font-semibold text-xs shadow-lg"
            >
              CTA Button Sample
            </button>
          </div>
        </div>
      )}

      {/* --- CUSTOM CSS TAB --- */}
      {activeSubTab === 'css' && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#141414] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-display italic text-white">Live Custom CSS Injection</h3>
              <p className="text-xs text-white/40 mt-0.5">
                Styles written here are immediately appended to the document &lt;head&gt;.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 text-white/60">
              CSS3 / Tailwind
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d0d]">
            <textarea
              rows={14}
              value={customCode.customCss}
              onChange={(e) => updateCustomCodeDraft({ customCss: e.target.value })}
              placeholder="/* Write custom CSS here */&#10;.my-custom-class { ... }"
              className="w-full p-4 bg-transparent text-xs text-emerald-300 font-mono focus:outline-none resize-y leading-relaxed"
              spellCheck={false}
            />
          </div>
        </div>
      )}

      {/* --- CUSTOM JS TAB --- */}
      {activeSubTab === 'js' && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#141414] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-display italic text-white">Custom JavaScript & Webhooks</h3>
              <p className="text-xs text-white/40 mt-0.5">
                Executes safely within the client runtime for custom animations or tracking tags.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 text-white/60">
              ECMAScript
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d0d]">
            <textarea
              rows={14}
              value={customCode.customJs}
              onChange={(e) => updateCustomCodeDraft({ customJs: e.target.value })}
              placeholder="// Write custom JavaScript here&#10;console.log('Script loaded');"
              className="w-full p-4 bg-transparent text-xs text-amber-200 font-mono focus:outline-none resize-y leading-relaxed"
              spellCheck={false}
            />
          </div>
        </div>
      )}

      {/* --- RAW JSON STATE TAB --- */}
      {activeSubTab === 'json' && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#141414] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-display italic text-white">Centralized State JSON Inspector</h3>
              <p className="text-xs text-white/40 mt-0.5">
                Direct view of the single source of truth data object.
              </p>
            </div>

            <button
              onClick={handleCopyJson}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
            </button>
          </div>

          {jsonError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle size={14} />
              <span>Invalid JSON: {jsonError}</span>
            </div>
          )}

          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d0d]">
            <textarea
              rows={16}
              value={jsonString}
              onChange={(e) => handleJsonChange(e.target.value)}
              className="w-full p-4 bg-transparent text-[11px] text-cyan-300 font-mono focus:outline-none resize-y leading-relaxed"
              spellCheck={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};
