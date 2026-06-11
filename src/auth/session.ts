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
import { ADMIN_EMAIL } from './constants';

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
  return Boolean(user && user.email === ADMIN_EMAIL && user.emailVerified);
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
  if (user.email !== ADMIN_EMAIL) {
    await signOut(auth);
    throw new Error(`Only ${ADMIN_EMAIL} can access the admin panel.`);
  }

  await user.reload();

  if (!user.emailVerified) {
    await signOut(auth);
    throw new Error('Admin account is not verified. Contact the site administrator.');
  }

  await user.getIdToken(true);
  return user;
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

  if (res.status === 503 || res.status === 404) {
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

/** Netlify-aware admin login: server function in production, client fallback in dev. */
export async function loginAdmin(email: string, password: string): Promise<User> {
  await initAuthPersistence();

  try {
    const token = await loginViaNetlifyFunction(email, password);
    const credential = await signInWithCustomToken(auth, token);
    return finalizeSession(credential.user);
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    const useClientFallback =
      import.meta.env.DEV || message === 'NETLIFY_AUTH_UNAVAILABLE';

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
    if (user.email !== ADMIN_EMAIL) {
      throw new Error(`Only ${ADMIN_EMAIL} can perform admin uploads and edits.`);
    }
    throw new Error('Your admin email is not verified. Contact the site administrator.');
  }

  await user.getIdToken(true);
  return user;
}

export function getAuthErrorMessage(error: unknown, fallback: string): string {
  const fbError = error as FirebaseError;
  switch (fbError.code) {
    case 'auth/unauthorized-domain':
      return 'This site domain is not authorized for sign-in. Add it in your Firebase Auth authorized domains.';
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a few minutes and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/configuration-not-found':
      return 'Authentication is not configured for this project.';
    default:
      return error instanceof Error ? error.message || fallback : fallback;
  }
}
