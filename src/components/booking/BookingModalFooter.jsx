// src/components/booking/BookingModalFooter.jsx
'use client';
import { FiArrowRight, FiLock } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import { formatPrice } from '@/utils/numberUtils';

export default function BookingModalFooter({
  currentStep,
  needsNameStep,
  canProceed,
  depositAmount,
  isSubmitting,
  onNext,
  onPrev,
  onConfirm,
}) {
  const { colors } = useTheme();

  const nameStepId = needsNameStep ? 1 : 0;
  const reviewStepId = needsNameStep ? 2 : 1;
  const dateStepId = needsNameStep ? 3 : 2;
  const timeStepId = needsNameStep ? 4 : 3;

  // مرحله نام
  if (needsNameStep && currentStep === nameStepId) {
    return (
      <Button
        title="ادامه"
        onPress={onNext}
        disabled={!canProceed}
        variant="primary"
        size="lg"
        fullWidth
      />
    );
  }

  // مرحله بررسی
  if (currentStep === reviewStepId) {
    return (
      <Button
        title="ادامه"
        onPress={onNext}
        disabled={!canProceed}
        variant="primary"
        size="lg"
        fullWidth
      />
    );
  }

  // مرحله تاریخ
  if (currentStep === dateStepId) {
    return (
      <div className="flex items-center gap-3">
        <Button title="قبلی" onPress={onPrev} variant="outline" size="lg" className="flex-1" />
        <Button
          title="ادامه"
          onPress={onNext}
          disabled={!canProceed}
          variant="primary"
          size="lg"
          className="flex-1"
        />
      </div>
    );
  }

  // مرحله ساعت — پرداخت
  return (
    <div className="flex flex-col gap-2.5">
      {/* مبلغ بیعانه */}
      {depositAmount > 0 && (
        <div
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border"
          style={{
            backgroundColor: colors.primary + '08',
            borderColor: colors.primary + '25',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">💰</span>
            <span className="text-[12px] font-[Vazir]" style={{ color: colors.textSecondary }}>
              مبلغ بیعانه قابل پرداخت
            </span>
          </div>
          <span className="text-[15px] font-[Vazir-Bold]" style={{ color: colors.primary }}>
            {formatPrice(depositAmount)}
          </span>
        </div>
      )}

      {/* دکمه‌ها */}
      <div className="flex items-center gap-3">
        <Button title="قبلی" onPress={onPrev} variant="outline" size="lg" className="flex-1" />
        <Button
          title={isSubmitting ? 'در حال رزرو...' : 'پرداخت و رزرو'}
          onPress={onConfirm}
          loading={isSubmitting}
          disabled={!canProceed || isSubmitting}
          variant="primary"
          size="lg"
          className="flex-[2]"
          icon={<FiLock size={16} color="#fff" />}
          iconPosition="right"
          style={{ backgroundColor: '#43A047' }}
        />
      </div>
    </div>
  );
}
