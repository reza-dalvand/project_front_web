'use client';
import PriceBreakdown from '@/components/common/PriceBreakdown';

/**
 * کارت خلاصه پرداخت برای صفحه رزرو
 *
 * @param {object} service - داده خدمت
 * @param {object} colors - رنگ‌های تم
 */
export default function PaymentSummaryCard({ service, colors }) {
  const originalPrice = service.originalPrice ?? service.price ?? 0;
  const discountPercent = service.discount ?? 0;
  const hasDeposit = service.hasDeposit || false;
  const depositPercent = service.depositPercent || 30;

  return (
    <PriceBreakdown
      originalPrice={originalPrice}
      discountPercent={discountPercent}
      hasDeposit={hasDeposit}
      depositPercent={depositPercent}
      showRemaining={true}
      variant="detailed"
    />
  );
}
