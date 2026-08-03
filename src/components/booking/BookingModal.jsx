'use client';

import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  FiX,
  FiCalendar,
  FiClock,
  FiArrowRight,
  FiArrowLeft,
  FiLock,
  FiCheck,
  FiSparkles,
  FiShield, 
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import BookingStepIndicator from './BookingStepIndicator';
import BookingDateSelector from './BookingDateSelector';
import BookingTimeSelector from './BookingTimeSelector';
import PriceBreakdown from '@/components/common/PriceBreakdown';
import RulesCard from './RulesCard';
import { toPersianDigit, parseNumber } from '@/utils/numberUtils';
import { PERSIAN_MONTHS } from '@/utils/dateUtils';

const STEPS = [
  { id: 1, label: 'بررسی', icon: FiCheck },
  { id: 2, label: 'تاریخ', icon: FiCalendar },
  { id: 3, label: 'ساعت', icon: FiClock },
];

const MOCK_TIME_SLOTS = [
  { id: 't1', time: '۰۹:۰۰', isAvailable: true },
  { id: 't2', time: '۰۹:۳۰', isAvailable: true },
  { id: 't3', time: '۱۰:۰۰', isAvailable: false },
  { id: 't4', time: '۱۰:۳۰', isAvailable: true },
  { id: 't5', time: '۱۱:۰۰', isAvailable: true },
  { id: 't6', time: '۱۱:۳۰', isAvailable: false },
  { id: 't7', time: '۱۲:۰۰', isAvailable: true },
  { id: 't8', time: '۱۴:۰۰', isAvailable: true },
  { id: 't9', time: '۱۴:۳۰', isAvailable: true },
  { id: 't10', time: '۱۵:۰۰', isAvailable: false },
  { id: 't11', time: '۱۵:۳۰', isAvailable: true },
  { id: 't12', time: '۱۶:۰۰', isAvailable: true },
];

const MOCK_SERVICE = {
  id: 's1',
  name: 'فیشیال تخصصی پوست VIP',
  businessName: 'سالن زیبایی نیلارام',
  originalPrice: 850000,
  price: 850000,
  discount: 12,
  hasDeposit: true,
  depositPercent: 30,
  duration: 60,
};

