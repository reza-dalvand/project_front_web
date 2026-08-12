// src/__tests__/stores/useAuthStore.test.js
import { useAuthStore, useAuthModalStore } from '@/stores/useAuthStore';
import { act } from '@testing-library/react';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      pendingPhone: null,
      pendingName: null,
      _hydrated: true,
    });
    useAuthModalStore.setState({
      showAuthModal: false,
      pendingAction: null,
    });
  });

  it('وضعیت پیش‌فرض: لاگین نیست', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('ورود با موفقیت', () => {
    act(() => {
      useAuthStore.getState().login('09123456789', 'مریم حسینی');
    });
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user.phone).toBe('09123456789');
    expect(state.user.name).toBe('مریم حسینی');
  });

  it('خروج از حساب', () => {
    act(() => {
      useAuthStore.getState().login('09123456789', 'مریم');
      useAuthStore.getState().logout();
    });
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('بروزرسانی پروفایل', () => {
    act(() => {
      useAuthStore.getState().login('09123456789', 'مریم');
      useAuthStore.getState().updateUser({ name: 'مریم حسینی' });
    });
    expect(useAuthStore.getState().user.name).toBe('مریم حسینی');
  });

  it('setPendingAuth', () => {
    act(() => {
      useAuthStore.getState().setPendingAuth('09123456789', 'مریم', 'حسینی');
    });
    const state = useAuthStore.getState();
    expect(state.pendingPhone).toBe('09123456789');
    expect(state.pendingName).toBe('مریم حسینی');
  });
});

describe('useAuthModalStore', () => {
  beforeEach(() => {
    useAuthModalStore.setState({ showAuthModal: false, pendingAction: null });
  });

  it('باز کردن مدال', () => {
    act(() => {
      useAuthModalStore.getState().openAuthModal();
    });
    expect(useAuthModalStore.getState().showAuthModal).toBe(true);
  });

  it('بستن مدال', () => {
    act(() => {
      useAuthModalStore.getState().openAuthModal();
      useAuthModalStore.getState().closeAuthModal();
    });
    expect(useAuthModalStore.getState().showAuthModal).toBe(false);
  });

  it('ذخیره pendingAction', () => {
    const mockAction = jest.fn();
    act(() => {
      useAuthModalStore.getState().openAuthModal(mockAction);
    });
    expect(useAuthModalStore.getState().pendingAction).toBe(mockAction);
  });
});
