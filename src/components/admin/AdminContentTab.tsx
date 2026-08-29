import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Layers,
  Sparkles,
  Video,
  User,
  Compass,
  BarChart2,
  FileText,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ExplorationItem, StatItem, SocialLink } from '../../types';
import { MediaPickerModal } from './MediaPickerModal';

export const AdminContentTab: React.FC = () => {
  const {
    draftData,
    updateHeroDraft,
    updateNavbarDraft,
    updateExplorationsDraft,
    updateStatsDraft,
    updateSocialLinksDraft,
    updateResumeDraft,
  } = usePortfolio();

  const [activeSection, setActiveSection] = useState<
    'hero' | 'navbar' | 'explorations' | 'stats' | 'resume' | 'social'
  >('hero');

  const [mediaPickerTarget, setMediaPickerTarget] = useState<{
    field: 'heroVideo' | 'exploration';
    explorationId?: string;
  } | null>(null);

  // --- Hero section form ---
  const hero = draftData.hero;
  const rolesText = (hero.roles || []).join('\n');

  // --- Navbar form ---
  const navbar = draftData.navbar || {
    initials: 'JR',
    name: 'Jinia Alam Rosne',
    role: 'Brand & AI Designer',
    links: [
      { label: 'Work', target: 'work' },
      { label: 'Journal', target: 'journal' },
      { label: 'Explorations', target: 'explorations' },
      { label: 'Stats', target: 'stats' },
    ],
    sayHiText: 'Say Hi',
    sayHiTarget: 'contact',
  };

  // --- Explorations ---
  const explorations = draftData.explorations || [];

  // --- Stats ---
  const stats = draftData.stats || [];

  // --- Resume ---
  const resume = draftData.resume;

  // --- Social Links ---
  const socialLinks = draftData.socialLinks || [];

  const handleMediaSelect = (url: string) => {
    if (!mediaPickerTarget) return;
    if (mediaPickerTarget.field === 'heroVideo') {
      updateHeroDraft({ videoUrl: url });
    } else if (mediaPickerTarget.field === 'exploration' && mediaPickerTarget.explorationId) {
      const updated = explorations.map((exp) =>
        exp.id === mediaPickerTarget.explorationId ? { ...exp, image: url } : exp
      );
      updateExplorationsDraft(updated);
    }
    setMediaPickerTarget(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Sub-nav tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-[#141414] border border-white/10 w-fit">
        {[
          { id: 'hero', label: 'Hero Header', icon: Sparkles },
          { id: 'navbar', label: 'Navbar & Branding', icon: Layers },
          { id: 'explorations', label: 'Explorations', icon: Compass },
          { id: 'stats', label: 'Stats & Metrics', icon: BarChart2 },
          { id: 'resume', label: 'Resume & CV', icon: FileText },
          { id: 'social', label: 'Social & Contact', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- HERO TAB --- */}
      {activeSection === 'hero' && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#141414] border border-white/10 space-y-6">
          <div>
            <h3 className="text-lg font-display italic text-white">Hero Section Configuration</h3>
            <p className="text-xs text-white/40 mt-1">
              Controls the top fold of your portfolio, rotating role titles, and ambient video stream.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                Collection Eyebrow
              </label>
              <input
                type="text"
                value={hero.collectionYear}
                onChange={(e) => updateHeroDraft({ collectionYear: e.target.value })}
                placeholder="COLLECTION '26"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={hero.name}
                onChange={(e) => updateHeroDraft({ name: e.target.value })}
                placeholder="Jinia Alam Rosne"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
              Rotating Role Titles (One per line)
            </label>
            <textarea
              rows={4}
              value={rolesText}
              onChange={(e) =>
                updateHeroDraft({
                  roles: e.target.value
                    .split('\n')
                    .map((r) => r.trim())
                    .filter(Boolean),
                })
              }
              placeholder="Brand Identity Designer&#10;AI Automation Specialist&#10;Digital Solutions Architect"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#89AACC]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                Location Text
              </label>
              <input
                type="text"
                value={hero.locationText}
                onChange={(e) => updateHeroDraft({ locationText: e.target.value })}
                placeholder="based in Bangladesh."
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                Availability Badge Text
              </label>
              <input
                type="text"
                value={hero.availabilityText}
                onChange={(e) => updateHeroDraft({ availabilityText: e.target.value })}
                placeholder="Available for projects"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
              Bio Summary Statement
            </label>
            <textarea
              rows={3}
              value={hero.bio}
              onChange={(e) => updateHeroDraft({ bio: e.target.value })}
              placeholder="Specializing in AI Automation and Digital Solutions..."
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
            />
          </div>

          {/* Buttons & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                Primary Button Text
              </label>
              <input
                type="text"
                value={hero.primaryCtaText}
                onChange={(e) => updateHeroDraft({ primaryCtaText: e.target.value })}
                placeholder="See Works"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                Secondary Button Text
              </label>
              <input
                type="text"
                value={hero.secondaryCtaText}
                onChange={(e) => updateHeroDraft({ secondaryCtaText: e.target.value })}
                placeholder="Reach out"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                value={hero.email}
                onChange={(e) => updateHeroDraft({ email: e.target.value })}
                placeholder="info.ros310@gmail.com"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
              />
            </div>
          </div>

          {/* Video Stream URL */}
          <div>
            <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
              Ambient Background Video Stream (M3U8 / MP4)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={hero.videoUrl}
                onChange={(e) => updateHeroDraft({ videoUrl: e.target.value })}
                placeholder="https://stream.mux.com/... or https://..."
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#89AACC]"
              />
              <button
                type="button"
                onClick={() => setMediaPickerTarget({ field: 'heroVideo' })}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Video size={14} className="text-[#89AACC]" />
                <span>Select Video</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- NAVBAR TAB --- */}
      {activeSection === 'navbar' && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#141414] border border-white/10 space-y-6">
          <div>
            <h3 className="text-lg font-display italic text-white">Navbar & Header Branding</h3>
            <p className="text-xs text-white/40 mt-1">
              Configure your monogram initials, top header role, and navigation anchor targets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                Initials Monogram
              </label>
              <input
                type="text"
                value={navbar.initials}
                onChange={(e) => updateNavbarDraft({ initials: e.target.value })}
                placeholder="JR"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#89AACC]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                Brand Name
              </label>
              <input
                type="text"
                value={navbar.name}
                onChange={(e) => updateNavbarDraft({ name: e.target.value })}
                placeholder="Jinia Alam Rosne"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                Subtitle Role
              </label>
              <input
                type="text"
                value={navbar.role}
                onChange={(e) => updateNavbarDraft({ role: e.target.value })}
                placeholder="Brand & AI Designer"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                Action Button Text
              </label>
              <input
                type="text"
                value={navbar.sayHiText || 'Say Hi'}
                onChange={(e) => updateNavbarDraft({ sayHiText: e.target.value })}
                placeholder="Say Hi"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                Action Button Target Section
              </label>
              <input
                type="text"
                value={navbar.sayHiTarget || 'contact'}
                onChange={(e) => updateNavbarDraft({ sayHiTarget: e.target.value })}
                placeholder="contact"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#89AACC]"
              />
            </div>
          </div>
        </div>
      )}

      {/* --- EXPLORATIONS TAB --- */}
      {activeSection === 'explorations' && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#141414] border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-display italic text-white">Visual Explorations</h3>
              <p className="text-xs text-white/40 mt-1">
                Curate kinetic typography experiments, shaders, 3D refraction, and packaging prototypes.
              </p>
            </div>
            <button
              onClick={() => {
                const newExp: ExplorationItem = {
                  id: `exp-${Date.now()}`,
                  title: 'New Exploration Specimen',
                  category: 'Generative Shaders',
                  image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
                  rotation: 'rotate-2',
                  description: 'Experimental study in procedural aesthetics.',
                  tags: ['3D', 'Generative', 'Study'],
                };
                updateExplorationsDraft([newExp, ...explorations]);
              }}
              className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-[#89AACC] hover:text-white transition-colors flex items-center gap-1.5 shadow"
            >
              <Plus size={14} />
              <span>Add Exploration</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {explorations.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 relative group"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black/40 border border-white/10 relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <button
                    onClick={() => setMediaPickerTarget({ field: 'exploration', explorationId: item.id })}
                    className="absolute bottom-2 right-2 p-2 rounded-lg bg-black/70 hover:bg-[#89AACC] text-white text-xs font-mono transition-colors flex items-center gap-1"
                  >
                    <ImageIcon size={12} />
                    <span>Change</span>
                  </button>
                </div>

                <div>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const updated = explorations.map((x) =>
                        x.id === item.id ? { ...x, title: e.target.value } : x
                      );
                      updateExplorationsDraft(updated);
                    }}
                    placeholder="Title"
                    className="w-full px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white font-medium focus:outline-none focus:border-[#89AACC]"
                  />
                  <input
                    type="text"
                    value={item.category}
                    onChange={(e) => {
                      const updated = explorations.map((x) =>
                        x.id === item.id ? { ...x, category: e.target.value } : x
                      );
                      updateExplorationsDraft(updated);
                    }}
                    placeholder="Category"
                    className="w-full px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[11px] text-[#89AACC] font-mono mt-1.5 focus:outline-none focus:border-[#89AACC]"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      if (confirm('Delete this exploration?')) {
                        updateExplorationsDraft(explorations.filter((x) => x.id !== item.id));
                      }
                    }}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- STATS TAB --- */}
      {activeSection === 'stats' && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#141414] border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-display italic text-white">Impact Stats & Metrics</h3>
              <p className="text-xs text-white/40 mt-1">
                Highlighted track record numbers showcased in the Stats component.
              </p>
            </div>
            <button
              onClick={() => {
                const newStat: StatItem = {
                  id: `stat-${Date.now()}`,
                  value: '10+',
                  label: 'Custom Deliverables',
                  description: 'Bespoke assets delivered with pixel perfection.',
                };
                updateStatsDraft([...stats, newStat]);
              }}
              className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-[#89AACC] hover:text-white transition-colors flex items-center gap-1.5 shadow"
            >
              <Plus size={14} />
              <span>Add Stat</span>
            </button>
          </div>

          <div className="space-y-4">
            {stats.map((stat, idx) => (
              <div
                key={stat.id}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <div className="w-full sm:w-28">
                  <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                    Value
                  </label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => {
                      const updated = stats.map((s) =>
                        s.id === stat.id ? { ...s, value: e.target.value } : s
                      );
                      updateStatsDraft(updated);
                    }}
                    placeholder="20+"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-display italic text-white focus:outline-none focus:border-[#89AACC]"
                  />
                </div>

                <div className="w-full sm:w-48">
                  <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const updated = stats.map((s) =>
                        s.id === stat.id ? { ...s, label: e.target.value } : s
                      );
                      updateStatsDraft(updated);
                    }}
                    placeholder="Brand Projects"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white font-medium focus:outline-none focus:border-[#89AACC]"
                  />
                </div>

                <div className="flex-1 w-full">
                  <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={stat.description}
                    onChange={(e) => {
                      const updated = stats.map((s) =>
                        s.id === stat.id ? { ...s, description: e.target.value } : s
                      );
                      updateStatsDraft(updated);
                    }}
                    placeholder="Detailed explanation..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/70 focus:outline-none focus:border-[#89AACC]"
                  />
                </div>

                <button
                  onClick={() => {
                    updateStatsDraft(stats.filter((s) => s.id !== stat.id));
                  }}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 self-end sm:self-center transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- RESUME TAB --- */}
      {activeSection === 'resume' && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#141414] border border-white/10 space-y-6">
          <div>
            <h3 className="text-lg font-display italic text-white">Resume & Professional CV</h3>
            <p className="text-xs text-white/40 mt-1">
              Displayed in the full-screen interactive Resume Modal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={resume.name}
                onChange={(e) => updateResumeDraft({ ...resume, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                Title & Specialization
              </label>
              <input
                type="text"
                value={resume.title}
                onChange={(e) => updateResumeDraft({ ...resume, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
              Executive Summary
            </label>
            <textarea
              rows={3}
              value={resume.summary}
              onChange={(e) => updateResumeDraft({ ...resume, summary: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
              Core Skills (One per line)
            </label>
            <textarea
              rows={4}
              value={(resume.coreSkills || []).join('\n')}
              onChange={(e) =>
                updateResumeDraft({
                  ...resume,
                  coreSkills: e.target.value
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#89AACC]"
            />
          </div>
        </div>
      )}

      {/* --- SOCIAL & CONTACT TAB --- */}
      {activeSection === 'social' && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#141414] border border-white/10 space-y-6">
          <div>
            <h3 className="text-lg font-display italic text-white">Social Links & External Profiles</h3>
            <p className="text-xs text-white/40 mt-1">
              Links appearing in the Contact Footer and across the website.
            </p>
          </div>

          <div className="space-y-3">
            {socialLinks.map((link, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10"
              >
                <input
                  type="text"
                  value={link.name}
                  onChange={(e) => {
                    const updated = [...socialLinks];
                    updated[idx] = { ...link, name: e.target.value };
                    updateSocialLinksDraft(updated);
                  }}
                  placeholder="Platform Name (e.g. Fiverr)"
                  className="w-36 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white font-medium focus:outline-none focus:border-[#89AACC]"
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => {
                    const updated = [...socialLinks];
                    updated[idx] = { ...link, url: e.target.value };
                    updateSocialLinksDraft(updated);
                  }}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#89AACC]"
                />
                <button
                  onClick={() => {
                    updateSocialLinksDraft(socialLinks.filter((_, i) => i !== idx));
                  }}
                  className="p-2 text-white/40 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            <button
              onClick={() => {
                updateSocialLinksDraft([
                  ...socialLinks,
                  { name: 'New Platform', url: 'https://', icon: 'Sparkles' },
                ]);
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Plus size={14} />
              <span>Add Link</span>
            </button>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={!!mediaPickerTarget}
        onClose={() => setMediaPickerTarget(null)}
        onSelect={handleMediaSelect}
        title={mediaPickerTarget?.field === 'heroVideo' ? 'Select Hero Video' : 'Select Exploration Image'}
        acceptTypes={mediaPickerTarget?.field === 'heroVideo' ? 'video' : 'image'}
      />
    </div>
  );
};
