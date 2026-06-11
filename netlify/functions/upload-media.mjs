import { randomUUID } from 'crypto';
import { getStore } from '@netlify/blobs';
import { initFirebaseAdmin } from './_firebase-admin.mjs';

async function verifyUploadAuth(authorizationHeader) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!authorizationHeader?.startsWith('Bearer ')) {
    throw Object.assign(new Error('Missing authorization'), { statusCode: 401 });
  }

  const idToken = authorizationHeader.slice(7);

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const firebaseAdmin = initFirebaseAdmin();
    const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
    if (decoded.email !== adminEmail || !decoded.email_verified) {
      throw Object.assign(new Error('Forbidden'), { statusCode: 403 });
    }
    return decoded;
  }

  const apiKey = process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY;
  if (!apiKey) {
    throw Object.assign(new Error('Upload auth not configured'), { statusCode: 503 });
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

  if (!res.ok || !user || user.email !== adminEmail || !verified) {
    throw Object.assign(new Error('Forbidden'), { statusCode: 403 });
  }

  return user;
}

const MAX_BYTES = 5 * 1024 * 1024;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Folder, X-File-Name',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
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

async function uploadToFirebase(folder, fileName, contentType, buffer) {
  const firebaseAdmin = initFirebaseAdmin();
  const bucketName =
    process.env.FIREBASE_STORAGE_BUCKET || 'kalarang-48b04.firebasestorage.app';
  const bucket = firebaseAdmin.storage().bucket(bucketName);
  const path = `${folder}/${fileName}`;
  const downloadToken = randomUUID();

  await bucket.file(path).save(buffer, {
    metadata: {
      contentType,
      metadata: { firebaseStorageDownloadTokens: downloadToken },
    },
    resumable: false,
    public: false,
  });

  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(path)}?alt=media&token=${downloadToken}`;
}

async function uploadToNetlifyBlobs(folder, fileName, contentType, buffer) {
  const store = getStore('media');
  const key = `${folder}/${fileName}`;
  await store.set(key, buffer, {
    metadata: { contentType },
  });

  const siteUrl = (process.env.URL || process.env.DEPLOY_URL || '').replace(/\/$/, '');
  return `${siteUrl}/.netlify/functions/serve-media?key=${encodeURIComponent(key)}`;
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  try {
    await verifyUploadAuth(event.headers.authorization || event.headers.Authorization);
  } catch (err) {
    const status = err.statusCode || 401;
    return jsonResponse(status, { error: err.message || 'Unauthorized' });
  }

  const folder = event.headers['x-folder'] || event.headers['X-Folder'] || 'products';
  const rawName = event.headers['x-file-name'] || event.headers['X-File-Name'] || 'image.jpg';
  const contentType = event.headers['content-type'] || event.headers['Content-Type'] || 'image/jpeg';
  const fileName = sanitizeFileName(rawName);

  if (!event.body) {
    return jsonResponse(400, { error: 'Empty upload body' });
  }

  const buffer = Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8');

  if (buffer.length > MAX_BYTES) {
    return jsonResponse(400, { error: `File exceeds ${MAX_BYTES / (1024 * 1024)}MB limit` });
  }

  try {
    let url;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        url = await uploadToFirebase(folder, fileName, contentType, buffer);
      } catch (firebaseErr) {
        console.warn('Firebase upload failed, using Netlify Blobs:', firebaseErr.message);
        url = await uploadToNetlifyBlobs(folder, fileName, contentType, buffer);
      }
    } else {
      url = await uploadToNetlifyBlobs(folder, fileName, contentType, buffer);
    }

    return jsonResponse(200, { url });
  } catch (err) {
    console.error('upload-media error:', err);
    return jsonResponse(500, {
      error: err.message || 'Upload failed',
    });
  }
}
