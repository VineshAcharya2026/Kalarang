import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  deleteDoc,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../firebase/config';
import { uploadFile } from '../firebase/storageUpload';
import { HeroVideo } from '../types';

export function useVideos() {
  const [videos, setVideos] = useState<HeroVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Sort by createdAt descending
    const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as HeroVideo[];
        setVideos(items);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        handleFirestoreError(err, OperationType.GET, 'videos');
      }
    );

    return () => unsubscribe();
  }, []);

  const addVideo = async (videoData: Omit<HeroVideo, 'id' | 'createdAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'videos'), {
        ...videoData,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'videos');
    }
  };

  const updateVideo = async (id: string, videoData: Partial<HeroVideo>) => {
    try {
      const docRef = doc(db, 'videos', id);
      await updateDoc(docRef, {
        ...videoData,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `videos/${id}`);
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      const docRef = doc(db, 'videos', id);
      await deleteDoc(docRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `videos/${id}`);
    }
  };

  const uploadVideoFile = (file: File, onProgress: (progress: number) => void): Promise<string> =>
    uploadFile(file, { folder: 'hero-videos', maxSizeMb: 5, onProgress });

  return {
    videos,
    loading,
    error,
    addVideo,
    updateVideo,
    deleteVideo,
    uploadVideoFile,
  };
}
