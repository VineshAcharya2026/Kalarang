import admin from 'firebase-admin';

export function initFirebaseAdmin() {
  if (admin.apps.length) return admin;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT not configured');
  }

  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(raw)),
    storageBucket:
      process.env.FIREBASE_STORAGE_BUCKET || 'kalarang-48b04.firebasestorage.app',
  });

  return admin;
}

export async function verifyAdminToken(authorizationHeader) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!authorizationHeader?.startsWith('Bearer ')) {
    throw Object.assign(new Error('Missing authorization'), { statusCode: 401 });
  }

  const idToken = authorizationHeader.slice(7);
  const firebaseAdmin = initFirebaseAdmin();
  const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);

  if (decoded.email !== adminEmail || !decoded.email_verified) {
    throw Object.assign(new Error('Forbidden'), { statusCode: 403 });
  }

  return decoded;
}
