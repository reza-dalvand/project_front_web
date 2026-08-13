// src/stores/useAuthStore.js
/**
 * Store احراز هویت — نسخه نهایی هماهنگ با بک‌اند
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
       * ورود موفق — ذخیره user + توکن‌ها
       * @param {object} userData - داده‌های کاربر از API (فرمت snake_case بک‌اند)
       * @param {object} tokens - { access_token, refresh_token }
       */
      login: (userData, tokens) => {
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
              `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
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
        set({ isAuthenticated: false, user: null, pendingPhone: null, pendingName: null });
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
        set({ isAuthenticated: false, user: null });
      },

      /**
       * بروزرسانی پروفایل کاربر
       */
      updateUser: (updates) =>
        set((state) => ({
          user: { ...state.user, ...updates },
        })),

      /**
       * بررسی اعتبار session
       * @returns {Promise<boolean>}
       */
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
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal);
  const logout = useAuthStore((s) => s.logout);

  const requireAuth = (action) => {
    if (isAuthenticated) {
      action?.();
    } else {
      openAuthModal(action);
    }
  };

  return { isAuthenticated, user, requireAuth, openAuthModal, logout };
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
