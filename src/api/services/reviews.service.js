// src/api/services/reviews.service.js
/**
 * ⭐ Reviews Service
 *
 * مدیریت نظرات و امتیازات:
 * - ثبت نظر
 * - لیست نظرات کسب‌وکار
 * - نظرات من
 * - بررسی امکان ثبت نظر
 * - پاسخ کسب‌وکار به نظر
 */
import apiClient from '../api-client';

export const reviewsService = {
  /**
   * ثبت نظر جدید
   * POST /reviews/create/
   *
   * @param {object} data - { appointment_id, rating, comment, tags }
   */
  createReview: (data) => {
    return apiClient.post('/reviews/create/', data);
  },

  /**
   * لیست نظرات یک کسب‌وکار
   * GET /reviews/business/{business_id}/
   */
  getBusinessReviews: (businessId, params = {}) => {
    return apiClient.get(`/reviews/business/${businessId}/`, { params });
  },

  /**
   * لیست نظرات ثبت‌شده توسط کاربر
   * GET /reviews/my-reviews/
   */
  getMyReviews: () => {
    return apiClient.get('/reviews/my-reviews/');
  },

  /**
   * بررسی امکان ثبت نظر برای نوبت
   * GET /reviews/can-review/{appointment_id}/
   */
  canReview: (appointmentId) => {
    return apiClient.get(`/reviews/can-review/${appointmentId}/`);
  },

  /**
   * ثبت پاسخ کسب‌وکار به نظر
   * POST /reviews/reply/
   */
  createReply: (reviewId, reply) => {
    return apiClient.post('/reviews/reply/', { review_id: reviewId, reply });
  },
};
