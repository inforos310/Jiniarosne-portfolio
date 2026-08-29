import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  BookOpen,
  Calendar,
  Clock,
  Tag,
  X,
  PlusCircle,
  MinusCircle,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { JournalArticle } from '../../types';
import { MediaPickerModal } from './MediaPickerModal';

export const AdminJournalTab: React.FC = () => {
  const { draftData, updateArticlesDraft } = usePortfolio();
  const articles = draftData.articles || [];

  const [editingArticle, setEditingArticle] = useState<JournalArticle | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<JournalArticle>({
    id: '',
    title: '',
    slug: '',
    readTime: '4 min read',
    date: 'Aug 2026',
    category: 'Design Philosophy',
    summary: '',
    image: '',
    content: [],
    published: true,
  });

  const [contentParagraphs, setContentParagraphs] = useState<string[]>(['']);

  const handleOpenCreate = () => {
    const newId = `journal-${Date.now()}`;
    setFormData({
      id: newId,
      title: '',
      slug: '',
      readTime: '4 min read',
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      category: 'Design Philosophy',
      summary: '',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
      content: [],
      published: true,
    });
    setContentParagraphs(['']);
    setIsCreating(true);
    setEditingArticle(null);
  };

  const handleOpenEdit = (article: JournalArticle) => {
    setEditingArticle(article);
    setFormData({ ...article });
    setContentParagraphs(article.content && article.content.length > 0 ? [...article.content] : ['']);
    setIsCreating(false);
  };

  const handleSaveArticle = () => {
    if (!formData.title.trim()) {
      alert('Please enter an article title.');
      return;
    }

    const slug =
      formData.slug.trim() ||
      formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const filteredParagraphs = contentParagraphs.map((p) => p.trim()).filter(Boolean);

    const completeArticle: JournalArticle = {
      ...formData,
      slug,
      content: filteredParagraphs.length > 0 ? filteredParagraphs : [formData.summary],
    };

    if (isCreating) {
      updateArticlesDraft([completeArticle, ...articles]);
    } else {
      updateArticlesDraft(
        articles.map((a) => (a.id === completeArticle.id ? completeArticle : a))
      );
    }

    setEditingArticle(null);
    setIsCreating(false);
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm('Are you sure you want to delete this journal article?')) {
      updateArticlesDraft(articles.filter((a) => a.id !== id));
    }
  };

  const handleAddParagraph = () => {
    setContentParagraphs([...contentParagraphs, '']);
  };

  const handleRemoveParagraph = (index: number) => {
    if (contentParagraphs.length === 1) return;
    setContentParagraphs(contentParagraphs.filter((_, i) => i !== index));
  };

  const handleParagraphChange = (index: number, val: string) => {
    const updated = [...contentParagraphs];
    updated[index] = val;
    setContentParagraphs(updated);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#141414] border border-white/10">
        <div>
          <h2 className="text-xl font-display italic text-white">Journal Articles CMS</h2>
          <p className="text-xs text-white/40 mt-1">
            Write, edit, and publish design philosophy essays and automation thought pieces.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-2xl bg-white text-black font-semibold text-xs hover:bg-[#89AACC] hover:text-white transition-all flex items-center gap-2 shadow-lg"
        >
          <Plus size={15} />
          <span>New Article</span>
        </button>
      </div>

      {/* Articles List */}
      <div className="space-y-3">
        {articles.map((art, idx) => (
          <div
            key={art.id}
            className="group flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#141414] border border-white/5 hover:border-white/15 transition-all gap-4"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Cover thumbnail */}
              <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0 relative">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">
                    {art.category}
                  </span>
                  <span className="text-[10px] text-white/30 font-mono">• {art.date}</span>
                  <span className="text-[10px] text-white/30 font-mono">• {art.readTime}</span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                  {art.title}
                </h3>
                <p className="text-xs text-white/40 truncate mt-0.5">{art.summary}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() => handleOpenEdit(art)}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Edit2 size={13} />
                <span>Edit Article</span>
              </button>
              <button
                onClick={() => handleDeleteArticle(art.id)}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                title="Delete article"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {(isCreating || editingArticle) && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsCreating(false);
                setEditingArticle(null);
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
                  {isCreating ? 'Write New Journal Article' : `Edit Article: ${formData.title}`}
                </h3>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingArticle(null);
                  }}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. The Future of Brand Identity in the Age of Autonomous AI"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#89AACC]"
                  />
                </div>

                {/* Category, Date, ReadTime */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Design Philosophy"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                      Publication Date
                    </label>
                    <input
                      type="text"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      placeholder="Aug 2026"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                      Estimated Read Time
                    </label>
                    <input
                      type="text"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      placeholder="4 min read"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#89AACC]"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <label className="text-[11px] font-mono uppercase text-white/50 block mb-1.5">
                    Summary / Deck (Appears on card preview)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Short executive takeaway..."
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#89AACC]"
                  />
                </div>

                {/* Cover Image & Media Picker */}
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
                      onClick={() => setIsMediaPickerOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center gap-1.5 transition-colors flex-shrink-0"
                    >
                      <ImageIcon size={14} className="text-indigo-400" />
                      <span>Choose Media</span>
                    </button>
                  </div>
                  {formData.image && (
                    <div className="mt-2 w-32 h-20 rounded-xl overflow-hidden border border-white/10">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Paragraphs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono uppercase text-white/50">
                      Article Content Paragraphs ({contentParagraphs.length})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddParagraph}
                      className="text-xs text-[#89AACC] hover:underline flex items-center gap-1 font-mono"
                    >
                      <PlusCircle size={13} />
                      <span>Add Paragraph</span>
                    </button>
                  </div>

                  {contentParagraphs.map((para, pIdx) => (
                    <div key={pIdx} className="flex gap-2 items-start">
                      <span className="text-[10px] font-mono text-white/30 pt-3 w-5 flex-shrink-0">
                        P{pIdx + 1}
                      </span>
                      <textarea
                        rows={3}
                        value={para}
                        onChange={(e) => handleParagraphChange(pIdx, e.target.value)}
                        placeholder={`Write paragraph ${pIdx + 1}...`}
                        className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#89AACC]"
                      />
                      {contentParagraphs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveParagraph(pIdx)}
                          className="p-2 text-white/30 hover:text-red-400 pt-3"
                          title="Remove paragraph"
                        >
                          <MinusCircle size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#161616]">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingArticle(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveArticle}
                  className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-[#89AACC] hover:text-white transition-colors shadow-lg"
                >
                  {isCreating ? 'Publish Article' : 'Save Article Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Media Picker */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(url) => {
          setFormData((prev) => ({ ...prev, image: url }));
          setIsMediaPickerOpen(false);
        }}
        title="Select Journal Cover Image"
        acceptTypes="image"
      />
    </div>
  );
};
