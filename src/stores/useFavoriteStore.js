// src/stores/useFavoriteStore.js
/**
 * Store علاقه‌مندی‌ها — هماهنگ با بک‌اند
 * ✅ حذف USE_MOCK — فقط API
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { favoritesService } from '@/api';

export const useFavoriteStore = create(
  persist(
    (set, get) => ({
      favoriteBusinesses: [],
      favoritePosts: [],
      isLoading: false,
      error: null,

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

      // ✅ حذف USE_MOCK — فقط API
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
          await favoritesService.toggleFavorite('business', businessId);
          return !isFavorited;
        } catch (error) {
          console.error('toggleBusinessFavorite failed:', error);
          // Rollback
          set({ favoriteBusinesses });
          throw error;
        }
      },

      // ✅ حذف USE_MOCK — فقط API
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
          await favoritesService.toggleFavorite('post', postId);
          return !isFavorited;
        } catch (error) {
          console.error('togglePostFavorite failed:', error);
          set({ favoritePosts });
          throw error;
        }
      },

      isBusinessFavorited: (businessId) =>
        get().favoriteBusinesses.some((b) => b.id === businessId),

      isPostFavorited: (postId) => get().favoritePosts.some((p) => p.id === postId),

      getFavoriteCounts: () => {
        const { favoriteBusinesses, favoritePosts } = get();
        return {
          business: favoriteBusinesses.length,
          post: favoritePosts.length,
          total: favoriteBusinesses.length + favoritePosts.length,
        };
      },

      fetchFavoriteCounts: async () => {
        try {
          const result = await favoritesService.getFavoritesCount();
          return result.data;
        } catch (error) {
          console.error('fetchFavoriteCounts failed:', error);
          return get().getFavoriteCounts();
        }
      },

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