import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Check,
  X,
  Sparkles,
  Layers,
  Calendar,
  User,
  Tag,
  FileText,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project } from '../../types';
import { MediaPickerModal } from './MediaPickerModal';

export const AdminProjectsTab: React.FC = () => {
  const { draftData, updateProjectsDraft } = usePortfolio();
  const projects = draftData.projects || [];

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<{ field: 'image' | 'gallery'; galleryIndex?: number } | null>(null);

  // Form State
  const [formData, setFormData] = useState<Project>({
    id: '',
    title: '',
    category: '',
    tagline: '',
    colSpan: 'md:col-span-7',
    aspectRatio: 'aspect-[16/10]',
    image: '',
    gallery: [],
    tags: [],
    description: '',
    challenge: '',
    solution: '',
    deliverables: [],
    year: '2026',
    client: '',
    metrics: '',
    link: '',
    published: true,
  });

  const [tagsInput, setTagsInput] = useState('');
  const [deliverablesInput, setDeliverablesInput] = useState('');

  const handleOpenCreate = () => {
    const newId = `project-${Date.now()}`;
    setFormData({
      id: newId,
      title: '',
      category: 'Visual Identity & Systems',
      tagline: '',
      colSpan: 'md:col-span-7',
      aspectRatio: 'aspect-[16/10]',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
      gallery: [],
      tags: ['Brand Strategy', 'Visual Identity'],
      description: '',
      challenge: '',
      solution: '',
      deliverables: ['Logo & Monogram Architecture', 'Brand Guidelines'],
      year: '2026',
      client: '',
      metrics: '',
      link: '',
      published: true,
    });
    setTagsInput('Brand Strategy, Visual Identity');
    setDeliverablesInput('Logo & Monogram Architecture\nBrand Guidelines');
    setIsCreating(true);
    setEditingProject(null);
  };

  const handleOpenEdit = (proj: Project) => {
    setEditingProject(proj);
    setFormData({ ...proj });
    setTagsInput((proj.tags || []).join(', '));
    setDeliverablesInput((proj.deliverables || []).join('\n'));
    setIsCreating(false);
  };

  const handleSaveProject = () => {
    if (!formData.title.trim()) {
      alert('Please provide a project title.');
      return;
    }

    const processedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const processedDeliverables = deliverablesInput
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean);

    const completeProject: Project = {
      ...formData,
      tags: processedTags,
      deliverables: processedDeliverables,
    };

    if (isCreating) {
      updateProjectsDraft([completeProject, ...projects]);
    } else {
      updateProjectsDraft(
        projects.map((p) => (p.id === completeProject.id ? completeProject : p))
      );
    }

    setEditingProject(null);
    setIsCreating(false);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      updateProjectsDraft(projects.filter((p) => p.id !== id));
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    updateProjectsDraft(updated);
  };

  const handleMediaSelect = (url: string) => {
    if (!mediaPickerTarget) return;
    if (mediaPickerTarget.field === 'image') {
      setFormData((prev) => ({ ...prev, image: url }));
    } else if (mediaPickerTarget.field === 'gallery') {
      setFormData((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), url],
      }));
    }
    setMediaPickerTarget(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#141414] border border-white/10">
        <div>
          <h2 className="text-xl font-display italic text-white">Selected Works Management</h2>
          <p className="text-xs text-white/40 mt-1">
            Add, reorder, and configure featured case studies displayed on the public site.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-2xl bg-white text-black font-semibold text-xs hover:bg-[#89AACC] hover:text-white transition-all flex items-center gap-2 shadow-lg"
        >
          <Plus size={15} />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {projects.map((proj, idx) => (
          <div
            key={proj.id}
            className="group flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#141414] border border-white/5 hover:border-white/15 transition-all gap-4"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Index & Reorder */}
              <div className="flex flex-col items-center gap-1 text-white/40">
                <button
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1 hover:text-white disabled:opacity-20 transition-colors"
                >
                  <ArrowUp size={14} />
                </button>
                <span className="text-[10px] font-mono">{idx + 1}</span>
                <button
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === projects.length - 1}
                  className="p-1 hover:text-white disabled:opacity-20 transition-colors"
                >
                  <ArrowDown size={14} />
                </button>
              </div>

              {/* Cover Thumbnail */}
              <div className="w-20 h-14 sm:w-28 sm:h-18 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0 relative">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#89AACC]">
                    {proj.category}
                  </span>
                  <span className="text-[10px] text-white/30 font-mono">• {proj.year}</span>
                  {proj.published === false && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      Draft
                    </span>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                  {proj.title}
                </h3>
                <p className="text-xs text-white/40 truncate mt-0.5">{proj.tagline}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() => handleOpenEdit(proj)}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Edit2 size={13} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDeleteProject(proj.id)}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                title="Delete project"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Project Create / Edit Modal */}
      <AnimatePresence>
        {(isCreating || editingProject) && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsCreating(false);
                setEditingProject(null);
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-[#121212] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#161616]">
                <h3 className="text-base font-display italic text-white">
                  {isCreating ? 'Create New Project' : `Edit Project: ${formData.title}`}
                </h3>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingProject(null);
                  }}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Title & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Brand Identity Design"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#89AACC]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Visual Identity & Systems"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#89AACC]"
                    />
                  </div>
                </div>

                {/* Tagline */}
                <div>
                  <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                    Tagline (Card Subheading)
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="Short punchy summary..."
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#89AACC]"
                  />
                </div>

                {/* Cover Image URL & Media Picker */}
                <div>
                  <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                    Cover Image URL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#89AACC]"
                    />
                    <button
                      type="button"
                      onClick={() => setMediaPickerTarget({ field: 'image' })}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center gap-1.5 transition-colors flex-shrink-0"
                    >
                      <ImageIcon size={14} className="text-[#89AACC]" />
                      <span>Choose Media</span>
                    </button>
                  </div>
                  {formData.image && (
                    <div className="mt-2 w-32 h-20 rounded-xl overflow-hidden border border-white/10 relative group">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Project Gallery Screenshots & Artifacts */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-mono uppercase text-white/50 block">
                      Case Study Gallery & Mockups ({formData.gallery?.length || 0})
                    </label>
                    <button
                      type="button"
                      onClick={() => setMediaPickerTarget({ field: 'gallery' })}
                      className="text-[11px] font-mono text-[#89AACC] hover:underline flex items-center gap-1"
                    >
                      <Plus size={12} />
                      <span>Add Gallery Image</span>
                    </button>
                  </div>

                  {formData.gallery && formData.gallery.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-black/40 border border-white/5">
                      {formData.gallery.map((imgUrl, gIdx) => (
                        <div key={gIdx} className="relative group rounded-xl overflow-hidden aspect-[4/3] bg-zinc-900 border border-white/10">
                          <img src={imgUrl} alt={`Gallery ${gIdx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                gallery: formData.gallery?.filter((_, i) => i !== gIdx),
                              });
                            }}
                            className="absolute top-1 right-1 p-1 rounded-md bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove image"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      onClick={() => setMediaPickerTarget({ field: 'gallery' })}
                      className="p-4 rounded-xl border border-dashed border-white/10 hover:border-white/20 text-center cursor-pointer text-xs text-white/40 hover:text-white transition-colors"
                    >
                      Click to add supplementary gallery mockups, brand assets, or screens from Supabase.
                    </div>
                  )}
                </div>

                {/* Layout Grid Column Span & Aspect Ratio */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                      Grid Column Width (Bento Layout)
                    </label>
                    <select
                      value={formData.colSpan || 'md:col-span-7'}
                      onChange={(e) => setFormData({ ...formData, colSpan: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#181818] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
                    >
                      <option value="md:col-span-7">Wide (7 of 12 columns)</option>
                      <option value="md:col-span-5">Medium (5 of 12 columns)</option>
                      <option value="md:col-span-12">Full Width (12 of 12 columns)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                      Aspect Ratio
                    </label>
                    <select
                      value={formData.aspectRatio || 'aspect-[16/10]'}
                      onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#181818] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
                    >
                      <option value="aspect-[16/10]">16:10 (Landscape)</option>
                      <option value="aspect-[4/3]">4:3 (Classic)</option>
                      <option value="aspect-square">1:1 (Square)</option>
                      <option value="aspect-[16/9]">16:9 (Cinema)</option>
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Brand Strategy, Visual Identity, Systems"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#89AACC]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                    Case Study Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Overview of the project..."
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#89AACC]"
                  />
                </div>

                {/* Challenge & Solution */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                      The Challenge
                    </label>
                    <textarea
                      rows={3}
                      value={formData.challenge}
                      onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                      placeholder="What problem were you solving?"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#89AACC]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                      The Solution
                    </label>
                    <textarea
                      rows={3}
                      value={formData.solution}
                      onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                      placeholder="How did your design or automation solve it?"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#89AACC]"
                    />
                  </div>
                </div>

                {/* Deliverables (Newline separated) */}
                <div>
                  <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                    Deliverables (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={deliverablesInput}
                    onChange={(e) => setDeliverablesInput(e.target.value)}
                    placeholder="Logo Architecture&#10;Brand Guidelines&#10;Packaging"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#89AACC]"
                  />
                </div>

                {/* Year, Client, Metrics, Link */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                      Year
                    </label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                      Client
                    </label>
                    <input
                      type="text"
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      placeholder="e.g. Aura Luxury Group"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                      Key Metric
                    </label>
                    <input
                      type="text"
                      value={formData.metrics || ''}
                      onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
                      placeholder="+180% Recognition"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                      External Link
                    </label>
                    <input
                      type="text"
                      value={formData.link || ''}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#161616]">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingProject(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProject}
                  className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-[#89AACC] hover:text-white transition-colors shadow-lg"
                >
                  {isCreating ? 'Create Project' : 'Save Project Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={!!mediaPickerTarget}
        onClose={() => setMediaPickerTarget(null)}
        onSelect={handleMediaSelect}
        title="Select Project Image"
        acceptTypes="image"
      />
    </div>
  );
};
