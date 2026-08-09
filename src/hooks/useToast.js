// src/hooks/useToast.js
import { create } from 'zustand';

let toastTimer = null;

export const useToastStore = create((set, get) => ({
  toast: { visible: false, message: '', type: 'info' },

  showToast: (message, type = 'info', duration = 3000) => {
    // پاک کردن تایمر قبلی
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }

    set({ toast: { visible: true, message, type } });

    // مخفی شدن خودکار
    toastTimer = setTimeout(() => {
      set((state) => ({
        toast: { ...state.toast, visible: false },
      }));
      toastTimer = null;
    }, duration);
  },

  hideToast: () => {
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
    set((state) => ({
      toast: { ...state.toast, visible: false },
    }));
  },
}));

export const useToast = () => {
  const toast = useToastStore((s) => s.toast);
  const showToast = useToastStore((s) => s.showToast);
  const hideToast = useToastStore((s) => s.hideToast);
  return { toast, showToast, hideToast };
};