import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  Check,
  Image as ImageIcon,
  Video,
  Trash2,
  Link as LinkIcon,
  Search,
  Loader2,
  Cloud,
  HardDrive,
  Eye,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { MediaItem } from '../../types';
import { usePortfolio } from '../../context/PortfolioContext';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, mediaItem?: MediaItem) => void;
  title?: string;
  acceptTypes?: 'image' | 'video' | 'all';
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media Asset',
  acceptTypes = 'all',
}) => {
  const { adminToken } = usePortfolio();
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [selectedUrl, setSelectedUrl] = useState('');
  const [tab, setTab] = useState<'library' | 'upload' | 'url'>('library');
  const [isSupabaseActive, setIsSupabaseActive] = useState(false);

  // Fetch media assets
  const fetchMedia = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const res = await fetch('/api/media', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const json = await res.json();
      if (json.success && json.media) {
        setMediaList(json.media);
        setIsSupabaseActive(Boolean(json.supabaseConnected));
      }
    } catch (e) {
      console.error('Failed to fetch media library:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      setSelectedItem(null);
      setSelectedUrl('');
      setCustomUrl('');
    }
  }, [isOpen, adminToken]);

  // Handle direct file upload from within the picker
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !adminToken) return;
    const file = files[0];
    setUploading(true);

    try {
      const fileData = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      const isVideo = file.type.startsWith('video') || file.name.endsWith('.mp4') || file.name.endsWith('.webm');
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          fileName: file.name,
          fileData,
          fileType: isVideo ? 'video' : 'image',
          mimeType: file.type || (isVideo ? 'video/mp4' : 'image/png'),
        }),
      });

      const json = await res.json();
      if (json.success && json.media) {
        setMediaList((prev) => [json.media, ...prev]);
        setSelectedItem(json.media);
        setSelectedUrl(json.media.fileUrl);
        setTab('library');
      }
    } catch (err) {
      console.error('Picker upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const filteredMedia = mediaList.filter((m) => {
    if (acceptTypes === 'image' && m.fileType !== 'image') return false;
    if (acceptTypes === 'video' && m.fileType !== 'video') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        m.fileName.toLowerCase().includes(q) ||
        m.originalName.toLowerCase().includes(q) ||
        (m.caption && m.caption.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleConfirm = () => {
    if (tab === 'url') {
      if (customUrl.trim()) {
        onSelect(customUrl.trim());
        onClose();
      }
    } else {
      if (selectedUrl) {
        onSelect(selectedUrl, selectedItem || undefined);
        onClose();
      }
    }
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative max-w-4xl w-full bg-[#121212] border border-white/15 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[88vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#161616]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#89AACC]/10 border border-[#89AACC]/20 flex items-center justify-center text-[#89AACC]">
              {acceptTypes === 'video' ? <Video size={16} /> : <ImageIcon size={16} />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="text-[11px] text-white/40">
                {isSupabaseActive
                  ? 'Connected to Supabase Storage Bucket'
                  : 'Local Media Storage'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-white/5 bg-[#141414]">
          <button
            onClick={() => setTab('library')}
            className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
              tab === 'library'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Media Library ({filteredMedia.length})
          </button>
          <button
            onClick={() => setTab('upload')}
            className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              tab === 'upload'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Upload size={13} />
            <span>Upload New to Supabase</span>
          </button>
          <button
            onClick={() => setTab('url')}
            className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              tab === 'url'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <LinkIcon size={13} />
            <span>Custom URL</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {tab === 'library' && (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search assets..."
                  className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#89AACC]"
                />
              </div>

              {loading ? (
                <div className="py-16 text-center text-white/40 flex flex-col items-center gap-2">
                  <Loader2 size={24} className="animate-spin text-[#89AACC]" />
                  <span className="text-xs">Loading media assets...</span>
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="py-16 text-center text-white/40 flex flex-col items-center gap-3 border border-dashed border-white/10 rounded-2xl">
                  <ImageIcon size={32} className="opacity-30" />
                  <p className="text-xs">No matching media files found.</p>
                  <button
                    onClick={() => setTab('upload')}
                    className="px-3.5 py-1.5 bg-white/10 hover:bg-white/15 text-white text-xs rounded-xl transition-colors"
                  >
                    Upload an asset
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredMedia.map((item) => {
                    const isSelected = selectedUrl === item.fileUrl;
                    const isSupabase = item.storageProvider === 'supabase';

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedUrl(item.fileUrl);
                          setSelectedItem(item);
                        }}
                        className={`group relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-[#141414] ${
                          isSelected
                            ? 'border-[#89AACC] shadow-lg shadow-[#89AACC]/20 ring-2 ring-[#89AACC]/30'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="aspect-[4/3] bg-black/60 relative flex items-center justify-center overflow-hidden">
                          {item.fileType === 'video' ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-[#89AACC] bg-zinc-900">
                              <Video size={24} />
                              <span className="text-[9px] font-mono mt-1 opacity-70">VIDEO</span>
                            </div>
                          ) : (
                            <img
                              src={item.fileUrl}
                              alt={item.originalName}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}

                          {/* Top Provider Badge */}
                          <div className="absolute top-1.5 left-1.5">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-semibold uppercase flex items-center gap-1 ${
                                isSupabase ? 'bg-emerald-500/90 text-white' : 'bg-black/70 text-white/80'
                              }`}
                            >
                              {isSupabase ? <Cloud size={8} /> : <HardDrive size={8} />}
                              <span>{isSupabase ? 'Supabase' : 'Local'}</span>
                            </span>
                          </div>

                          {/* Selected Checkmark */}
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#89AACC] text-white flex items-center justify-center shadow-lg">
                              <Check size={12} strokeWidth={3} />
                            </div>
                          )}
                        </div>

                        {/* Title & Size */}
                        <div className="p-2 border-t border-white/5 bg-[#121212]">
                          <div className="text-[11px] text-white font-medium truncate" title={item.originalName}>
                            {item.originalName}
                          </div>
                          <div className="text-[9px] text-white/40 font-mono">
                            {formatBytes(item.fileSize)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {tab === 'upload' && (
            <div className="py-8 flex flex-col items-center justify-center border-2 border-dashed border-white/15 rounded-3xl p-8 bg-white/[0.01]">
              <input
                type="file"
                id="picker-direct-upload"
                accept={acceptTypes === 'video' ? 'video/*' : acceptTypes === 'image' ? 'image/*' : 'image/*,video/*'}
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />

              <label
                htmlFor="picker-direct-upload"
                className="flex flex-col items-center justify-center cursor-pointer text-center space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#89AACC]">
                  {uploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-white">
                    {uploading ? 'Uploading to Supabase Storage...' : 'Click to Upload Asset'}
                  </h4>
                  <p className="text-xs text-white/40 max-w-xs">
                    File will be uploaded to Supabase Storage and automatically selected.
                  </p>
                </div>

                <span className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-[#89AACC] hover:text-white transition-colors shadow-md">
                  Browse File
                </span>
              </label>
            </div>
          )}

          {tab === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">Direct Asset or Stream URL</label>
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or https://stream.mux.com/..."
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white font-mono placeholder-white/20 focus:outline-none focus:border-[#89AACC]"
                />
              </div>

              {/* Preview if customUrl exists */}
              {customUrl.trim() && (
                <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-white/40 uppercase">URL Preview</span>
                  <div className="max-h-48 rounded-xl overflow-hidden bg-black/60 flex items-center justify-center">
                    {customUrl.includes('.mp4') || customUrl.includes('.m3u8') ? (
                      <video src={customUrl} controls className="max-h-44 max-w-full" />
                    ) : (
                      <img src={customUrl} alt="Preview" className="max-h-44 max-w-full object-contain" />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#161616] flex items-center justify-between">
          <div className="text-xs text-white/50 truncate max-w-xs font-mono">
            {tab === 'url' ? customUrl || 'No custom URL specified' : selectedUrl || 'No asset selected'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={tab === 'url' ? !customUrl.trim() : !selectedUrl}
              className={`px-5 py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 shadow-lg ${
                (tab === 'url' ? customUrl.trim() : selectedUrl)
                  ? 'bg-white text-black hover:bg-[#89AACC] hover:text-white cursor-pointer'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              <Check size={14} />
              <span>Confirm Selection</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
