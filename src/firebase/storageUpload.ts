import { ensureAdminAuth } from '../auth';

const MAX_UPLOAD_MB = 5;
const UPLOAD_TIMEOUT_MS = 45_000;

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
  return ext ? MIME_BY_EXT[ext] : 'image/jpeg';
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

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1] || '');
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export async function uploadFile(file: File, options: UploadOptions): Promise<string> {
  const { folder, onProgress, maxSizeMb = MAX_UPLOAD_MB } = options;

  if (file.size > maxSizeMb * 1024 * 1024) {
    throw new Error(`File "${file.name}" exceeds the ${maxSizeMb}MB limit.`);
  }

  const user = await ensureAdminAuth();
  const idToken = await user.getIdToken(true);
  const contentType = inferContentType(file);
  const fileName = sanitizeFileName(file.name);

  onProgress?.(10);

  const data = await fileToBase64(file);
  onProgress?.(40);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

  try {
    const res = await fetch('/.netlify/functions/upload-media', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ folder, fileName, contentType, data }),
      signal: controller.signal,
    });

    onProgress?.(90);

    const payload = (await res.json().catch(() => ({}))) as { url?: string; error?: string };

    if (!res.ok || !payload.url) {
      if (res.status === 404) {
        throw new Error(
          'Upload service is not deployed yet. Wait for Netlify to finish building, or paste an image URL.'
        );
      }
      throw new Error(payload.error || `Upload failed (${res.status})`);
    }

    onProgress?.(100);
    return payload.url;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Upload timed out. Try a smaller image (under 5MB) or paste an image URL.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
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
