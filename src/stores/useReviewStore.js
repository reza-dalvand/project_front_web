// src/stores/useReviewStore.js
/**
 * Store نظردهی — هماهنگ با بک‌اند
 *
 * مدل Review بک‌اند:
 *   rating: 1-5
 *   comment: max 300
 *   tags: ['clean', 'punctual', 'quality', 'polite', 'fair_price', 'recommend']
 *   reply: پاسخ سالن
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { reviewsService } from '@/api';
import { USE_MOCK } from '@/api/config';

// تگ‌های مجاز (هماهنگ با بک‌اند)
export const REVIEW_TAGS = [
  { id: 'clean', label: 'مکان تمیز بود' },
  { id: 'punctual', label: 'سر وقت انجام شد' },
  { id: 'quality', label: 'کیفیت عالی بود' },
  { id: 'polite', label: 'رفتار محترمانه' },
  { id: 'fair_price', label: 'قیمت مناسب بود' },
  { id: 'recommend', label: 'پیشنهاد می‌کنم' },
];

export const useReviewStore = create(
  persist(
    (set, get) => ({
      // ─── State ───
      reviews: [], // نظرات ثبت‌شده
      pendingReviews: [], // نوبت‌های در انتظار نظردهی
      isLoading: false,
      error: null,

      // ─── افزودن نوبت در انتظار نظردهی ───
      addPendingReview: (appointment) =>
        set((state) => {
          if (state.pendingReviews.some((p) => p.appointmentId === appointment.id)) {
            return state;
          }
          return {
            pendingReviews: [
              ...state.pendingReviews,
              {
                appointmentId: appointment.id,
                businessName: appointment.businessName,
                businessLogo: appointment.businessLogo,
                serviceName: appointment.serviceName,
                employeeName: appointment.employeeName,
                date: appointment.date,
                time: appointment.time,
                addedAt: Date.now(),
              },
            ],
          };
        }),

      // ─── بررسی امکان نظردهی از API ───
      checkCanReview: async (appointmentId) => {
        if (USE_MOCK) return { can_review: true };
        try {
          const result = await reviewsService.canReview(appointmentId);
          return result.data;
        } catch (error) {
          console.error('checkCanReview failed:', error);
          return { can_review: false };
        }
      },

      // ─── ثبت نظر — هماهنگ با بک‌اند ───
      submitReview: async (appointmentId, reviewData) => {
        set({ isLoading: true, error: null });
        try {
          if (!USE_MOCK) {
            // فراخوانی واقعی API
            await reviewsService.createReview({
              appointment_id: appointmentId,
              rating: reviewData.rating,
              comment: reviewData.comment || '',
              tags: reviewData.tags || [],
            });
          } else {
            // شبیه‌سازی
            await new Promise((r) => setTimeout(r, 800));
          }

          const newReview = {
            id: `rev_${Date.now()}`,
            appointmentId,
            ...reviewData,
            submittedAt: Date.now(),
          };

          set((state) => ({
            reviews: [...state.reviews, newReview],
            pendingReviews: state.pendingReviews.filter((p) => p.appointmentId !== appointmentId),
            isLoading: false,
          }));

          return newReview;
        } catch (error) {
          console.error('submitReview failed:', error);
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      // ─── رد کردن نوبت در انتظار ───
      dismissPendingReview: (appointmentId) =>
        set((state) => ({
          pendingReviews: state.pendingReviews.filter((p) => p.appointmentId !== appointmentId),
        })),

      // ─── بررسی نظر ثبت‌شده ───
      hasReviewFor: (appointmentId) => get().reviews.some((r) => r.appointmentId === appointmentId),

      // ─── دریافت نظرات کسب‌وکار ───
      fetchBusinessReviews: async (businessId) => {
        if (USE_MOCK) return [];
        try {
          const result = await reviewsService.getBusinessReviews(businessId);
          return result.data;
        } catch (error) {
          console.error('fetchBusinessReviews failed:', error);
          return [];
        }
      },

      // ─── دریافت نظرات من ───
      fetchMyReviews: async () => {
        if (USE_MOCK) return get().reviews;
        try {
          const result = await reviewsService.getMyReviews();
          return result.data;
        } catch (error) {
          console.error('fetchMyReviews failed:', error);
          return [];
        }
      },

      // ─── پاسخ کسب‌وکار به نظر ───
      replyToReview: async (reviewId, reply) => {
        if (USE_MOCK) return;
        try {
          await reviewsService.createReply(reviewId, reply);
        } catch (error) {
          console.error('replyToReview failed:', error);
          throw error;
        }
      },
    }),
    {
      name: 'beau-review-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
      partialize: (state) => ({
        reviews: state.reviews,
        pendingReviews: state.pendingReviews,
      }),
    }
  )
);
