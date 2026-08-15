// src/stores/usePriceListStore.js
/**
 * Store لیست قیمت — بدون یادداشت (notes حذف شد)
 *
 * قیمت‌ها فقط از بخش «خدمات» خوانده می‌شوند.
 * تم و وضعیت انتشار قابل تغییر هستند.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { priceListService } from '@/api';
import { USE_MOCK } from '@/api/config';
import { PRICE_LIST_THEMES } from '@/data/priceList';

// ═══════ ساختار پیش‌فرض ═══════
const DEFAULT_LIST = (businessId) => ({
  businessId,
  themeId: 'classic',
  isPublished: false,
  services: [],
});

// ═══════ تبدیل فرمت بک‌اند به فرمت فرانت ═══════
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

// ═══════ تبدیل فرمت فرانت به فرمت بک‌اند ═══════
const mapPriceListToApi = (list) => ({
  theme: list.themeId,
  is_published: list.isPublished,
});

export const usePriceListStore = create(
  persist(
    (set, get) => ({
      // ─── State ───
      lists: {},
      isLoading: false,
      error: null,

      // ─── دریافت از API ───
      fetchPriceList: async (businessId) => {
        set({ isLoading: true, error: null });
        try {
          if (USE_MOCK) {
            const defaultList = DEFAULT_LIST(businessId);
            set((s) => ({
              lists: { ...s.lists, [businessId]: defaultList },
              isLoading: false,
            }));
            return defaultList;
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
          const defaultList = DEFAULT_LIST(businessId);
          set((s) => ({
            lists: { ...s.lists, [businessId]: defaultList },
            error: error.message,
            isLoading: false,
          }));
          return defaultList;
        }
      },

      // ─── ساخت لیست پیش‌فرض اگر وجود نداشته باشد ───
      ensureList: (businessId) => {
        if (!get().lists[businessId]) {
          set((s) => ({
            lists: { ...s.lists, [businessId]: DEFAULT_LIST(businessId) },
          }));
        }
      },

      // ─── Getter ───
      getList: (businessId) => get().lists[businessId] || null,

      // ─── بروزرسانی محلی ───
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

      // ─── تغییر تم ───
      setTheme: (businessId, themeId) => {
        get().updateList(businessId, { themeId });
        if (!USE_MOCK) {
          const list = get().lists[businessId];
          priceListService
            .updatePriceList(mapPriceListToApi(list))
            .catch((err) => console.error('setTheme API failed:', err));
        }
      },

      // ─── انتشار / مخفی کردن ───
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

      // ─── دریافت تم ───
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
