import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { db, UPLOADS_DIR, MediaItem } from './server/db';
import {
  getActiveSupabaseConfig,
  getSupabaseClient,
  uploadFileToSupabase,
  deleteFileFromSupabase,
  testSupabaseConnection,
} from './server/supabase';

const app = express();
const PORT = 3000;

// Middleware for parsing large JSON payloads and uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads serving
app.use('/uploads', express.static(UPLOADS_DIR));

// Admin authentication middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required.' });
  }
  const token = authHeader.replace('Bearer ', '').trim();
  if (!db.verifyToken(token)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired admin token.' });
  }
  next();
}

// ----------------------------------------------------
// PUBLIC PORTFOLIO API (Single Source of Truth)
// ----------------------------------------------------
app.get('/api/portfolio', (req: Request, res: Response) => {
  try {
    const published = db.getPublished();
    res.json({
      success: true,
      data: published,
      publishedAt: published.publishedAt,
      version: published.version,
    });
  } catch (error: any) {
    console.error('Error fetching published portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio data' });
  }
});

// ----------------------------------------------------
// ADMIN AUTHENTICATION
// ----------------------------------------------------
app.post('/api/admin/login', (req: Request, res: Response) => {
  try {
    const { pin } = req.body;
    const result = db.verifyPin(pin);
    if (result.valid) {
      return res.json({
        success: true,
        token: result.token,
        message: 'Admin authenticated successfully',
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Invalid admin passcode. Default is 2026.',
    });
  } catch (error: any) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.json({ authenticated: false });
  }
  const token = authHeader.replace('Bearer ', '').trim();
  const isValid = db.verifyToken(token);
  return res.json({ authenticated: isValid });
});

app.post('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  try {
    const { oldPin, newPin } = req.body;
    const result = db.updateAdminPin(oldPin, newPin);
    if (result.success) {
      return res.json({ success: true, message: 'Admin PIN updated successfully' });
    }
    return res.status(400).json({ success: false, error: result.error });
  } catch (error: any) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// ----------------------------------------------------
// ADMIN CMS DRAFT & PUBLISH SYSTEM
// ----------------------------------------------------
app.get('/api/portfolio/draft', requireAdmin, (req: Request, res: Response) => {
  try {
    const draft = db.getDraft();
    res.json({
      success: true,
      data: draft,
      savedAt: draft.savedAt,
      isModified: draft.isModified,
    });
  } catch (error: any) {
    console.error('Error fetching draft portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch draft data' });
  }
});

