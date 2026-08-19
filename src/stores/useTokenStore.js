// src/stores/useTokenStore.js
/**
 * مدیریت توکن‌های JWT
 * هماهنگ با بک‌اند:
 *   - Access Token: ۱ ساعت اعتبار
 *   - Refresh Token: ۳۰ روز اعتبار با Rotation
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { JWT_CONFIG } from '@/api/config';
import { decodeJWT, isTokenExpired, getTokenRemainingTime } from '@/utils/jwt-utils';

export const useTokenStore = create(
  persist(
    (set, get) => ({
      // ─── State ───
      accessToken: null,
      refreshToken: null,
      tokenType: JWT_CONFIG.TOKEN_TYPE,

      // ─── Actions ───

      /**
       * ذخیره توکن‌های جدید
       * @param {object} tokens - { access, refresh, expiresIn }
       */
      setTokens: ({ access, refresh }) => {
        set({
          accessToken: access,
          refreshToken: refresh,
          tokenType: JWT_CONFIG.TOKEN_TYPE,
        });
      },

      /**
       * بروزرسانی فقط Access Token
       */
      updateAccessToken: (newAccessToken) => {
        set({ accessToken: newAccessToken });
      },

      /**
       * بروزرسانی Refresh Token (در صورت rotation)
       */
      updateRefreshToken: (newRefreshToken) => {
        set({ refreshToken: newRefreshToken });
      },

      /**
       * پاک کردن همه توکن‌ها
       */
      clearTokens: () => {
        set({ accessToken: null, refreshToken: null });
      },

      // ─── Getters ───

      getAccessToken: () => get().accessToken,
      getRefreshToken: () => get().refreshToken,

      hasValidAccessToken: () => {
        const { accessToken } = get();
        if (!accessToken) return false;
        return !isTokenExpired(accessToken);
      },

      isTokenExpiringSoon: () => {
        const { accessToken } = get();
        if (!accessToken) return false;
        const remaining = getTokenRemainingTime(accessToken);
        return remaining > 0 && remaining < 5 * 60 * 1000;
      },

      getUserIdFromToken: () => {
        const { accessToken } = get();
        if (!accessToken) return null;
        const payload = decodeJWT(accessToken);
        return payload?.user_id || null;
      },
    }),
    {
      name: 'beau-token-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
