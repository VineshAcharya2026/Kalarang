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
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage, OperationType, handleFirestoreError } from '../firebase/config';
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

  // Upload progress tracking
  const uploadVideoFile = (
    file: File, 
    onProgress: (progress: number) => void
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Create a unique file name
      const uniqueName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const storageRef = ref(storage, `hero-videos/${uniqueName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => {
          console.error('Video upload to Firebase Storage failed:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  };

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
