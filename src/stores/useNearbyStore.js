// src/stores/useNearbyStore.js
import { create } from 'zustand';

export const useNearbyStore = create((set) => ({
  enabled: false,
  userLocation: null,
  loading: false,
  denied: false,
  maxDistanceKm: 10,

  enable: (location) =>
    set({ enabled: true, userLocation: location, loading: false, denied: false }),

  disable: () => set({ enabled: false, denied: false }),

  setLoading: (loading) => set({ loading }),

  setDenied: (denied) => set({ denied, loading: false }),
}));
