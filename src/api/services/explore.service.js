// src/api/services/explore.service.js
/**
 * 🖼️ Explore Service — ویترین + اسلایدر صفحه هوم
 *
 * - getPosts      → اسلایدر تبلیغاتی صفحه هوم (از /explore/posts/)
 * - getPortfolios → گرید ویترین صفحه اکسپلور (از /portfolios/)
 */
import apiClient from '../api-client';

export const exploreService = {
  /**
   * دریافت پست‌های ویترین (برای اسلایدر صفحه هوم)
   *
   * @param {object} params - { page, page_size, category_id, business_id }
   *
   * Response (ExplorePostListSerializer):
   *   { id, caption, source, business, business_name, business_logo,
   *     business_booking_slug, main_category, main_category_name,
   *     sub_category, sub_category_name, is_pinned, images, first_image,
   *     is_favorited, created_at }
   */
  getPosts: (params = {}) => {
    return apiClient.get('/explore/posts/', { params });
  },

  /**
   * دریافت جزئیات یک پست ویترین
   */
  getPostDetail: (postId) => {
    return apiClient.get(`/explore/posts/${postId}/`);
  },

  /**
   * دریافت تمام نمونه‌کارها (برای گرید صفحه اکسپلور)
   *
   * @param {object} params - { page, page_size, category_id, business_id }
   */
  getPortfolios: (params = {}) => {
    return apiClient.get('/portfolios/', { params });
  },

  /**
   * دریافت جزئیات یک نمونه‌کار
   */
  getPortfolioDetail: (portfolioId) => {
    return apiClient.get(`/portfolios/${portfolioId}/`);
  },
};
