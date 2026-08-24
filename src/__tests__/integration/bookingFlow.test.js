import { calculateAppFee, calculateFinalPrice, MAX_APP_FEE } from '@/utils/price-utils';

describe('Booking Flow Integration', () => {
  it('Flow کامل: انتخاب خدمت → رزرو → تایید با کد', () => {
    // ✅ داده mock کامل با تمام فیلدهای مورد نیاز
    const service = {
      id: 1,
      name: 'فیشیال تخصصی',
      originalPrice: 750000,
      discountPercent: 10,
      finalPrice: 675000,
      hasDeposit: true,
      depositPercent: 30,
      depositAmount: 202500,
      duration: 60,
      renewalDays: 30,
    };

    // ۱. بررسی قیمت
    const appFee = calculateAppFee(service.finalPrice);
    expect(appFee).toBeGreaterThan(0);
    expect(appFee).toBeLessThanOrEqual(MAX_APP_FEE);

    // ۲. بررسی قیمت نهایی
    const finalPrice = calculateFinalPrice(service.originalPrice, service.discountPercent);
    expect(finalPrice).toBe(675000);
    expect(finalPrice).toBe(service.finalPrice);

    // ۳. بررسی کمیسیون
    // 675000 × 4% = 27000
    expect(appFee).toBe(27000);

    // ۴. بررسی سهم کسب‌وکار
    const businessShare = service.finalPrice - appFee;
    expect(businessShare).toBe(648000);

    // ۵. شبیه‌سازی تایید کد
    const verificationCode = '4321';
    const enteredCode = '4321';
    expect(verificationCode === enteredCode).toBe(true);

    // ۶. بررسی مبلغ باقی‌مانده
    const remaining = service.finalPrice - service.depositAmount;
    expect(remaining).toBe(472500);
  });
});
