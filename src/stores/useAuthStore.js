// src/stores/useAuthStore.js
/**
 * Store احراز هویت — فاز ۲ (هماهنگ با بک‌اند)
 *
 * تغییرات:
 * - اضافه شدن needsProfileCompletion
 * - اصلاح login برای مدیریت is_new_user
 * - اصلاح checkSession
 * - اصلاح logout
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '@/api';
import { useTokenStore } from './useTokenStore';
import { isTokenExpired } from '@/utils/jwt-utils';

// ═══════════════════════════════════════════
//    ۱. Store اصلی احراز هویت
// ═══════════════════════════════════════════
export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      pendingPhone: null,
      pendingName: null,
      needsProfileCompletion: false, // ✅ جدید
      _hydrated: false,

      setHydrated: () => set({ _hydrated: true }),

      /**
       * ذخیره شماره در انتظار OTP
       */
      setPendingAuth: (phone, firstName = '', lastName = '') => {
        set({
          pendingPhone: phone,
          pendingName: `${firstName} ${lastName}`.trim(),
        });
      },

      /**
       * ✅ اصلاح‌شده: ورود موفق
       * @param {object} userData - داده‌های کاربر (فرمت بک‌اند)
       * @param {object} tokens - { access_token, refresh_token }
       * @param {object} options - { is_new_user, needs_profile_completion }
       */
      login: (userData, tokens, options = {}) => {
        // ذخیره توکن‌ها
        if (tokens?.access_token) {
          useTokenStore.getState().setTokens({
            access: tokens.access_token,
            refresh: tokens.refresh_token,
          });
        }

        set({
          isAuthenticated: true,
          user: {
            id: userData.id,
            phone: userData.phone,
            phoneDisplay: userData.phone_display || userData.phone,
            name:
              userData.full_name ||
              `${userData.first_name || ''} ${userData.last_name || ''}`.trim() ||
              'کاربر زیبانو',
            firstName: userData.first_name || '',
            lastName: userData.last_name || '',
            avatar: userData.avatar || null,
            isVerified: userData.is_verified ?? false,
            isNationalIdVerified: userData.is_national_id_verified ?? false,
            verifiedName: userData.verified_name || '',
            dateJoined: userData.date_joined || '',
          },
          pendingPhone: null,
          pendingName: null,
          needsProfileCompletion: options.needs_profile_completion ?? false, // ✅ جدید
        });
      },

      /**
       * خروج — فراخوانی API + پاک کردن state
       */
      logout: async () => {
        const refreshToken = useTokenStore.getState().getRefreshToken();
        try {
          if (refreshToken) {
            await authService.logout(refreshToken, false);
          }
        } catch {
          // آفلاین یا خطای شبکه — فقط state پاک شود
        }
        useTokenStore.getState().clearTokens();
        set({
          isAuthenticated: false,
          user: null,
          pendingPhone: null,
          pendingName: null,
          needsProfileCompletion: false,
        });
      },

      /**
       * خروج از همه دستگاه‌ها
       */
      logoutAllDevices: async () => {
        const refreshToken = useTokenStore.getState().getRefreshToken();
        try {
          if (refreshToken) {
            await authService.logout(refreshToken, true);
          }
        } catch {}
        useTokenStore.getState().clearTokens();
        set({
          isAuthenticated: false,
          user: null,
          needsProfileCompletion: false,
        });
      },

      /**
       * بروزرسانی پروفایل کاربر
       */
      updateUser: (updates) =>
        set((state) => ({
          user: { ...state.user, ...updates },
        })),

      /**
       * ✅ جدید: تکمیل پروفایل انجام شد
       */
      completeProfile: () => {
        set({ needsProfileCompletion: false });
      },

      /**
       * ✅ اصلاح‌شده: بررسی اعتبار session
       * @returns {Promise<boolean>}
       */
      checkSession: async () => {
        const { accessToken, refreshToken } = useTokenStore.getState();

        // هیچ توکنی نیست
        if (!accessToken && !refreshToken) {
          set({ isAuthenticated: false, user: null });
          return false;
        }

        // Access token هنوز معتبر است
        if (accessToken && !isTokenExpired(accessToken)) {
          return true;
        }

        // Access token منقضی شده — تلاش برای refresh
        if (refreshToken) {
          try {
            const result = await authService.refreshToken(refreshToken);
            const data = result.data;

            // بک‌اند در CustomTokenRefreshView برمی‌گرداند: { access, refresh }
            useTokenStore.getState().setTokens({
              access: data.access,
              refresh: data.refresh,
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
    }),
    {
      name: 'zibano-auth-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        needsProfileCompletion: state.needsProfileCompletion,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHydrated();
      },
    }
  )
);

// ═══════════════════════════════════════════
//    ۲. Store مدال احراز هویت
// ═══════════════════════════════════════════
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

// ═══════════════════════════════════════════
//    ۳. Hook ترکیبی: useAuth
// ═══════════════════════════════════════════
export const useAuth = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const needsProfileCompletion = useAuthStore((s) => s.needsProfileCompletion);
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal);
  const logout = useAuthStore((s) => s.logout);

  const requireAuth = (action) => {
    if (isAuthenticated) {
      action?.();
    } else {
      openAuthModal(action);
    }
  };

  return { isAuthenticated, user, needsProfileCompletion, requireAuth, openAuthModal, logout };
};

// ═══════════════════════════════════════════
//    ۴. Hook مدال: useAuthModal
// ═══════════════════════════════════════════
export const useAuthModal = () => {
  const showAuthModal = useAuthModalStore((s) => s.showAuthModal);
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal);
  const closeAuthModal = useAuthModalStore((s) => s.closeAuthModal);
  const cancelAuthModal = useAuthModalStore((s) => s.cancelAuthModal);
  return { showAuthModal, openAuthModal, closeAuthModal, cancelAuthModal };
};
