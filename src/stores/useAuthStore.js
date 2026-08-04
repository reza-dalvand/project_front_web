// src/stores/useAuthStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
  (set, get) => ({
    isAuthenticated: false,
    user: null,
    pendingAction: null,
    pendingPhone: null,
    pendingName: null,
    _hydrated: false,          // ← اضافه شد
    setHydrated: () => set({ _hydrated: true }),

      // ذخیره شماره و نام برای مرحله بعد (OTP)
      setPendingAuth: (phone, firstName, lastName) => {
        set({
          pendingPhone: phone,
          pendingName: `${firstName} ${lastName}`.trim(),
        });
      },

      // لاگین نهایی پس از تایید OTP
      login: (phone, name = 'کاربر زیبانو', token = 'mock_token_' + Date.now()) => {
        const userData = {
          phone,
          name,
          avatar: null,
          token,
          memberSince: 'از مرداد ۱۴۰۵',
        };
        set({
          isAuthenticated: true,
          user: userData,
          pendingPhone: null,
          pendingName: null,
          pendingAction: null,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          pendingAction: null,
          pendingPhone: null,
          pendingName: null,
        });
      },

      updateUser: (updates) =>
        set((state) => ({
          user: { ...state.user, ...updates },
        })),

      setPendingAction: (action) => set({ pendingAction: action }),

      executePendingAction: () => {
        const { pendingAction } = get();
        if (pendingAction) {
          setTimeout(() => {
            pendingAction();
            set({ pendingAction: null });
          }, 100);
        }
      },

      clearPendingAction: () => set({ pendingAction: null }),
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
      onRehydrateStorage: () => {
        return (state) => {
          if (state) state.setHydrated();
        };
      },
    }
  )
);