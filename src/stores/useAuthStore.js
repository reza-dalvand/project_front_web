/**
 * Store احراز هویت — فاز ۲ (هماهنگ با بک‌اند)
 * 
 * ✅ FIX: اضافه کردن Periodic Refresh هر ۵۰ دقیقه
 * ✅ FIX: حذف logout تکراری
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { authService } from '@/api';
import { useTokenStore } from './useTokenStore';
import { isTokenExpired, isTokenExpiringSoon } from '@/utils/jwt-utils';
import { useRouter, usePathname } from 'next/navigation';

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
//    Periodic Refresh Timer
// ═══════════════════════════════════════════════
let refreshTimer = null;

const startPeriodicRefresh = () => {
  if (refreshTimer) clearInterval(refreshTimer);
  
  // هر ۵۰ دقیقه (۱۰ دقیقه قبل از انقضای ۱ ساعته)
  refreshTimer = setInterval(async () => {
    const { accessToken, refreshToken } = useTokenStore.getState();
    
    if (!refreshToken) {
      stopPeriodicRefresh();
      return;
    }
    
    // اگر access token به زودی منقضی می‌شود، refresh کن
    if (accessToken && isTokenExpiringSoon(accessToken)) {
      try {
        const result = await authService.refreshToken(refreshToken);
        const data = result.data;
        useTokenStore.getState().setTokens({
          access: data.access,
          refresh: data.refresh || refreshToken,
        });
      } catch (error) {
        console.warn('Periodic refresh failed:', error);
        stopPeriodicRefresh();
      }
    }
  }, 50 * 60 * 1000); // ۵۰ دقیقه
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
      _hydrated: false,

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
        });
        
        // ✅ شروع periodic refresh پس از ورود
        startPeriodicRefresh();
      },

      logout: async (allDevices = false) => {
        // ✅ توقف periodic refresh قبل از خروج
        stopPeriodicRefresh();
        
        const refreshToken = useTokenStore.getState().getRefreshToken();
        try {
          if (refreshToken) {
            await authService.logout(refreshToken, allDevices);
          }
        } catch {
          // آفلاین یا خطای شبکه — فقط state پاک شود
        }
        useTokenStore.getState().clearTokens();

        // پاک کردن استور کسب‌وکار
        try {
          const { useBusinessStore } = await import('./useBusinessStore');
          useBusinessStore.getState().clearForLogout();
        } catch {
          // ignore
        }

        // پاک کردن استور پرداخت
        try {
          const { usePaymentStore } = await import('./usePaymentStore');
          usePaymentStore.getState().clearPaymentState();
        } catch {
          // ignore
        }

        set({
          isAuthenticated: false,
          user: null,
          pendingPhone: null,
          pendingName: null,
          needsProfileCompletion: false,
        });
      },

      updateUser: (updates) =>
        set((state) => ({
          user: { ...state.user, ...updates },
        })),

      completeProfile: () => {
        set({ needsProfileCompletion: false });
      },

      checkSession: async () => {
        const { accessToken, refreshToken } = useTokenStore.getState();

        if (!accessToken && !refreshToken) {
          set({ isAuthenticated: false, user: null });
          return false;
        }

        if (accessToken && !isTokenExpired(accessToken)) {
          return true;
        }

        if (refreshToken) {
          try {
            const result = await authService.refreshToken(refreshToken);
            const data = result.data;
            useTokenStore.getState().setTokens({
              access: data.access,
              refresh: data.refresh || refreshToken,
            });
            return true;
          } catch {
            useTokenStore.getState().clearTokens();
            set({ isAuthenticated: false, user: null });
            return false;
          }
        }

        return false;
      },
      
      // ✅ متد جدید برای شروع manual refresh timer
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
        user: state.user,
        needsProfileCompletion: state.needsProfileCompletion,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated();
          // ✅ شروع periodic refresh پس از rehydration اگر کاربر لاگین است
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