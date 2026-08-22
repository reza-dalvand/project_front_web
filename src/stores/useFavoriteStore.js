// src/stores/useFavoriteStore.js
/**
 * Store علاقه‌مندی‌ها — هماهنگ با بک‌اند
 *
 * مدل‌ها:
 *   FavoriteBusiness: user + business (unique_together)
 *   FavoritePost: user + post (unique_together)
 *
 * API:
 *   POST /favorites/toggle/ → { favorite_type, object_id }
 *   GET  /favorites/count/  → { business, post, total }
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { favoritesService } from '@/api';
export const useFavoriteStore = create(
  persist(
    (set, get) => ({
      // ─── State ───
      favoriteBusinesses: [],
      favoritePosts: [],
      isLoading: false,
      error: null,

      // ─── دریافت لیست از API ───
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
          console.error('fetchFavorites failed:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      // ─── Toggle علاقه‌مندی به کسب‌وکار ───
      toggleBusinessFavorite: async (businessId, businessData = null) => {
        const { favoriteBusinesses } = get();
        const isFavorited = favoriteBusinesses.some((b) => b.id === businessId);

        // Optimistic update
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
          if (!USE_MOCK) {
            await favoritesService.toggleFavorite('business', businessId);
          } else {
            await new Promise((r) => setTimeout(r, 300));
          }
          return !isFavorited;
        } catch (error) {
          console.error('toggleBusinessFavorite failed:', error);
          // Rollback
          set({ favoriteBusinesses });
          throw error;
        }
      },

      // ─── Toggle علاقه‌مندی به پست ───
      togglePostFavorite: async (postId, postData = null) => {
        const { favoritePosts } = get();
        const isFavorited = favoritePosts.some((p) => p.id === postId);

        // Optimistic update
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
          if (!USE_MOCK) {
            await favoritesService.toggleFavorite('post', postId);
          } else {
            await new Promise((r) => setTimeout(r, 300));
          }
          return !isFavorited;
        } catch (error) {
          console.error('togglePostFavorite failed:', error);
          set({ favoritePosts });
          throw error;
        }
      },

      // ─── بررسی علاقه‌مندی ───
      isBusinessFavorited: (businessId) =>
        get().favoriteBusinesses.some((b) => b.id === businessId),

      isPostFavorited: (postId) => get().favoritePosts.some((p) => p.id === postId),

      // ─── تعداد علاقه‌مندی‌ها ───
      getFavoriteCounts: () => {
        const { favoriteBusinesses, favoritePosts } = get();
        return {
          business: favoriteBusinesses.length,
          post: favoritePosts.length,
          total: favoriteBusinesses.length + favoritePosts.length,
        };
      },

      // ─── دریافت تعداد از API ───
      fetchFavoriteCounts: async () => {
        try {
          const result = await favoritesService.getFavoritesCount();
          return result.data;
        } catch (error) {
          console.error('fetchFavoriteCounts failed:', error);
          return get().getFavoriteCounts();
        }
      },

      // ─── پاک کردن (خروج از حساب) ───
      clearFavorites: () => {
        set({
          favoriteBusinesses: [],
          favoritePosts: [],
        });
      },
    }),
    {
      name: 'beau-favorite-storage',
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
