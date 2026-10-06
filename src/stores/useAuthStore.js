/**
 * Store احراز هویت — فاز ۲ (هماهنگ با بک‌اند)
 *
 * ✅ FIX: اضافه کردن Periodic Refresh هر ۵۰ دقیقه
 * ✅ FIX: حذف logout تکراری
 * ✅ FIX F-14: رفع Race Condition با centralized refresh
 * ✅ FIX F-15: اضافه شدن session status check
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { authService } from '@/api';
import { useTokenStore } from './useTokenStore';
import { isTokenExpired, isTokenExpiringSoon } from '@/utils/jwt-utils';
import { usePathname, useRouter } from 'next/navigation';

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

const getStorage = () => {
  if (typeof window === 'undefined') {
    return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  }
  if (Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios') {
    return createCapacitorStorage();
  }
  return localStorage;
};

// ═══════════════════════════════════════════════
//    ✅ FIX F-14: Centralized Refresh Promise
// ═══════════════════════════════════════════════
let refreshPromise = null;

/**
 * رفرش توکن مرکزی — فقط یک رفرش همزمان اجرا می‌شود
 */
const centralizedRefresh = async () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const { refreshToken } = useTokenStore.getState();
      
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const result = await authService.refreshToken(refreshToken);
      const data = result?.data;

      if (!data || !data.access) {
        throw new Error('Invalid refresh response');
      }

      useTokenStore.getState().setTokens({
        access: data.access,
        refresh: data.refresh || refreshToken,
      });

      return data.access;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// ═══════════════════════════════════════════════
//    Periodic Refresh Timer
// ═══════════════════════════════════════════════
let refreshTimer = null;

const startPeriodicRefresh = () => {
  if (refreshTimer) clearInterval(refreshTimer);

  // هر ۵۰ دقیقه (۱۰ دقیقه قبل از انقضای ۱ ساعته)
  refreshTimer = setInterval(
    async () => {
      const { accessToken, refreshToken } = useTokenStore.getState();

      if (!refreshToken) {
        stopPeriodicRefresh();
        return;
      }

      // ✅ FIX F-14: استفاده از centralized refresh
      if (accessToken && isTokenExpiringSoon(accessToken)) {
        try {
          await centralizedRefresh();
        } catch (error) {
          console.warn('Periodic refresh failed:', error);
          stopPeriodicRefresh();
        }
      }
    },
    50 * 60 * 1000
  ); // ۵۰ دقیقه
};

const stopPeriodicRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
};

