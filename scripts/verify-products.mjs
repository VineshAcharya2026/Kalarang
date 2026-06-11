import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ids = ['royal-crimson-banarasi-silk-saree', 'emerald-temple-kanjivaram-saree'];

for (const id of ids) {
  const snap = await getDoc(doc(db, 'products', id));
  if (snap.exists()) {
    const p = snap.data();
    console.log(`✓ ${p.name} — ₹${p.salePrice.toLocaleString('en-IN')}`);
  } else {
    console.log(`✗ Missing: ${id}`);
  }
}
