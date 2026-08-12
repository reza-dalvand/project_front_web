// src/__tests__/utils/priceUtils.test.js
import {
  calculateAppFee,
  calculateFinalPrice,
  calculateDiscountAmount,
  calculateDeposit,
  calculateRemaining,
  calculateBusinessShare,
  buildPriceSummary,
  MAX_APP_FEE,
  MIN_DEPOSIT,
} from '@/utils/price-utils';

describe('price-utils', () => {
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

  describe('calculateDiscountAmount', () => {
    it('محاسبه مبلغ تخفیف', () => {
      expect(calculateDiscountAmount(750000, 10)).toBe(75000);
    });

    it('بدون تخفیف', () => {
      expect(calculateDiscountAmount(750000, 0)).toBe(0);
    });
  });

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

  describe('calculateRemaining', () => {
    it('محاسبه مابقی', () => {
      expect(calculateRemaining(675000, 200000)).toBe(475000);
    });
  });

  describe('calculateBusinessShare', () => {
    it('محاسبه سهم کسب‌وکار', () => {
      const share = calculateBusinessShare(750000);
      const fee = calculateAppFee(750000);
      expect(share).toBe(750000 - fee);
    });
  });

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
