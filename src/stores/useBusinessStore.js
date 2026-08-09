// src/stores/useBusinessStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { INITIAL_BUSINESS_DATA, STORAGE_VERSION } from './business/initialData';
import { createServicesSlice } from './business/slices/servicesSlice';
import { createAppointmentsSlice } from './business/slices/appointmentsSlice';
import { createTeamSlice } from './business/slices/teamSlice';
import { createPortfoliosSlice } from './business/slices/portfoliosSlice';
import { createSchedulesSlice } from './business/slices/schedulesSlice';

export const useBusinessStore = create(
  persist(
    (set, get) => ({
      // ─── State اصلی ───
      businessData: INITIAL_BUSINESS_DATA,
      _version: STORAGE_VERSION,

      // ─── Slice: خدمات ───
      ...createServicesSlice(set),

      // ─── Slice: نوبت‌ها ───
      ...createAppointmentsSlice(set),

      // ─── Slice: تیم ───
      ...createTeamSlice(set),

      // ─── Slice: نمونه‌کارها ───
      ...createPortfoliosSlice(set),

      // ─── Slice: زمان‌بندی ───
      ...createSchedulesSlice(set),

      // ─── اطلاعات پایه کسب‌وکار ───
      updateBusinessInfo: (updates) =>
        set((state) => ({
          businessData: { ...state.businessData, ...updates },
        })),

      deleteBusiness: () => {
        set((state) => ({
          businessData: { ...state.businessData, isActive: false },
        }));
        return true;
      },

      // ─── Selectors ───
      getActiveServices: () =>
        get().businessData.services.filter((s) => s.isActive !== false),

      // ─── ریست دستی ───
      resetToDefaults: () => {
        set({ businessData: INITIAL_BUSINESS_DATA, _version: STORAGE_VERSION });
      },
    }),
    {
      name: 'zibano-business-storage',
      version: STORAGE_VERSION,
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
      partialize: (state) => ({
        businessData: state.businessData,
        _version: STORAGE_VERSION,
      }),
      migrate: (persistedState, version) => {
        if (version < STORAGE_VERSION) {
          return { businessData: INITIAL_BUSINESS_DATA, _version: STORAGE_VERSION };
        }
        return persistedState;
      },
      merge: (persistedState, currentState) => {
        if (
          !persistedState ||
          !persistedState.businessData ||
          !persistedState.businessData.appointments ||
          persistedState.businessData.appointments.length === 0
        ) {
          return currentState;
        }
        const firstApt = persistedState.businessData.appointments[0];
        if (!firstApt.date || !firstApt.date.jy || !firstApt.date.jm || !firstApt.date.jd) {
          return currentState;
        }
        return { ...currentState, ...persistedState };
      },
    }
  )
);