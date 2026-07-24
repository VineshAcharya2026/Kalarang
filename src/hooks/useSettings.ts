import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../firebase/config';
import { Settings } from '../types';

const DEFAULT_SETTINGS: Settings = {
  storeName: 'KALARANG — Silks & Studio',
  whatsappNumber: '919108955445',
  email: 'studio@kalarang.com',
  studioAddress: '',
  announcementBar: {
    enabled: true,
    text: '✨ Every first order 10% off ✨'
  },
  freeShippingThreshold: 5000,
  firstOrderDiscount: { enabled: true, percent: 10 },
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const docRef = doc(db, 'settings', 'main');

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setSettings(snapshot.data() as Settings);
        } else {
          // Document does not exist yet; try seeding default settings
          setDoc(docRef, DEFAULT_SETTINGS).catch((err) => {
            console.warn('Failed to seed default settings (expected if not admin yet):', err);
          });
          setSettings(DEFAULT_SETTINGS);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        handleFirestoreError(err, OperationType.GET, 'settings/main');
      }
    );

    return () => unsubscribe();
  }, []);

  const saveSettings = async (newSettings: Settings) => {
    try {
      const docRef = doc(db, 'settings', 'main');
      await setDoc(docRef, newSettings);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/main');
    }
  };

  return {
    settings,
    loading,
    error,
    saveSettings,
  };
}
