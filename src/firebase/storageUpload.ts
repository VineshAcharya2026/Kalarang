import { ensureAdminAuth } from '../auth';

const MAX_NETLIFY_UPLOAD_MB = 5;
const CLIENT_FALLBACK_TIMEOUT_MS = 60_000;
const STALL_TIMEOUT_MS = 20_000;

export interface UploadOptions {
  folder: string;
  onProgress?: (percent: number) => void;
  maxSizeMb?: number;
}

const MIME_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
};

function inferContentType(file: File): string {
  if (file.type && file.type !== 'application/octet-stream') {
    return file.type;
  }

  const lower = file.name.toLowerCase();
  const ext = Object.keys(MIME_BY_EXT).find((e) => lower.endsWith(e));
  if (ext) return MIME_BY_EXT[ext];

  return 'image/jpeg';
}

function sanitizeFileName(name: string): string {
  const lower = name.toLowerCase();
  const dot = lower.lastIndexOf('.');
  const ext = dot > 0 ? lower.slice(dot) : '.jpg';
  const base = (dot > 0 ? lower.slice(0, dot) : lower)
    .replace(/[^a-z0-9_-]/g, '_')
    .slice(0, 80);
  return `${Date.now()}_${base || 'file'}${ext}`;
}

async function uploadViaNetlifyFunction(
  file: File,
  folder: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  const user = await ensureAdminAuth();
  const idToken = await user.getIdToken(true);
  const contentType = inferContentType(file);
  const fileName = sanitizeFileName(file.name);

  onProgress?.(5);

  const res = await fetch('/.netlify/functions/upload-media', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': contentType,
      'X-Folder': folder,
      'X-File-Name': fileName,
    },
    body: file,
  });

  onProgress?.(90);

  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };

  if (!res.ok || !data.url) {
    if (res.status === 404 || res.status === 503) {
      throw new Error('NETLIFY_UPLOAD_UNAVAILABLE');
    }
    throw new Error(data.error || `Upload failed (${res.status})`);
  }

  onProgress?.(100);
  return data.url;
}

async function uploadViaFirebaseClient(
  file: File,
  folder: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  const [{ ref, uploadBytes, getDownloadURL }, { storage }] = await Promise.all([
    import('firebase/storage'),
    import('./config'),
  ]);

  const contentType = inferContentType(file);
  const fileName = sanitizeFileName(file.name);
  const storageRef = ref(storage, `${folder}/${fileName}`);

  let stalled = false;
  const stallTimer = setTimeout(() => {
    stalled = true;
  }, STALL_TIMEOUT_MS);

  const uploadPromise = uploadBytes(storageRef, file, {
    contentType,
    customMetadata: { originalName: file.name },
  });

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Upload timed out. Storage may not be configured — try a smaller image or paste an image URL.'));
    }, CLIENT_FALLBACK_TIMEOUT_MS);
  });

  try {
    onProgress?.(25);
    const snapshot = await Promise.race([uploadPromise, timeoutPromise]);

    if (stalled) {
      throw new Error('Upload stalled. Use an image URL or try again on the live Netlify site.');
    }

    onProgress?.(85);
    const url = await getDownloadURL(snapshot.ref);
    onProgress?.(100);
    return url;
  } finally {
    clearTimeout(stallTimer);
  }
}

export async function uploadFile(file: File, options: UploadOptions): Promise<string> {
  const { folder, onProgress, maxSizeMb = MAX_NETLIFY_UPLOAD_MB } = options;

  if (file.size > maxSizeMb * 1024 * 1024) {
    throw new Error(`File "${file.name}" exceeds the ${maxSizeMb}MB limit.`);
  }

  try {
    return await uploadViaNetlifyFunction(file, folder, onProgress);
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    const useClientFallback =
      import.meta.env.DEV || message === 'NETLIFY_UPLOAD_UNAVAILABLE';

    if (useClientFallback) {
      return uploadViaFirebaseClient(file, folder, onProgress);
    }

    throw err;
  }
}

export async function uploadFiles(files: File[], options: UploadOptions): Promise<string[]> {
  const results: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const url = await uploadFile(file, {
      ...options,
      onProgress: options.onProgress
        ? (pct) => options.onProgress!(Math.round(((i + pct / 100) / files.length) * 100))
        : undefined,
    });
    results.push(url);
  }
  return results;
}
