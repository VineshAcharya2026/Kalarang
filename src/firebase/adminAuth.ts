import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from './config';

const ADMIN_EMAIL = 'vineshjm@gmail.com';

export function waitForAuthReady(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      resolve(user);
    });
  });
}

/** Ensure admin is signed in with a fresh token before Storage/Firestore writes. */
export async function ensureAdminAuth(): Promise<User> {
  const user = await waitForAuthReady();

  if (!user) {
    throw new Error('You are not signed in. Please log in at /admin/login and try again.');
  }

  if (user.email !== ADMIN_EMAIL) {
    throw new Error(`Only ${ADMIN_EMAIL} can perform admin uploads and edits.`);
  }

  if (!user.emailVerified) {
    throw new Error('Your admin email is not verified. Contact the site administrator.');
  }

  // Refresh ID token so Storage rules see email_verified == true
  await user.getIdToken(true);
  return user;
}