export default function BookingModal({
  visible,
  onClose,
  service,
  businessName,
  businessLogo,
  onConfirm,
}) {
  const { colors } = useTheme();
  const currentService = service || MOCK_SERVICE;

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  // محاسبه depositAmount
  const originalPrice = parseNumber(
    currentService.originalPrice ?? currentService.price
  );
  const discountPercent = parseNumber(currentService.discount);
  const discountAmount = Math.round((originalPrice * discountPercent) / 100);
  const finalPrice = Math.max(0, originalPrice - discountAmount);
  const hasDeposit = currentService.hasDeposit || false;
  const depositPercent = parseNumber(currentService.depositPercent) || 30;
  const depositAmount = hasDeposit
    ? Math.round((finalPrice * depositPercent) / 100)
    : finalPrice;

  // Mount شدن در مرورگر
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // ریست هنگام باز شدن
  useEffect(() => {
    if (visible) {
      setCurrentStep(1);
      setSelectedDate(null);
      setSelectedTime(null);
      setShowSuccess(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  // بستن با Escape
  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleConfirm = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onConfirm?.({
        service: currentService,
        date: selectedDate,
        time: selectedTime,
      });
    }, 3000);
  };

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        return !!selectedDate;
      case 3:
        return !!selectedTime;
      default:
        return false;
    }
  }, [currentStep, selectedDate, selectedTime]);

  const availableCount = MOCK_TIME_SLOTS.filter((s) => s.isAvailable).length;

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setShowSuccess(false);
    onClose?.();
  };

  // رندر فوتر بر اساس مرحله
  const renderFooter = () => {
    if (currentStep === 1) {
      return (
        <Button
          title="ادامه"
          onPress={handleNext}
          disabled={!canProceed}
          icon={<FiArrowLeft size={18} color="#fff" />}
          fullWidth
        />
      );
    }

    if (currentStep === 2) {
      return (
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 py-3.5 px-4.5 rounded-[14px] border-[1.5px]"
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
              onPress={handleNext}
              disabled={!canProceed}
              icon={<FiArrowLeft size={18} color="#fff" />}
              fullWidth
            />
          </div>
        </div>
      );
    }

    // مرحله ۳ - پرداخت
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1 py-3.5 px-4.5 rounded-[14px] border-[1.5px]"
          style={{ borderColor: colors.border }}
        >
          <FiArrowRight size={18} style={{ color: colors.textMain }} />
          <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            بازگشت
          </span>
        </button>
        <div className="flex-1">
          <Button
            title={`پرداخت ${toPersianDigit(depositAmount.toLocaleString('en-US'))} تومان`}
            onPress={handleConfirm}
            disabled={!canProceed}
            icon={<FiLock size={18} color="#fff" />}
            fullWidth
            style={{
              backgroundColor: canProceed ? '#43A047' : colors.border,
            }}
          />
        </div>
      </div>
    );
  };

  if (!mounted || !visible) return null;

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="relative w-full max-w-lg max-h-[92vh] rounded-t-[24px] md:rounded-[24px] flex flex-col overflow-hidden"
        style={{
          backgroundColor: colors.cardBackground,
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        {/* هدر */}
        <div
          className="flex items-center gap-3 py-3 px-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <div
            className="w-11 h-11 rounded-[14px] flex items-center justify-center"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <FiCalendar size={22} style={{ color: colors.primary }} />
          </div>
          <div className="flex flex-col gap-0.5 flex-1">
            <span
              className="text-base font-[Vazir-Bold]"
              style={{ color: colors.textMain }}
            >
              رزرو نوبت
            </span>
            <span
              className="text-xs font-[Vazir] truncate"
              style={{ color: colors.textSecondary }}
            >
              {currentService?.name || 'خدمت'}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={20} style={{ color: colors.textMain }} />
          </button>
        </div>

        {/* Step Indicator */}
        {!showSuccess && <BookingStepIndicator steps={STEPS} currentStep={currentStep} />}

        {/* محتوای اسکرولی */}
        <div className="flex-1 overflow-y-auto px-4 pt-2 pb-10">
          {/* ═══ مرحله ۱: اطلاعات خدمت + قوانین ═══ */}
          {currentStep === 1 && !showSuccess && (
            <div className="flex flex-col gap-3.5">
              {/* بخش ۱: جزئیات پرداخت */}
              <div className="flex items-center gap-2.5 mb-1">
                <div
                  className="w-9 h-9 rounded-[11px] flex items-center justify-center"
                  style={{ backgroundColor: '#43A04715' }}
                >
                  <FiCheck size={18} color="#43A047" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                    جزئیات پرداخت
                  </span>
                  <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                    بیعانه آنلاین + مابقی در سالن
                  </span>
                </div>
              </div>

              <PriceBreakdown
                originalPrice={originalPrice}
                discountPercent={discountPercent}
                finalPrice={finalPrice}
                hasDeposit={hasDeposit}
                depositPercent={depositPercent}
                depositAmount={depositAmount}
                showRemaining={true}
                variant="detailed"
              />

              {/* بخش ۲: قوانین رزرو */}
              <div className="flex items-center gap-2.5 mt-3 mb-1">
                <div
                  className="w-9 h-9 rounded-[11px] flex items-center justify-center"
                  style={{ backgroundColor: '#9C27B015' }}
                >
                  <FiShield size={18} color="#9C27B0" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                    قوانین رزرو نوبت
                  </span>
                  <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                    لطفاً قبل از پرداخت مطالعه فرمایید
                  </span>
                </div>
              </div>

              <RulesCard colors={colors} />
            </div>
          )}

          {/* ═══ مرحله ۲: انتخاب تاریخ ═══ */}
          {currentStep === 2 && !showSuccess && (
            <div className="flex flex-col gap-3.5">
              <BookingDateSelector
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>
          )}

          {/* ═══ مرحله ۳: انتخاب ساعت ═══ */}
          {currentStep === 3 && !showSuccess && (
            <div className="flex flex-col gap-3.5">
              {/* Chip تاریخ انتخاب شده */}
              {selectedDate && (
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 self-start py-2 px-3.5 rounded-[14px] border"
                  style={{
                    backgroundColor: colors.primary + '10',
                    borderColor: colors.primary + '40',
                  }}
                >
                  <FiCalendar size={16} style={{ color: colors.primary }} />
                  <span className="text-[13px] font-[Vazir-Bold]" style={{ color: colors.primary }}>
                    {toPersianDigit(selectedDate.jd)}{' '}
                    {PERSIAN_MONTHS[selectedDate.jm - 1]}{' '}
                    {toPersianDigit(selectedDate.jy)}
                  </span>
                </button>
              )}

              {/* یادآوری پرداخت */}
              <div
                className="flex items-center gap-2 p-2.5 rounded-[12px] border"
                style={{
                  backgroundColor: '#43A04710',
                  borderColor: '#43A04735',
                }}
              >
                <FiCheck size={16} color="#43A047" />
                <span
                  className="text-[11px] font-[Vazir] leading-[18px] flex-1"
                  style={{ color: colors.textSecondary }}
                >
                  با انتخاب ساعت و تپ روی دکمه پرداخت، بیعانه پرداخت و نوبت شما ثبت می‌شود
                </span>
              </div>

              <BookingTimeSelector
                slots={MOCK_TIME_SLOTS}
                selectedId={selectedTime?.id}
                onSelect={(slot) => setSelectedTime(slot)}
              />
            </div>
          )}

          {/* ═══ مرحله موفقیت ═══ */}
          {showSuccess && (
            <div className="flex flex-col items-center justify-center py-12 px-6 gap-4">
              <div
                className="relative w-[100px] h-[100px] rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: '#43A047' }}
              >
                <FiCheck size={48} color="#fff" />
              </div>

              <span className="text-xl font-[Vazir-Bold] text-center" style={{ color: colors.textMain }}>
                رزرو با موفقیت ثبت شد!
              </span>
              <span
                className="text-[13px] font-[Vazir] text-center leading-[21px]"
                style={{ color: colors.textSecondary }}
              >
                کد تایید ۴ رقمی به شماره شما ارسال خواهد شد
              </span>

              {/* خلاصه رزرو */}
              <div
                className="w-full p-4 rounded-2xl border flex flex-col gap-2.5 mt-2"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                }}
              >
                <div className="flex items-center gap-2">
                  <FiSparkles size={16} style={{ color: colors.textSecondary }} />
                  <span className="text-xs font-[Vazir] min-w-[90px]" style={{ color: colors.textSecondary }}>
                    خدمت:
                  </span>
                  <span className="text-[13px] font-[Vazir-Bold] flex-1" style={{ color: colors.textMain }}>
                    {currentService?.name || ''}
                  </span>
                </div>
                {selectedDate && (
                  <div className="flex items-center gap-2">
                    <FiCalendar size={16} style={{ color: colors.textSecondary }} />
                    <span className="text-xs font-[Vazir] min-w-[90px]" style={{ color: colors.textSecondary }}>
                      تاریخ:
                    </span>
                    <span className="text-[13px] font-[Vazir-Bold] flex-1" style={{ color: colors.textMain }}>
                      {toPersianDigit(selectedDate.jd)} {PERSIAN_MONTHS[selectedDate.jm - 1]}
                    </span>
                  </div>
                )}
                {selectedTime && (
                  <div className="flex items-center gap-2">
                    <FiClock size={16} style={{ color: colors.textSecondary }} />
                    <span className="text-xs font-[Vazir] min-w-[90px]" style={{ color: colors.textSecondary }}>
                      ساعت:
                    </span>
                    <span className="text-[13px] font-[Vazir-Bold] flex-1" style={{ color: colors.textMain }}>
                      {selectedTime.time}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FiCheck size={16} color="#43A047" />
                  <span className="text-xs font-[Vazir] min-w-[90px]" style={{ color: colors.textSecondary }}>
                    مبلغ پرداختی:
                  </span>
                  <span className="text-[13px] font-[Vazir-Bold] flex-1" style={{ color: '#43A047' }}>
                    {toPersianDigit(depositAmount.toLocaleString('en-US'))} تومان
                  </span>
                </div>
              </div>

              <div className="w-full mt-3">
                <Button
                  title="بازگشت به صفحه کسب‌وکار"
                  onPress={handleClose}
                  variant="outline"
                  fullWidth
                />
              </div>
            </div>
          )}

          <div className="h-16" />
        </div>

        {/* فوتر دکمه‌ها */}
        {!showSuccess && (
          <div
            className="pt-2.5 pb-1.5 border-t px-4"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            }}
          >
            {renderFooter()}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}