// ═══════════════════════════════════════════════
//    ۱. Store اصلی احراز هویت
// ═══════════════════════════════════════════════
export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      pendingPhone: null,
      pendingName: null,
      needsProfileCompletion: false,
      isSuspended: false,
      suspensionReason: '',
      _hydrated: false,

      // ✅ FIX F-15: آخرین زمان بررسی وضعیت
      lastSessionCheck: 0,

      setHydrated: () => set({ _hydrated: true }),

      setPendingAuth: (phone, firstName = '', lastName = '') => {
        set({
          pendingPhone: phone,
          pendingName: `${firstName} ${lastName}`.trim(),
        });
      },

      login: (userData, tokens, options = {}) => {
        if (tokens?.accessToken) {
          useTokenStore.getState().setTokens({
            access: tokens.accessToken,
            refresh: tokens.refreshToken,
          });
        }

        set({
          isAuthenticated: true,
          user: {
            id: userData.id,
            phone: userData.phone,
            phoneDisplay: userData.phoneDisplay || userData.phone,
            name:
              userData.fullName ||
              `${userData.firstName || ''} ${userData.lastName || ''}`.trim() ||
              'کاربر بیو کلاب',
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            avatar: userData.avatar || null,
            isVerified: userData.isVerified ?? false,
            isNationalIdVerified: userData.isNationalIdVerified ?? false,
            verifiedName: userData.verifiedName || '',
            dateJoined: userData.dateJoined || '',
          },
          pendingPhone: null,
          pendingName: null,
          needsProfileCompletion: options.needsProfileCompletion ?? false,
          isSuspended: options.isSuspended ?? false,
          suspensionReason: options.suspensionReason ?? '',
          lastSessionCheck: Date.now(),
        });

        startPeriodicRefresh();
      },

      logout: async (allDevices = false) => {
        // ─── ۱. توقف تایمرهای فعال ───
        stopPeriodicRefresh();

        // ─── ۲. فراخوانی API خروج (best-effort) ───
        const refreshToken = useTokenStore.getState().getRefreshToken();
        try {
          if (refreshToken) {
            await authService.logout(refreshToken, allDevices);
          }
        } catch {
          // آفلاین یا خطای شبکه — ادامه می‌دهیم
        }

        // ─── ۳. پاک‌سازی متمرکز تمام استورهای حساس به کاربر ───
        const userSensitiveStores = [
          { name: 'useTokenStore', method: 'clearTokens' },
          { name: 'useBusinessStore', method: 'clearForLogout' },
          { name: 'usePaymentStore', method: 'clearPaymentState' },
          { name: 'useFavoriteStore', method: 'clearForLogout' },
          { name: 'useReviewStore', method: 'clearForLogout' },
          { name: 'useNotificationStore', method: 'clearNotifications' },
          { name: 'useOfflineQueueStore', method: 'clearQueue' },
          { name: 'useApiCacheStore', method: 'clearAll' },
          { name: 'usePriceListStore', method: 'clearForLogout' },
          { name: 'useNearbyStore', method: 'reset' },
        ];

        for (const { name, method } of userSensitiveStores) {
          try {
            const storeModule = await import(`./${name}.js`);
            const store = storeModule[name];
            
            if (store && typeof store.getState === 'function') {
              const state = store.getState();
              if (typeof state[method] === 'function') {
                await state[method]();
              }
            }
          } catch (err) {
            console.warn(`Failed to clear ${name}:`, err?.message);
          }
        }

        // ─── ۴. پاک‌سازی مستقیم localStorage به عنوان fallback ───
        if (typeof window !== 'undefined') {
          const storageKeys = [
            'beau-token-storage',
            'beau-auth-storage',
            'beau-business-storage',
            'beau-payment-storage',
            'beau-favorite-storage',
            'beau-review-storage',
            'beau-notification-storage',
            'beau-offline-queue-storage',
            'beau-api-cache-storage',
            'beau-pricelist-storage',
          ];
          storageKeys.forEach((key) => {
            try {
              window.localStorage.removeItem(key);
            } catch {}
          });
        }

        // ─── ۵. ریست state احراز هویت ───
        set({
          isAuthenticated: false,
          user: null,
          pendingPhone: null,
          pendingName: null,
          needsProfileCompletion: false,
          isSuspended: false,
          suspensionReason: '',
          lastSessionCheck: 0,
        });

        // ─── ۶. پاک‌سازی کوکی‌های احتمالی ───
        if (typeof document !== 'undefined') {
          document.cookie.split(';').forEach((c) => {
            try {
              const name = c.trim().split('=')[0];
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            } catch {}
          });
        }
      },

      updateUser: (updates) =>
        set((state) => ({
          user: { ...state.user, ...updates },
        })),

      completeProfile: () => {
        set({ needsProfileCompletion: false });
      },

      // ✅ FIX F-15: تنظیم وضعیت تعلیق
      setSuspensionStatus: (isSuspended, reason = '') => {
        set({
          isSuspended,
          suspensionReason: reason,
        });
      },

      // ✅ FIX F-14: استفاده از centralized refresh
      checkSession: async () => {
        const { accessToken, refreshToken } = useTokenStore.getState();

        if (!accessToken && !refreshToken) {
          set({ isAuthenticated: false, user: null });
          return false;
        }

        if (accessToken && !isTokenExpired(accessToken)) {
          set({ lastSessionCheck: Date.now() });
          return true;
        }

        if (refreshToken) {
          try {
            await centralizedRefresh();
            set({ lastSessionCheck: Date.now() });
            return true;
          } catch {
            useTokenStore.getState().clearTokens();
            set({ isAuthenticated: false, user: null });
            return false;
          }
        }

        return false;
      },

      // ✅ FIX F-15: بررسی وضعیت session از سرور
      checkSessionStatus: async () => {
        const { isAuthenticated } = get();
        if (!isAuthenticated) return;

        try {
          const result = await authService.getSessionStatus();
          const data = result?.data;

          if (data) {
            set({
              isSuspended: data.isSuspended ?? false,
              suspensionReason: data.suspensionReason ?? '',
              lastSessionCheck: Date.now(),
            });

            // اگر کاربر دیگر وجود ندارد یا غیرفعال شده
            if (data.isDeactivated) {
              get().logout();
            }
          }
        } catch (error) {
          console.warn('Session status check failed:', error?.message);
        }
      },

      startRefreshTimer: () => {
        const { isAuthenticated } = get();
        if (isAuthenticated) {
          startPeriodicRefresh();
        }
      },
    }),
    {
      name: 'beau-auth-storage',
      storage: createJSONStorage(getStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user ? {
          id: state.user.id,
          name: state.user.name,
          avatar: state.user.avatar,
          isVerified: state.user.isVerified,
        } : null,
        needsProfileCompletion: state.needsProfileCompletion,
        isSuspended: state.isSuspended,
        suspensionReason: state.suspensionReason,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated();
          if (state.isAuthenticated) {
            startPeriodicRefresh();
          }
        }
      },
    }
  )
);

// ═══════════════════════════════════════════════
//    ۲. Store مدال احراز هویت
// ═══════════════════════════════════════════════
export const useAuthModalStore = create((set, get) => ({
  showAuthModal: false,
  pendingAction: null,

  openAuthModal: (action = null) => {
    set({ showAuthModal: true, pendingAction: action });
  },

  closeAuthModal: () => {
    const { pendingAction } = get();
    set({ showAuthModal: false, pendingAction: null });
    if (pendingAction && useAuthStore.getState().isAuthenticated) {
      setTimeout(() => {
        try {
          pendingAction();
        } catch {}
      }, 300);
    }
  },

  cancelAuthModal: () => {
    set({ showAuthModal: false, pendingAction: null });
  },
}));

// ═══════════════════════════════════════════════
//    ۳. Hook ترکیبی: useAuth
// ═══════════════════════════════════════════════
export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const needsProfileCompletion = useAuthStore((s) => s.needsProfileCompletion);
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal);
  const logout = useAuthStore((s) => s.logout);

  const requireAuth = (action) => {
    if (isAuthenticated) {
      action?.();
    } else {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
  };

  return {
    isAuthenticated,
    user,
    needsProfileCompletion,
    requireAuth,
    openAuthModal,
    logout,
  };
};

// ═══════════════════════════════════════════════
//    ۴. Hook مدال: useAuthModal
// ═══════════════════════════════════════════════
export const useAuthModal = () => {
  const showAuthModal = useAuthModalStore((s) => s.showAuthModal);
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal);
  const closeAuthModal = useAuthModalStore((s) => s.closeAuthModal);
  const cancelAuthModal = useAuthModalStore((s) => s.cancelAuthModal);
  return { showAuthModal, openAuthModal, closeAuthModal, cancelAuthModal };
};