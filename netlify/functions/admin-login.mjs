import { SignJWT, importPKCS8 } from 'jose';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT not configured');
  }
  return JSON.parse(raw);
}

function normalizePrivateKey(key) {
  return key.includes('\\n') ? key.replace(/\\n/g, '\n') : key;
}

async function getGoogleAccessToken(serviceAccount) {
  const privateKey = await importPKCS8(normalizePrivateKey(serviceAccount.private_key), 'RS256');
  const now = Math.floor(Date.now() / 1000);

  const assertion = await new SignJWT({
    scope: 'https://www.googleapis.com/auth/identitytoolkit',
  })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(serviceAccount.client_email)
    .setSubject(serviceAccount.client_email)
    .setAudience('https://oauth2.googleapis.com/token')
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(privateKey);

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error_description || 'Failed to obtain Google access token');
  }

  return tokenData.access_token;
}

async function getUserByEmail(email, projectId, accessToken) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:lookup`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: [email] }),
    }
  );

  const data = await res.json();
  if (!res.ok || !data.users?.[0]) {
    throw new Error('Admin user not found in Firebase Auth');
  }

  return data.users[0];
}

async function createCustomToken(uid, serviceAccount) {
  const privateKey = await importPKCS8(normalizePrivateKey(serviceAccount.private_key), 'RS256');
  const now = Math.floor(Date.now() / 1000);

  return new SignJWT({ uid })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(serviceAccount.client_email)
    .setSubject(serviceAccount.client_email)
    .setAudience('https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit')
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(privateKey);
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json', ...CORS },
      body: JSON.stringify({ error: 'Admin auth is not configured on Netlify' }),
    };
  }

  try {
    const { email, password } = JSON.parse(event.body || '{}');

    if (email?.trim() !== adminEmail || password !== adminPassword) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json', ...CORS },
        body: JSON.stringify({ error: 'Invalid email or password' }),
      };
    }

    const serviceAccount = getServiceAccount();
    const accessToken = await getGoogleAccessToken(serviceAccount);
    const user = await getUserByEmail(adminEmail, serviceAccount.project_id, accessToken);
    const token = await createCustomToken(user.localId, serviceAccount);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', ...CORS },
      body: JSON.stringify({ token }),
    };
  } catch (err) {
    if (err instanceof Error && err.message.includes('FIREBASE_SERVICE_ACCOUNT')) {
      return {
        statusCode: 503,
        headers: { 'Content-Type': 'application/json', ...CORS },
        body: JSON.stringify({ error: 'Server auth not configured' }),
      };
    }

    console.error('admin-login error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', ...CORS },
      body: JSON.stringify({ error: 'Login failed. Try again later.' }),
    };
  }
}
