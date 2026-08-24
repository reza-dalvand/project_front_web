import {
  calculateDistance,
  calculateDistanceMeters,
  formatDistance,
  buildGoogleMapsUrl,
  buildBaladUrl,
  buildNeshanUrl,
  isWithinRadius,
  getCurrentLocation,
} from '@/utils/geo-utils';

describe('geo-utils', () => {
  describe('calculateDistance', () => {
    it('فاصله بین دو نقطه یکسان صفر است', () => {
      expect(calculateDistance(35.6892, 51.389, 35.6892, 51.389)).toBe(0);
    });

    it('فاصله بین دو نقطه متفاوت عدد مثبت است', () => {
      const distance = calculateDistance(35.6892, 51.389, 32.6546, 51.668);
      expect(distance).toBeGreaterThan(0);
    });

    it('برای ورودی نامعتبر، خالی برمی‌گرداند', () => {
      expect(calculateDistance(null, 51, 35, 51)).toBeNull();
      expect(calculateDistance(35, null, 35, 51)).toBeNull();
    });
  });

  describe('calculateDistanceMeters', () => {
    it('فاصله را بر حسب متر برمی‌گرداند', () => {
      const km = calculateDistance(35.6892, 51.389, 35.6892, 51.399);
      const meters = calculateDistanceMeters(35.6892, 51.389, 35.6892, 51.399);
      expect(meters).toBeCloseTo(km * 1000, 0);
    });
  });

  describe('formatDistance', () => {
    it('فاصله زیر یک کیلومتر را با متر برمی‌گرداند', () => {
      expect(formatDistance(0.5)).toBe('۵۰۰ متر');
    });

    it('فاصله بین ۱ تا ۱۰ کیلومتر را با یک رقم اعشار برمی‌گرداند', () => {
      expect(formatDistance(2.345)).toBe('۲.۳ کیلومتر');
    });

    it('فاصله بالای ۱۰ کیلومتر را گرد برمی‌گرداند', () => {
      expect(formatDistance(15)).toBe('۱۵ کیلومتر');
    });

    it('برای صفر و نامعتبر، رشته خالی برمی‌گرداند', () => {
      expect(formatDistance(0)).toBe('');
      expect(formatDistance(null)).toBe('');
    });
  });

  describe('نشانی‌های مسیریابی', () => {
    it('نشانی گوگل‌مپ را می‌سازد', () => {
      expect(buildGoogleMapsUrl(35.6892, 51.389)).toBe(
        'https://www.google.com/maps/dir/?api=1&destination=35.6892,51.389'
      );
    });

    it('نشانی بلد را می‌سازد', () => {
      expect(buildBaladUrl(35.6892, 51.389)).toBe(
        'https://balad.ir/route?destination=35.6892,51.389'
      );
    });

    it('نشانی نشان را می‌سازد', () => {
      expect(buildNeshanUrl(35.6892, 51.389)).toBe(
        'https://neshan.org/route?destination=35.6892,51.389'
      );
    });
  });

  describe('isWithinRadius', () => {
    it('نقطه داخل شعاع را تشخیص می‌دهد', () => {
      expect(isWithinRadius(35.6892, 51.389, 35.6892, 51.389, 10)).toBe(true);
    });
  });

  describe('getCurrentLocation', () => {
    it('در محیط فاقد موقعیت‌یاب، خطا برمی‌گرداند', () => {
      // در jsdom موقعیت‌یاب پیاده‌سازی نشده است
      return expect(getCurrentLocation()).rejects.toThrow('پشتیبانی نمی‌کند');
    });
  });
});
