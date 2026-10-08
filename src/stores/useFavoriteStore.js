// src/stores/useFavoriteStore.js
/**
 * Store علاقه‌مندی‌ها — هماهنگ با بک‌اند
 * ✅ حذف USE_MOCK — فقط API
 * ✅ FIX 5.1: مدیریت کامل خطا در Optimistic Update
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { favoritesService } from '@/api';
import { useToastStore } from '@/hooks/useToast';

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
            // ✅ فاز ۳: فقط فیلدهای camelCase (بعد از نرمال‌ساز)
            favoriteBusinesses: (result.data.businesses || []).map((b) => ({
              id: b.business,
              name: b.businessName,
              logo: b.businessLogo,
              cover: b.businessCover,
              slug: b.businessSlug,
              category: b.businessCategory || '',
              city: b.businessCity || '',
            })),
            favoritePosts: (result.data.posts || []).map((p) => ({
              id: p.id || p.post,
              caption: p.caption || '',
              businessName: p.businessName || '',
              businessLogo: p.businessLogo || null,
              businessBookingSlug: p.businessBookingSlug || null,
              images: p.images || [], // ✅ آرایه کامل تصاویر
              image: p.image || (p.images && p.images[0]) || null, // برای backward compatibility
            })),
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('fetchFavorites failed:', error);
          const errorMsg = error?.message || 'خطا در دریافت علاقه‌مندی‌ها';
          set({ error: errorMsg, isLoading: false });
          useToastStore.getState().showToast(errorMsg, 'error');
        }
      },

      // ✅ FIX 5.1: Optimistic Update با مدیریت کامل خطا و اطلاع‌رسانی
      toggleBusinessFavorite: async (businessId, businessData = null) => {
        const { favoriteBusinesses } = get();
        const isFavorited = favoriteBusinesses.some((b) => b.id === businessId);
        const previousState = [...favoriteBusinesses]; // ذخیره حالت قبلی برای rollback دقیق

        // ─── Optimistic Update ───
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
          set({ error: null });
          return !isFavorited;
        } catch (error) {
          console.error('toggleBusinessFavorite failed:', error);

          // ─── Rollback: بازگشت دقیق به حالت قبل ───
          set({
            favoriteBusinesses: previousState,
            error: error?.message || 'خطا در به‌روزرسانی علاقه‌مندی',
          });

          // ✅ FIX 5.1: اطلاع‌رسانی به کاربر درباره شکست و بازگشت تغییرات
          useToastStore.getState().showToast(
            isFavorited
              ? 'خطا در حذف از علاقه‌مندی‌ها. لطفاً دوباره تلاش کنید.'
              : 'خطا در افزودن به علاقه‌مندی‌ها. لطفاً دوباره تلاش کنید.',
            'error',
            4000
          );

          throw error;
        }
      },

      // ✅ FIX 5.1: Optimistic Update با مدیریت کامل خطا و اطلاع‌رسانی
      togglePostFavorite: async (postId, postData = null) => {
        const { favoritePosts } = get();
        const isFavorited = favoritePosts.some((p) => p.id === postId);
        const previousState = [...favoritePosts]; // ذخیره حالت قبلی برای rollback دقیق

        // ─── Optimistic Update ───
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
          set({ error: null });
          return !isFavorited;
        } catch (error) {
          console.error('togglePostFavorite failed:', error);

          // ─── Rollback: بازگشت دقیق به حالت قبل ───
          set({
            favoritePosts: previousState,
            error: error?.message || 'خطا در به‌روزرسانی علاقه‌مندی',
          });

          // ✅ FIX 5.1: اطلاع‌رسانی به کاربر درباره شکست و بازگشت تغییرات
          useToastStore.getState().showToast(
            isFavorited
              ? 'خطا در حذف پست از علاقه‌مندی‌ها. لطفاً دوباره تلاش کنید.'
              : 'خطا در ذخیره پست. لطفاً دوباره تلاش کنید.',
            'error',
            4000
          );

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
          error: null,
        });
      },

      // ═══════════════════════════════════════════════════════
      // ✅ F-06 Fix: پاک‌سازی کامل هنگام لاگ‌اوت
      // ═══════════════════════════════════════════════════════
      clearForLogout: () => {
        set({
          favoriteBusinesses: [],
          favoritePosts: [],
          isLoading: false,
          error: null,
        });
        try {
          useFavoriteStore.persist.clearStorage();
        } catch {
          // silently ignore storage clear errors
        }
      },
    }),
    {
      name: 'beau-favorite-storage',
      version: 2, // ✅ نسخه استور برای migration آینده
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
      partialize: (state) => ({
        favoriteBusinesses: state.favoriteBusinesses,
        favoritePosts: state.favoritePosts,
      }),
      // ✅ FIX 5.1: مدیریت migration برای نسخه‌های آینده
      migrate: (persistedState, version) => {
        if (!persistedState || version < 2) {
          return {
            favoriteBusinesses: [],
            favoritePosts: [],
          };
        }
        return persistedState;
      },
      // ✅ FIX 5.1: اعتبارسنجی داده‌های ذخیره‌شده هنگام rehydrate
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error('useFavoriteStore rehydration error:', error);
            return;
          }
          if (state) {
            // اعتبارسنجی ساختار داده‌ها
            if (!Array.isArray(state.favoriteBusinesses)) {
              state.favoriteBusinesses = [];
            }
            if (!Array.isArray(state.favoritePosts)) {
              state.favoritePosts = [];
            }
          }
        };
      },
    }
  )
);