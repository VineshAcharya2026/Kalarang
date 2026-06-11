import type { FirebaseError } from 'firebase/app';

export function getFirebaseErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    // handleFirestoreError legacy JSON payloads
    if (error.message.startsWith('{')) {
      try {
        const parsed = JSON.parse(error.message) as { error?: string };
        if (parsed.error) return parsed.error;
      } catch {
        /* use message below */
      }
    }

    const fbError = error as FirebaseError;
    switch (fbError.code) {
      case 'permission-denied':
        return 'Permission denied. Sign in as vineshjm@gmail.com with a verified email.';
      case 'unauthenticated':
        return 'Session expired. Please sign in again at /admin/login.';
      case 'not-found':
        return 'Document not found. It may have been deleted.';
      case 'failed-precondition':
        return 'Database index is building. Wait a few minutes and refresh.';
      case 'storage/unauthorized':
        return 'Upload denied. Sign in as admin and ensure Firebase Storage is enabled.';
      case 'storage/canceled':
        return 'Upload was cancelled.';
      case 'storage/quota-exceeded':
        return 'Storage quota exceeded.';
      default:
        return error.message || fallback;
    }
  }

  return fallback;
}
