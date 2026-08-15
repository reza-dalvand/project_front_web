// src/__tests__/integration/authFlow.test.js
import { useAuthStore, useAuthModalStore } from '@/stores/useAuthStore';
import { act } from '@testing-library/react';

// ✅ Helper مشترک
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

describe('Auth Flow Integration', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      pendingPhone: null,
      needsProfileCompletion: false,
      _hydrated: true,
    });
    useAuthModalStore.setState({ showAuthModal: false, pendingAction: null });
  });

  it('Flow کامل: ورود با OTP', async () => {
    act(() => {
      useAuthStore.getState().setPendingAuth('09123456789');
    });
    expect(useAuthStore.getState().pendingPhone).toBe('09123456789');

    act(() => {
      useAuthModalStore.getState().openAuthModal();
    });
    expect(useAuthModalStore.getState().showAuthModal).toBe(true);

    act(() => {
      useAuthStore.getState().login(createTestUser(), createTestTokens());
      useAuthModalStore.getState().closeAuthModal();
    });

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user.name).toBe('مریم حسینی');
    expect(useAuthModalStore.getState().showAuthModal).toBe(false);
    expect(useAuthStore.getState().pendingPhone).toBeNull();
  });

  // ✅ FIX: خروج از حساب (async/await)
  it('Flow خروج از حساب', async () => {
    act(() => {
      useAuthStore.getState().login(createTestUser(), createTestTokens());
    });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    
    await act(async () => {
      await useAuthStore.getState().logout();
    });
    
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });

  // ✅ FIX: استفاده از Fake Timers
  it('Flow pendingAction پس از لاگین', async () => {
    jest.useFakeTimers();
    const mockAction = jest.fn();
    
    act(() => {
      useAuthModalStore.getState().openAuthModal(mockAction);
    });
    act(() => {
      useAuthStore.getState().login(createTestUser(), createTestTokens());
    });
    act(() => {
      useAuthModalStore.getState().closeAuthModal();
    });
    
    // pendingAction با تأخیر ۳۰۰ms اجرا می‌شود
    act(() => {
      jest.advanceTimersByTime(400);
    });
    
    expect(mockAction).toHaveBeenCalled();
    jest.useRealTimers();
  });
});