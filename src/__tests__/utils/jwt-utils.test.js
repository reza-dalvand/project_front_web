// src/__tests__/utils/jwt-utils.test.js
import { decodeJWT, isTokenExpired, getTokenRemainingTime, isTokenExpiringSoon } from '@/utils/jwt-utils';

// ✅ FIX: Helper برای Base64url encoding ایمن در برابر کاراکترهای یونیکد (فارسی)
const encodeBase64Url = (obj) => {
  const jsonStr = JSON.stringify(obj);
  const base64 = Buffer.from(jsonStr, 'utf8').toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const createMockToken = (payload, expOffset = 3600) => {
  const header = encodeBase64Url({ alg: 'HS256', typ: 'JWT' });
  const exp = Math.floor(Date.now() / 1000) + expOffset;
  const body = encodeBase64Url({ ...payload, exp });
  const signature = 'mock_signature';
  return `${header}.${body}.${signature}`;
};

describe('jwt-utils', () => {
  describe('decodeJWT', () => {
    it('باید payload با فیلدهای فارسی را decode کند', () => {
      const payload = { user_id: 1, name: 'مریم حسینی', role: 'admin' };
      const token = createMockToken(payload);
      const decoded = decodeJWT(token);
      expect(decoded).not.toBeNull();
      expect(decoded.name).toBe('مریم حسینی');
      expect(decoded.user_id).toBe(1);
    });

    it('توکن نامعتبر را null برگرداند', () => {
      expect(decodeJWT('invalid.token')).toBeNull();
      expect(decodeJWT('')).toBeNull();
      expect(decodeJWT(null)).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('توکن منقضی شده را تشخیص دهد', () => {
      const token = createMockToken({ user_id: 1 }, -100); // 100 seconds in the past
      expect(isTokenExpired(token)).toBe(true);
    });

    it('توکن معتبر را تشخیص دهد', () => {
      const token = createMockToken({ user_id: 1 }, 3600); // 1 hour in the future
      expect(isTokenExpired(token)).toBe(false);
    });
  });

  describe('getTokenRemainingTime', () => {
    it('زمان باقی‌مانده را محاسبه کند', () => {
      const token = createMockToken({ user_id: 1 }, 3600);
      const remaining = getTokenRemainingTime(token);
      expect(remaining).toBeGreaterThan(3500 * 1000);
      expect(remaining).toBeLessThanOrEqual(3600 * 1000);
    });

    it('برای توکن منقضی شده 0 برگرداند', () => {
      const token = createMockToken({ user_id: 1 }, -100);
      expect(getTokenRemainingTime(token)).toBe(0);
    });
  });
});