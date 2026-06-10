import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy,
  deleteDoc
} from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../firebase/config';
import { Collection } from '../types';

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'collections'), orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Collection[];
        setCollections(items);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        handleFirestoreError(err, OperationType.GET, 'collections');
      }
    );

    return () => unsubscribe();
  }, []);

  const addCollection = async (collectionData: Omit<Collection, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'collections'), {
        ...collectionData,
      });
      return docRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'collections');
    }
  };

  const updateCollection = async (id: string, collectionData: Partial<Collection>) => {
    try {
      const docRef = doc(db, 'collections', id);
      await updateDoc(docRef, {
        ...collectionData,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `collections/${id}`);
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      const docRef = doc(db, 'collections', id);
      await deleteDoc(docRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `collections/${id}`);
    }
  };

  return {
    collections,
    loading,
    error,
    addCollection,
    updateCollection,
    deleteCollection,
  };
}
