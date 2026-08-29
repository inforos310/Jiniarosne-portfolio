import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { db } from './db';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
  bucket: string;
  isEnabled: boolean;
}

let cachedClient: SupabaseClient | null = null;
let lastConfigHash: string = '';

export function getActiveSupabaseConfig(): SupabaseConfig {
  const dbConfig = db.getSupabaseConfig();
  
  // Environment variables override or fallback
  const envUrl = process.env.SUPABASE_URL || '';
  const envAnonKey = process.env.SUPABASE_ANON_KEY || '';
  const envServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const envBucket = process.env.SUPABASE_BUCKET || 'portfolio-media';

  const url = dbConfig.url || envUrl;
  const anonKey = dbConfig.anonKey || envAnonKey;
  const serviceRoleKey = dbConfig.serviceRoleKey || envServiceKey;
  const bucket = dbConfig.bucket || envBucket || 'portfolio-media';
  
  const isEnabled = dbConfig.isEnabled !== false && Boolean(url && (anonKey || serviceRoleKey));

  return {
    url,
    anonKey,
    serviceRoleKey,
    bucket,
    isEnabled,
  };
}

export function getSupabaseClient(): SupabaseClient | null {
  const config = getActiveSupabaseConfig();
  if (!config.isEnabled || !config.url) {
    return null;
  }

  const keyToUse = config.serviceRoleKey || config.anonKey;
  if (!keyToUse) {
    return null;
  }

  const currentHash = `${config.url}_${keyToUse.slice(0, 10)}`;
  if (!cachedClient || lastConfigHash !== currentHash) {
    try {
      cachedClient = createClient(config.url, keyToUse, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      lastConfigHash = currentHash;
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return cachedClient;
}

export async function testSupabaseConnection(customConfig?: Partial<SupabaseConfig>): Promise<{
  success: boolean;
  message: string;
  buckets?: string[];
  bucketExists?: boolean;
}> {
  const active = getActiveSupabaseConfig();
  const testUrl = customConfig?.url || active.url;
  const testKey = customConfig?.serviceRoleKey || customConfig?.anonKey || active.serviceRoleKey || active.anonKey;
  const testBucket = customConfig?.bucket || active.bucket;

  if (!testUrl || !testKey) {
    return {
      success: false,
      message: 'Supabase URL and API Key (Anon or Service Role) are required.',
    };
  }

  try {
    const testClient = createClient(testUrl, testKey, {
      auth: { persistSession: false },
    });

    const { data: buckets, error: listError } = await testClient.storage.listBuckets();
    if (listError) {
      return {
        success: false,
        message: `Supabase Storage error: ${listError.message}`,
      };
    }

    const bucketNames = (buckets || []).map((b) => b.name);
    const bucketExists = bucketNames.includes(testBucket);

    return {
      success: true,
      message: bucketExists
        ? `Connected successfully! Bucket "${testBucket}" is active and accessible.`
        : `Connected to Supabase! Bucket "${testBucket}" does not exist yet (it will be created automatically on upload).`,
      buckets: bucketNames,
      bucketExists,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Connection failed: ${err.message || 'Unknown network error'}`,
    };
  }
}

export async function uploadFileToSupabase(
  fileName: string,
  buffer: Buffer,
  mimeType: string,
  folder = 'uploads'
): Promise<{
  success: boolean;
  publicUrl?: string;
  storagePath?: string;
  bucket?: string;
  error?: string;
}> {
  const config = getActiveSupabaseConfig();
  const supabase = getSupabaseClient();

  if (!supabase || !config.isEnabled) {
    return {
      success: false,
      error: 'Supabase Storage is not configured or enabled.',
    };
  }

  const bucket = config.bucket || 'portfolio-media';
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${folder}/${Date.now()}_${cleanFileName}`;

  try {
    // 1. Ensure bucket exists or create it
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const exists = (buckets || []).some((b) => b.name === bucket);
      if (!exists) {
        await supabase.storage.createBucket(bucket, {
          public: true,
          fileSizeLimit: 52428800, // 50MB
        });
      }
    } catch (bucketErr) {
      console.warn('Bucket verification warning (proceeding):', bucketErr);
    }

    // 2. Upload file
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, buffer, {
      contentType: mimeType,
      cacheControl: '3600',
      upsert: true,
    });

    if (error) {
      console.error('Supabase upload error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    // 3. Get Public URL
    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return {
      success: true,
      publicUrl: publicData.publicUrl,
      storagePath: filePath,
      bucket,
    };
  } catch (err: any) {
    console.error('Exception during Supabase upload:', err);
    return {
      success: false,
      error: err.message || 'Unknown Supabase upload error',
    };
  }
}

export async function deleteFileFromSupabase(
  storagePath: string,
  bucketName?: string
): Promise<{ success: boolean; error?: string }> {
  const config = getActiveSupabaseConfig();
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { success: false, error: 'Supabase not connected' };
  }

  const bucket = bucketName || config.bucket || 'portfolio-media';

  try {
    const { data, error } = await supabase.storage.from(bucket).remove([storagePath]);
    if (error) {
      console.error('Supabase deletion error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Exception deleting from Supabase:', err);
    return { success: false, error: err.message };
  }
}