app.post('/api/portfolio/draft', requireAdmin, (req: Request, res: Response) => {
  try {
    const draftData = req.body;
    const updated = db.saveDraft(draftData);
    res.json({
      success: true,
      message: 'Draft saved permanently to database',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error saving draft:', error);
    res.status(500).json({ error: 'Failed to save draft' });
  }
});

app.post('/api/portfolio/publish', requireAdmin, (req: Request, res: Response) => {
  try {
    const { note, draftOverride } = req.body;
    if (draftOverride) {
      db.saveDraft(draftOverride);
    }
    const published = db.publishDraft(note);
    res.json({
      success: true,
      message: 'Changes published successfully to live website!',
      data: published,
      version: published.version,
      publishedAt: published.publishedAt,
    });
  } catch (error: any) {
    console.error('Error publishing portfolio:', error);
    res.status(500).json({ error: 'Failed to publish portfolio changes' });
  }
});

app.get('/api/portfolio/history', requireAdmin, (req: Request, res: Response) => {
  try {
    const history = db.getVersionHistory();
    res.json({ success: true, history });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch version history' });
  }
});

app.post('/api/portfolio/rollback', requireAdmin, (req: Request, res: Response) => {
  try {
    const { version } = req.body;
    const updated = db.rollbackToVersion(Number(version));
    if (!updated) {
      return res.status(404).json({ error: 'Version not found' });
    }
    res.json({
      success: true,
      message: `Rolled back to version ${version}`,
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to rollback version' });
  }
});

app.post('/api/portfolio/reset', requireAdmin, (req: Request, res: Response) => {
  try {
    const published = db.resetToDefault();
    res.json({
      success: true,
      message: 'Portfolio reset to default state',
      data: published,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to reset portfolio' });
  }
});

// ----------------------------------------------------
// MEDIA LIBRARY & SUPABASE STORAGE INTEGRATION
// ----------------------------------------------------
app.get('/api/media', requireAdmin, (req: Request, res: Response) => {
  try {
    const media = db.getMedia();
    const config = getActiveSupabaseConfig();
    res.json({
      success: true,
      media,
      supabaseConnected: config.isEnabled,
      activeBucket: config.bucket,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch media library' });
  }
});

// Storage Config Endpoint
app.get('/api/media/config', requireAdmin, (req: Request, res: Response) => {
  try {
    const config = getActiveSupabaseConfig();
    res.json({
      success: true,
      config: {
        url: config.url,
        bucket: config.bucket,
        isEnabled: config.isEnabled,
        hasAnonKey: Boolean(config.anonKey),
        hasServiceRoleKey: Boolean(config.serviceRoleKey),
        maskedAnonKey: config.anonKey ? `${config.anonKey.slice(0, 8)}...${config.anonKey.slice(-6)}` : '',
        maskedServiceRoleKey: config.serviceRoleKey ? `${config.serviceRoleKey.slice(0, 8)}...${config.serviceRoleKey.slice(-6)}` : '',
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch storage configuration' });
  }
});

app.post('/api/media/config', requireAdmin, (req: Request, res: Response) => {
  try {
    const { url, anonKey, serviceRoleKey, bucket, isEnabled } = req.body;
    const updated = db.saveSupabaseConfig({
      url: url !== undefined ? url.trim() : undefined,
      anonKey: anonKey !== undefined ? anonKey.trim() : undefined,
      serviceRoleKey: serviceRoleKey !== undefined ? serviceRoleKey.trim() : undefined,
      bucket: bucket !== undefined ? bucket.trim() : undefined,
      isEnabled: isEnabled !== undefined ? Boolean(isEnabled) : undefined,
    });
    res.json({
      success: true,
      message: 'Supabase storage configuration saved successfully',
      config: updated,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to save storage configuration' });
  }
});

app.post('/api/media/test-supabase', requireAdmin, async (req: Request, res: Response) => {
  try {
    const result = await testSupabaseConnection(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: `Failed to test Supabase connection: ${error.message || 'Unknown error'}`,
    });
  }
});

// Media Upload (Supabase Cloud Storage with resilient Local Fallback)
app.post('/api/media/upload', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { fileName, fileData, fileType, mimeType, caption } = req.body;
    if (!fileData) {
      return res.status(400).json({ error: 'No file data provided.' });
    }

    // Clean base64 string
    const base64Data = fileData.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate unique name
    const ext = path.extname(fileName || 'upload.png') || '.png';
    const cleanOriginalName = (fileName || 'upload.png').replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueName = `media_${Date.now()}_${crypto.randomBytes(4).toString('hex')}${ext}`;

    // Always cache locally as well for offline safety
    const localFilePath = path.join(UPLOADS_DIR, uniqueName);
    fs.writeFileSync(localFilePath, buffer);

    let finalFileUrl = `/uploads/${uniqueName}`;
    let storageProvider: 'supabase' | 'local' = 'local';
    let storagePath: string | undefined = undefined;
    let bucketName: string | undefined = undefined;

    // Check if Supabase Storage is configured and enabled
    const supabaseConfig = getActiveSupabaseConfig();
    if (supabaseConfig.isEnabled && supabaseConfig.url) {
      try {
        const uploadResult = await uploadFileToSupabase(
          cleanOriginalName,
          buffer,
          mimeType || (fileType === 'video' ? 'video/mp4' : 'image/png'),
          'portfolio-assets'
        );

        if (uploadResult.success && uploadResult.publicUrl) {
          finalFileUrl = uploadResult.publicUrl;
          storageProvider = 'supabase';
          storagePath = uploadResult.storagePath;
          bucketName = uploadResult.bucket;
        } else {
          console.warn('Supabase upload returned warning, fell back to local disk:', uploadResult.error);
        }
      } catch (sbErr) {
        console.error('Supabase upload exception (falling back to local):', sbErr);
      }
    }

    const mediaItem: MediaItem = {
      id: `med_${crypto.randomBytes(6).toString('hex')}`,
      fileName: uniqueName,
      originalName: fileName || uniqueName,
      fileUrl: finalFileUrl,
      fileType: fileType || (mimeType?.startsWith('video') ? 'video' : 'image'),
      fileSize: buffer.length,
      mimeType: mimeType || (fileType === 'video' ? 'video/mp4' : 'image/png'),
      storageProvider,
      bucketName,
      storagePath,
      caption: caption || '',
      createdAt: new Date().toISOString(),
    };

    db.addMedia(mediaItem);

    res.json({
      success: true,
      message: storageProvider === 'supabase'
        ? 'File uploaded directly to Supabase Cloud Storage'
        : 'File uploaded and stored in local persistent media storage',
      media: mediaItem,
      provider: storageProvider,
    });
  } catch (error: any) {
    console.error('Media upload error:', error);
    res.status(500).json({ error: 'Failed to upload media file' });
  }
});

// Update Media Item (Caption, etc.)
app.patch('/api/media/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = db.updateMedia(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Media not found' });
    }
    res.json({ success: true, message: 'Media metadata updated', media: updated });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update media item' });
  }
});

// Delete Media (Deletes from Supabase bucket & local storage)
app.delete('/api/media/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const allMedia = db.getMedia();
    const targetItem = allMedia.find((m) => m.id === id);

    if (!targetItem) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // If stored on Supabase, attempt bucket removal
    if (targetItem.storageProvider === 'supabase' && targetItem.storagePath) {
      try {
        await deleteFileFromSupabase(targetItem.storagePath, targetItem.bucketName);
      } catch (sbErr) {
        console.warn('Supabase remote file removal note:', sbErr);
      }
    }

    // Delete record and local cache
    const deleted = db.deleteMedia(id);
    if (deleted) {
      return res.json({
        success: true,
        message: targetItem.storageProvider === 'supabase'
          ? 'Media deleted from Supabase Storage and database'
          : 'Media deleted from local storage and database',
      });
    }
    return res.status(404).json({ error: 'Media item could not be removed' });
  } catch (error: any) {
    console.error('Delete media error:', error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

// Sync local media to Supabase
app.post('/api/media/sync-to-supabase', requireAdmin, async (req: Request, res: Response) => {
  try {
    const config = getActiveSupabaseConfig();
    if (!config.isEnabled || !config.url) {
      return res.status(400).json({
        success: false,
        error: 'Supabase Storage is not configured or enabled. Please configure credentials first.',
      });
    }

    const allMedia = db.getMedia();
    const localItems = allMedia.filter((m) => m.storageProvider !== 'supabase' && m.fileUrl.startsWith('/uploads/'));
    
    let syncedCount = 0;
    const errors: string[] = [];

    for (const item of localItems) {
      const fileName = path.basename(item.fileUrl);
      const diskPath = path.join(UPLOADS_DIR, fileName);

      if (fs.existsSync(diskPath)) {
        try {
          const buffer = fs.readFileSync(diskPath);
          const uploadResult = await uploadFileToSupabase(
            item.originalName || fileName,
            buffer,
            item.mimeType || 'image/png',
            'portfolio-assets'
          );

          if (uploadResult.success && uploadResult.publicUrl) {
            db.updateMedia(item.id, {
              fileUrl: uploadResult.publicUrl,
              storageProvider: 'supabase',
              storagePath: uploadResult.storagePath,
              bucketName: uploadResult.bucket,
            });
            syncedCount++;
          } else {
            errors.push(`Failed for ${item.fileName}: ${uploadResult.error}`);
          }
        } catch (itemErr: any) {
          errors.push(`Failed for ${item.fileName}: ${itemErr.message}`);
        }
      }
    }

    res.json({
      success: true,
      message: `Synced ${syncedCount} of ${localItems.length} media files to Supabase Storage`,
      syncedCount,
      totalLocal: localItems.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to synchronize media to Supabase' });
  }
});

// ----------------------------------------------------
// VISITOR ANALYTICS & TELEMETRY TRACKING
// ----------------------------------------------------
app.post('/api/analytics/session', (req: Request, res: Response) => {
  try {
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const anonymizedIp = String(rawIp).split(',')[0].trim().replace(/\.\d+$/, '.***');
    
    const session = db.recordSession({
      ...req.body,
      ip: anonymizedIp,
    });

    res.json({ success: true, session });
  } catch (error: any) {
    console.error('Analytics session error:', error);
    res.status(500).json({ error: 'Failed to record session' });
  }
});

app.post('/api/analytics/heartbeat', (req: Request, res: Response) => {
  try {
    const { sessionId, durationSeconds, maxScrollDepth } = req.body;
    if (sessionId) {
      db.recordSession({
        sessionId,
        durationSeconds: Number(durationSeconds) || 0,
        maxScrollDepth: Number(maxScrollDepth) || 0,
        isOnline: true,
      });
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to process heartbeat' });
  }
});

// Beacon endpoint (text/plain or json from navigator.sendBeacon)
app.post('/api/analytics/beacon', (req: Request, res: Response) => {
  try {
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (e) {}
    }
    if (payload && payload.sessionId) {
      db.recordSession({
        sessionId: payload.sessionId,
        durationSeconds: Number(payload.durationSeconds) || 0,
        maxScrollDepth: Number(payload.maxScrollDepth) || 0,
        isOnline: false,
      });
    }
    res.status(204).end();
  } catch (e) {
    res.status(204).end();
  }
});

app.post('/api/analytics/event', (req: Request, res: Response) => {
  try {
    const event = db.recordEvent(req.body);
    res.json({ success: true, event });
  } catch (error: any) {
    console.error('Analytics event error:', error);
    res.status(500).json({ error: 'Failed to record event' });
  }
});

app.get('/api/analytics/dashboard', requireAdmin, (req: Request, res: Response) => {
  try {
    const dashboardData = db.getAnalyticsDashboard();
    res.json({ success: true, data: dashboardData });
  } catch (error: any) {
    console.error('Analytics dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics dashboard' });
  }
});

// ----------------------------------------------------
// VITE MIDDLEWARE & SPA ROUTING
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
