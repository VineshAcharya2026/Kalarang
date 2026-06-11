import { create } from 'zustand';
import type { User } from 'firebase/auth';
import { initAuthPersistence, subscribeToAuth } from '../auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));

initAuthPersistence().then(() => {
  subscribeToAuth((user) => {
    useAuthStore.getState().setUser(user);
    useAuthStore.getState().setLoading(false);
  });
});
