/**
 * Store نظردهی — هماهنگ با بک‌اند
 * منطق جدید: فقط یکبار نظر برای هر کسب‌وکار
 * اگر نظر نداد، بعد از هر نوبت جدید مدال نشان داده می‌شود
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
      dismissedAppointments: [], // ✅ persisted — برای جلوگیری از نمایش مجدد مدال بسته‌شده
      reviewedBusinessIds: [], // ✅ persisted — کسب‌وکارهایی که کاربر نظر داده
      isLoading: false,
      error: null,

      addPendingReview: (appointment) =>
        set((state) => {
          // اگر قبلاً برای این کسب‌وکار نظر داده، اضافه نکن
          const bizId = appointment.businessId || appointment.business_id;
          if (bizId && state.reviewedBusinessIds.includes(bizId)) {
            return state;
          }
          // اگر قبلاً dismiss شده، اضافه نکن
          if (state.dismissedAppointments.includes(appointment.id)) {
            return state;
          }
          if (state.pendingReviews.some((p) => p.appointmentId === appointment.id)) {
            return state;
          }
          return {
            pendingReviews: [
              ...state.pendingReviews,
              {
                appointmentId: appointment.id,
                businessId: bizId,
                businessName: appointment.businessName || appointment.business_name,
                businessLogo: appointment.businessLogo || appointment.business_logo,
                serviceName: appointment.serviceName || appointment.service_name,
                employeeName: appointment.employeeName || appointment.employee_name,
                date: appointment.date || appointment.date_key,
                time: appointment.time || appointment.time_slot,
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

      submitReview: async (appointmentId, reviewData) => {
        set({ isLoading: true, error: null });
        try {
          await reviewsService.createReview({
            appointment_id: appointmentId,
            comment: reviewData.comment || '',
            tag_votes: reviewData.tag_votes || [],
          });

          // پیدا کردن businessId از pendingReviews
          const pending = get().pendingReviews.find((p) => p.appointmentId === appointmentId);
          const businessId = pending?.businessId;

          const newReview = {
            id: `rev_${Date.now()}`,
            appointmentId,
            businessId,
            ...reviewData,
            submittedAt: Date.now(),
          };

          set((state) => ({
            reviews: [...state.reviews, newReview],
            pendingReviews: state.pendingReviews.filter((p) => p.appointmentId !== appointmentId),
            // ✅ از dismissed هم حذف شود (دیگر مهم نیست چون نظر ثبت شد)
            dismissedAppointments: state.dismissedAppointments.filter((id) => id !== appointmentId),
            // ✅ این کسب‌وکار را به لیست نظر داده‌شده‌ها اضافه کن
            reviewedBusinessIds:
              businessId && !state.reviewedBusinessIds.includes(businessId)
                ? [...state.reviewedBusinessIds, businessId]
                : state.reviewedBusinessIds,
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
          // ✅ فقط این appointment را dismiss کن
          // اگر نوبت جدیدی از همان کسب‌وکار بیاید، appointmentId جدید است و dismiss نیست
          dismissedAppointments: [...state.dismissedAppointments, appointmentId],
        })),

      hasReviewFor: (appointmentId) => get().reviews.some((r) => r.appointmentId === appointmentId),

      hasReviewForBusiness: (businessId) => get().reviewedBusinessIds.includes(businessId),

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

      // ✅ جدید: دریافت نوبت‌های آماده نظردهی از API
      fetchPendingReviews: async () => {
        try {
          const result = await reviewsService.getPendingReviews();
          const appointments = result.data || [];
          const { dismissedAppointments, pendingReviews, reviewedBusinessIds } = get();

          // فقط آن‌هایی که dismiss نشده‌اند، هنوز در pending نیستند، و برای کسب‌وکارشان نظر نداده
          const newAppointments = appointments.filter((apt) => {
            const bizId = apt.business_id || apt.businessId;
            return (
              !dismissedAppointments.includes(apt.id) &&
              !pendingReviews.some((p) => p.appointmentId === apt.id) &&
              !reviewedBusinessIds.includes(bizId)
            );
          });

          set((state) => ({
            pendingReviews: [
              ...state.pendingReviews,
              ...newAppointments.map((apt) => ({
                appointmentId: apt.id,
                businessId: apt.business_id || apt.businessId,
                businessName: apt.business_name || apt.businessName,
                businessLogo: apt.business_logo || apt.businessLogo,
                serviceName: apt.service_name || apt.serviceName,
                employeeName: apt.employee_name || apt.employeeName,
                date: apt.date_key || apt.date,
                time: apt.time_slot || apt.time,
                addedAt: Date.now(),
              })),
            ],
          }));

          return newAppointments;
        } catch (error) {
          console.error('fetchPendingReviews failed:', error);
          return [];
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
        dismissedAppointments: state.dismissedAppointments,
        reviewedBusinessIds: state.reviewedBusinessIds,
      }),
    }
  )
);
