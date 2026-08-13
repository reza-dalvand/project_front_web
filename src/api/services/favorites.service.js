// src/api/services/favorites.service.js
/**
 * ❤️ Favorites Service — هماهنگ با بک‌اند
 *
 * Endpoints:
 *   GET  /favorites/        → لیست علاقه‌مندی‌ها
 *   POST /favorites/toggle/ → افزودن/حذف علاقه‌مندی
 *   GET  /favorites/count/  → تعداد علاقه‌مندی‌ها
 *
 * مدل‌ها:
 *   FavoriteBusiness: user + business (unique_together)
 *   FavoritePost: user + post (unique_together)
 */
import apiClient from '../api-client';

export const favoritesService = {
  /**
   * لیست علاقه‌مندی‌ها
   * GET /favorites/?type=business|post
   *
   * Response: { businesses: [...], posts: [...] }
   */
  getFavorites: (type = null) => {
    const params = type ? { type } : {};
    return apiClient.get('/favorites/', { params });
  },

  /**
   * افزودن/حذف علاقه‌مندی (Toggle)
   * POST /favorites/toggle/
   *
   * Payload: { favorite_type: 'business'|'post', object_id: number }
   * Response: { is_favorited: boolean, message: string }
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
   *
   * Response: { business: number, post: number, total: number }
   */
  getFavoritesCount: () => {
    return apiClient.get('/favorites/count/');
  },
};
