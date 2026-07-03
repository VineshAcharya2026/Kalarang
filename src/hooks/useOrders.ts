import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy,
  where,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../firebase/config';
import { Order } from '../types';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Read orders in real-time (snapshots) for admins
  const subscribeToOrders = (onData: (data: Order[]) => void, onError: (err: Error) => void) => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    
    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        onData(items);
      },
      (err) => {
        onError(err);
        handleFirestoreError(err, OperationType.GET, 'orders');
      }
    );
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'orders');
    }
  };

  const getOrdersByPhone = async (phone: string): Promise<Order[]> => {
    const normalizedPhone = phone.replace(/[^0-9]/g, '');
    if (!normalizedPhone) return [];

    try {
      const q = query(collection(db, 'orders'), where('phone', '==', normalizedPhone));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Order[];
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'orders');
      return [];
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const docRef = doc(db, 'orders', id);
      await updateDoc(docRef, {
        status,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${id}`);
    }
  };

  return {
    addOrder,
    getOrdersByPhone,
    updateOrderStatus,
    subscribeToOrders,
  };
}
