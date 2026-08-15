// src/__tests__/stores/useReviewStore.test.js
import { useReviewStore } from '@/stores/useReviewStore';
import { act } from '@testing-library/react';

describe('useReviewStore', () => {
  beforeEach(() => {
    useReviewStore.setState({ reviews: [], pendingReviews: [] });
  });

  it('افزودن نوبت در انتظار نظردهی', () => {
    act(() => {
      useReviewStore.getState().addPendingReview({
        id: 'apt_1',
        businessName: 'سالن تست',
        serviceName: 'فیشیال',
      });
    });
    expect(useReviewStore.getState().pendingReviews).toHaveLength(1);
  });

  it('جلوگیری از تکرار', () => {
    act(() => {
      useReviewStore.getState().addPendingReview({ id: 'apt_1', businessName: 'سالن' });
      useReviewStore.getState().addPendingReview({ id: 'apt_1', businessName: 'سالن' });
    });
    expect(useReviewStore.getState().pendingReviews).toHaveLength(1);
  });

  // ✅ FIX: ثبت نظر و حذف از pending (async/await)
  it('ثبت نظر و حذف از pending', async () => {
    act(() => {
      useReviewStore.getState().addPendingReview({ id: 'apt_1', businessName: 'سالن' });
    });
    
    await act(async () => {
      await useReviewStore.getState().submitReview('apt_1', { rating: 5, comment: 'عالی' });
    });
    
    expect(useReviewStore.getState().reviews).toHaveLength(1);
    expect(useReviewStore.getState().pendingReviews).toHaveLength(0);
    expect(useReviewStore.getState().reviews[0].rating).toBe(5);
  });

  it('رد کردن نوبت در انتظار', () => {
    act(() => {
      useReviewStore.getState().addPendingReview({ id: 'apt_1', businessName: 'سالن' });
      useReviewStore.getState().dismissPendingReview('apt_1');
    });
    expect(useReviewStore.getState().pendingReviews).toHaveLength(0);
  });

  // ✅ FIX: hasReviewFor (async/await)
  it('hasReviewFor', async () => {
    act(() => {
      useReviewStore.getState().addPendingReview({ id: 'apt_1', businessName: 'سالن' });
    });
    
    await act(async () => {
      await useReviewStore.getState().submitReview('apt_1', { rating: 4 });
    });
    
    expect(useReviewStore.getState().hasReviewFor('apt_1')).toBe(true);
    expect(useReviewStore.getState().hasReviewFor('apt_2')).toBe(false);
  });
});