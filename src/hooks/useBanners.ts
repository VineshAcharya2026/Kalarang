import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  deleteDoc
} from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../firebase/config';
import { Banner } from '../types';

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'banners'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Banner[];
        setBanners(items);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        handleFirestoreError(err, OperationType.GET, 'banners');
      }
    );

    return () => unsubscribe();
  }, []);

  const addBanner = async (bannerData: Omit<Banner, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'banners'), {
        ...bannerData,
      });
      return docRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'banners');
    }
  };

  const updateBanner = async (id: string, bannerData: Partial<Banner>) => {
    try {
      const docRef = doc(db, 'banners', id);
      await updateDoc(docRef, {
        ...bannerData,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `banners/${id}`);
    }
  };

  const deleteBanner = async (id: string) => {
    try {
      const docRef = doc(db, 'banners', id);
      await deleteDoc(docRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `banners/${id}`);
    }
  };

  return {
    banners,
    loading,
    error,
    addBanner,
    updateBanner,
    deleteBanner,
  };
}
