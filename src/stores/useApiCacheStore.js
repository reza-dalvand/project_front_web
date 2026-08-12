// src/stores/useApiCacheStore.js
/**
 * کش نتایج API برای عملکرد بهتر
 *
 * استراتژی:
 * - Cache-First برای داده‌های کم‌تغییر (دسته‌بندی‌ها، استان‌ها)
 * - Network-First برای داده‌های پویا (نوبت‌ها، اعلان‌ها)
 * - TTL (Time To Live) برای انقضای کش
 */
import { create } from 'zustand';

// TTL پیش‌فرض برای هر نوع داده (میلی‌ثانیه)
const CACHE_TTL = {
  categories: 24 * 60 * 60 * 1000, // ۲۴ ساعت
  provinces: 24 * 60 * 60 * 1000, // ۲۴ ساعت
  cities: 24 * 60 * 60 * 1000, // ۲۴ ساعت
  businessDetail: 5 * 60 * 1000, // ۵ دقیقه
  services: 5 * 60 * 1000, // ۵ دقیقه
  appointments: 60 * 1000, // ۱ دقیقه
  notifications: 60 * 1000, // ۱ دقیقه
  default: 2 * 60 * 1000, // ۲ دقیقه
};

export const useApiCacheStore = create((set, get) => ({
  // ─── State ───
  cache: {}, // { [key]: { data, timestamp, ttl } }

  // ─── Actions ───
  /**
   * ذخیره داده در کش
   * @param {string} key - کلید یکتا
   * @param {any} data - داده
   * @param {number} ttl - زمان انقضا (میلی‌ثانیه)
   */
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

  /**
   * دریافت داده از کش (اگر منقضی نشده باشد)
   * @param {string} key
   * @returns {any|null}
   */
  getCache: (key) => {
    const { cache } = get();
    const entry = cache[key];
    if (!entry) return null;

    // بررسی انقضا
    if (Date.now() - entry.timestamp > entry.ttl) {
      // منقضی شده — حذف از کش
      set((state) => {
        const { [key]: _, ...rest } = state.cache;
        return { cache: rest };
      });
      return null;
    }

    return entry.data;
  },

  /**
   * بررسی وجود داده در کش (بدون بررسی انقضا)
   * @param {string} key
   * @returns {boolean}
   */
  hasCache: (key) => {
    const { cache } = get();
    return key in cache;
  },

  /**
   * حذف یک آیتم از کش
   * @param {string} key
   */
  invalidateCache: (key) => {
    set((state) => {
      const { [key]: _, ...rest } = state.cache;
      return { cache: rest };
    });
  },

  /**
   * حذف همه آیتم‌های مرتبط با یک پیشوند
   * @param {string} prefix - مثلاً 'appointments_'
   */
  invalidateCacheByPrefix: (prefix) => {
    set((state) => {
      const filtered = Object.fromEntries(
        Object.entries(state.cache).filter(([key]) => !key.startsWith(prefix))
      );
      return { cache: filtered };
    });
  },

  /**
   * پاک کردن کل کش
   */
  clearCache: () => {
    set({ cache: {} });
  },

  /**
   * پاک کردن کش‌های منقضی‌شده
   */
  pruneExpiredCache: () => {
    set((state) => {
      const now = Date.now();
      const filtered = Object.fromEntries(
        Object.entries(state.cache).filter(([_, entry]) => now - entry.timestamp <= entry.ttl)
      );
      return { cache: filtered };
    });
  },
}));

// ═══════════════════════════════════════════
//    Hook کمکی: useCachedData
// ═══════════════════════════════════════════
/**
 * Hook برای دریافت داده با کش
 * @param {string} key
 * @param {function} fetchFn - تابع دریافت داده از API
 * @param {object} options - { ttl, forceRefresh }
 * @returns {{ data, isLoading, error, refresh }}
 */
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

// ═══════════════════════════════════════════
//    ثابت‌های TTL برای استفاده در سرویس‌ها
// ═══════════════════════════════════════════
export { CACHE_TTL };
