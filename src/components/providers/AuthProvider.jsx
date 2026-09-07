'use client';

import { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTokenStore } from '@/stores/useTokenStore';
import { authService } from '@/api';

/**
 * AuthProvider — مدیریت Session Persistence
 * 
 * مسئولیت‌ها:
 * ۱. Rehydration از storage در startup
 * ۲. Refresh token هنگام بازگشت کاربر به اپ (visibilitychange / appStateChange)
 * ۳. جلوگیری از logout خودکار
 */
export default function AuthProvider({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const lastRefreshRef = useRef(0);

  useEffect(() => {
    const platform = Capacitor.getPlatform();
    const MIN_REFRESH_INTERVAL = 60 * 1000; // حداقل ۱ دقیقه بین refresh ها

    const handleRefresh = async () => {
      const now = Date.now();
      if (now - lastRefreshRef.current < MIN_REFRESH_INTERVAL) {
        return; // جلوگیری از refresh مکرر
      }
      
      const { refreshToken } = useTokenStore.getState();
      if (!refreshToken) return;

      lastRefreshRef.current = now;
      
      try {
        const result = await authService.refreshToken(refreshToken);
        
        // ✅ FIX: Defensive programming — بررسی ساختار response
        const data = result?.data;
        if (!data || !data.access) {
          console.warn('Invalid refresh response structure:', result);
          return;
        }
        
        useTokenStore.getState().setTokens({
          access: data.access,
          refresh: data.refresh || refreshToken,
        });
        
        console.log('✅ Token refreshed successfully');
      } catch (error) {
        console.warn('Activity-based refresh failed:', error?.message || error);
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
      let listener;
      
      CapApp.addListener('appStateChange', ({ isActive }) => {
        if (isActive && isAuthenticated) {
          handleRefresh();
        }
      }).then((l) => {
        listener = l;
      });

      return () => {
        if (listener) {
          listener.remove();
        }
      };
    }
  }, [isAuthenticated]);

  return <>{children}</>;
}