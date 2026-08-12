// src/stores/useTokenStore.js
/**
 * مدیریت توکن‌های JWT
 * Access Token + Refresh Token با persist در localStorage
 *
 * هماهنگ با بک‌اند:
 * - Access Token: ۱ ساعت اعتبار
 * - Refresh Token: ۳۰ روز اعتبار با Rotation
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
      tokenType: JWT_CONFIG.TOKEN_TYPE, // 'Bearer'
      accessTokenExpiry: null, // timestamp (اختیاری، از decode خود توکن هم می‌شود استفاده کرد)

      // ─── Actions ───
      /**
       * ذخیره توکن‌های جدید پس از لاگین یا refresh
       * @param {object} tokens - { access, refresh, expiresIn }
       */
      setTokens: ({ access, refresh, expiresIn }) => {
        set({
          accessToken: access,
          refreshToken: refresh,
          tokenType: JWT_CONFIG.TOKEN_TYPE,
          accessTokenExpiry: expiresIn ? Date.now() + expiresIn * 1000 : null,
        });
      },

      /**
       * بروزرسانی فقط Access Token (پس از refresh)
       * @param {string} newAccessToken
       */
      updateAccessToken: (newAccessToken) => {
        set({
          accessToken: newAccessToken,
          accessTokenExpiry: null, // از decode خود توکن استفاده می‌شود
        });
      },

      /**
       * پاک کردن همه توکن‌ها (خروج از حساب)
       */
      clearTokens: () => {
        set({
          accessToken: null,
          refreshToken: null,
          accessTokenExpiry: null,
        });
      },

      // ─── Getters ───
      /**
       * دریافت Access Token فعلی
       * @returns {string|null}
       */
      getAccessToken: () => get().accessToken,

      /**
       * دریافت Refresh Token فعلی
       * @returns {string|null}
       */
      getRefreshToken: () => get().refreshToken,

      /**
       * بررسی اعتبار Access Token
       * @returns {boolean} - true اگر توکن معتبر باشد
       */
      hasValidAccessToken: () => {
        const { accessToken } = get();
        if (!accessToken) return false;
        return !isTokenExpired(accessToken);
      },

      /**
       * بررسی اینکه توکن به زودی منقضی می‌شود (کمتر از ۵ دقیقه)
       * @returns {boolean}
       */
      isTokenExpiringSoon: () => {
        const { accessToken } = get();
        if (!accessToken) return false;
        const remaining = getTokenRemainingTime(accessToken);
        return remaining > 0 && remaining < 5 * 60 * 1000; // ۵ دقیقه
      },

      /**
       * دریافت user_id از توکن
       * @returns {number|null}
       */
      getUserIdFromToken: () => {
        const { accessToken } = get();
        if (!accessToken) return null;
        const payload = decodeJWT(accessToken);
        return payload?.user_id || null;
      },
    }),
    {
      name: 'zibano-token-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        accessTokenExpiry: state.accessTokenExpiry,
      }),
    }
  )
);
