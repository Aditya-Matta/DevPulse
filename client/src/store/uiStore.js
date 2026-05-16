import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUIStore = create(
  persist(
    (set, get) => ({
      theme: 'light', // default is now light (warm minimal)
      sidebarOpen: true,
      notifications: [],

      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: next });
        document.documentElement.classList.toggle('dark', next === 'dark');
      },

      initTheme: () => {
        const { theme } = get();
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (v) => set({ sidebarOpen: v }),

      addNotification: (notification) => {
        const id = Date.now();
        set((state) => ({ notifications: [...state.notifications, { id, ...notification }] }));
        setTimeout(() => get().removeNotification(id), notification.duration || 4000);
      },

      removeNotification: (id) =>
        set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) })),
    }),
    {
      name: 'devpulse-ui',
      partialState: (state) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen }),
    }
  )
);

export default useUIStore;
