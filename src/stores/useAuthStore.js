// src/stores/useAuthStore.js
/**
 * Store احراز هویت - بازنویسی برای JWT
 *
 * هماهنگ با بک‌اند:
 * - OTP ۵ رقمی
 * - JWT Access + Refresh Token
 * - Logout با Blacklist
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '@/api';
import { useTokenStore } from './useTokenStore';
import { isTokenExpired } from '@/utils/jwt-utils';

// ═══════════════════════════════════════════
//    ۱. Store اصلی احراز هویت (با persist)
// ═══════════════════════════════════════════
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ─── State ───
      isAuthenticated: false,
      user: null,
      pendingPhone: null,
      pendingName: null,
      _hydrated: false,

      // ─── Hydration ───
      setHydrated: () => set({ _hydrated: true }),

      // ─── Actions ───
      /**
       * ذخیره شماره در انتظار OTP
       * @param {string} phone
       * @param {string} firstName
       * @param {string} lastName
       */
      setPendingAuth: (phone, firstName = '', lastName = '') => {
        set({
          pendingPhone: phone,
          pendingName: `${firstName} ${lastName}`.trim(),
        });
      },

      /**
       * ورود موفق — ذخیره user + توکن‌ها
       * @param {object} userData - داده‌های کاربر از API
       * @param {object} tokens - { access_token, refresh_token, expires_in }
       */
      login: (userData, tokens) => {
        // ذخیره توکن‌ها در store جداگانه
        if (tokens?.access_token) {
          useTokenStore.getState().setTokens({
            access: tokens.access_token,
            refresh: tokens.refresh_token,
            expiresIn: tokens.expires_in,
          });
        }

        set({
          isAuthenticated: true,
          user: {
            id: userData.id,
            phone: userData.phone,
            phoneDisplay: userData.phone_display,
            name: userData.full_name || `${userData.first_name} ${userData.last_name}`.trim(),
            firstName: userData.first_name,
            lastName: userData.last_name,
            avatar: userData.avatar,
            isVerified: userData.is_verified,
            isNationalIdVerified: userData.is_national_id_verified,
            verifiedName: userData.verified_name,
            dateJoined: userData.date_joined,
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
        } catch (e) {
          console.log('Logout API failed (probably offline):', e.message);
        }
        // پاک کردن توکن‌ها
        useTokenStore.getState().clearTokens();
        set({
          isAuthenticated: false,
          user: null,
          pendingPhone: null,
          pendingName: null,
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
        } catch (e) {
          console.log('Logout all API failed:', e.message);
        }
        useTokenStore.getState().clearTokens();
        set({
          isAuthenticated: false,
          user: null,
        });
      },

      /**
       * بروزرسانی پروفایل کاربر
       * @param {object} updates
       */
      updateUser: (updates) =>
        set((state) => ({
          user: { ...state.user, ...updates },
        })),

      /**
       * بررسی اعتبار session
       * اگر access token منقضی شده ولی refresh token داریم، تلاش برای refresh
       * @returns {Promise<boolean>}
       */
      checkSession: async () => {
        const { accessToken, refreshToken } = useTokenStore.getState();

        // اگر اصلاً توکنی نداریم
        if (!accessToken && !refreshToken) {
          set({ isAuthenticated: false, user: null });
          return false;
        }

        // اگر access token هنوز معتبر است
        if (accessToken && !isTokenExpired(accessToken)) {
          return true;
        }

        // اگر refresh token داریم، تلاش برای refresh
        if (refreshToken) {
          try {
            const result = await authService.refreshToken(refreshToken);
            const { access, refresh } = result.data;
            useTokenStore.getState().setTokens({
              access,
              refresh,
              expiresIn: null,
            });
            return true;
          } catch {
            // Refresh failed — خروج
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
//    ۲. Store مدال احراز هویت (بدون persist)
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
        } catch (e) {
          console.error('Pending action failed:', e);
        }
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
