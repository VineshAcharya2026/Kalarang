import { ensureAdminAuth } from '../auth';

const MAX_UPLOAD_MB = 8;
const UPLOAD_TIMEOUT_MS = 30_000;
const MAX_COMPRESSED_BYTES = 900 * 1024;

export interface UploadOptions {
  folder: string;
  onProgress?: (percent: number) => void;
  maxSizeMb?: number;
}

function inferContentType(file: File): string {
  if (file.type && file.type !== 'application/octet-stream') {
    return file.type;
  }
  const lower = file.name.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  return 'image/jpeg';
}

async function compressImage(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const maxWidth = 1400;
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const qualities = [0.85, 0.75, 0.65, 0.55];
  for (const quality of qualities) {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality)
    );
    if (blob && blob.size <= MAX_COMPRESSED_BYTES) {
      return blob;
    }
  }

  const fallback = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.5)
  );
  return fallback || file;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1] || '');
    };
    reader.onerror = () => reject(new Error('Failed to read compressed image'));
    reader.readAsDataURL(blob);
  });
}

export async function uploadFile(file: File, options: UploadOptions): Promise<string> {
  const { onProgress, maxSizeMb = MAX_UPLOAD_MB } = options;

  if (file.size > maxSizeMb * 1024 * 1024) {
    throw new Error(`File "${file.name}" exceeds the ${maxSizeMb}MB limit.`);
  }

  onProgress?.(5);

  const compressed = await compressImage(file);
  const contentType =
    compressed.type && compressed.type !== 'application/octet-stream'
      ? compressed.type
      : inferContentType(file);

  if (compressed.size > MAX_COMPRESSED_BYTES) {
    throw new Error(
      'Image is still too large after compression. Use a smaller photo or paste an image URL.'
    );
  }

  onProgress?.(25);

  const user = await ensureAdminAuth();
  const idToken = await user.getIdToken(true);
  const data = await blobToBase64(compressed);

  onProgress?.(50);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

  try {
    const res = await fetch('/.netlify/functions/upload-media', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contentType, data }),
      signal: controller.signal,
    });

    onProgress?.(90);

    const payload = (await res.json().catch(() => ({}))) as { url?: string; error?: string };

    if (!res.ok || !payload.url) {
      if (res.status === 404) {
        throw new Error(
          'Upload service is not live yet. Wait 2 minutes for Netlify to deploy, or paste an image URL.'
        );
      }
      throw new Error(payload.error || `Upload failed (${res.status})`);
    }

    onProgress?.(100);
    return payload.url;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Upload timed out. Try a smaller image or paste an image URL.');
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
