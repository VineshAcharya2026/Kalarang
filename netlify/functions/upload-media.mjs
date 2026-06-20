const MAX_BYTES = 900 * 1024; // ~900KB keeps Firestore docs safe
const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL || 'admin@kalarang.com',
  'vineshjm@gmail.com',
];

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
  if (!res.ok || !user || !ADMIN_EMAILS.includes(user.email)) {
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

  const { contentType = 'image/jpeg', data } = payload;
  if (!data) return jsonResponse(400, { error: 'Missing file data' });

  const byteLength = Buffer.byteLength(data, 'base64');
  if (byteLength > MAX_BYTES) {
    return jsonResponse(400, {
      error: 'Image too large after compression. Use a smaller file or paste an image URL.',
    });
  }

  const url = `data:${contentType};base64,${data}`;
  return jsonResponse(200, { url });
}
