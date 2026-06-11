import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { ensureAdminAuth } from '../auth';
import { getFirebaseErrorMessage } from '../firebase/errors';
import { Product } from '../types';

function stripUndefined<T extends Record<string, unknown>>(data: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'products'),
      where('isDeleted', '==', false),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((snap) => ({
          id: snap.id,
          ...snap.data(),
        })) as Product[];
        setProducts(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        const message = getFirebaseErrorMessage(err, 'Failed to load products.');
        setError(message);
        setLoading(false);
        console.error('Products snapshot error:', err);
      }
    );

    return () => unsubscribe();
  }, []);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'isDeleted'>) => {
    try {
      await ensureAdminAuth();

      const docId = productData.slug;
      if (!docId) {
        throw new Error('Product slug is required.');
      }

      const existing = await getDoc(doc(db, 'products', docId));
      if (existing.exists() && !existing.data()?.isDeleted) {
        throw new Error(
          `A product named similarly already exists (slug: ${docId}). Use a different display name.`
        );
      }

      await setDoc(doc(db, 'products', docId), {
        ...productData,
        isDeleted: false,
        createdAt: serverTimestamp(),
      });

      return docId;
    } catch (err) {
      throw new Error(getFirebaseErrorMessage(err, 'Failed to add product.'));
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      await ensureAdminAuth();

      const { id: _id, createdAt: _createdAt, ...updates } = productData;
      const payload = stripUndefined({
        ...updates,
        updatedAt: serverTimestamp(),
      });

      await updateDoc(doc(db, 'products', id), payload);
    } catch (err) {
      throw new Error(getFirebaseErrorMessage(err, 'Failed to update product.'));
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await ensureAdminAuth();
      await updateDoc(doc(db, 'products', id), {
        isDeleted: true,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      throw new Error(getFirebaseErrorMessage(err, 'Failed to delete product.'));
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
