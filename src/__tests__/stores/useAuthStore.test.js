// src/__tests__/stores/useAuthStore.test.js
import { useAuthStore, useAuthModalStore } from '@/stores/useAuthStore';
import { act } from '@testing-library/react';

// ✅ Helper برای ساخت داده‌های تست
const createTestUser = (phone = '09123456789', firstName = 'مریم', lastName = 'حسینی') => ({
  id: 1,
  phone,
  phone_display: `${phone.slice(0, 4)}***${phone.slice(-4)}`,
  first_name: firstName,
  last_name: lastName,
  full_name: `${firstName} ${lastName}`,
  avatar: null,
  is_verified: true,
  is_national_id_verified: false,
  verified_name: '',
  date_joined: '2024-01-15T10:00:00Z',
});

const createTestTokens = () => ({
  access_token: 'mock_access_token_test',
  refresh_token: 'mock_refresh_token_test',
});

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      pendingPhone: null,
      pendingName: null,
      needsProfileCompletion: false,
      _hydrated: true,
    });
    useAuthModalStore.setState({ showAuthModal: false, pendingAction: null });
  });

  it('وضعیت پیش‌فرض: لاگین نیست', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('ورود با موفقیت', () => {
    act(() => {
      useAuthStore.getState().login(createTestUser(), createTestTokens());
    });
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user.phone).toBe('09123456789');
    expect(state.user.name).toBe('مریم حسینی');
  });

  // ✅ FIX: خروج از حساب (async/await)
  it('خروج از حساب', async () => {
    act(() => {
      useAuthStore.getState().login(createTestUser(), createTestTokens());
    });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    await act(async () => {
      await useAuthStore.getState().logout();
    });

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('بروزرسانی پروفایل', () => {
    act(() => {
      useAuthStore.getState().login(createTestUser(), createTestTokens());
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
