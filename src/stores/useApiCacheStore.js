// src/stores/useApiCacheStore.js
/**
 * کش نتایج API برای عملکرد بهتر
 *
 * استراتژی:
 * - Cache-First برای داده‌های کم‌تغییر (دسته‌بندی‌ها، استان‌ها)
 * - Network-First برای داده‌های پویا (نوبت‌ها، اعلان‌ها)
 * - TTL (Time To Live) برای انقضای کش
 *
 * ⚠️ این استور persist نمی‌شود (فقط حافظه runtime)
 */
import { create } from 'zustand';

const CACHE_TTL = {
  categories: 24 * 60 * 60 * 1000,
  provinces: 24 * 60 * 60 * 1000,
  cities: 24 * 60 * 60 * 1000,
  businessDetail: 5 * 60 * 1000,
  services: 5 * 60 * 1000,
  appointments: 60 * 1000,
  notifications: 60 * 1000,
  default: 2 * 60 * 1000,
};

export const useApiCacheStore = create((set, get) => ({
  // ─── State ───
  cache: {},

  // ─── Actions ───
  setCache: (key, data, ttl = CACHE_TTL.default) => {
    set((state) => ({
      cache: {
        ...state.cache,
        [key]: {
          data,
          timestamp: Date.now(),
          ttl,
        },
      },
    }));
  },

  getCache: (key) => {
    const { cache } = get();
    const entry = cache[key];
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      set((state) => {
        const { [key]: _, ...rest } = state.cache;
        return { cache: rest };
      });
      return null;
    }

    return entry.data;
  },

  hasCache: (key) => {
    const { cache } = get();
    return key in cache;
  },

  invalidateCache: (key) => {
    set((state) => {
      const { [key]: _, ...rest } = state.cache;
      return { cache: rest };
    });
  },

  invalidateCacheByPrefix: (prefix) => {
    set((state) => {
      const filtered = Object.fromEntries(
        Object.entries(state.cache).filter(([key]) => !key.startsWith(prefix))
      );
      return { cache: filtered };
    });
  },

  clearCache: () => {
    set({ cache: {} });
  },

  pruneExpiredCache: () => {
    set((state) => {
      const now = Date.now();
      const filtered = Object.fromEntries(
        Object.entries(state.cache).filter(([_, entry]) => now - entry.timestamp <= entry.ttl)
      );
      return { cache: filtered };
    });
  },

  // ═══════════════════════════════════════════════════════
  // ✅ F-06 Fix: پاک‌سازی کامل کش هنگام لاگه‌اوت
  // ═══════════════════════════════════════════════════════
  // ⚠️ این استور persist نیست، پس فقط state را خالی می‌کنیم
  clearAll: () => {
    set({ cache: {} });
  },
}));

// ═══════════════════════════════════════════
//    Hook کمکی: useCachedData
// ═══════════════════════════════════════════
export const useCachedData = (key, fetchFn, options = {}) => {
  const { ttl = CACHE_TTL.default, forceRefresh = false } = options;
  const getCache = useApiCacheStore((s) => s.getCache);
  const setCache = useApiCacheStore((s) => s.setCache);

  const cachedData = getCache(key);

  const refresh = async () => {
    try {
      const data = await fetchFn();
      setCache(key, data, ttl);
      return data;
    } catch (error) {
      throw error;
    }
  };

  return {
    data: cachedData,
    isLoading: !cachedData,
    refresh,
  };
};

export { CACHE_TTL };