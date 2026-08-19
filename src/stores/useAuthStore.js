// src/stores/useAuthStore.js
/**
 * Store احراز هویت — فاز ۲ (هماهنگ با بک‌اند)
 *
 * تغییرات:
 * - اضافه شدن needsProfileCompletion
 * - اصلاح login برای مدیریت is_new_user
 * - اصلاح checkSession
 * - اصلاح logout
 *
 * ✅ FIX فاز ۱: camelCase در login و checkSession
 *    response-normalizer تمام کلیدها را به camelCase تبدیل می‌کند
 *    access_token → accessToken
 *    refresh_token → refreshToken
 *    is_new_user → isNewUser
 *    needs_profile_completion → needsProfileCompletion
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '@/api';
import { useTokenStore } from './useTokenStore';
import { isTokenExpired } from '@/utils/jwt-utils';
import { useRouter, usePathname } from 'next/navigation';

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
      needsProfileCompletion: false,
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
       * ✅ FIX فاز ۱: ورود موفق — camelCase
       * @param {object} userData - داده‌های کاربر (فرمت بک‌اند، camelCase شده توسط normalizer)
       * @param {object} tokens - { accessToken, refreshToken } ← camelCase
       * @param {object} options - { isNewUser, needsProfileCompletion } ← camelCase
       */
      login: (userData, tokens, options = {}) => {
        // ✅ FIX: tokens.accessToken به جای tokens.access_token
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
          // ✅ FIX: options.needsProfileCompletion به جای options.needs_profile_completion
          needsProfileCompletion: options.needsProfileCompletion ?? false,
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
       * تکمیل پروفایل انجام شد
       */
      completeProfile: () => {
        set({ needsProfileCompletion: false });
      },

      /**
       * ✅ FIX فاز ۱: بررسی اعتبار session — camelCase
       * بک‌اند در refresh برمی‌گرداند: { access, refresh }
       * normalizer تبدیل نمی‌کند چون کلید underscore ندارد
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
            // این کلیدها underscore ندارند، normalizer تغییرشان نمی‌دهد
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
      name: 'beau-auth-storage',
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
      // ✅ FIX: مسیر فعلی به عنوان redirect پاس داده می‌شود
      // بعد از لاگین، کاربر به همین صفحه برمی‌گردد
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
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
