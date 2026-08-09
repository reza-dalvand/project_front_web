// src/stores/useAuthStore.js
// ═══════════════════════════════════════════════════════
//    Auth Store واحد (ادغام useAuthStore + useAuthModalStore)
//    تمام state‌های احراز هویت در یک فایل
// ═══════════════════════════════════════════════════════
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
      setPendingAuth: (phone, firstName, lastName) => {
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

  closeAuthModal: () => {
    set({ showAuthModal: false });
    const { pendingAction } = get();
    if (pendingAction && useAuthStore.getState().isAuthenticated) {
      setTimeout(() => {
        pendingAction();
        set({ pendingAction: null });
      }, 300);
    } else {
      set({ pendingAction: null });
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
