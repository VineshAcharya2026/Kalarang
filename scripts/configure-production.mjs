/**
 * Configure Firebase + Netlify production: Auth domains, Storage, Firestore rules.
 * Run: node scripts/configure-production.mjs
 */
import { readFileSync, existsSync, writeFileSync, unlinkSync } from 'fs';
import { homedir, tmpdir } from 'os';
import { join } from 'path';
import { createRequire } from 'module';
import { spawnSync } from 'child_process';

const require = createRequire(import.meta.url);
const { initializeApp, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const PROJECT_ID = 'kalarang-48b04';
const ADMIN_EMAIL = 'vineshjm@gmail.com';
const ADMIN_PASSWORD = 'Kalarang@2026';
const CLIENT_ID = '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
const CLIENT_SECRET = 'j9iVZfS8kkCEFUPaAeJV0sAi';

const NETLIFY_DOMAINS = [
  'kalarang2026.netlify.app',
  'localhost',
  '127.0.0.1',
];

const REQUIRED_APIS = [
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com',
  'firebaseauth.googleapis.com',
  'firebasestorage.googleapis.com',
  'storage.googleapis.com',
  'firestore.googleapis.com',
  'firebase.googleapis.com',
];

function loadFirebaseCliTokens() {
  const configPath = join(homedir(), '.config', 'configstore', 'firebase-tools.json');
  if (!existsSync(configPath)) {
    throw new Error('Firebase CLI not logged in. Run: firebase login');
  }
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  const refreshToken = config?.tokens?.refresh_token;
  if (!refreshToken) {
    throw new Error('No Firebase refresh token found. Run: firebase login');
  }
  return refreshToken;
}

async function refreshAccessToken(refreshToken) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`Failed to get access token: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

function initAdmin(refreshToken) {
  const credPath = join(tmpdir(), `kalarang-adc-${Date.now()}.json`);
  writeFileSync(
    credPath,
    JSON.stringify({
      type: 'authorized_user',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken,
    })
  );
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath;

  if (!getApps().length) {
    initializeApp({ projectId: PROJECT_ID });
  }

  return credPath;
}

async function enableApis(accessToken) {
  console.log('\n--- Enabling Google Cloud APIs ---');
  for (const service of REQUIRED_APIS) {
    const res = await fetch(
      `https://serviceusage.googleapis.com/v1/projects/${PROJECT_ID}/services/${service}:enable`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (res.ok || res.status === 409) {
      console.log(`✓ ${service}`);
    } else {
      console.log(`⚠ ${service}: ${res.status} ${(await res.text()).slice(0, 120)}`);
    }
  }
}

async function configureAuth(accessToken) {
  console.log('\n--- Configuring Firebase Auth ---');

  const patchRes = await fetch(
    `https://identitytoolkit.googleapis.com/admin/v2/projects/${PROJECT_ID}/config?updateMask=signIn.email.enabled,signIn.email.passwordRequired`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Goog-User-Project': PROJECT_ID,
      },
      body: JSON.stringify({
        signIn: { email: { enabled: true, passwordRequired: true } },
      }),
    }
  );

  if (patchRes.ok) {
    console.log('✓ Email/Password sign-in enabled');
  } else {
    console.log('⚠ Auth sign-in patch:', patchRes.status, (await patchRes.text()).slice(0, 200));
  }

  const getRes = await fetch(
    `https://identitytoolkit.googleapis.com/admin/v2/projects/${PROJECT_ID}/config`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Goog-User-Project': PROJECT_ID,
      },
    }
  );

  if (!getRes.ok) {
    console.log('⚠ Could not read auth config:', getRes.status, (await getRes.text()).slice(0, 200));
    return;
  }

  const current = await getRes.json();
  const existing = current.authorizedDomains || [];
  const merged = [...new Set([...existing, ...NETLIFY_DOMAINS])];

  const domainRes = await fetch(
    `https://identitytoolkit.googleapis.com/admin/v2/projects/${PROJECT_ID}/config?updateMask=authorizedDomains`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Goog-User-Project': PROJECT_ID,
      },
      body: JSON.stringify({ authorizedDomains: merged }),
    }
  );

  if (domainRes.ok) {
    console.log('✓ Authorized domains:', merged.join(', '));
  } else {
    console.log('⚠ Authorized domains patch:', domainRes.status, (await domainRes.text()).slice(0, 300));
    console.log('  Add manually: https://console.firebase.google.com/project/kalarang-48b04/authentication/settings');
  }
}

