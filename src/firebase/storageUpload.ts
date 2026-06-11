import { ref, uploadBytesResumable, getDownloadURL, type UploadMetadata } from 'firebase/storage';
import { storage } from './config';
import { ensureAdminAuth } from '../auth';

const UPLOAD_TIMEOUT_MS = 120_000;

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

function getFriendlyUploadError(error: { code?: string; message?: string }): string {
  switch (error.code) {
    case 'storage/unauthorized':
      return 'Upload denied. Sign in as vineshjm@gmail.com and verify storage is enabled for this project.';
    case 'storage/canceled':
      return 'Upload was cancelled.';
    case 'storage/quota-exceeded':
      return 'Storage quota exceeded.';
    case 'storage/retry-limit-exceeded':
      return 'Upload failed after retries. Check your connection.';
    case 'storage/object-not-found':
    case 'storage/bucket-not-found':
      return 'Cloud storage is not set up for this project. Contact the site administrator.';
    default:
      return error.message || 'Upload failed. Use the image URL field as a fallback.';
  }
}

export async function uploadFile(file: File, options: UploadOptions): Promise<string> {
  await ensureAdminAuth();

  const { folder, onProgress, maxSizeMb = 10 } = options;

  if (file.size > maxSizeMb * 1024 * 1024) {
    throw new Error(`File "${file.name}" exceeds the ${maxSizeMb}MB limit.`);
  }

  const contentType = inferContentType(file);
  const fileName = sanitizeFileName(file.name);
  const storageRef = ref(storage, `${folder}/${fileName}`);

  const metadata: UploadMetadata = {
    contentType,
    customMetadata: { originalName: file.name },
  };

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    const timeoutId = setTimeout(() => {
      uploadTask.cancel();
      reject(new Error('Upload timed out. Check your connection or use an image URL instead.'));
    }, UPLOAD_TIMEOUT_MS);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (onProgress && snapshot.totalBytes > 0) {
          onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
        }
      },
      (error) => {
        clearTimeout(timeoutId);
        reject(new Error(getFriendlyUploadError(error)));
      },
      async () => {
        clearTimeout(timeoutId);
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        } catch (err) {
          reject(err instanceof Error ? err : new Error('Failed to get download URL.'));
        }
      }
    );
  });
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
