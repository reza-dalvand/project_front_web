// src/stores/useReviewStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useReviewStore = create(
  persist(
    (set, get) => ({
      reviews: [],
      pendingReviews: [],

      // افزودن نوبت در انتظار نظردهی
      addPendingReview: (appointment) =>
        set((state) => {
          // جلوگیری از تکرار
          if (state.pendingReviews.some((p) => p.appointmentId === appointment.id)) {
            return state;
          }
          const updated = [
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
          ];
          return { pendingReviews: updated };
        }),

      // ثبت نظر و حذف از لیست در انتظار
      submitReview: (appointmentId, reviewData) => {
        const newReview = {
          id: `rev_${Date.now()}`,
          appointmentId,
          ...reviewData,
          submittedAt: Date.now(),
        };
        set((state) => ({
          reviews: [...state.reviews, newReview],
          pendingReviews: state.pendingReviews.filter((p) => p.appointmentId !== appointmentId),
        }));
        return newReview;
      },

      // رد کردن نوبت در انتظار نظردهی
      dismissPendingReview: (appointmentId) =>
        set((state) => ({
          pendingReviews: state.pendingReviews.filter((p) => p.appointmentId !== appointmentId),
        })),

      // بررسی آیا برای این نوبت نظر ثبت شده
      hasReviewFor: (appointmentId) => get().reviews.some((r) => r.appointmentId === appointmentId),
    }),
    {
      name: 'zibano-review-storage',
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
