// src/api/services/reviews.service.js
/**
 * ⭐ Reviews Service — هماهنگ با بک‌اند
 *
 * Endpoints:
 *   POST /reviews/create/                      → ثبت نظر
 *   GET  /reviews/business/{business_id}/      → نظرات کسب‌وکار
 *   GET  /reviews/my-reviews/                  → نظرات من
 *   GET  /reviews/can-review/{appointment_id}/ → بررسی امکان نظردهی
 *   POST /reviews/reply/                       → پاسخ کسب‌وکار
 *
 * مدل Review بک‌اند:
 *   rating: 1-5
 *   comment: max 300
 *   tags: JSON array ['clean', 'punctual', ...]
 *   reply: پاسخ سالن
 *   replied_at: زمان پاسخ
 */
import apiClient from '../api-client';

export const reviewsService = {
  /**
   * ثبت نظر جدید
   * POST /reviews/create/
   *
   * Payload:
   * {
   *   appointment_id: number,
   *   rating: number (1-5),
   *   comment: string (max 300),
   *   tags: string[]
   * }
   *
   * Response: ReviewDetailSerializer
   */
  createReview: (data) => {
    return apiClient.post('/reviews/create/', data);
  },

  /**
   * نظرات یک کسب‌وکار
   * GET /reviews/business/{business_id}/
   *
   * Response: { reviews: [...], avg_rating, rating_distribution }
   */
  getBusinessReviews: (businessId, params = {}) => {
    return apiClient.get(`/reviews/business/${businessId}/`, { params });
  },

  /**
   * نظرات ثبت‌شده توسط کاربر
   * GET /reviews/my-reviews/
   */
  getMyReviews: () => {
    return apiClient.get('/reviews/my-reviews/');
  },

  /**
   * بررسی امکان ثبت نظر برای نوبت
   * GET /reviews/can-review/{appointment_id}/
   *
   * Response: { can_review: boolean, reason?: string }
   */
  canReview: (appointmentId) => {
    return apiClient.get(`/reviews/can-review/${appointmentId}/`);
  },

  /**
   * ثبت پاسخ کسب‌وکار به نظر
   * POST /reviews/reply/
   *
   * Payload: { review_id: number, reply: string }
   */
  createReply: (reviewId, reply) => {
    return apiClient.post('/reviews/reply/', {
      review_id: reviewId,
      reply,
    });
  },
};
