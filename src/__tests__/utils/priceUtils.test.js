// src/__tests__/utils/priceUtils.test.js
/**
 * ✅ FIX P1: تست‌های calculateAppFee از numberUtils.test.js به اینجا منتقل شدند
 */
import {
  calculateAppFee,
  calculateFinalPrice,
  calculateDiscountAmount,
  calculateDeposit,
  calculateRemaining,
  calculateBusinessShare,
  buildPriceSummary,
  APP_FEE_TIERS,
  MAX_APP_FEE,
  MIN_DEPOSIT,
  getCurrentFeeTier,
} from '@/utils/price-utils';

describe('price-utils', () => {
  // ═══════ calculateAppFee — منتقل‌شده از numberUtils.test ═══════
  describe('calculateAppFee', () => {
    it('زیر ۲۵۰ هزار → ۷ هزار ثابت', () => {
      expect(calculateAppFee(100000)).toBe(7000);
      expect(calculateAppFee(200000)).toBe(7000);
      expect(calculateAppFee(249999)).toBe(7000);
    });

    it('۲۵۰ تا ۵۰۰ هزار → ۳٪', () => {
      expect(calculateAppFee(250000)).toBe(7500);
      expect(calculateAppFee(500000)).toBe(15000);
    });

    it('بالای ۵۰۰ هزار → ۴٪', () => {
      expect(calculateAppFee(600000)).toBe(24000);
      expect(calculateAppFee(1000000)).toBe(40000);
    });

    it('سقف ۵۰ هزار', () => {
      expect(calculateAppFee(2000000)).toBe(50000);
      expect(calculateAppFee(5000000)).toBe(50000);
    });

    it('ورودی صفر یا منفی', () => {
      expect(calculateAppFee(0)).toBe(0);
      expect(calculateAppFee(-100)).toBe(0);
      expect(calculateAppFee(null)).toBe(0);
    });

    it('مقدار دقیق در مرز ۲۵۰ هزار', () => {
      expect(calculateAppFee(249999)).toBe(7000);
      expect(calculateAppFee(250000)).toBe(7500);
    });
  });

  // ═══════ APP_FEE_TIERS — منتقل‌شده از numberUtils.test ═══════
  describe('APP_FEE_TIERS', () => {
    it('سه ردیف تعریف شده', () => {
      expect(APP_FEE_TIERS).toHaveLength(3);
    });

    it('ردیف اول: ثابت ۷ هزار', () => {
      expect(APP_FEE_TIERS[0].type).toBe('fixed');
      expect(APP_FEE_TIERS[0].fee).toBe(7000);
      expect(APP_FEE_TIERS[0].max).toBe(250000);
    });

    it('ردیف دوم: ۳٪', () => {
      expect(APP_FEE_TIERS[1].type).toBe('percent');
      expect(APP_FEE_TIERS[1].fee).toBe(3);
    });

    it('ردیف سوم: ۴٪', () => {
      expect(APP_FEE_TIERS[2].type).toBe('percent');
      expect(APP_FEE_TIERS[2].fee).toBe(4);
    });
  });

  // ═══════ getCurrentFeeTier — منتقل‌شده از numberUtils.test ═══════
  describe('getCurrentFeeTier', () => {
    it('شناسایی ردیف صحیح', () => {
      expect(getCurrentFeeTier(100000).type).toBe('fixed');
      expect(getCurrentFeeTier(300000).type).toBe('percent');
      expect(getCurrentFeeTier(600000).type).toBe('percent');
    });

    it('ورودی صفر', () => {
      expect(getCurrentFeeTier(0)).toEqual(APP_FEE_TIERS[0]);
    });
  });

  // ═══════ calculateFinalPrice ═══════
  describe('calculateFinalPrice', () => {
    it('محاسبه قیمت نهایی با تخفیف', () => {
      expect(calculateFinalPrice(750000, 10)).toBe(675000);
      expect(calculateFinalPrice(500000, 20)).toBe(400000);
    });

    it('بدون تخفیف', () => {
      expect(calculateFinalPrice(750000, 0)).toBe(750000);
    });

    it('تخفیف ۱۰۰٪', () => {
      expect(calculateFinalPrice(750000, 100)).toBe(0);
    });
  });

  // ═══════ calculateDiscountAmount ═══════
  describe('calculateDiscountAmount', () => {
    it('محاسبه مبلغ تخفیف', () => {
      expect(calculateDiscountAmount(750000, 10)).toBe(75000);
    });

    it('بدون تخفیف', () => {
      expect(calculateDiscountAmount(750000, 0)).toBe(0);
    });
  });

  // ═══════ calculateDeposit ═══════
  describe('calculateDeposit', () => {
    it('محاسبه بیعانه با درصد', () => {
      expect(calculateDeposit(675000, true, 30)).toBe(202500);
    });

    it('حداقل بیعانه', () => {
      const result = calculateDeposit(100000, true, 5);
      expect(result).toBeGreaterThanOrEqual(MIN_DEPOSIT);
    });

    it('بدون بیعانه', () => {
      expect(calculateDeposit(675000, false)).toBe(0);
    });
  });

  // ═══════ calculateRemaining ═══════
  describe('calculateRemaining', () => {
    it('محاسبه مابقی', () => {
      expect(calculateRemaining(675000, 200000)).toBe(475000);
    });
  });

  // ═══════ calculateBusinessShare ═══════
  describe('calculateBusinessShare', () => {
    it('محاسبه سهم کسب‌وکار', () => {
      const share = calculateBusinessShare(750000);
      const fee = calculateAppFee(750000);
      expect(share).toBe(750000 - fee);
    });
  });

  // ═══════ buildPriceSummary ═══════
  describe('buildPriceSummary', () => {
    it('ساخت خلاصه قیمت کامل', () => {
      const summary = buildPriceSummary(750000, 10, true, 30);
      expect(summary.originalPrice).toBe(750000);
      expect(summary.discountAmount).toBe(75000);
      expect(summary.finalPrice).toBe(675000);
      expect(summary.depositAmount).toBeGreaterThan(0);
      expect(summary.remaining).toBeGreaterThan(0);
      expect(summary.appFee).toBeGreaterThan(0);
    });
  });
});
