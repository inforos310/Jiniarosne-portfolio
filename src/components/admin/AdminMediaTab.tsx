import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  Image as ImageIcon,
  Video,
  Trash2,
  Copy,
  Check,
  Search,
  ExternalLink,
  Loader2,
  FolderOpen,
  Eye,
  X,
  Cloud,
  HardDrive,
  Settings,
  RefreshCw,
  Sparkles,
  Layers,
  FileCheck,
  AlertCircle,
  Play,
  Filter,
  ArrowUpDown,
  Tag,
  CheckCircle2,
  FileCode,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { MediaItem } from '../../types';

interface SupabaseConfigState {
  url: string;
  bucket: string;
  isEnabled: boolean;
  hasAnonKey: boolean;
  hasServiceRoleKey: boolean;
  maskedAnonKey: string;
  maskedServiceRoleKey: string;
}

export const AdminMediaTab: React.FC = () => {
  const { adminToken, draftData, updateHeroDraft, updateProjectsDraft, updateArticlesDraft } = usePortfolio();
  
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ total: number; current: number } | null>(null);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video' | 'supabase' | 'local'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'size' | 'name'>('newest');
  
  // Storage settings state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [storageConfig, setStorageConfig] = useState<SupabaseConfigState | null>(null);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(false);
  const [activeBucket, setActiveBucket] = useState<string>('portfolio-media');
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Settings form
  const [formUrl, setFormUrl] = useState('');
  const [formAnonKey, setFormAnonKey] = useState('');
  const [formServiceKey, setFormServiceKey] = useState('');
  const [formBucket, setFormBucket] = useState('portfolio-media');
  const [formEnabled, setFormEnabled] = useState(true);
  const [testStatus, setTestStatus] = useState<{ loading: boolean; message?: string; success?: boolean } | null>(null);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Drag & drop state
  const [isDragging, setIsDragging] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Fetch Media and Storage config
  const fetchMedia = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const res = await fetch('/api/media', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const json = await res.json();
      if (json.success && json.media) {
        setMedia(json.media);
        setSupabaseConnected(Boolean(json.supabaseConnected));
        if (json.activeBucket) setActiveBucket(json.activeBucket);
      }
    } catch (e) {
      console.error('Failed to fetch media:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchStorageConfig = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/media/config', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const json = await res.json();
      if (json.success && json.config) {
        setStorageConfig(json.config);
        setFormUrl(json.config.url || '');
        setFormBucket(json.config.bucket || 'portfolio-media');
        setFormEnabled(json.config.isEnabled);
        setSupabaseConnected(Boolean(json.config.isEnabled && json.config.url));
      }
    } catch (e) {
      console.error('Failed to fetch storage config:', e);
    }
  };

  useEffect(() => {
    fetchMedia();
    fetchStorageConfig();
  }, [adminToken]);

  // Handle Multi-file Upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !adminToken) return;
    setUploading(true);
    setUploadProgress({ total: files.length, current: 0 });

    const newUploaded: MediaItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress({ total: files.length, current: i + 1 });

      const fileData = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      try {
        const isVideo = file.type.startsWith('video') || file.name.endsWith('.mp4') || file.name.endsWith('.webm') || file.name.endsWith('.mov');
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
          newUploaded.push(json.media);
        }
      } catch (err) {
        console.error(`Upload failed for file ${file.name}:`, err);
      }
    }

    if (newUploaded.length > 0) {
      setMedia((prev) => [...newUploaded, ...prev]);
    }

    setUploading(false);
    setUploadProgress(null);
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Delete Media
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to permanently delete this media file?')) return;
    if (!adminToken) return;

    try {
      const res = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const json = await res.json();
      if (json.success) {
        setMedia((prev) => prev.filter((m) => m.id !== id));
        if (previewItem?.id === id) setPreviewItem(null);
      }
    } catch (e) {
      console.error('Failed to delete media:', e);
    }
  };

  // Copy Direct Link
  const handleCopyUrl = (url: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const finalUrl = url.startsWith('http') ? url : window.location.origin + url;
    navigator.clipboard.writeText(finalUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Test Supabase Connection
  const handleTestConnection = async () => {
    if (!adminToken) return;
    setTestStatus({ loading: true });
    try {
      const res = await fetch('/api/media/test-supabase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          url: formUrl,
          anonKey: formAnonKey,
          serviceRoleKey: formServiceKey,
          bucket: formBucket,
        }),
      });
      const json = await res.json();
      setTestStatus({
        loading: false,
        success: json.success,
        message: json.message,
      });
    } catch (e: any) {
      setTestStatus({
        loading: false,
        success: false,
        message: e.message || 'Connection test failed',
      });
    }
  };

  // Save Storage Config
  const handleSaveStorageConfig = async () => {
    if (!adminToken) return;
    setIsSavingConfig(true);
    try {
      const res = await fetch('/api/media/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          url: formUrl,
          anonKey: formAnonKey || undefined,
          serviceRoleKey: formServiceKey || undefined,
          bucket: formBucket,
          isEnabled: formEnabled,
        }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchStorageConfig();
        await fetchMedia();
        setIsSettingsOpen(false);
      }
    } catch (e) {
      console.error('Failed to save config:', e);
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Sync local files to Supabase
  const handleSyncToSupabase = async () => {
    if (!adminToken) return;
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch('/api/media/sync-to-supabase', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const json = await res.json();
      if (json.success) {
        setSyncMessage(json.message);
        await fetchMedia();
      } else {
        setSyncMessage(json.error || 'Sync failed');
      }
    } catch (e: any) {
      setSyncMessage(`Sync error: ${e.message}`);
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  // Quick Assignment to Hero
  const handleAssignToHero = (item: MediaItem) => {
    updateHeroDraft({ videoUrl: item.fileUrl });
    alert(`Assigned "${item.originalName}" as the Hero Video Reel in drafts! Remember to publish changes.`);
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Filter & Sorting
  const filteredMedia = media
    .filter((m) => {
      if (typeFilter === 'image' && m.fileType !== 'image') return false;
      if (typeFilter === 'video' && m.fileType !== 'video') return false;
      if (typeFilter === 'supabase' && m.storageProvider !== 'supabase') return false;
      if (typeFilter === 'local' && m.storageProvider === 'supabase') return false;

      if (search.trim()) {
        const query = search.toLowerCase();
        return (
          m.fileName.toLowerCase().includes(query) ||
          m.originalName.toLowerCase().includes(query) ||
          (m.caption && m.caption.toLowerCase().includes(query)) ||
          (m.bucketName && m.bucketName.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'size') return b.fileSize - a.fileSize;
      if (sortBy === 'name') return a.originalName.localeCompare(b.originalName);
      return 0;
    });

  const totalStorageBytes = media.reduce((acc, curr) => acc + (curr.fileSize || 0), 0);
  const supabaseMediaCount = media.filter((m) => m.storageProvider === 'supabase').length;
  const localMediaCount = media.length - supabaseMediaCount;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner: Storage Status & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Supabase Status Card */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-[#141414] border border-white/10 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${supabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  {supabaseConnected ? 'Supabase Storage Connected' : 'Local Disk Storage (Fallback)'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/10 text-white/70">
                  Bucket: {activeBucket}
                </span>
              </div>
              <p className="text-xs text-white/50 max-w-xl">
                {supabaseConnected
                  ? 'Assets are uploaded directly to Supabase Storage with high-speed CDN delivery. Changes are instantly synchronized across your portfolio.'
                  : 'Currently storing media files to local persistent storage. Connect your Supabase credentials to unlock global high-speed CDN hosting.'}
              </p>
            </div>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white text-xs font-medium transition-all flex items-center gap-2 shrink-0"
              title="Storage Settings"
            >
              <Settings size={14} />
              <span>Configure Storage</span>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-6 font-mono text-white/60">
              <span>Total Assets: <strong className="text-white">{media.length}</strong></span>
              <span>Supabase Cloud: <strong className="text-emerald-400">{supabaseMediaCount}</strong></span>
              <span>Local: <strong className="text-white/80">{localMediaCount}</strong></span>
              <span>Total Size: <strong className="text-white">{formatBytes(totalStorageBytes)}</strong></span>
            </div>

            {supabaseConnected && localMediaCount > 0 && (
              <button
                onClick={handleSyncToSupabase}
                disabled={syncing}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                {syncing ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                <span>Sync {localMediaCount} Local Files to Supabase</span>
              </button>
            )}
          </div>

          {syncMessage && (
            <div className="mt-2 text-xs text-emerald-400 bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/20">
              {syncMessage}
            </div>
          )}
        </div>

        {/* Quick Upload Card */}
        <div
          ref={dropRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-center text-center relative ${
            isDragging
              ? 'border-[#89AACC] bg-[#89AACC]/10 scale-[1.01]'
              : 'border-dashed border-white/15 bg-[#141414] hover:border-white/30'
          }`}
        >
          <input
            type="file"
            id="main-media-upload-input"
            multiple
            accept="image/*,video/*"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />

          <label
            htmlFor="main-media-upload-input"
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer space-y-2 py-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-1 group-hover:scale-110 transition-transform">
              {uploading ? <Loader2 size={22} className="animate-spin text-[#89AACC]" /> : <Upload size={22} />}
            </div>
            
            <div className="text-sm font-semibold text-white">
              {uploading ? `Uploading (${uploadProgress?.current}/${uploadProgress?.total})...` : 'Upload Images & Videos'}
            </div>
            <p className="text-[11px] text-white/40 max-w-[200px]">
              Drag & drop files here, or click to browse (supports PNG, JPG, WEBP, MP4, MOV)
            </p>
          </label>
        </div>
      </div>

      {/* Filter, Search & Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl bg-[#141414] border border-white/10">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets by filename, caption or tag..."
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#89AACC]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Files' },
            { id: 'image', label: 'Images' },
            { id: 'video', label: 'Videos' },
            { id: 'supabase', label: 'Supabase Cloud' },
            { id: 'local', label: 'Local Disk' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setTypeFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                typeFilter === f.id
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <ArrowUpDown size={14} className="text-white/40" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            aria-label="Sort media assets by"
            className="bg-white/5 border border-white/10 rounded-xl text-xs text-white px-3 py-1.5 focus:outline-none focus:border-[#89AACC]"
          >
            <option value="newest" className="bg-[#141414]">Newest First</option>
            <option value="oldest" className="bg-[#141414]">Oldest First</option>
            <option value="size" className="bg-[#141414]">File Size</option>
            <option value="name" className="bg-[#141414]">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-24 text-center text-white/40 flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-[#89AACC]" />
          <span className="text-xs font-mono">Loading media assets from database...</span>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="py-24 text-center text-white/40 flex flex-col items-center gap-4 p-8 border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
          <FolderOpen size={44} className="opacity-30 text-[#89AACC]" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-white">No media files match your filter</h4>
            <p className="text-xs text-white/40 max-w-sm">
              Upload high-resolution photography, branding mockups, or video reels to populate your portfolio's media cloud.
            </p>
          </div>
          <label
            htmlFor="main-media-upload-input"
            className="px-5 py-2.5 bg-white text-black font-semibold rounded-2xl text-xs hover:bg-[#89AACC] hover:text-white cursor-pointer transition-colors shadow-lg"
          >
            Upload Media Now
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((item) => {
            const isSupabase = item.storageProvider === 'supabase';
            const isVideo = item.fileType === 'video';

            return (
              <div
                key={item.id}
                onClick={() => setPreviewItem(item)}
                className="group relative rounded-2xl bg-[#141414] border border-white/10 hover:border-white/30 overflow-hidden transition-all flex flex-col cursor-pointer shadow-lg hover:shadow-xl"
              >
                {/* Thumbnail */}
                <div className="aspect-[4/3] bg-black/60 relative overflow-hidden flex items-center justify-center">
                  {isVideo ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black relative">
                      <video
                        src={item.fileUrl}
                        preload="metadata"
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl">
                          <Play size={16} className="ml-0.5 text-[#89AACC]" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.fileUrl}
                      alt={item.originalName}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-semibold uppercase flex items-center gap-1 backdrop-blur-md ${
                        isSupabase
                          ? 'bg-emerald-500/80 text-white'
                          : 'bg-zinc-800/90 text-white/80 border border-white/10'
                      }`}
                    >
                      {isSupabase ? <Cloud size={10} /> : <HardDrive size={10} />}
                      <span>{isSupabase ? 'Supabase' : 'Local'}</span>
                    </span>

                    {isVideo && (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono font-semibold uppercase bg-black/80 text-[#89AACC] border border-white/10">
                        VIDEO
                      </span>
                    )}
                  </div>

                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 z-20">
                    <button
                      onClick={(e) => handleCopyUrl(item.fileUrl, item.id, e)}
                      className="p-2.5 rounded-xl bg-white/20 hover:bg-white text-white hover:text-black transition-colors"
                      title="Copy Public URL"
                    >
                      {copiedId === item.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewItem(item);
                      }}
                      className="p-2.5 rounded-xl bg-white/20 hover:bg-white text-white hover:text-black transition-colors"
                      title="Preview Media"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500 text-white transition-colors"
                      title="Delete Media"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Info Footer */}
                <div className="p-3 border-t border-white/5 space-y-1 bg-[#121212]">
                  <div className="text-xs text-white font-medium truncate" title={item.originalName}>
                    {item.originalName}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-white/40 font-mono">
                    <span>{formatBytes(item.fileSize)}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox / Video Player Modal */}
      <AnimatePresence>
        {previewItem && (
          <div className="fixed inset-0 z-[9995] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewItem(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl w-full bg-[#121212] border border-white/15 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#161616]">
                <div className="flex items-center gap-3 truncate">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 ${
                      previewItem.storageProvider === 'supabase'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-zinc-800 text-white/80 border border-white/10'
                    }`}
                  >
                    {previewItem.storageProvider === 'supabase' ? <Cloud size={12} /> : <HardDrive size={12} />}
                    <span>{previewItem.storageProvider === 'supabase' ? 'Supabase Storage' : 'Local Storage'}</span>
                  </span>
                  <h4 className="text-sm font-medium text-white truncate">{previewItem.originalName}</h4>
                </div>

                <button
                  onClick={() => setPreviewItem(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Media Display Area */}
              <div className="p-6 flex items-center justify-center bg-black/60 max-h-[65vh] overflow-hidden">
                {previewItem.fileType === 'video' ? (
                  <video
                    src={previewItem.fileUrl}
                    controls
                    autoPlay
                    className="max-h-[55vh] max-w-full rounded-2xl shadow-2xl"
                  />
                ) : (
                  <img
                    src={previewItem.fileUrl}
                    alt={previewItem.originalName}
                    className="max-h-[55vh] max-w-full object-contain rounded-2xl shadow-2xl"
                  />
                )}
              </div>

              {/* Action Bar */}
              <div className="p-4 border-t border-white/10 bg-[#161616] flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-white/50 font-mono truncate max-w-md">
                  {previewItem.fileUrl}
                </div>

                <div className="flex items-center gap-2">
                  {previewItem.fileType === 'video' && (
                    <button
                      onClick={() => handleAssignToHero(previewItem)}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles size={14} />
                      <span>Set as Hero Video Reel</span>
                    </button>
                  )}

                  <button
                    onClick={(e) => handleCopyUrl(previewItem.fileUrl, previewItem.id, e)}
                    className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-[#89AACC] hover:text-white transition-colors flex items-center gap-1.5 shadow-md"
                  >
                    {copiedId === previewItem.id ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedId === previewItem.id ? 'Copied Link!' : 'Copy Direct URL'}</span>
                  </button>

                  <a
                    href={previewItem.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Supabase Storage Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[9996] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-lg w-full bg-[#121212] border border-white/15 rounded-3xl overflow-hidden shadow-2xl z-10 p-6 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Cloud size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Supabase Storage Configuration</h3>
                    <p className="text-xs text-white/40">Connect your Supabase project bucket for media hosting</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-white/70 font-medium mb-1">Supabase Project URL</label>
                  <input
                    type="text"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="https://xyzproject.supabase.co"
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono placeholder-white/20 focus:outline-none focus:border-[#89AACC]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-medium mb-1">
                    Supabase Public Anon Key {storageConfig?.hasAnonKey && <span className="text-emerald-400 text-[10px]">(Configured)</span>}
                  </label>
                  <input
                    type="password"
                    value={formAnonKey}
                    onChange={(e) => setFormAnonKey(e.target.value)}
                    placeholder={storageConfig?.maskedAnonKey ? `Existing: ${storageConfig.maskedAnonKey}` : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'}
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono placeholder-white/20 focus:outline-none focus:border-[#89AACC]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-medium mb-1">
                    Service Role Key (Optional - for auto-bucket creation)
                  </label>
                  <input
                    type="password"
                    value={formServiceKey}
                    onChange={(e) => setFormServiceKey(e.target.value)}
                    placeholder={storageConfig?.maskedServiceRoleKey ? `Existing: ${storageConfig.maskedServiceRoleKey}` : 'Optional service role key for admin operations'}
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono placeholder-white/20 focus:outline-none focus:border-[#89AACC]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-medium mb-1">Storage Bucket Name</label>
                  <input
                    type="text"
                    value={formBucket}
                    onChange={(e) => setFormBucket(e.target.value)}
                    placeholder="portfolio-media"
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono placeholder-white/20 focus:outline-none focus:border-[#89AACC]"
                  />
                  <span className="text-[10px] text-white/40 mt-1 block">
                    Default is <code className="text-white/60">portfolio-media</code>. The bucket will be automatically verified or created as public.
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="enable-supabase-check"
                    checked={formEnabled}
                    onChange={(e) => setFormEnabled(e.target.checked)}
                    className="w-4 h-4 rounded bg-white/10 border-white/20 text-[#89AACC]"
                  />
                  <label htmlFor="enable-supabase-check" className="text-white cursor-pointer select-none">
                    Enable Supabase Storage for upcoming uploads
                  </label>
                </div>

                {/* Test Connection Output */}
                {testStatus && (
                  <div
                    className={`p-3 rounded-xl border flex items-start gap-2 ${
                      testStatus.success
                        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                        : 'bg-red-950/40 border-red-500/30 text-red-300'
                    }`}
                  >
                    {testStatus.success ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
                    <span className="text-xs">{testStatus.message}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={handleTestConnection}
                  disabled={testStatus?.loading}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  {testStatus?.loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                  <span>Test Connection</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveStorageConfig}
                    disabled={isSavingConfig}
                    className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-[#89AACC] hover:text-white transition-colors flex items-center gap-1.5 shadow-lg"
                  >
                    {isSavingConfig ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                    <span>Save Configuration</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
