'use client';

import { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { useAuthStore } from '@/stores/useAuthStore';

export default function AuthProvider({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const lastRefreshRef = useRef(0);
  const lastSessionCheckRef = useRef(0);

  useEffect(() => {
    const platform = Capacitor.getPlatform();
    const MIN_REFRESH_INTERVAL = 60 * 1000; // حداقل ۱ دقیقه
    const MIN_SESSION_CHECK_INTERVAL = 5 * 60 * 1000; // حداقل ۵ دقیقه

    const handleRefresh = async () => {
      const now = Date.now();
      const authStore = useAuthStore.getState();

      // ─── Token Refresh مرکزی ───
      if (now - lastRefreshRef.current >= MIN_REFRESH_INTERVAL) {
        lastRefreshRef.current = now;

        try {
          if (typeof authStore.refreshSessionToken === 'function') {
            await authStore.refreshSessionToken();
          }
        } catch (error) {
          console.warn('Activity-based refresh skipped:', error?.message || error);
        }
      }

      // ─── Session Status Check مرکزی ───
      if (now - lastSessionCheckRef.current >= MIN_SESSION_CHECK_INTERVAL) {
        lastSessionCheckRef.current = now;

        try {
          if (typeof authStore.checkSessionStatus === 'function') {
            await authStore.checkSessionStatus();
          }
        } catch (error) {
          console.warn('Session status check skipped:', error?.message || error);
        }
      }
    };

    // ─── Web: visibilitychange ───
    if (platform === 'web' && typeof document !== 'undefined') {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && isAuthenticated) {
          handleRefresh();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }

    // ─── Android/iOS: appStateChange ───
    if (platform === 'android' || platform === 'ios') {
      let listener = null;
      let isMounted = true;

      CapApp.addListener('appStateChange', ({ isActive }) => {
        if (isMounted && isActive && isAuthenticated) {
          handleRefresh();
        }
      }).then((pluginListener) => {
        if (isMounted) {
          listener = pluginListener;
        } else {
          pluginListener.remove();
        }
      });

      return () => {
        isMounted = false;
        if (listener) {
          listener.remove();
          listener = null;
        }
      };
    }

    return undefined;
  }, [isAuthenticated]);

  return <>{children}</>;
}