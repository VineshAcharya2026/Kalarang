import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

function initFirebaseAdmin() {
  if (getApps().length) return;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT not configured');
  }

  initializeApp({
    credential: cert(JSON.parse(raw)),
  });
}

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return new Response(JSON.stringify({ error: 'Admin auth is not configured on Netlify' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { email, password } = await req.json();

    if (email?.trim() !== adminEmail || password !== adminPassword) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    initFirebaseAdmin();
    const user = await getAuth().getUserByEmail(adminEmail);
    const token = await getAuth().createCustomToken(user.uid);

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes('FIREBASE_SERVICE_ACCOUNT')) {
      return new Response(JSON.stringify({ error: 'Server auth not configured' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.error('admin-login error:', err);
    return new Response(JSON.stringify({ error: 'Login failed. Try again later.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
