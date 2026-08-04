// src/stores/useNetworkStore.js
'use client';
import { create } from 'zustand';

export const useNetworkStore = create((set, get) => ({
  isConnected: true,
  isInternetReachable: true,
  connectionType: 'unknown',
  showOfflineBanner: false,
  _initialized: false,

  init: () => {
    if (typeof window === 'undefined') return null;

    // جلوگیری از init چندباره
    if (get()._initialized) return null;
    set({ _initialized: true });

    const updateStatus = () => {
      const connected = navigator.onLine;
      set({
        isConnected: connected,
        isInternetReachable: connected,
        connectionType: connected ? 'online' : 'offline',
      });
      if (!connected) {
        set({ showOfflineBanner: true });
      } else {
        setTimeout(() => set({ showOfflineBanner: false }), 1500);
      }
    };

    updateStatus();

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      set({ _initialized: false });
    };
  },

  dismissBanner: () => set({ showOfflineBanner: false }),
}));