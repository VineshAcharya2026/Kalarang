/**
 * Bootstrap Kalarang Firebase: seed Firestore + create admin auth user.
 * Run: node scripts/bootstrap.mjs
 */
import { readFileSync, existsSync, writeFileSync, unlinkSync } from 'fs';
import { homedir, tmpdir } from 'os';
import { join } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

const PROJECT_ID = 'kalarang-48b04';
const ADMIN_EMAIL = 'vineshjm@gmail.com';
const ADMIN_PASSWORD = 'Kalarang@2026';
const API_KEY = 'AIzaSyB6BUJG1hN2uV6DgvRgeQ_PX2UJhUPCRYI';
const CLIENT_ID = '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
const CLIENT_SECRET = 'j9iVZfS8kkCEFUPaAeJV0sAi';

const SAMPLE_IMAGE =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
const IMAGE_BANARASI =
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80';

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

async function enableIdentityToolkit(accessToken) {
  for (const service of [
    'identitytoolkit.googleapis.com',
    'securetoken.googleapis.com',
    'firebaseauth.googleapis.com',
    'firebasestorage.googleapis.com',
    'storage.googleapis.com',
  ]) {
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
      console.log(`✓ ${service} enabled`);
    } else {
      console.log(`${service}:`, res.status, (await res.text()).slice(0, 120));
    }
  }

  // Classic Firebase Auth config (Spark plan — no Identity Platform billing)
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
    console.log('✓ Email/Password sign-in configured');
  } else {
    console.log('Auth config patch:', patchRes.status, (await patchRes.text()).slice(0, 200));
  }
}

async function tryCreateAdminViaRest() {
  const signUpRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        returnSecureToken: true,
      }),
    }
  );

  const signUpData = await signUpRes.json();
  if (signUpRes.ok) {
    console.log(`✓ Admin user created via Auth REST: ${ADMIN_EMAIL}`);
    return true;
  }

  if (signUpData?.error?.message?.includes('EMAIL_EXISTS')) {
    console.log('Admin user already exists — resetting password via Admin SDK...');
    return false;
  }

  console.log('Auth signUp:', signUpData?.error?.message || signUpData);
  return false;
}

async function ensureAdminUser() {
  const created = await tryCreateAdminViaRest();
  if (created) return;

  try {
    const existing = await getAuth().getUserByEmail(ADMIN_EMAIL);
    await getAuth().updateUser(existing.uid, {
      password: ADMIN_PASSWORD,
      emailVerified: true,
    });
    console.log(`✓ Admin user password reset: ${ADMIN_EMAIL}`);
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      const user = await getAuth().createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        emailVerified: true,
        displayName: 'Kalarang Admin',
      });
      console.log(`✓ Admin user created via Admin SDK: ${user.email}`);
    } else if (err.code === 'auth/configuration-not-found') {
      console.log('\n⚠ Firebase Authentication is not enabled yet.');
      console.log('  Enable it manually (free on Spark plan):');
      console.log(`  https://console.firebase.google.com/project/${PROJECT_ID}/authentication`);
      console.log('  Click "Get started" → Enable "Email/Password" → Save');
      console.log('  Then re-run: node scripts/bootstrap.mjs\n');
    } else {
      throw err;
    }
  }
}

async function seedFirestore() {
  const db = getFirestore();
  const now = FieldValue.serverTimestamp();

  await db.collection('collections').doc('banarasi-silk').set(
    {
      name: 'Banarasi Silk',
      slug: 'banarasi-silk',
      coverImage: IMAGE_BANARASI,
      order: 1,
      isActive: true,
      description: 'Heritage Banarasi weave with rich zari and traditional motifs.',
    },
    { merge: true }
  );
  console.log('✓ Collection: Banarasi Silk');

  await db.collection('settings').doc('main').set(
    {
      storeName: 'KALARANG — Silks & Studio',
      whatsappNumber: '919876543210',
      announcementBar: {
        enabled: true,
        text: '✨ Free Shipping above ₹5000 | ₹500 off your first KALARANG order ✨',
      },
      freeShippingThreshold: 5000,
    },
    { merge: true }
  );
  console.log('✓ Store settings');

  const products = [
    {
      name: 'Royal Crimson Banarasi Silk Saree',
      slug: 'royal-crimson-banarasi-silk-saree',
      collectionId: 'banarasi-silk',
      fabric: 'Pure Banarasi Silk',
      work: 'Zari Brocade',
      border: 'Golden Zari Border',
      texture: 'Rich & Smooth',
      occasions: ['Wedding', 'Festive'],
      colors: ['Crimson Red', 'Gold'],
      mrp: 18999,
      salePrice: 14999,
      images: [IMAGE_BANARASI],
      isFeatured: true,
      isNewArrival: true,
      inStock: true,
      isDeleted: false,
      createdAt: now,
    },
    {
      name: 'Emerald Temple Kanjivaram Saree',
      slug: 'emerald-temple-kanjivaram-saree',
      collectionId: 'banarasi-silk',
      fabric: 'Kanjivaram Silk',
      work: 'Temple Border Weave',
      border: 'Contrast Temple Border',
      texture: 'Classic Lustre',
      occasions: ['Festive', 'Temple', 'Gifting'],
      colors: ['Emerald Green', 'Gold'],
      mrp: 22499,
      salePrice: 17999,
      images: [SAMPLE_IMAGE],
      isFeatured: true,
      isNewArrival: true,
      inStock: true,
      isDeleted: false,
      createdAt: now,
    },
  ];

  for (const product of products) {
    await db.collection('products').doc(product.slug).set(product, { merge: true });
    console.log(`✓ Product: ${product.name}`);
  }

  await db.collection('banners').doc('hero-main').set(
    {
      imageUrl: SAMPLE_IMAGE,
      headline: 'Weaving Elegance Across Generations',
      subtext:
        'Discover the pure heritage of traditional Indian loom-woven masterpieces, crafted in rich silk and gold brocade design.',
      ctaLabel: 'Shop Saree Catalog',
      ctaLink: '/collections/all',
      isActive: true,
    },
    { merge: true }
  );
  console.log('✓ Hero banner');
}

async function main() {
  console.log(`Bootstrapping ${PROJECT_ID}...\n`);

  const refreshToken = loadFirebaseCliTokens();
  const accessToken = await refreshAccessToken(refreshToken);
  await enableIdentityToolkit(accessToken);

  const credPath = initAdmin(refreshToken);

  try {
    await seedFirestore();
    await ensureAdminUser();
  } finally {
    try {
      unlinkSync(credPath);
    } catch {
      /* ignore */
    }
  }

  console.log('\n=== ADMIN LOGIN ===');
  console.log('URL:      https://kalarang2026.netlify.app/admin/login');
  console.log(`Email:    ${ADMIN_EMAIL}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
  console.log('\n=== PRODUCTS ADDED ===');
  console.log('1. Royal Crimson Banarasi Silk Saree — ₹14,999');
  console.log('2. Emerald Temple Kanjivaram Saree — ₹17,999');
}

main().catch((err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});
