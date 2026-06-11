import { randomUUID } from 'crypto';
import { getStore } from '@netlify/blobs';

const MAX_BYTES = 5 * 1024 * 1024;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'vineshjm@gmail.com';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

function sanitizeFileName(name) {
  const lower = (name || 'image.jpg').toLowerCase();
  const dot = lower.lastIndexOf('.');
  const ext = dot > 0 ? lower.slice(dot) : '.jpg';
  const base = (dot > 0 ? lower.slice(0, dot) : lower)
    .replace(/[^a-z0-9_-]/g, '_')
    .slice(0, 80);
  return `${Date.now()}_${base || 'file'}${ext}`;
}

async function verifyToken(idToken) {
  const apiKey = process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error('FIREBASE_API_KEY not configured');
  }

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    }
  );

  const data = await res.json();
  const user = data.users?.[0];
  const verified = user?.emailVerified === true || user?.emailVerified === 'true';

  if (!res.ok || !user || user.email !== ADMIN_EMAIL || !verified) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
}

async function uploadToFirebase(folder, fileName, contentType, buffer) {
  const { default: admin } = await import('firebase-admin');

  if (!admin.apps.length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!raw) throw new Error('No service account');
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(raw)),
      storageBucket:
        process.env.FIREBASE_STORAGE_BUCKET || 'kalarang-48b04.firebasestorage.app',
    });
  }

  const bucketName =
    process.env.FIREBASE_STORAGE_BUCKET || 'kalarang-48b04.firebasestorage.app';
  const path = `${folder}/${fileName}`;
  const token = randomUUID();

  await admin.storage().bucket(bucketName).file(path).save(buffer, {
    metadata: {
      contentType,
      metadata: { firebaseStorageDownloadTokens: token },
    },
    resumable: false,
  });

  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
}

async function uploadToBlobs(folder, fileName, contentType, buffer) {
  const store = getStore('media');
  const key = `${folder}/${fileName}`;
  await store.set(key, buffer, { metadata: { contentType } });

  const siteUrl = (process.env.URL || 'https://kalarang2026.netlify.app').replace(/\/$/, '');
  return `${siteUrl}/.netlify/functions/serve-media?key=${encodeURIComponent(key)}`;
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  if (req.method !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const authHeader = req.headers.get('authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return json(401, { error: 'Missing authorization' });
  }

  try {
    await verifyToken(authHeader.slice(7));
  } catch (err) {
    return json(err.status || 401, { error: err.message || 'Unauthorized' });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  const { folder = 'products', fileName: rawName, contentType = 'image/jpeg', data } = payload;

  if (!data) {
    return json(400, { error: 'Missing file data' });
  }

  const buffer = Buffer.from(data, 'base64');
  if (buffer.length > MAX_BYTES) {
    return json(400, { error: 'File exceeds 5MB limit' });
  }

  const fileName = sanitizeFileName(rawName);

  try {
    let url;
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        url = await uploadToFirebase(folder, fileName, contentType, buffer);
      } catch (firebaseErr) {
        console.warn('Firebase upload failed, using Blobs:', firebaseErr.message);
        url = await uploadToBlobs(folder, fileName, contentType, buffer);
      }
    } else {
      url = await uploadToBlobs(folder, fileName, contentType, buffer);
    }

    return json(200, { url });
  } catch (err) {
    console.error('upload-media error:', err);
    return json(500, { error: err.message || 'Upload failed' });
  }
};
