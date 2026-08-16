// src/stores/usePriceListStore.js

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { priceListService } from '@/api';
import { USE_MOCK } from '@/api/config';
import { PRICE_LIST_THEMES, INITIAL_PRICE_LISTS } from '@/data/priceList'; // ✅ اضافه شد
import { useBusinessStore } from './useBusinessStore';

const DEFAULT_LIST = (businessId) => ({
  businessId,
  themeId: 'classic',
  isPublished: false,
  services: [],
});

const buildServicesFromBusiness = () => {
  const businessData = useBusinessStore.getState().businessData;
  return (businessData?.services || [])
    .filter((s) => s.isActive !== false)
    .map((s) => ({
      id: s.id,
      name: s.name,
      typeName: s.typeName || '',
      typeId: s.typeId || '',
      originalPrice: s.originalPrice,
      discountPercent: s.discountPercent || 0,
      finalPrice: s.finalPrice || s.originalPrice,
      hasDeposit: s.hasDeposit || false,
      depositAmount: s.depositAmount || 0,
    }));
};

const mapPriceListFromApi = (data, businessId) => ({
  businessId,
  themeId: data.theme || 'classic',
  isPublished: data.is_published || false,
  services: (data.services || []).map((s) => ({
    id: s.id,
    name: s.name,
    typeName: s.type_name || s.type_id || '',
    typeId: s.type_id || '',
    originalPrice: s.original_price,
    discountPercent: s.discount_percent,
    finalPrice: s.final_price,
    hasDeposit: s.has_deposit,
    depositAmount: s.deposit_amount,
  })),
});

const mapPriceListToApi = (list) => ({
  theme: list.themeId,
  is_published: list.isPublished,
});

export const usePriceListStore = create(
  persist(
    (set, get) => ({
      lists: {},
      isLoading: false,
      error: null,

      fetchPriceList: async (businessId) => {
        set({ isLoading: true, error: null });
        try {
          if (USE_MOCK) {
            const services = buildServicesFromBusiness();
            const existing = get().lists[businessId];
            // ✅ جدید: fallback به INITIAL_PRICE_LISTS
            const initial = INITIAL_PRICE_LISTS[businessId];
            const mockList = {
              businessId,
              themeId: existing?.themeId || initial?.themeId || 'classic',
              isPublished: existing?.isPublished ?? initial?.isPublished ?? false,
              services,
            };
            set((s) => ({
              lists: { ...s.lists, [businessId]: mockList },
              isLoading: false,
            }));
            return mockList;
          }
          const result = await priceListService.getPriceList();
          const mapped = mapPriceListFromApi(result.data, businessId);
          set((s) => ({
            lists: { ...s.lists, [businessId]: mapped },
            isLoading: false,
          }));
          return mapped;
        } catch (error) {
          console.error('fetchPriceList failed:', error);
          const services = buildServicesFromBusiness();
          const fallbackList = {
            businessId,
            themeId: 'classic',
            isPublished: false,
            services,
          };
          set((s) => ({
            lists: { ...s.lists, [businessId]: fallbackList },
            error: error.message,
            isLoading: false,
          }));
          return fallbackList;
        }
      },

      ensureList: (businessId) => {
        if (!get().lists[businessId]) {
          const services = buildServicesFromBusiness();
          // ✅ جدید: از INITIAL_PRICE_LISTS به عنوان پایه
          const initial = INITIAL_PRICE_LISTS[businessId];
          set((s) => ({
            lists: {
              ...s.lists,
              [businessId]: {
                ...DEFAULT_LIST(businessId),
                themeId: initial?.themeId || 'classic',
                isPublished: initial?.isPublished ?? false,
                services,
              },
            },
          }));
        }
      },

      getList: (businessId) => get().lists[businessId] || null,

      updateList: (businessId, updates) =>
        set((s) => ({
          lists: {
            ...s.lists,
            [businessId]: {
              ...(s.lists[businessId] || DEFAULT_LIST(businessId)),
              ...updates,
            },
          },
        })),

      setTheme: (businessId, themeId) => {
        get().updateList(businessId, { themeId });
        if (!USE_MOCK) {
          const list = get().lists[businessId];
          priceListService
            .updatePriceList(mapPriceListToApi(list))
            .catch((err) => console.error('setTheme API failed:', err));
        }
      },

      togglePublish: (businessId) => {
        const current = get().lists[businessId] || DEFAULT_LIST(businessId);
        const next = !current.isPublished;
        get().updateList(businessId, { isPublished: next });
        if (!USE_MOCK) {
          const list = get().lists[businessId];
          priceListService
            .updatePriceList(mapPriceListToApi(list))
            .catch((err) => console.error('togglePublish API failed:', err));
        }
        return next;
      },

      getTheme: (businessId) => {
        const list = get().lists[businessId];
        const themeId = list?.themeId || 'classic';
        return PRICE_LIST_THEMES.find((t) => t.id === themeId) || PRICE_LIST_THEMES[0];
      },
    }),
    {
      name: 'zibano-price-list-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
      partialize: (state) => ({ lists: state.lists }),
    }
  )
);