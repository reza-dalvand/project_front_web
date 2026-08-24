jest.mock('@/api', () => ({
  reviewsService: {
    createReview: jest.fn().mockResolvedValue({ data: {} }),
    canReview: jest.fn().mockResolvedValue({ data: { can_review: true } }),
  },
}));

import { useReviewStore } from '@/stores/useReviewStore';
import { reviewsService } from '@/api';

describe('useReviewStore', () => {
  beforeEach(() => {
    useReviewStore.setState({ reviews: [], pendingReviews: [], isLoading: false, error: null });
    jest.clearAllMocks();
  });

  describe('addPendingReview', () => {
    it('نوبت را به لیست در انتظار اضافه می‌کند', () => {
      useReviewStore.getState().addPendingReview({ id: 'apt1', businessName: 'سالن' });
      expect(useReviewStore.getState().pendingReviews).toHaveLength(1);
    });

    it('از افزودن تکراری جلوگیری می‌کند', () => {
      useReviewStore.getState().addPendingReview({ id: 'apt1', businessName: 'سالن' });
      useReviewStore.getState().addPendingReview({ id: 'apt1', businessName: 'سالن' });
      expect(useReviewStore.getState().pendingReviews).toHaveLength(1);
    });
  });

  describe('dismissPendingReview', () => {
    it('نوبت در انتظار را حذف می‌کند', () => {
      useReviewStore.getState().addPendingReview({ id: 'apt1', businessName: 'سالن' });
      useReviewStore.getState().dismissPendingReview('apt1');
      expect(useReviewStore.getState().pendingReviews).toHaveLength(0);
    });
  });

  describe('hasReviewFor', () => {
    it('وجود نظر برای نوبت را بررسی می‌کند', () => {
      useReviewStore.setState({ reviews: [{ appointmentId: 'apt1' }] });
      expect(useReviewStore.getState().hasReviewFor('apt1')).toBe(true);
      expect(useReviewStore.getState().hasReviewFor('apt2')).toBe(false);
    });
  });

  describe('submitReview', () => {
    it('نظر را ثبت و نوبت در انتظار را حذف می‌کند', async () => {
      useReviewStore.getState().addPendingReview({ id: 'apt1', businessName: 'سالن' });
      await useReviewStore.getState().submitReview('apt1', {
        rating: 5,
        comment: 'عالی',
        tags: ['clean'],
      });
      expect(useReviewStore.getState().reviews).toHaveLength(1);
      expect(useReviewStore.getState().pendingReviews).toHaveLength(0);
      expect(reviewsService.createReview).toHaveBeenCalled();
    });
  });

  describe('checkCanReview', () => {
    it('از سرویس بررسی امکان نظر می‌پرسد', async () => {
      const result = await useReviewStore.getState().checkCanReview('apt1');
      expect(result).toEqual({ can_review: true });
      expect(reviewsService.canReview).toHaveBeenCalledWith('apt1');
    });
  });
});
