// src/hooks/useToast.js
import { create } from 'zustand';

export const useToastStore = create((set) => ({
  toast: { visible: false, message: '', type: 'info' },

  showToast: (message, type = 'info') => {
    set({ toast: { visible: true, message, type } });
  },

  hideToast: () => {
    set((state) => ({ toast: { ...state.toast, visible: false } }));
  },
}));

export const useToast = () => {
  const toast = useToastStore((s) => s.toast);
  const showToast = useToastStore((s) => s.showToast);
  const hideToast = useToastStore((s) => s.hideToast);

  return { toast, showToast, hideToast };
};
