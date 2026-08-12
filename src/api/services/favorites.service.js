// src/api/services/favorites.service.js
/**
 * ❤️ Favorites Service
 *
 * مدیریت علاقه‌مندی‌ها:
 * - لیست علاقه‌مندی‌ها
 * - افزودن/حذف علاقه‌مندی
 * - تعداد علاقه‌مندی‌ها
 */
import apiClient from '../api-client';

export const favoritesService = {
  /**
   * لیست علاقه‌مندی‌ها
   * GET /favorites/?type=business|post
   */
  getFavorites: (type = null) => {
    const params = type ? { type } : {};
    return apiClient.get('/favorites/', { params });
  },

  /**
   * افزودن/حذف علاقه‌مندی
   * POST /favorites/toggle/
   *
   * @param {string} favoriteType - 'business' یا 'post'
   * @param {number} objectId - شناسه کسب‌وکار یا پست
   */
  toggleFavorite: (favoriteType, objectId) => {
    return apiClient.post('/favorites/toggle/', {
      favorite_type: favoriteType,
      object_id: objectId,
    });
  },

  /**
   * تعداد علاقه‌مندی‌ها
   * GET /favorites/count/
   */
  getFavoritesCount: () => {
    return apiClient.get('/favorites/count/');
  },
};
