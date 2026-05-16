import { create } from 'zustand';
import api from '../lib/axios';

const useInterviewStore = create((set, get) => ({
  interviews: [],
  total: 0,
  pages: 1,
  currentPage: 1,
  loading: false,
  error: null,
  filters: {
    outcome: '',
    company: '',
    topic: '',
    startDate: '',
    endDate: '',
    search: '',
  },

  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters }, currentPage: 1 })),
  clearFilters: () => set({ filters: { outcome: '', company: '', topic: '', startDate: '', endDate: '', search: '' }, currentPage: 1 }),
  setPage: (page) => set({ currentPage: page }),

  fetchInterviews: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      params.append('page', page);
      const res = await api.get(`/api/interviews?${params}`);
      set({
        interviews: res.data.data.interviews,
        total: res.data.data.total,
        pages: res.data.data.pages,
        currentPage: page,
        loading: false,
      });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch', loading: false });
    }
  },

  addInterview: (interview) => set((state) => ({ interviews: [interview, ...state.interviews], total: state.total + 1 })),

  updateInterview: (id, updated) => set((state) => ({
    interviews: state.interviews.map((i) => (i._id === id ? updated : i)),
  })),

  removeInterview: (id) => set((state) => ({
    interviews: state.interviews.filter((i) => i._id !== id),
    total: state.total - 1,
  })),
}));

export default useInterviewStore;
