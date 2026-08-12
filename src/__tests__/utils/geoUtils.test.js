// src/__tests__/utils/geoUtils.test.js
import { calculateDistance, calculateDistanceMeters, formatDistance } from '@/utils/geo-utils';

describe('geo-utils', () => {
  describe('calculateDistance', () => {
    it('فاصله بین دو نقطه شناخته‌شده (تهران تا اصفهان ≈ ۳۴۰ کیلومتر)', () => {
      const tehran = { lat: 35.6892, lng: 51.389 };
      const isfahan = { lat: 32.6546, lng: 51.668 };
      const distance = calculateDistance(tehran.lat, tehran.lng, isfahan.lat, isfahan.lng);
      expect(distance).toBeGreaterThan(300);
      expect(distance).toBeLessThan(400);
    });

    it('فاصله صفر برای نقطه یکسان', () => {
      const distance = calculateDistance(35.6892, 51.389, 35.6892, 51.389);
      expect(distance).toBeCloseTo(0, 5);
    });

    it('ورودی null', () => {
      expect(calculateDistance(null, 51, 35, 51)).toBeNull();
    });
  });

  describe('calculateDistanceMeters', () => {
    it('تبدیل به متر', () => {
      const km = calculateDistance(35.6892, 51.389, 35.6992, 51.389);
      const meters = calculateDistanceMeters(35.6892, 51.389, 35.6992, 51.389);
      expect(meters).toBeCloseTo(km * 1000, 0);
    });
  });

  describe('formatDistance', () => {
    it('فاصله زیر ۱ کیلومتر → متر', () => {
      expect(formatDistance(0.5)).toBe('۵۰۰ متر');
    });

    it('فاصله ۱ تا ۱۰ کیلومتر', () => {
      expect(formatDistance(2.345)).toBe('۲.۳ کیلومتر');
    });

    it('فاصله بالای ۱۰ کیلومتر', () => {
      expect(formatDistance(15.7)).toBe('۱۶ کیلومتر');
    });

    it('ورودی صفر یا null', () => {
      expect(formatDistance(0)).toBe('');
      expect(formatDistance(null)).toBe('');
    });
  });
});
