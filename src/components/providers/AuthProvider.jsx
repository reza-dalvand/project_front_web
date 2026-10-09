'use client';

import { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTokenStore } from '@/stores/useTokenStore';
import { authService } from '@/api';
import { isTokenExpiringSoon } from '@/utils/jwt-utils';

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
      
      // ─── Token Refresh ───
      if (now - lastRefreshRef.current >= MIN_REFRESH_INTERVAL) {
        const { accessToken, refreshToken } = useTokenStore.getState();
        
        if (refreshToken && isTokenExpiringSoon(accessToken)) {
          lastRefreshRef.current = now;
          try {
            const result = await authService.refreshToken(refreshToken);
            const data = result?.data;
            if (data?.access) {
              useTokenStore.getState().setTokens({
                access: data.access,
                refresh: data.refresh || refreshToken,
              });
            }
          } catch (error) {
            console.warn('Activity-based refresh skipped:', error?.message || error);
          }
        }
      }

      // ─── Session Status Check ───
      if (now - lastSessionCheckRef.current >= MIN_SESSION_CHECK_INTERVAL) {
        lastSessionCheckRef.current = now;
        try {
          const result = await authService.getSessionStatus();
          const data = result?.data;
          if (data) {
            const authStore = useAuthStore.getState();
            authStore.setSuspensionStatus(
              data.isSuspended ?? false,
              data.suspensionReason ?? ''
            );
            if (data.isDeactivated) {
              authStore.logout();
            }
          }
        } catch (error) {
          console.warn('Session status check skipped:', error?.message);
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
      let isMounted = true; // ✅ FIX F-20: محافظت در برابر unmount قبل از resolve

      CapApp.addListener('appStateChange', ({ isActive }) => {
        // ✅ FIX F-20: فقط اگر کامپوننت هنوز mounted است اجرا شود
        if (isMounted && isActive && isAuthenticated) {
          handleRefresh();
        }
      }).then((pluginListener) => {
        if (isMounted) {
          listener = pluginListener;
        } else {
          // ✅ FIX F-20: کامپوننت قبل از resolve شدن unmount شده
          // listener را فوراً remove کن
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

    // Fallback: هیچ cleanup لازم نیست
    return undefined;
  }, [isAuthenticated]);

  return <>{children}</>;
}