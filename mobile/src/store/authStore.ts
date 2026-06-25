import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/api/client';

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  avatar?: string;
  premiumUntil?: string;
  city?: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role?: string }) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const user = await api.login(email, password);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Giriş başarısız';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      register: async (data: { name: string; email: string; password: string; role?: string }) => {
        set({ isLoading: true, error: null });
        try {
          const user = await api.register(data);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Kayıt başarısız';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      googleLogin: async (idToken: string) => {
        set({ isLoading: true, error: null });
        try {
          const user = await api.googleLogin(idToken);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Google girişi başarısız';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await api.logout();
        } catch {
          // Ignore logout API errors
        } finally {
          await SecureStore.deleteItemAsync('accessToken');
          await SecureStore.deleteItemAsync('refreshToken');
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: !!user });
      },

      clearError: () => {
        set({ error: null });
      },

      initializeAuth: async () => {
        try {
          const token = await SecureStore.getItemAsync('accessToken');
          if (token) {
            const user = await api.getProfile();
            set({ user, isAuthenticated: true });
          }
        } catch {
          // Token invalid or expired
          await SecureStore.deleteItemAsync('accessToken');
          await SecureStore.deleteItemAsync('refreshToken');
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);