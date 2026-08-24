import { useTokenStore } from '@/stores/useTokenStore';
import { createJwt } from '../helpers/createJwt';

const futureExp = () => Math.floor(Date.now() / 1000) + 3600;
const pastExp = () => Math.floor(Date.now() / 1000) - 100;

describe('useTokenStore', () => {
  beforeEach(() => {
    useTokenStore.getState().clearTokens();
  });

  describe('setTokens', () => {
    it('توکن‌ها را ذخیره می‌کند', () => {
      useTokenStore.getState().setTokens({ access: 'a', refresh: 'r' });
      expect(useTokenStore.getState().getAccessToken()).toBe('a');
      expect(useTokenStore.getState().getRefreshToken()).toBe('r');
    });
  });

  describe('clearTokens', () => {
    it('توکن‌ها را پاک می‌کند', () => {
      useTokenStore.getState().setTokens({ access: 'a', refresh: 'r' });
      useTokenStore.getState().clearTokens();
      expect(useTokenStore.getState().getAccessToken()).toBeNull();
      expect(useTokenStore.getState().getRefreshToken()).toBeNull();
    });
  });

  describe('updateAccessToken', () => {
    it('فقط توکن دسترسی را به‌روز می‌کند', () => {
      useTokenStore.getState().setTokens({ access: 'a', refresh: 'r' });
      useTokenStore.getState().updateAccessToken('new-access');
      expect(useTokenStore.getState().getAccessToken()).toBe('new-access');
      expect(useTokenStore.getState().getRefreshToken()).toBe('r');
    });
  });

  describe('updateRefreshToken', () => {
    it('فقط توکن تازه‌سازی را به‌روز می‌کند', () => {
      useTokenStore.getState().setTokens({ access: 'a', refresh: 'r' });
      useTokenStore.getState().updateRefreshToken('new-refresh');
      expect(useTokenStore.getState().getRefreshToken()).toBe('new-refresh');
      expect(useTokenStore.getState().getAccessToken()).toBe('a');
    });
  });

  describe('hasValidAccessToken', () => {
    it('برای توکن معتبر، خالی برمی‌گرداند', () => {
      const token = createJwt({ user_id: 1, exp: futureExp() });
      useTokenStore.getState().setTokens({ access: token, refresh: 'r' });
      expect(useTokenStore.getState().hasValidAccessToken()).toBe(true);
    });

    it('برای توکن منقضی‌شده، خالی برمی‌گرداند', () => {
      const token = createJwt({ user_id: 1, exp: pastExp() });
      useTokenStore.getState().setTokens({ access: token, refresh: 'r' });
      expect(useTokenStore.getState().hasValidAccessToken()).toBe(false);
    });

    it('بدون توکن، خالی برمی‌گرداند', () => {
      expect(useTokenStore.getState().hasValidAccessToken()).toBe(false);
    });
  });

  describe('getUserIdFromToken', () => {
    it('شناسه کاربر را از توکن استخراج می‌کند', () => {
      const token = createJwt({ user_id: 42, exp: futureExp() });
      useTokenStore.getState().setTokens({ access: token, refresh: 'r' });
      expect(useTokenStore.getState().getUserIdFromToken()).toBe(42);
    });

    it('بدون توکن، خالی برمی‌گرداند', () => {
      expect(useTokenStore.getState().getUserIdFromToken()).toBeNull();
    });
  });

  describe('isTokenExpiringSoon', () => {
    it('برای توکنی که به‌زودی منقضی می‌شود، خالی برمی‌گرداند', () => {
      const soon = Math.floor(Date.now() / 1000) + 60;
      const token = createJwt({ exp: soon });
      useTokenStore.getState().setTokens({ access: token, refresh: 'r' });
      expect(useTokenStore.getState().isTokenExpiringSoon()).toBe(true);
    });

    it('برای توکنی که زمان زیادی مانده، خالی برمی‌گرداند', () => {
      const token = createJwt({ exp: futureExp() });
      useTokenStore.getState().setTokens({ access: token, refresh: 'r' });
      expect(useTokenStore.getState().isTokenExpiringSoon()).toBe(false);
    });
  });
});
