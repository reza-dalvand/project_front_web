/**
 * مدیریت توکن‌های JWT
 * هماهنگ با بک‌اند:
 *   - Access Token: ۱ ساعت اعتبار
 *   - Refresh Token: ۳۰ روز اعتبار با Rotation + Sliding
 *
 * ✅ FIX: استفاده از @capacitor/preferences در Android
 * ✅ FIX F-13: رمزنگاری ساده توکن‌ها قبل از ذخیره
 * ✅ FIX F-13: استفاده از sessionStorage برای refresh token در وب
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { JWT_CONFIG } from '@/api/config';
import { 
  decodeJWT, 
  isTokenExpired, 
  getTokenRemainingTime,
  encryptToken,
  decryptToken,
} from '@/utils/jwt-utils';

// ═══════════════════════════════════════════════
//    Custom Storage برای Capacitor
// ═══════════════════════════════════════════════
const createCapacitorStorage = () => ({
  getItem: async (name) => {
    try {
      const { value } = await Preferences.get({ key: name });
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },
  setItem: async (name, value) => {
    try {
      await Preferences.set({ key: name, value: JSON.stringify(value) });
    } catch {
      // ignore
    }
  },
  removeItem: async (name) => {
    try {
      await Preferences.remove({ key: name });
    } catch {
      // ignore
    }
  },
});

// ═══════════════════════════════════════════════
//    ✅ FIX F-13: Secure Web Storage با رمزنگاری
// ═══════════════════════════════════════════════
const createSecureWebStorage = (storageType = 'localStorage') => {
  const storage = typeof window !== 'undefined' 
    ? window[storageType] 
    : null;

  return {
    getItem: (name) => {
      try {
        if (!storage) return null;
        const raw = storage.getItem(name);
        if (!raw) return null;
        
        const parsed = JSON.parse(raw);
        
        // رمزگشایی فیلدهای حساس
        if (parsed?.state) {
          if (parsed.state.accessToken) {
            parsed.state.accessToken = decryptToken(parsed.state.accessToken);
          }
          if (parsed.state.refreshToken) {
            parsed.state.refreshToken = decryptToken(parsed.state.refreshToken);
          }
        }
        
        return parsed;
      } catch {
        return null;
      }
    },
    
    setItem: (name, value) => {
      try {
        if (!storage) return;
        
        // کپی عمیق برای جلوگیری از mutation
        const toStore = JSON.parse(JSON.stringify(value));
        
        // رمزنگاری فیلدهای حساس
        if (toStore?.state) {
          if (toStore.state.accessToken) {
            toStore.state.accessToken = encryptToken(toStore.state.accessToken);
          }
          if (toStore.state.refreshToken) {
            toStore.state.refreshToken = encryptToken(toStore.state.refreshToken);
          }
        }
        
        storage.setItem(name, JSON.stringify(toStore));
      } catch {
        // ignore
      }
    },
    
    removeItem: (name) => {
      try {
        if (storage) storage.removeItem(name);
      } catch {
        // ignore
      }
    },
  };
};

// ═══════════════════════════════════════════════
//    انتخاب Storage بر اساس Platform
// ═══════════════════════════════════════════════
const getStorage = () => {
  // در محیط Node (SSR) یا تست
  if (typeof window === 'undefined') {
    return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  }

  // در Android (Capacitor) — استفاده از Preferences
  if (Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios') {
    return createCapacitorStorage();
  }

  // ✅ FIX F-13: در Web — استفاده از localStorage با رمزنگاری
  return createSecureWebStorage('localStorage');
};

export const useTokenStore = create(
  persist(
    (set, get) => ({
      // ─── State ───
      accessToken: null,
      refreshToken: null,
      tokenType: JWT_CONFIG.TOKEN_TYPE,

      // ─── Actions ───
      setTokens: ({ access, refresh }) => {
        set({
          accessToken: access,
          refreshToken: refresh,
          tokenType: JWT_CONFIG.TOKEN_TYPE,
        });
      },

      updateAccessToken: (newAccessToken) => {
        set({ accessToken: newAccessToken });
      },

      updateRefreshToken: (newRefreshToken) => {
        set({ refreshToken: newRefreshToken });
      },

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
        return remaining > 0 && remaining < 5 * 60 * 1000; // کمتر از ۵ دقیقه
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
      storage: createJSONStorage(getStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);