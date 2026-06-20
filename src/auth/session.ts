import {
  type User,
  onAuthStateChanged,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signOut,
  browserLocalPersistence,
  setPersistence,
} from 'firebase/auth';
import type { FirebaseError } from 'firebase/app';
import { auth } from '../firebase/config';
import { ADMIN_EMAIL, isAdminEmail } from './constants';

let persistenceReady: Promise<void> | null = null;

export function initAuthPersistence(): Promise<void> {
  if (!persistenceReady) {
    persistenceReady = setPersistence(auth, browserLocalPersistence);
  }
  return persistenceReady;
}

export function subscribeToAuth(onChange: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, onChange);
}

export function isAdminUser(user: User | null): boolean {
  return isAdminEmail(user?.email ?? null);
}

export function waitForAuthReady(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      resolve(user);
    });
  });
}

async function finalizeSession(user: User): Promise<User> {
  if (!isAdminEmail(user.email)) {
    await signOut(auth);
    throw new Error(`Only authorized admin emails can access the admin panel.`);
  }

  await user.reload();
  await user.getIdToken(true);
  return user;
}

function isNetlifyAuthUnavailable(status: number): boolean {
  return status === 503 || status === 404 || status === 502;
}

async function loginViaNetlifyFunction(email: string, password: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch('/.netlify/functions/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
    });
  } catch {
    throw new Error('NETLIFY_AUTH_UNAVAILABLE');
  }

  const data = (await res.json().catch(() => ({}))) as { token?: string; error?: string };

  if (isNetlifyAuthUnavailable(res.status)) {
    throw new Error('NETLIFY_AUTH_UNAVAILABLE');
  }

  if (!res.ok || !data.token) {
    throw new Error(data.error || 'Login failed. Check your email and password.');
  }

  return data.token;
}

async function loginViaFirebaseClient(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return finalizeSession(credential.user);
}

/** Netlify-aware admin login: server function when configured, Firebase Auth fallback otherwise. */
export async function loginAdmin(email: string, password: string): Promise<User> {
  await initAuthPersistence();

  try {
    const token = await loginViaNetlifyFunction(email, password);
    const credential = await signInWithCustomToken(auth, token);
    return finalizeSession(credential.user);
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    const useClientFallback =
      import.meta.env.DEV ||
      message === 'NETLIFY_AUTH_UNAVAILABLE' ||
      message.includes('not configured');

    if (useClientFallback) {
      return loginViaFirebaseClient(email, password);
    }

    throw err;
  }
}

export async function logoutAdmin(): Promise<void> {
  await signOut(auth);
}

export async function ensureAdminAuth(): Promise<User> {
  await initAuthPersistence();

  const user = await waitForAuthReady();

  if (!user) {
    throw new Error('You are not signed in. Please log in at /admin/login and try again.');
  }

  if (!isAdminUser(user)) {
    throw new Error(`Only ${ADMIN_EMAIL} can perform admin uploads and edits.`);
  }

  await user.getIdToken(true);
  return user;
}

export function getAuthErrorMessage(error: unknown, fallback: string): string {
  const fbError = error as FirebaseError;
  switch (fbError.code) {
    case 'auth/unauthorized-domain':
      return 'This site domain is not authorized for sign-in. Add it in Firebase Auth → Settings → Authorized domains.';
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Use your Firebase Auth credentials for this admin email.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a few minutes and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/configuration-not-found':
      return 'Email/password sign-in is not enabled. Enable it in Firebase Console → Authentication.';
    default:
      return error instanceof Error ? error.message || fallback : fallback;
  }
}
