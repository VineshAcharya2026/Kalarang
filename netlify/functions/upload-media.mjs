import { getStore } from '@netlify/blobs';

const MAX_BYTES = 5 * 1024 * 1024;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'vineshjm@gmail.com';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { ...CORS, 'Content-Type': 'application/json' },
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

async function verifyToken(idToken) {
  const apiKey = process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY;
  if (!apiKey) {
    const err = new Error('Auth not configured');
    err.statusCode = 503;
    throw err;
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
    err.statusCode = 403;
    throw err;
  }
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  const authHeader = event.headers.authorization || event.headers.Authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return jsonResponse(401, { error: 'Missing authorization' });
  }

  try {
    await verifyToken(authHeader.slice(7));
  } catch (err) {
    return jsonResponse(err.statusCode || 401, { error: err.message || 'Unauthorized' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON body' });
  }

  const { folder = 'products', fileName: rawName, contentType = 'image/jpeg', data } = payload;
  if (!data) return jsonResponse(400, { error: 'Missing file data' });

  const buffer = Buffer.from(data, 'base64');
  if (buffer.length > MAX_BYTES) {
    return jsonResponse(400, { error: 'File exceeds 5MB limit' });
  }

  const fileName = sanitizeFileName(rawName);
  const key = `${folder}/${fileName}`;

  try {
    const store = getStore('media');
    await store.set(key, buffer, { metadata: { contentType } });

    const siteUrl = (process.env.URL || 'https://kalarang2026.netlify.app').replace(/\/$/, '');
    const url = `${siteUrl}/.netlify/functions/serve-media?key=${encodeURIComponent(key)}`;

    return jsonResponse(200, { url });
  } catch (err) {
    console.error('upload-media error:', err);
    return jsonResponse(500, { error: err.message || 'Upload failed' });
  }
}
