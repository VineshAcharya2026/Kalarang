import crypto from 'crypto';

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

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

function signJwt(payload, serviceAccount) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createSign('RSA-SHA256')
    .update(signingInput)
    .sign(normalizePrivateKey(serviceAccount.private_key), 'base64url');

  return `${signingInput}.${signature}`;
}

async function getGoogleAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const assertion = signJwt(
    {
      iss: serviceAccount.client_email,
      sub: serviceAccount.client_email,
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
      scope: 'https://www.googleapis.com/auth/identitytoolkit',
    },
    serviceAccount
  );

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

function createCustomToken(uid, serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  return signJwt(
    {
      iss: serviceAccount.client_email,
      sub: serviceAccount.client_email,
      aud: 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit',
      iat: now,
      exp: now + 3600,
      uid,
    },
    serviceAccount
  );
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

  const adminEmails = [
    process.env.ADMIN_EMAIL || 'admin@kalarang.com',
    'vineshjm@gmail.com',
  ];
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json', ...CORS },
      body: JSON.stringify({ error: 'Admin auth is not configured on Netlify' }),
    };
  }

  try {
    const { email, password } = JSON.parse(event.body || '{}');

    const normalizedEmail = email?.trim();
    if (!adminEmails.includes(normalizedEmail) || password !== adminPassword) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json', ...CORS },
        body: JSON.stringify({ error: 'Invalid email or password' }),
      };
    }

    const serviceAccount = getServiceAccount();
    const accessToken = await getGoogleAccessToken(serviceAccount);
    const user = await getUserByEmail(normalizedEmail, serviceAccount.project_id, accessToken);
    const token = createCustomToken(user.localId, serviceAccount);

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
