// src/api/services/explore.service.js
/**
 * 🖼️ Explore Service — هماهنگ با بک‌اند
 *
 * Endpoints:
 *   GET    /explore/posts/                    → لیست پست‌ها (عمومی)
 *   GET    /explore/posts/{pk}/               → جزئیات پست
 *   GET    /explore/my-posts/                 → پست‌های کسب‌وکار من
 *   POST   /explore/my-posts/create/          → ایجاد پست
 *   PUT    /explore/my-posts/{pk}/update/     → ویرایش پست
 *   DELETE /explore/my-posts/{pk}/delete/     → حذف پست
 *
 * مدل ExplorePost:
 *   business, source (business|magazine), caption (max 500)
 *   main_category, sub_category, is_pinned
 *   images: PostImage[] (image, sort_order)
 */
import apiClient from '../api-client';

export const exploreService = {
  /**
   * لیست پست‌های ویترین (عمومی)
   * GET /explore/posts/
   *
   * Params: { main_category, business_id, page, page_size }
   * Response: ExplorePostListSerializer[]
   */
  getPosts: (params = {}) => {
    return apiClient.get('/explore/posts/', { params });
  },

  /**
   * جزئیات پست
   * GET /explore/posts/{pk}/
   */
  getPostDetail: (postId) => {
    return apiClient.get(`/explore/posts/${postId}/`);
  },

  /**
   * پست‌های کسب‌وکار من
   * GET /explore/my-posts/
   */
  getMyPosts: () => {
    return apiClient.get('/explore/my-posts/');
  },

  /**
   * ایجاد پست جدید
   * POST /explore/my-posts/create/
   *
   * Payload (FormData):
   * {
   *   caption: string,
   *   main_category: number,
   *   sub_category: number,
   *   images: File[] (max 5)
   * }
   */
  createPost: (data) => {
    if (data instanceof FormData) {
      return apiClient.upload('/explore/my-posts/create/', data);
    }
    return apiClient.post('/explore/my-posts/create/', data);
  },

  /**
   * ویرایش پست
   * PUT /explore/my-posts/{pk}/update/
   */
  updatePost: (postId, data) => {
    if (data instanceof FormData) {
      return apiClient.upload(`/explore/my-posts/${postId}/update/`, data, { method: 'PUT' });
    }
    return apiClient.put(`/explore/my-posts/${postId}/update/`, data);
  },

  /**
   * حذف پست
   * DELETE /explore/my-posts/{pk}/delete/
   */
  deletePost: (postId) => {
    return apiClient.delete(`/explore/my-posts/${postId}/delete/`);
  },
};
