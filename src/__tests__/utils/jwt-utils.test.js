import {
  decodeJWT,
  isTokenExpired,
  getTokenRemainingTime,
  getUserIdFromToken,
  isTokenExpiringSoon,
} from '@/utils/jwt-utils';
import { createJwt } from '../helpers/createJwt';

const futureExp = () => Math.floor(Date.now() / 1000) + 3600;
const pastExp = () => Math.floor(Date.now() / 1000) - 100;

describe('jwt-utils', () => {
  describe('decodeJWT', () => {
    it('payload یک توکن معتبر را استخراج می‌کند', () => {
      const token = createJwt({ user_id: 1, exp: futureExp(), name: 'مریم حسینی' });
      const payload = decodeJWT(token);
      expect(payload).not.toBeNull();
      expect(payload.user_id).toBe(1);
      expect(payload.name).toBe('مریم حسینی');
    });

    it('برای توکن نامعتبر، خالی برمی‌گرداند', () => {
      expect(decodeJWT('')).toBeNull();
      expect(decodeJWT(null)).toBeNull();
      expect(decodeJWT('invalid')).toBeNull();
      expect(decodeJWT('a.b')).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('برای توکن با انقضای آینده، خالی برمی‌گرداند', () => {
      const token = createJwt({ exp: futureExp() });
      expect(isTokenExpired(token)).toBe(false);
    });

    it('برای توکن منقضی‌شده، خالی برمی‌گرداند', () => {
      const token = createJwt({ exp: pastExp() });
      expect(isTokenExpired(token)).toBe(true);
    });

    it('برای توکن بدون فیلد انقضا، خالی برمی‌گرداند', () => {
      const token = createJwt({ user_id: 1 });
      expect(isTokenExpired(token)).toBe(true);
    });

    it('برای توکن نامعتبر، خالی برمی‌گرداند', () => {
      expect(isTokenExpired('invalid')).toBe(true);
      expect(isTokenExpired(null)).toBe(true);
    });
  });

  describe('getTokenRemainingTime', () => {
    it('زمان باقی‌مانده را بر حسب میلی‌ثانیه برمی‌گرداند', () => {
      const token = createJwt({ exp: futureExp() });
      const remaining = getTokenRemainingTime(token);
      expect(remaining).toBeGreaterThan(0);
      expect(remaining).toBeLessThanOrEqual(3600 * 1000);
    });

    it('برای توکن منقضی‌شده، صفر برمی‌گرداند', () => {
      const token = createJwt({ exp: pastExp() });
      expect(getTokenRemainingTime(token)).toBe(0);
    });
  });

  describe('getUserIdFromToken', () => {
    it('شناسه کاربر را از توکن استخراج می‌کند', () => {
      const token = createJwt({ user_id: 42, exp: futureExp() });
      expect(getUserIdFromToken(token)).toBe(42);
    });

    it('برای توکن نامعتبر، خالی برمی‌گرداند', () => {
      expect(getUserIdFromToken('invalid')).toBeNull();
      expect(getUserIdFromToken(null)).toBeNull();
    });
  });

  describe('isTokenExpiringSoon', () => {
    it('برای توکنی که کمتر از ۵ دقیقه مانده، خالی برمی‌گرداند', () => {
      const soon = Math.floor(Date.now() / 1000) + 60;
      const token = createJwt({ exp: soon });
      expect(isTokenExpiringSoon(token)).toBe(true);
    });

    it('برای توکنی که زمان زیادی مانده، خالی برمی‌گرداند', () => {
      const token = createJwt({ exp: futureExp() });
      expect(isTokenExpiringSoon(token)).toBe(false);
    });

    it('برای توکن منقضی‌شده، خالی برمی‌گرداند', () => {
      const token = createJwt({ exp: pastExp() });
      expect(isTokenExpiringSoon(token)).toBe(false);
    });
  });
});
