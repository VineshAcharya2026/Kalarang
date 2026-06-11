import admin from 'firebase-admin';

function initFirebaseAdmin() {
  if (admin.apps.length) return admin;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT not configured');
  }

  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(raw)),
  });

  return admin;
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return {
      statusCode: 503,
      body: JSON.stringify({ error: 'Admin auth is not configured on Netlify' }),
    };
  }

  try {
    const { email, password } = JSON.parse(event.body || '{}');

    if (email?.trim() !== adminEmail || password !== adminPassword) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid email or password' }),
      };
    }

    const firebaseAdmin = initFirebaseAdmin();
    const user = await firebaseAdmin.auth().getUserByEmail(adminEmail);
    const token = await firebaseAdmin.auth().createCustomToken(user.uid);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    };
  } catch (err) {
    if (err instanceof Error && err.message.includes('FIREBASE_SERVICE_ACCOUNT')) {
      return {
        statusCode: 503,
        body: JSON.stringify({ error: 'Server auth not configured' }),
      };
    }

    console.error('admin-login error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Login failed. Try again later.' }),
    };
  }
}
