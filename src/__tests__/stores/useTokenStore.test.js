// src/__tests__/stores/useTokenStore.test.js
import { useTokenStore } from '@/stores/useTokenStore';
import { act } from '@testing-library/react';

// Helper برای ساخت JWT
const createMockJWT = (payload) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  const body = btoa(JSON.stringify(payload))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${header}.${body}.mock_sig`;
};

describe('useTokenStore', () => {
  beforeEach(() => {
    act(() => {
      useTokenStore.getState().clearTokens();
    });
  });

  // ═══════ وضعیت اولیه ═══════
  describe('وضعیت اولیه', () => {
    it('توکن‌ها باید null باشند', () => {
      const state = useTokenStore.getState();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
    });

    it('tokenType باید Bearer باشد', () => {
      const state = useTokenStore.getState();
      expect(state.tokenType).toBe('Bearer');
    });
  });

  // ═══════ setTokens ═══════
  describe('setTokens', () => {
    it('توکن‌ها را ذخیره کند', () => {
      act(() => {
        useTokenStore.getState().setTokens({
          access: 'mock_access_123',
          refresh: 'mock_refresh_456',
        });
      });
      const state = useTokenStore.getState();
      expect(state.accessToken).toBe('mock_access_123');
      expect(state.refreshToken).toBe('mock_refresh_456');
    });

    it('tokenType را Bearer تنظیم کند', () => {
      act(() => {
        useTokenStore.getState().setTokens({
          access: 'acc',
          refresh: 'ref',
        });
      });
      expect(useTokenStore.getState().tokenType).toBe('Bearer');
    });
  });

  // ═══════ updateAccessToken ═══════
  describe('updateAccessToken', () => {
    it('فقط access token را بروزرسانی کند', () => {
      act(() => {
        useTokenStore.getState().setTokens({
          access: 'old_access',
          refresh: 'keep_refresh',
        });
        useTokenStore.getState().updateAccessToken('new_access');
      });
      const state = useTokenStore.getState();
      expect(state.accessToken).toBe('new_access');
      expect(state.refreshToken).toBe('keep_refresh');
    });
  });

  // ═══════ updateRefreshToken ═══════
  describe('updateRefreshToken', () => {
    it('فقط refresh token را بروزرسانی کند', () => {
      act(() => {
        useTokenStore.getState().setTokens({
          access: 'keep_access',
          refresh: 'old_refresh',
        });
        useTokenStore.getState().updateRefreshToken('new_refresh');
      });
      const state = useTokenStore.getState();
      expect(state.accessToken).toBe('keep_access');
      expect(state.refreshToken).toBe('new_refresh');
    });
  });

  // ═══════ clearTokens ═══════
  describe('clearTokens', () => {
    it('هر دو توکن را پاک کند', () => {
      act(() => {
        useTokenStore.getState().setTokens({
          access: 'acc',
          refresh: 'ref',
        });
        useTokenStore.getState().clearTokens();
      });
      const state = useTokenStore.getState();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
    });
  });

  // ═══════ Getters ═══════
  describe('getters', () => {
    beforeEach(() => {
      act(() => {
        useTokenStore.getState().setTokens({
          access: 'test_access',
          refresh: 'test_refresh',
        });
      });
    });

    it('getAccessToken توکن را برگرداند', () => {
      expect(useTokenStore.getState().getAccessToken()).toBe('test_access');
    });

    it('getRefreshToken توکن را برگرداند', () => {
      expect(useTokenStore.getState().getRefreshToken()).toBe('test_refresh');
    });

    it('getAccessToken بدون توکن null برگرداند', () => {
      act(() => {
        useTokenStore.getState().clearTokens();
      });
      expect(useTokenStore.getState().getAccessToken()).toBeNull();
    });
  });

  // ═══════ hasValidAccessToken ═══════
  describe('hasValidAccessToken', () => {
    it('برای توکن معتبر true برگرداند', () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      const validToken = createMockJWT({ user_id: 1, exp: futureExp });
      act(() => {
        useTokenStore.getState().setTokens({ access: validToken, refresh: 'ref' });
      });
      expect(useTokenStore.getState().hasValidAccessToken()).toBe(true);
    });

    it('برای توکن منقضی false برگرداند', () => {
      const pastExp = Math.floor(Date.now() / 1000) - 100;
      const expiredToken = createMockJWT({ user_id: 1, exp: pastExp });
      act(() => {
        useTokenStore.getState().setTokens({ access: expiredToken, refresh: 'ref' });
      });
      expect(useTokenStore.getState().hasValidAccessToken()).toBe(false);
    });

    it('بدون توکن false برگرداند', () => {
      expect(useTokenStore.getState().hasValidAccessToken()).toBe(false);
    });
  });

  // ═══════ isTokenExpiringSoon ═══════
  describe('isTokenExpiringSoon', () => {
    it('برای توکن با ۲ دقیقه اعتبار true برگرداند', () => {
      const exp = Math.floor(Date.now() / 1000) + 120;
      const token = createMockJWT({ exp });
      act(() => {
        useTokenStore.getState().setTokens({ access: token, refresh: 'ref' });
      });
      expect(useTokenStore.getState().isTokenExpiringSoon()).toBe(true);
    });

    it('برای توکن با ۱ ساعت اعتبار false برگرداند', () => {
      const exp = Math.floor(Date.now() / 1000) + 3600;
      const token = createMockJWT({ exp });
      act(() => {
        useTokenStore.getState().setTokens({ access: token, refresh: 'ref' });
      });
      expect(useTokenStore.getState().isTokenExpiringSoon()).toBe(false);
    });
  });

  // ═══════ getUserIdFromToken ═══════
  describe('getUserIdFromToken', () => {
    it('user_id را از توکن استخراج کند', () => {
      const token = createMockJWT({ user_id: 789, exp: 1893456000 });
      act(() => {
        useTokenStore.getState().setTokens({ access: token, refresh: 'ref' });
      });
      expect(useTokenStore.getState().getUserIdFromToken()).toBe(789);
    });

    it('بدون توکن null برگرداند', () => {
      expect(useTokenStore.getState().getUserIdFromToken()).toBeNull();
    });
  });
});
