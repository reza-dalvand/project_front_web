// src/stores/useNetworkStore.js
'use client';
import { create } from 'zustand';

export const useNetworkStore = create((set) => ({
  isConnected: true,
  isInternetReachable: true,
  connectionType: 'unknown',
  showOfflineBanner: false,

  // مقداردهی اولیه و گوش دادن به تغییرات شبکه
  init: () => {
    if (typeof window === 'undefined') return null;

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

    // بررسی اولیه
    updateStatus();

    // گوش دادن به رویدادها
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  },

  // بستن بنر آفلاین
  dismissBanner: () => set({ showOfflineBanner: false }),
}));