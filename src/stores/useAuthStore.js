// src/stores/useAuthStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
      // ✅ تغییر: نام‌ها اختیاری شدند
      setPendingAuth: (phone, firstName = '', lastName = '') => {
        set({
          pendingPhone: phone,
          pendingName: `${firstName} ${lastName}`.trim(),
        });
      },

      login: (phone, name = 'کاربر زیبانو', token = 'mock_token_' + Date.now()) => {
        set({
          isAuthenticated: true,
          user: {
            phone,
            name,
            avatar: null,
            token,
            memberSince: 'از مرداد ۱۴۰۵',
          },
          pendingPhone: null,
          pendingName: null,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          pendingPhone: null,
          pendingName: null,
        });
      },

      updateUser: (updates) =>
        set((state) => ({
          user: { ...state.user, ...updates },
        })),
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

  // ✅ اصلاح: بعد از لاگین فقط مدال بسته شود و اکشن اجرا شود
  // دیگر نیازی به ریدایرکت نیست چون کاربر در همان صفحه مانده است
  closeAuthModal: () => {
    const { pendingAction } = get();

    set({ showAuthModal: false, pendingAction: null });

    // اگر اکشنی منتظر بوده (مثلاً لایک کردن پست)، حالا که لاگین شده اجراش کن
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

  const requireAuth = (action) => {
    if (isAuthenticated) {
      action?.();
    } else {
      openAuthModal(action);
    }
  };

  return { isAuthenticated, user, requireAuth, openAuthModal };
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
