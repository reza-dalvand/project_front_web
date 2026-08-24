import {
  calculateAppFee,
  APP_FEE_TIERS,
  MAX_APP_FEE,
  getCurrentFeeTier,
  calculateFinalPrice,
  calculateDiscountAmount,
  calculateDeposit,
  calculateRemaining,
  calculateBusinessShare,
  buildPriceSummary,
  MIN_DEPOSIT,
} from '@/utils/price-utils';

describe('price-utils', () => {
  describe('calculateAppFee', () => {
    it('زیر ۲۵۰ هزار تومان، کمیسیون ثابت ۷۰۰۰ است', () => {
      expect(calculateAppFee(100000)).toBe(7000);
      expect(calculateAppFee(200000)).toBe(7000);
      expect(calculateAppFee(249999)).toBe(7000);
    });

    it('از ۲۵۰ هزار تا ۵۰۰ هزار، ۳ درصد است', () => {
      expect(calculateAppFee(250000)).toBe(7500);
      expect(calculateAppFee(500000)).toBe(15000);
    });

    it('بالای ۵۰۰ هزار، ۴ درصد است', () => {
      expect(calculateAppFee(600000)).toBe(24000);
      expect(calculateAppFee(1000000)).toBe(40000);
    });

    it('کمیسیون از سقف بیشتر نمی‌شود', () => {
      expect(calculateAppFee(2000000)).toBe(MAX_APP_FEE);
    });

    it('برای صفر، منفی و نامعتبر صفر برمی‌گرداند', () => {
      expect(calculateAppFee(0)).toBe(0);
      expect(calculateAppFee(-100)).toBe(0);
      expect(calculateAppFee(null)).toBe(0);
    });
  });

  describe('getCurrentFeeTier', () => {
    it('ردیف صحیح را بر اساس مبلغ برمی‌گرداند', () => {
      expect(getCurrentFeeTier(100000)).toEqual(APP_FEE_TIERS[0]);
      expect(getCurrentFeeTier(300000)).toEqual(APP_FEE_TIERS[1]);
      expect(getCurrentFeeTier(600000)).toEqual(APP_FEE_TIERS[2]);
    });

    it('برای صفر، ردیف اول را برمی‌گرداند', () => {
      expect(getCurrentFeeTier(0)).toEqual(APP_FEE_TIERS[0]);
    });
  });

  describe('calculateFinalPrice', () => {
    it('قیمت نهایی را با کسر تخفیف محاسبه می‌کند', () => {
      expect(calculateFinalPrice(750000, 10)).toBe(675000);
      expect(calculateFinalPrice(500000, 20)).toBe(400000);
    });

    it('بدون تخفیف، همان قیمت اصلی را برمی‌گرداند', () => {
      expect(calculateFinalPrice(750000, 0)).toBe(750000);
    });

    it('برای قیمت نامعتبر صفر برمی‌گرداند', () => {
      expect(calculateFinalPrice(0, 10)).toBe(0);
      expect(calculateFinalPrice(null, 10)).toBe(0);
    });
  });

  describe('calculateDiscountAmount', () => {
    it('مبلغ تخفیف را محاسبه می‌کند', () => {
      expect(calculateDiscountAmount(750000, 10)).toBe(75000);
    });

    it('بدون تخفیف صفر برمی‌گرداند', () => {
      expect(calculateDiscountAmount(750000, 0)).toBe(0);
      expect(calculateDiscountAmount(750000)).toBe(0);
    });
  });

  describe('calculateDeposit', () => {
    it('بیعانه را بر اساس درصد محاسبه می‌کند', () => {
      expect(calculateDeposit(675000, true, 30)).toBe(202500);
    });

    it('بیعانه از حداقل کمتر نمی‌شود', () => {
      expect(calculateDeposit(100000, true, 5)).toBe(MIN_DEPOSIT);
    });

    it('بدون بیعانه صفر برمی‌گرداند', () => {
      expect(calculateDeposit(675000, false)).toBe(0);
      expect(calculateDeposit(0, true, 30)).toBe(0);
    });
  });

  describe('calculateRemaining', () => {
    it('مبلغ باقی‌مانده را محاسبه می‌کند', () => {
      expect(calculateRemaining(675000, 200000)).toBe(475000);
    });

    it('از صفر کمتر نمی‌شود', () => {
      expect(calculateRemaining(100000, 200000)).toBe(0);
    });
  });

  describe('calculateBusinessShare', () => {
    it('سهم کسب‌وکار پس از کسر کمیسیون را برمی‌گرداند', () => {
      // کمیسیون 750000 = 4% = 30000
      expect(calculateBusinessShare(750000)).toBe(720000);
    });
  });

  describe('buildPriceSummary', () => {
    it('خلاصه کامل قیمت را می‌سازد', () => {
      const summary = buildPriceSummary(750000, 10, true, 30);
      expect(summary.originalPrice).toBe(750000);
      expect(summary.discountPercent).toBe(10);
      expect(summary.discountAmount).toBe(75000);
      expect(summary.finalPrice).toBe(675000);
      expect(summary.appFee).toBe(27000);
      expect(summary.depositAmount).toBe(202500);
      expect(summary.remaining).toBe(472500);
      expect(summary.businessShare).toBe(648000);
    });
  });
});
