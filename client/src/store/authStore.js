import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/axios';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),

      logout: async () => {
        try { await api.post('/api/auth/logout'); } catch {}
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      setToken: (accessToken) => set({ accessToken }),

      setUser: (user) => set({ user }),

      updateUser: (partial) => set((state) => ({ user: { ...state.user, ...partial } })),
    }),
    {
      name: 'devpulse-auth',
      partialState: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      // Don't persist accessToken — it's refreshed via cookie on reload
    }
  )
);

export default useAuthStore;
