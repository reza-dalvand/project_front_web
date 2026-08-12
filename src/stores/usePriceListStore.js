// src/stores/usePriceListStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { INITIAL_PRICE_LISTS } from '@/data/priceList';

const DEFAULT_LIST = (businessId) => ({
  businessId,
  themeId: 'classic',
  isPublished: false,
  notes: [],
});

export const usePriceListStore = create(
  persist(
    (set, get) => ({
      lists: INITIAL_PRICE_LISTS,

      // ساخت لیست پیش‌فرض اگر وجود نداشته باشد
      ensureList: (businessId) => {
        if (!get().lists[businessId]) {
          set((s) => ({ lists: { ...s.lists, [businessId]: DEFAULT_LIST(businessId) } }));
        }
      },

      getList: (businessId) => get().lists[businessId] || null,

      updateList: (businessId, updates) =>
        set((s) => ({
          lists: {
            ...s.lists,
            [businessId]: { ...(s.lists[businessId] || DEFAULT_LIST(businessId)), ...updates },
          },
        })),

      setTheme: (businessId, themeId) => get().updateList(businessId, { themeId }),

      // انتشار / مخفی کردن — مقدار جدید را برمی‌گرداند
      togglePublish: (businessId) => {
        const current = get().lists[businessId] || DEFAULT_LIST(businessId);
        const next = !current.isPublished;
        get().updateList(businessId, { isPublished: next });
        return next;
      },

      addNote: (businessId, note) => {
        const current = get().lists[businessId] || DEFAULT_LIST(businessId);
        get().updateList(businessId, {
          notes: [...current.notes, { ...note, id: `nt_${Date.now()}` }],
        });
      },

      deleteNote: (businessId, noteId) => {
        const current = get().lists[businessId] || DEFAULT_LIST(businessId);
        get().updateList(businessId, {
          notes: current.notes.filter((n) => n.id !== noteId),
        });
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
