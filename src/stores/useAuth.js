// src/stores/useAuth.js
import { create } from 'zustand';
import { useAuthStore } from '@/stores/useAuthStore';

// ═══════════════════════════════════════════
//    Store سراسری مدیریت مدال احراز هویت
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
//    Hook اصلی برای کامپوننت‌ها
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

  return {
    isAuthenticated,
    user,
    requireAuth,
    openAuthModal, 
  };
};

// ═══════════════════════════════════════════
//    Hook مخصوص Provider و صفحات
// ═══════════════════════════════════════════
export const useAuthModal = () => {
  const showAuthModal = useAuthModalStore((s) => s.showAuthModal);
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal); 
  const closeAuthModal = useAuthModalStore((s) => s.closeAuthModal);
  const cancelAuthModal = useAuthModalStore((s) => s.cancelAuthModal);

  return { showAuthModal, openAuthModal, closeAuthModal, cancelAuthModal };
};