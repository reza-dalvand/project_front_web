// src/components/booking/BookingModalFooter.jsx
'use client';
import { FiArrowRight, FiArrowLeft, FiLock, FiCreditCard } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import { formatPrice } from '@/utils/numberUtils';

/**
 * فوتر دکمه‌های مدال رزرو
 *
 * @param {number}  currentStep
 * @param {boolean} needsNameStep
 * @param {boolean} canProceed
 * @param {number}  depositAmount
 * @param {function} onNext
 * @param {function} onPrev
 * @param {function} onConfirm
 */
export default function BookingModalFooter({
  currentStep,
  needsNameStep,
  canProceed,
  depositAmount,
  onNext,
  onPrev,
  onConfirm,
}) {
  const { colors } = useTheme();

  // شناسه استپ‌ها
  const nameStepId = needsNameStep ? 1 : 0;
  const reviewStepId = needsNameStep ? 2 : 1;
  const dateStepId = needsNameStep ? 3 : 2;
  const timeStepId = needsNameStep ? 4 : 3;

  // ═══ مرحله نام ═══
  if (needsNameStep && currentStep === nameStepId) {
    return (
      <Button
        title="ادامه"
        onPress={onNext}
        disabled={!canProceed}
        // icon={<FiArrowLeft size={18} color="#fff" />}
        fullWidth
      />
    );
  }

  // ═══ مرحله بررسی: فقط ادامه ═══
  if (currentStep === reviewStepId) {
    return (
      <Button
        title="ادامه"
        onPress={onNext}
        disabled={!canProceed}
        // icon={<FiArrowLeft size={18} color="#fff" />}
        fullWidth
      />
    );
  }

  // ═══ مرحله تاریخ: بازگشت + ادامه ═══
  if (currentStep === dateStepId) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={onPrev}
          className="flex items-center gap-1 py-3.5 px-[18px] rounded-[14px] border-[1.5px]"
          style={{ borderColor: colors.border }}
        >
          <FiArrowRight size={18} style={{ color: colors.textMain }} />
          <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            بازگشت
          </span>
        </button>
        <div className="flex-1">
          <Button
            title="ادامه"
            onPress={onNext}
            disabled={!canProceed}
            // icon={<FiArrowLeft size={18} color="#fff" />}
            fullWidth
            iconPosition="right"
          />
        </div>
      </div>
    );
  }

  // ═══ مرحله ساعت: بازگشت + مبلغ بیعانه + دکمه پرداخت ═══
  return (
    <div className="flex flex-col gap-2.5">
      {/* مبلغ بیعانه بالای دکمه پرداخت */}
      <div
        className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border"
        style={{
          backgroundColor: colors.primary + '08',
          borderColor: colors.primary + '25',
        }}
      >
        <div className="flex items-center gap-2">
          <FiCreditCard size={15} style={{ color: colors.primary }} />
          <span className="text-[12px] font-[Vazir]" style={{ color: colors.textSecondary }}>
            مبلغ بیعانه قابل پرداخت
          </span>
        </div>
        <span className="text-[15px] font-[Vazir-Bold]" style={{ color: colors.primary }}>
          {formatPrice(depositAmount)}
        </span>
      </div>

      {/* دکمه‌ها */}
      <div className="flex items-center gap-3">
        <button
          onClick={onPrev}
          className="flex items-center gap-1 py-3.5 px-[18px] rounded-[14px] border-[1.5px]"
          style={{ borderColor: colors.border }}
        >
          <FiArrowRight size={18} style={{ color: colors.textMain }} />
          <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            بازگشت
          </span>
        </button>
        <div className="flex-1">
          <Button
            title="پرداخت"
            onPress={onConfirm}
            disabled={!canProceed}
            icon={<FiLock size={18} color="#fff" />}
            fullWidth
            style={{ backgroundColor: canProceed ? '#43A047' : colors.border }}
          />
        </div>
      </div>
    </div>
  );
}
