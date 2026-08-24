// src/stores/useReviewStore.js
/**
 * Store نظردهی — هماهنگ با بک‌اند
 * ✅ حذف USE_MOCK — فقط API
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { reviewsService } from '@/api';

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
      reviews: [],
      pendingReviews: [],
      isLoading: false,
      error: null,

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

      checkCanReview: async (appointmentId) => {
        try {
          const result = await reviewsService.canReview(appointmentId);
          return result.data;
        } catch (error) {
          console.error('checkCanReview failed:', error);
          return { can_review: false };
        }
      },

      // ✅ حذف USE_MOCK — فقط API
      submitReview: async (appointmentId, reviewData) => {
        set({ isLoading: true, error: null });
        try {
          await reviewsService.createReview({
            appointment_id: appointmentId,
            rating: reviewData.rating,
            comment: reviewData.comment || '',
            tags: reviewData.tags || [],
          });

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

      dismissPendingReview: (appointmentId) =>
        set((state) => ({
          pendingReviews: state.pendingReviews.filter((p) => p.appointmentId !== appointmentId),
        })),

      hasReviewFor: (appointmentId) => get().reviews.some((r) => r.appointmentId === appointmentId),

      fetchBusinessReviews: async (businessId) => {
        try {
          const result = await reviewsService.getBusinessReviews(businessId);
          return result.data;
        } catch (error) {
          console.error('fetchBusinessReviews failed:', error);
          return [];
        }
      },

      fetchMyReviews: async () => {
        try {
          const result = await reviewsService.getMyReviews();
          return result.data;
        } catch (error) {
          console.error('fetchMyReviews failed:', error);
          return [];
        }
      },

      replyToReview: async (reviewId, reply) => {
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
