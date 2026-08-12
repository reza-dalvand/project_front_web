// src/stores/useFavoriteStore.js
/**
 * Store علاقه‌مندی‌ها
 *
 * هماهنگ با بک‌اند:
 * - FavoriteBusiness (کسب‌وکار)
 * - FavoritePost (پست ویترین)
 * - Toggle با API
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { favoritesService } from '@/api';

export const useFavoriteStore = create(
  persist(
    (set, get) => ({
      // ─── State ───
      favoriteBusinesses: [], // [{ id, name, ... }]
      favoritePosts: [], // [{ id, caption, ... }]
      isLoading: false,
      error: null,

      // ─── Actions ───
      /**
       * دریافت لیست علاقه‌مندی‌ها از API
       */
      fetchFavorites: async () => {
        set({ isLoading: true, error: null });
        try {
          const result = await favoritesService.getFavorites();
          set({
            favoriteBusinesses: result.data.businesses || [],
            favoritePosts: result.data.posts || [],
            isLoading: false,
          });
        } catch (error) {
          console.error('Fetch favorites failed:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      /**
       * Toggle علاقه‌مندی به کسب‌وکار
       * @param {number} businessId
       * @param {object} businessData - داده‌های کسب‌وکار برای ذخیره محلی
       */
      toggleBusinessFavorite: async (businessId, businessData = null) => {
        const { favoriteBusinesses } = get();
        const isFavorited = favoriteBusinesses.some((b) => b.id === businessId);

        // خوش‌بینانه (Optimistic) — اول UI آپدیت شود
        if (isFavorited) {
          set({
            favoriteBusinesses: favoriteBusinesses.filter((b) => b.id !== businessId),
          });
        } else if (businessData) {
          set({
            favoriteBusinesses: [...favoriteBusinesses, businessData],
          });
        }

        try {
          await favoritesService.toggleFavorite('business', businessId);
        } catch (error) {
          console.error('Toggle business favorite failed:', error);
          // Rollback در صورت خطا
          set({ favoriteBusinesses });
          throw error;
        }
      },

      /**
       * Toggle علاقه‌مندی به پست
       * @param {number} postId
       * @param {object} postData - داده‌های پست برای ذخیره محلی
       */
      togglePostFavorite: async (postId, postData = null) => {
        const { favoritePosts } = get();
        const isFavorited = favoritePosts.some((p) => p.id === postId);

        // خوش‌بینانه (Optimistic)
        if (isFavorited) {
          set({
            favoritePosts: favoritePosts.filter((p) => p.id !== postId),
          });
        } else if (postData) {
          set({
            favoritePosts: [...favoritePosts, postData],
          });
        }

        try {
          await favoritesService.toggleFavorite('post', postId);
        } catch (error) {
          console.error('Toggle post favorite failed:', error);
          // Rollback
          set({ favoritePosts });
          throw error;
        }
      },

      /**
       * بررسی علاقه‌مندی به کسب‌وکار
       * @param {number} businessId
       * @returns {boolean}
       */
      isBusinessFavorited: (businessId) => {
        return get().favoriteBusinesses.some((b) => b.id === businessId);
      },

      /**
       * بررسی علاقه‌مندی به پست
       * @param {number} postId
       * @returns {boolean}
       */
      isPostFavorited: (postId) => {
        return get().favoritePosts.some((p) => p.id === postId);
      },

      /**
       * دریافت تعداد علاقه‌مندی‌ها
       * @returns {{ business: number, post: number, total: number }}
       */
      getFavoriteCounts: () => {
        const { favoriteBusinesses, favoritePosts } = get();
        return {
          business: favoriteBusinesses.length,
          post: favoritePosts.length,
          total: favoriteBusinesses.length + favoritePosts.length,
        };
      },

      /**
       * پاک کردن همه علاقه‌مندی‌ها (خروج از حساب)
       */
      clearFavorites: () => {
        set({
          favoriteBusinesses: [],
          favoritePosts: [],
        });
      },
    }),
    {
      name: 'zibano-favorite-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
      partialize: (state) => ({
        favoriteBusinesses: state.favoriteBusinesses,
        favoritePosts: state.favoritePosts,
      }),
    }
  )
);
