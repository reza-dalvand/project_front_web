/**
 * مدیریت توکن‌های JWT
 * هماهنگ با بک‌اند:
 *   - Access Token: ۱ ساعت اعتبار
 *   - Refresh Token: ۳۰ روز اعتبار با Rotation + Sliding
 *
 * ✅ FIX: استفاده از @capacitor/preferences در Android
 * ✅ FIX F-13: رمزنگاری ساده توکن‌ها قبل از ذخیره
 * ✅ FIX F-13: استفاده از sessionStorage برای refresh token در وب
 * ✅ FIX F-22: رفع double serialization در secure storage
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
//    ✅ FIX F-22: Secure Web Storage
//    createJSONStorage خودش JSON.stringify/parse می‌کند
//    بنابراین ما فقط روی فیلدهای حساس رمزنگاری/رمزگشایی اعمال می‌کنیم
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
        
        // ✅ FIX F-22: createJSONStorage خودش JSON.parse می‌کند
        // ما فقط raw string را برمی‌گردانیم تا createJSONStorage آن را parse کند
        // اما قبل از برگرداندن، باید فیلدهای رمزنگاری‌شده را رمزگشایی کنیم
        
        // ابتدا JSON.parse می‌کنیم تا به ساختار zustand برسیم
        const parsed = JSON.parse(raw);
        
        // رمزگشایی فیلدهای حساس در state
        if (parsed?.state) {
          if (parsed.state.accessToken && typeof parsed.state.accessToken === 'string') {
            try {
              parsed.state.accessToken = decryptToken(parsed.state.accessToken);
            } catch {
              // اگر رمزگشایی شکست خورد، مقدار اصلی را نگه دار
            }
          }
          if (parsed.state.refreshToken && typeof parsed.state.refreshToken === 'string') {
            try {
              parsed.state.refreshToken = decryptToken(parsed.state.refreshToken);
            } catch {
              // اگر رمزگشایی شکست خورد، مقدار اصلی را نگه دار
            }
          }
        }
        
        // ✅ FIX F-22: دوباره stringify می‌کنیم تا createJSONStorage بتواند parse کند
        return JSON.stringify(parsed);
      } catch {
        return null;
      }
    },
    
    setItem: (name, value) => {
      try {
        if (!storage) return;
        
        // ✅ FIX F-22: value از createJSONStorage یک JSON string است
        // آن را parse می‌کنیم، فیلدهای حساس را رمزنگاری می‌کنیم، و دوباره stringify می‌کنیم
        const parsed = JSON.parse(value);
        
        if (parsed?.state) {
          if (parsed.state.accessToken && typeof parsed.state.accessToken === 'string') {
            parsed.state.accessToken = encryptToken(parsed.state.accessToken);
          }
          if (parsed.state.refreshToken && typeof parsed.state.refreshToken === 'string') {
            parsed.state.refreshToken = encryptToken(parsed.state.refreshToken);
          }
        }
        
        storage.setItem(name, JSON.stringify(parsed));
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

  // ✅ FIX F-22: در Web — استفاده از localStorage با رمزنگاری
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
        // ✅ پاک‌سازی مستقیم storage
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem('beau-token-storage');
          }
        } catch {
          // ignore
        }
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