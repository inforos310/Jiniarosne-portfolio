import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  Check,
  Sparkles,
  Layers,
  FileText,
  Briefcase,
  GraduationCap,
  Globe,
  Image as ImageIcon,
  User,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project, JournalArticle, ExplorationItem, StatItem, SocialLink } from '../../types';

type SectionSubTab = 'hero' | 'projects' | 'journal' | 'explorations' | 'stats' | 'resume' | 'social';

export const ContentManagerTab: React.FC = () => {
  const {
    data,
    updateHero,
    updateProject,
    addProject,
    deleteProject,
    updateArticles,
    addArticle,
    deleteArticle,
    updateExplorations,
    addExploration,
    deleteExploration,
    updateStats,
    updateResume,
    updateSocialLinks,
  } = usePortfolio();

  const [activeSubTab, setActiveSubTab] = useState<SectionSubTab>('hero');
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Editing modals/states
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 2500);
  };

  return (
    <div className="space-y-6 text-white">
      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
        {[
          { id: 'hero', label: 'Hero & Identity', icon: User },
          { id: 'projects', label: 'Selected Works', icon: Briefcase },
          { id: 'journal', label: 'Journal Articles', icon: FileText },
          { id: 'explorations', label: 'Explorations', icon: Sparkles },
          { id: 'stats', label: 'Stats & Metrics', icon: Layers },
          { id: 'resume', label: 'Resume & CV', icon: GraduationCap },
          { id: 'social', label: 'Social & Links', icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as SectionSubTab)}
              className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
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

      {/* Success Banner */}
      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check size={14} />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* SUBTAB 1: HERO & IDENTITY */}
      {activeSubTab === 'hero' && (
        <div className="p-6 rounded-3xl bg-[#141414] border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-display italic text-white text-glow">
              Hero Section & Visual Identity
            </h3>
            <span className="text-[10px] font-mono text-white/40 uppercase">Live Synchronized</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={data.hero.name}
                onChange={(e) => updateHero({ name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#89AACC]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                Collection Year Badge
              </label>
              <input
                type="text"
                value={data.hero.collectionYear}
                onChange={(e) => updateHero({ collectionYear: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#89AACC]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                Rotating Roles (Comma separated)
              </label>
              <input
                type="text"
                value={data.hero.roles.join(', ')}
                onChange={(e) =>
                  updateHero({
                    roles: e.target.value
                      .split(',')
                      .map((r) => r.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#89AACC]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                Location Text
              </label>
              <input
                type="text"
                value={data.hero.locationText}
                onChange={(e) => updateHero({ locationText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#89AACC]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                Availability Badge Text
              </label>
              <input
                type="text"
                value={data.hero.availabilityText}
                onChange={(e) => updateHero({ availabilityText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#89AACC]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                Bio Description Statement
              </label>
              <textarea
                rows={3}
                value={data.hero.bio}
                onChange={(e) => updateHero({ bio: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#89AACC]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                Contact Email Address
              </label>
              <input
                type="email"
                value={data.hero.email}
                onChange={(e) => {
                  updateHero({ email: e.target.value });
                  updateResume({ ...data.resume, email: e.target.value });
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#89AACC]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                Background Stream Video (HLS .m3u8 or MP4)
              </label>
              <input
                type="text"
                value={data.hero.videoUrl}
                onChange={(e) => updateHero({ videoUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#89AACC]"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: SELECTED WORKS / PROJECTS */}
      {activeSubTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-display italic text-white text-glow">
              Selected Works & Case Studies ({data.projects.length})
            </h3>
            <button
              onClick={() => {
                const newProject: Project = {
                  id: `project-${Date.now()}`,
                  title: 'New Featured Project',
                  category: 'Visual Identity & Systems',
                  tagline: 'Precision design systems & bespoke digital experience',
                  colSpan: 'md:col-span-6',
                  aspectRatio: 'aspect-[16/10]',
                  image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
                  tags: ['Design Systems', 'Brand Strategy', 'UI/UX'],
                  description: 'A comprehensive brand identity and digital solution framework.',
                  challenge: 'Creating a seamless visual identity across all platforms.',
                  solution: 'Crafted bespoke design tokens and layout systems.',
                  deliverables: ['Brand Guidelines', 'Component Library', 'Design Tokens'],
                  year: '2026',
                  client: 'Modern Client',
                  metrics: '+150% Conversion in Q1',
                  link: 'https://dribbble.com',
                };
                addProject(newProject);
                setEditingProjectId(newProject.id);
                showNotification('New project added!');
              }}
              className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs flex items-center gap-1.5 hover:bg-[#89AACC] hover:text-white transition-colors"
            >
              <Plus size={14} />
              <span>Add New Project</span>
            </button>
          </div>

          <div className="space-y-3">
            {data.projects.map((project) => {
              const isEditing = editingProjectId === project.id;
              return (
                <div
                  key={project.id}
                  className="p-5 rounded-2xl bg-[#141414] border border-white/10 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-12 h-12 rounded-xl object-cover border border-white/10"
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-white">{project.title}</h4>
                        <span className="text-[11px] text-white/40 font-mono">
                          {project.category} • {project.year} • {project.client}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingProjectId(isEditing ? null : project.id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors text-xs flex items-center gap-1.5"
                      >
                        <Edit2 size={13} />
                        <span>{isEditing ? 'Close' : 'Edit'}</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete project "${project.title}"?`)) {
                            deleteProject(project.id);
                            showNotification('Project deleted.');
                          }
                        }}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors text-xs"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Editing Drawer Form */}
                  {isEditing && (
                    <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                          Project Title
                        </label>
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => updateProject(project.id, { title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          value={project.category}
                          onChange={(e) => updateProject(project.id, { category: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                          Tagline / One-liner
                        </label>
                        <input
                          type="text"
                          value={project.tagline}
                          onChange={(e) => updateProject(project.id, { tagline: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                          Cover Image URL
                        </label>
                        <input
                          type="text"
                          value={project.image}
                          onChange={(e) => updateProject(project.id, { image: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={project.description}
                          onChange={(e) =>
                            updateProject(project.id, { description: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                          Challenge
                        </label>
                        <textarea
                          rows={2}
                          value={project.challenge}
                          onChange={(e) =>
                            updateProject(project.id, { challenge: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                          Solution
                        </label>
                        <textarea
                          rows={2}
                          value={project.solution}
                          onChange={(e) => updateProject(project.id, { solution: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                          Client Name
                        </label>
                        <input
                          type="text"
                          value={project.client}
                          onChange={(e) => updateProject(project.id, { client: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                          Metrics / Impact
                        </label>
                        <input
                          type="text"
                          value={project.metrics || ''}
                          onChange={(e) => updateProject(project.id, { metrics: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 3: JOURNAL ARTICLES */}
      {activeSubTab === 'journal' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-display italic text-white text-glow">
              Journal & Thought Leadership Articles ({data.articles.length})
            </h3>
            <button
              onClick={() => {
                const newArticle: JournalArticle = {
                  id: `journal-${Date.now()}`,
                  title: 'New Editorial Article',
                  slug: `article-${Date.now()}`,
                  readTime: '4 min read',
                  date: 'Aug 2026',
                  category: 'Design Systems',
                  summary: 'Insightful thoughts on the future of design and creative engineering.',
                  image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
                  content: [
                    'Paragraph 1: Core thesis statement and context.',
                    'Paragraph 2: Deep dive into execution and principles.',
                  ],
                };
                addArticle(newArticle);
                setEditingArticleId(newArticle.id);
                showNotification('New article created!');
              }}
              className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs flex items-center gap-1.5 hover:bg-[#89AACC] hover:text-white transition-colors"
            >
              <Plus size={14} />
              <span>Add Article</span>
            </button>
          </div>

          <div className="space-y-3">
            {data.articles.map((article) => {
              const isEditing = editingArticleId === article.id;
              return (
                <div
                  key={article.id}
                  className="p-5 rounded-2xl bg-[#141414] border border-white/10 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#89AACC] uppercase">
                        {article.category} • {article.readTime}
                      </span>
                      <h4 className="text-sm font-semibold text-white">{article.title}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingArticleId(isEditing ? null : article.id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors text-xs flex items-center gap-1.5"
                      >
                        <Edit2 size={13} />
                        <span>{isEditing ? 'Close' : 'Edit'}</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete article "${article.title}"?`)) {
                            deleteArticle(article.id);
                            showNotification('Article deleted.');
                          }
                        }}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors text-xs"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="pt-4 border-t border-white/10 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                            Article Title
                          </label>
                          <input
                            type="text"
                            value={article.title}
                            onChange={(e) =>
                              updateArticles(
                                data.articles.map((a) =>
                                  a.id === article.id ? { ...a, title: e.target.value } : a
                                )
                              )
                            }
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                            Category & Read Time
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={article.category}
                              onChange={(e) =>
                                updateArticles(
                                  data.articles.map((a) =>
                                    a.id === article.id ? { ...a, category: e.target.value } : a
                                  )
                                )
                              }
                              className="w-1/2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                            />
                            <input
                              type="text"
                              value={article.readTime}
                              onChange={(e) =>
                                updateArticles(
                                  data.articles.map((a) =>
                                    a.id === article.id ? { ...a, readTime: e.target.value } : a
                                  )
                                )
                              }
                              className="w-1/2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                          Summary Teaser
                        </label>
                        <textarea
                          rows={2}
                          value={article.summary}
                          onChange={(e) =>
                            updateArticles(
                              data.articles.map((a) =>
                                a.id === article.id ? { ...a, summary: e.target.value } : a
                              )
                            )
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                          Content Paragraphs (Separate with empty lines)
                        </label>
                        <textarea
                          rows={4}
                          value={article.content.join('\n\n')}
                          onChange={(e) =>
                            updateArticles(
                              data.articles.map((a) =>
                                a.id === article.id
                                  ? {
                                      ...a,
                                      content: e.target.value
                                        .split('\n\n')
                                        .map((p) => p.trim())
                                        .filter(Boolean),
                                    }
                                  : a
                              )
                            )
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 4: EXPLORATIONS */}
      {activeSubTab === 'explorations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-display italic text-white text-glow">
              Visual Playground Explorations ({data.explorations.length})
            </h3>
            <button
              onClick={() => {
                const newExp: ExplorationItem = {
                  id: `exp-${Date.now()}`,
                  title: 'Kinetic Study 07',
                  category: 'Motion Shaders',
                  image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
                  rotation: '-rotate-2',
                  description: 'Experimental shader study examining kinetic typography.',
                  tags: ['3D', 'Shaders', 'Creative'],
                };
                addExploration(newExp);
                showNotification('Exploration item added!');
              }}
              className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs flex items-center gap-1.5 hover:bg-[#89AACC] hover:text-white transition-colors"
            >
              <Plus size={14} />
              <span>Add Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.explorations.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-3"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-36 object-cover rounded-xl border border-white/10"
                />
                <div>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      updateExplorations(
                        data.explorations.map((x) =>
                          x.id === item.id ? { ...x, title: e.target.value } : x
                        )
                      )
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white mb-1"
                  />
                  <input
                    type="text"
                    value={item.category}
                    onChange={(e) =>
                      updateExplorations(
                        data.explorations.map((x) =>
                          x.id === item.id ? { ...x, category: e.target.value } : x
                        )
                      )
                    }
                    className="w-full px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-[#89AACC] mb-1"
                  />
                  <input
                    type="text"
                    value={item.image}
                    placeholder="Image URL"
                    onChange={(e) =>
                      updateExplorations(
                        data.explorations.map((x) =>
                          x.id === item.id ? { ...x, image: e.target.value } : x
                        )
                      )
                    }
                    className="w-full px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-white/50"
                  />
                </div>
                <button
                  onClick={() => {
                    deleteExploration(item.id);
                    showNotification('Exploration removed.');
                  }}
                  className="w-full py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs flex items-center justify-center gap-1 transition-colors"
                >
                  <Trash2 size={12} />
                  <span>Remove</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: STATS & IMPACT */}
      {activeSubTab === 'stats' && (
        <div className="p-6 rounded-3xl bg-[#141414] border border-white/10 space-y-5">
          <h3 className="text-base font-display italic text-white text-glow">
            Key Metrics & Impact Statistics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.stats.map((stat, idx) => (
              <div key={stat.id || idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                    Stat Metric (e.g. 20+, 4+, 100%)
                  </label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) =>
                      updateStats(
                        data.stats.map((s, i) => (i === idx ? { ...s, value: e.target.value } : s))
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-display italic text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) =>
                      updateStats(
                        data.stats.map((s, i) => (i === idx ? { ...s, label: e.target.value } : s))
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={stat.description}
                    onChange={(e) =>
                      updateStats(
                        data.stats.map((s, i) =>
                          i === idx ? { ...s, description: e.target.value } : s
                        )
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 6: RESUME & CV */}
      {activeSubTab === 'resume' && (
        <div className="p-6 rounded-3xl bg-[#141414] border border-white/10 space-y-6">
          <h3 className="text-base font-display italic text-white text-glow">
            Curriculum Vitae / Resume Details
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                Professional Bio Summary
              </label>
              <textarea
                rows={3}
                value={data.resume.summary}
                onChange={(e) => updateResume({ ...data.resume, summary: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                Core Skills List (Comma separated)
              </label>
              <textarea
                rows={2}
                value={data.resume.coreSkills.join(', ')}
                onChange={(e) =>
                  updateResume({
                    ...data.resume,
                    coreSkills: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
              />
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#89AACC]">
                Experience Entries
              </h4>
              {data.resume.experience.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[9px] uppercase font-mono text-white/40 block">Role</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const updated = [...data.resume.experience];
                        updated[idx].role = e.target.value;
                        updateResume({ ...data.resume, experience: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-white/5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-mono text-white/40 block">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...data.resume.experience];
                        updated[idx].company = e.target.value;
                        updateResume({ ...data.resume, experience: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-white/5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-mono text-white/40 block">Period</label>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => {
                        const updated = [...data.resume.experience];
                        updated[idx].period = e.target.value;
                        updateResume({ ...data.resume, experience: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-white/5 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 7: SOCIAL LINKS */}
      {activeSubTab === 'social' && (
        <div className="p-6 rounded-3xl bg-[#141414] border border-white/10 space-y-5">
          <h3 className="text-base font-display italic text-white text-glow">
            Outbound Social & Platform Links
          </h3>

          <div className="space-y-3">
            {data.socialLinks.map((link, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="w-24 text-xs font-semibold text-white">{link.name}</span>
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => {
                    const updated = [...data.socialLinks];
                    updated[idx].url = e.target.value;
                    updateSocialLinks(updated);
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
