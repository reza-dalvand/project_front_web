// src/api/services/explore.service.js
/**
 * 🖼️ Explore Service
 *
 * مدیریت پست‌های ویترین:
 * - لیست پست‌ها (عمومی)
 * - جزئیات پست
 * - پست‌های کسب‌وکار من
 * - ایجاد و حذف پست
 */
import apiClient from '../api-client';

export const exploreService = {
  // ═══════════ Public ═══════════

  /**
   * لیست پست‌های ویترین
   * GET /explore/posts/
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

  // ═══════════ Business ═══════════

  /**
   * لیست پست‌های کسب‌وکار من
   * GET /explore/my-posts/
   */
  getMyPosts: () => {
    return apiClient.get('/explore/my-posts/');
  },

  /**
   * ایجاد پست جدید
   * POST /explore/my-posts/create/
   */
  createPost: (data) => {
    return apiClient.post('/explore/my-posts/create/', data);
  },

  /**
   * حذف پست
   * DELETE /explore/my-posts/{pk}/delete/
   */
  deletePost: (postId) => {
    return apiClient.delete(`/explore/my-posts/${postId}/delete/`);
  },
};
