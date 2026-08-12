// src/__tests__/integration/authFlow.test.js
import { useAuthStore, useAuthModalStore } from '@/stores/useAuthStore';
import { act } from '@testing-library/react';

describe('Auth Flow Integration', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      pendingPhone: null,
      _hydrated: true,
    });
    useAuthModalStore.setState({ showAuthModal: false, pendingAction: null });
  });

  it('Flow کامل: ورود با OTP', async () => {
    // ۱. کاربر شماره وارد می‌کند
    act(() => {
      useAuthStore.getState().setPendingAuth('09123456789');
    });
    expect(useAuthStore.getState().pendingPhone).toBe('09123456789');

    // ۲. مدال OTP باز می‌شود
    act(() => {
      useAuthModalStore.getState().openAuthModal();
    });
    expect(useAuthModalStore.getState().showAuthModal).toBe(true);

    // ۳. کاربر کد را وارد می‌کند و لاگین می‌شود
    act(() => {
      useAuthStore.getState().login('09123456789', 'مریم حسینی');
      useAuthModalStore.getState().closeAuthModal();
    });

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user.name).toBe('مریم حسینی');
    expect(useAuthModalStore.getState().showAuthModal).toBe(false);
    expect(useAuthStore.getState().pendingPhone).toBeNull();
  });

  it('Flow خروج از حساب', () => {
    act(() => {
      useAuthStore.getState().login('09123456789', 'مریم');
    });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    act(() => {
      useAuthStore.getState().logout();
    });
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('Flow pendingAction پس از لاگین', () => {
    const mockAction = jest.fn();

    act(() => {
      useAuthModalStore.getState().openAuthModal(mockAction);
    });

    // لاگین
    act(() => {
      useAuthStore.getState().login('09123456789', 'مریم');
    });

    // بستن مدال → باید pendingAction اجرا شود
    act(() => {
      useAuthModalStore.getState().closeAuthModal();
    });

    // pendingAction با تأخیر ۳۰۰ms اجرا می‌شود
    jest.advanceTimersByTime?.(400);
    // در صورت استفاده از jest.useFakeTimers()
  });
});