async function configureStorageCors(accessToken, bucketName) {
  const patchRes = await fetch(
    `https://storage.googleapis.com/storage/v1/b/${bucketName}?fields=cors`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cors: [
          {
            origin: [
              'https://kalarang2026.netlify.app',
              'http://localhost:3000',
              'http://127.0.0.1:3000',
            ],
            method: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
            responseHeader: [
              'Content-Type',
              'Authorization',
              'x-goog-resumable',
              'x-goog-meta-*',
            ],
            maxAgeSeconds: 3600,
          },
        ],
      }),
    }
  );

  if (patchRes.ok) {
    console.log(`✓ Storage CORS configured for Netlify + localhost`);
    return true;
  }

  console.log('⚠ Storage CORS:', patchRes.status, (await patchRes.text()).slice(0, 200));
  return false;
}

async function configureStorage(accessToken) {
  console.log('\n--- Configuring Firebase Storage ---');

  const bucketName = `${PROJECT_ID}.firebasestorage.app`;

  const getRes = await fetch(
    `https://firebasestorage.googleapis.com/v1alpha/projects/${PROJECT_ID}/defaultBucket`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (getRes.ok) {
    const bucket = await getRes.json();
    console.log(`✓ Default bucket exists: ${bucket.name || bucket.bucket?.name || bucketName}`);
    await configureStorageCors(accessToken, bucketName);
    return true;
  }

  console.log('Default bucket not found — creating...');

  const createRes = await fetch(
    `https://firebasestorage.googleapis.com/v1alpha/projects/${PROJECT_ID}/defaultBucket`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: 'asia-south1',
      }),
    }
  );

  if (createRes.ok) {
    const created = await createRes.json();
    console.log(`✓ Storage bucket created: ${created.name || created.bucket?.name || bucketName}`);
    await configureStorageCors(accessToken, bucketName);
    return true;
  }

  const errText = await createRes.text();
  console.log('⚠ Storage bucket create:', createRes.status, errText.slice(0, 400));

  if (errText.includes('BILLING') || errText.includes('billing') || createRes.status === 403) {
    console.log('\n  Storage requires Blaze plan OR one-time console setup:');
    console.log(`  https://console.firebase.google.com/project/${PROJECT_ID}/storage`);
    console.log('  Click "Get started" → choose region (asia-south1) → finish.');
  }

  return false;
}

async function ensureAdminUser() {
  console.log('\n--- Verifying admin user ---');
  try {
    const existing = await getAuth().getUserByEmail(ADMIN_EMAIL);
    await getAuth().updateUser(existing.uid, {
      password: ADMIN_PASSWORD,
      emailVerified: true,
    });
    console.log(`✓ Admin verified: ${ADMIN_EMAIL}`);
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      const user = await getAuth().createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        emailVerified: true,
        displayName: 'Kalarang Admin',
      });
      console.log(`✓ Admin created: ${user.email}`);
    } else {
      throw err;
    }
  }
}

function deployFirebaseRules() {
  console.log('\n--- Deploying Firestore + Storage rules ---');
  const result = spawnSync(
    'firebase',
    ['deploy', '--project', PROJECT_ID, '--only', 'firestore:rules,firestore:indexes,storage'],
    { stdio: 'inherit', shell: true, cwd: join(process.cwd()) }
  );

  if (result.status !== 0) {
    console.log('\n⚠ Rules deploy failed. If Storage is not set up, enable it in console first.');
    return false;
  }

  console.log('✓ Rules and indexes deployed');
  return true;
}

async function main() {
  console.log(`Configuring production for ${PROJECT_ID}\n`);
  console.log('Netlify site: https://kalarang2026.netlify.app');

  const refreshToken = loadFirebaseCliTokens();
  const accessToken = await refreshAccessToken(refreshToken);
  const credPath = initAdmin(refreshToken);

  try {
    await enableApis(accessToken);
    await configureAuth(accessToken);
    const storageReady = await configureStorage(accessToken);
    await ensureAdminUser();

    if (storageReady) {
      deployFirebaseRules();
    } else {
      console.log('\nSkipping storage rules deploy until bucket exists.');
      spawnSync(
        'firebase',
        ['deploy', '--project', PROJECT_ID, '--only', 'firestore:rules,firestore:indexes'],
        { stdio: 'inherit', shell: true }
      );
    }
  } finally {
    try {
      unlinkSync(credPath);
    } catch {
      /* ignore */
    }
  }

  console.log('\n=== PRODUCTION CHECKLIST ===');
  console.log('Netlify env (optional): VITE_APP_URL=https://kalarang2026.netlify.app');
  console.log('Admin login:  https://kalarang2026.netlify.app/admin/login');
  console.log(`Email:        ${ADMIN_EMAIL}`);
  console.log(`Password:     ${ADMIN_PASSWORD}`);
  console.log('\nIf image upload fails, confirm Storage is enabled and re-run:');
  console.log('  node scripts/configure-production.mjs');
}

main().catch((err) => {
  console.error('\nConfigure failed:', err);
  process.exit(1);
});
