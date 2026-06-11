import { ref, uploadBytesResumable, getDownloadURL, type UploadMetadata } from 'firebase/storage';
import { storage } from './config';

const UPLOAD_TIMEOUT_MS = 120_000;

export interface UploadOptions {
  folder: string;
  onProgress?: (percent: number) => void;
  maxSizeMb?: number;
}

function sanitizeFileName(name: string): string {
  const ext = name.includes('.') ? name.slice(name.lastIndexOf('.')) : '';
  const base = name.slice(0, name.length - ext.length).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80);
  return `${Date.now()}_${base || 'file'}${ext.toLowerCase()}`;
}

function getFriendlyUploadError(error: { code?: string; message?: string }): string {
  switch (error.code) {
    case 'storage/unauthorized':
      return 'Upload denied. Sign in as the admin account (vineshjm@gmail.com) and try again.';
    case 'storage/canceled':
      return 'Upload was cancelled.';
    case 'storage/quota-exceeded':
      return 'Storage quota exceeded. Free up space or upgrade your Firebase plan.';
    case 'storage/retry-limit-exceeded':
      return 'Upload failed after multiple retries. Check your connection and try again.';
    case 'storage/invalid-checksum':
      return 'File was corrupted during upload. Please try again.';
    case 'storage/object-not-found':
    case 'storage/bucket-not-found':
      return 'Firebase Storage is not set up yet. Open Firebase Console → Storage → Get started, then try again. You can also paste an image URL in the fallback field below.';
    default:
      if (error.message?.includes('storage') || error.message?.includes('Storage')) {
        return `${error.message} If this persists, enable Firebase Storage in the console or use the image URL fallback field.`;
      }
      return error.message || 'Upload failed. Enable Firebase Storage in the console or use the image URL fallback field.';
  }
}

export function uploadFile(file: File, options: UploadOptions): Promise<string> {
  const { folder, onProgress, maxSizeMb = 10 } = options;

  if (file.size > maxSizeMb * 1024 * 1024) {
    return Promise.reject(new Error(`File "${file.name}" exceeds the ${maxSizeMb}MB limit.`));
  }

  const fileName = sanitizeFileName(file.name);
  const storageRef = ref(storage, `${folder}/${fileName}`);

  const metadata: UploadMetadata = {
    contentType: file.type || 'application/octet-stream',
    customMetadata: { originalName: file.name },
  };

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    const timeoutId = setTimeout(() => {
      uploadTask.cancel();
      reject(
        new Error(
          'Upload timed out. Open Firebase Console → Storage → Get started, then redeploy storage rules.'
        )
      );
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

export async function uploadFiles(
  files: File[],
  options: UploadOptions
): Promise<string[]> {
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
