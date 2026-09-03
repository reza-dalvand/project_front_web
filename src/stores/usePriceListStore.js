// src/stores/usePriceListStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { priceListService } from '@/api';
import { useBusinessStore } from './useBusinessStore';

export const PRICE_LIST_THEMES = [
  {
    id: 'classic',
    label: 'کلاسیک',
    emoji: '📋',
    bg: '#FFFFFF',
    card: '#F9F6F2',
    accent: '#A88B7D',
    text: '#2C2521',
    textSecondary: '#5A504B',
    border: '#DCD1CB',
  },
  {
    id: 'rose',
    label: 'گلابی',
    emoji: '🌸',
    bg: '#FFF0F3',
    card: '#FFF7F8',
    accent: '#E91E63',
    text: '#3B1023',
    textSecondary: '#8D6E7A',
    border: '#F5C6D6',
  },
  {
    id: 'gold',
    label: 'طلایی',
    emoji: '✨',
    bg: '#FFFDF5',
    card: '#FFFBEF',
    accent: '#D4A017',
    text: '#3D2B10',
    textSecondary: '#8D7A55',
    border: '#EEDFAC',
  },
  {
    id: 'mint',
    label: 'نعنایی',
    emoji: '🌿',
    bg: '#F0FFF5',
    card: '#F7FFF9',
    accent: '#43A047',
    text: '#1B3B22',
    textSecondary: '#5A8D62',
    border: '#C6E8C9',
  },
];

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

/**
 * ✅ نگاشت پاسخ بک‌اند به فرمت فرانت (عمومی)
 */
const mapPublicPriceListFromApi = (data, businessId) => ({
  businessId,
  themeId: data.theme || 'classic',
  isPublished: data.isPublished ?? data.is_published ?? true,
  services: (data.services || []).map((s) => ({
    id: s.id,
    name: s.name,
    typeName: s.typeName || s.type_name || '',
    typeId: s.typeId || s.type_id || '',
    originalPrice: s.originalPrice ?? s.original_price ?? 0,
    discountPercent: s.discountPercent ?? s.discount_percent ?? 0,
    finalPrice: s.finalPrice ?? s.final_price ?? 0,
    hasDeposit: s.hasDeposit ?? s.has_deposit ?? false,
    depositAmount: s.depositAmount ?? s.deposit_amount ?? 0,
  })),
});

const mapPriceListFromApi = (data, businessId) => ({
  businessId,
  themeId: data.theme || 'classic',
  isPublished: data.isPublished ?? data.is_published ?? false,
  services: (data.services || []).map((s) => ({
    id: s.id,
    name: s.name,
    typeName: s.typeName || s.type_name || '',
    typeId: s.typeId || s.type_id || '',
    originalPrice: s.originalPrice ?? s.original_price ?? 0,
    discountPercent: s.discountPercent ?? s.discount_percent ?? 0,
    finalPrice: s.finalPrice ?? s.final_price ?? 0,
    hasDeposit: s.hasDeposit ?? s.has_deposit ?? false,
    depositAmount: s.depositAmount ?? s.deposit_amount ?? 0,
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

      /**
       * ✅ دریافت لیست قیمت عمومی (برای مشتری)
       */
      fetchPublicPriceList: async (businessId) => {
        set({ isLoading: true, error: null });
        try {
          const result = await priceListService.getPublicPriceList(businessId);
          const mapped = mapPublicPriceListFromApi(result.data, businessId);
          set((s) => ({
            lists: { ...s.lists, [businessId]: mapped },
            isLoading: false,
          }));
          return mapped;
        } catch (error) {
          console.error('fetchPublicPriceList failed:', error);
          set({ error: error.message, isLoading: false });
          return null;
        }
      },

      /**
       * دریافت لیست قیمت کسب‌وکار خودم (مالک)
       */
      fetchPriceList: async (businessId) => {
        set({ isLoading: true, error: null });
        try {
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
            isPublished: services.length > 0, // ✅ FIX: اگر سرویس هست، منتشرشده فرض کن
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
          set((s) => ({
            lists: {
              ...s.lists,
              [businessId]: {
                ...DEFAULT_LIST(businessId),
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
        const list = get().lists[businessId];
        priceListService
          .updatePriceList(mapPriceListToApi(list))
          .catch((err) => console.error('setTheme API failed:', err));
      },

      togglePublish: (businessId) => {
        const current = get().lists[businessId] || DEFAULT_LIST(businessId);
        const next = !current.isPublished;
        get().updateList(businessId, { isPublished: next });
        const list = get().lists[businessId];
        priceListService
          .updatePriceList(mapPriceListToApi(list))
          .catch((err) => console.error('togglePublish API failed:', err));
        return next;
      },

      getTheme: (businessId) => {
        const list = get().lists[businessId];
        const themeId = list?.themeId || 'classic';
        return PRICE_LIST_THEMES.find((t) => t.id === themeId) || PRICE_LIST_THEMES[0];
      },
    }),
    {
      name: 'beau-price-list-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
      partialize: (state) => ({ lists: state.lists }),
    }
  )
);