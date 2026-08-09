// src/components/booking/BookingModal.jsx
'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  FiX,
  FiCalendar,
  FiClock,
  FiArrowRight,
  FiArrowLeft,
  FiLock,
  FiCheck,
  FiInfo,
  FiShield,
  FiDollarSign,
  FiTag,
  FiCreditCard,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import Button from '@/components/common/Button';
import BookingStepIndicator from './BookingStepIndicator';
import BookingDateSelector from './BookingDateSelector';
import BookingTimeSelector from './BookingTimeSelector';
import RulesCard from './RulesCard';
import TrustToggle from './TrustToggle';
import { toPersianDigit, parseNumber, formatPrice } from '@/utils/numberUtils';
import { PERSIAN_MONTHS } from '@/utils/dateUtils';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

// ═══════════ STEPS (۳ مرحله) ═══════════
const STEPS = [
  { id: 1, label: 'بررسی', icon: FiInfo },
  { id: 2, label: 'تاریخ', icon: FiCalendar },
  { id: 3, label: 'ساعت', icon: FiClock },
];

// ═══════════ MOCK TIME SLOTS ═══════════
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

// ═══════════ MOCK SERVICE ═══════════
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
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const currentService = service || MOCK_SERVICE;

  // ─── State ───
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [trustEnabled, setTrustEnabled] = useState(false);
  const instanceId = useRef('booking-modal');

  // ✅ تشخیص اینکه مشتری قبلاً حداقل یک نوبت ثبت کرده
  const hasPreviousBookings = isAuthenticated;

  // ─── محاسبات قیمت ───
  const originalPrice = parseNumber(currentService.originalPrice ?? currentService.price);
  const discountPercent = parseNumber(currentService.discount);
  const discountAmount = Math.round((originalPrice * discountPercent) / 100);
  const finalPrice = Math.max(0, originalPrice - discountAmount);
  const hasDeposit = currentService.hasDeposit || false;
  const depositPercent = parseNumber(currentService.depositPercent) || 30;
  const depositAmount = hasDeposit ? Math.round((finalPrice * depositPercent) / 100) : finalPrice;
  const remainingAmount = finalPrice - depositAmount;

  // ─── Effects ───
  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      releaseScrollLock(instanceId.current);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      setCurrentStep(1);
      setSelectedDate(null);
      setSelectedTime(null);
      setShowSuccess(false);
      setTrustEnabled(false);
      acquireScrollLock(instanceId.current);
    } else {
      releaseScrollLock(instanceId.current);
    }
    return () => releaseScrollLock(instanceId.current);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  // ─── Handlers ───
  const handleNext = () => {
    if (currentStep < 3) setCurrentStep((p) => p + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((p) => p - 1);
  };

  const handleConfirm = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onConfirm?.({
        service: currentService,
        date: selectedDate,
        time: selectedTime,
        trustBased: trustEnabled,
        verificationCode: trustEnabled ? null : undefined,
      });
    }, 3000);
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setShowSuccess(false);
    setTrustEnabled(false);
    onClose?.();
  };

  // ─── canProceed ───
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

  // ─── Footer داینامیک ───
  const renderFooter = () => {
    // مرحله ۱: فقط ادامه
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

    // مرحله ۲: بازگشت + ادامه
    if (currentStep === 2) {
      return (
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
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
              onPress={handleNext}
              disabled={!canProceed}
              icon={<FiArrowLeft size={18} color="#fff" />}
              fullWidth
              iconPosition="right"
            />
          </div>
        </div>
      );
    }

    // مرحله ۳: بازگشت + مبلغ بیعانه + دکمه پرداخت
    return (
      <div className="flex flex-col gap-2.5">
        {/* ✅ مبلغ بیعانه بالای دکمه پرداخت */}
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
            onClick={handlePrev}
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
              onPress={handleConfirm}
              disabled={!canProceed}
              icon={<FiLock size={18} color="#fff" />}
              fullWidth
              style={{ backgroundColor: canProceed ? '#43A047' : colors.border }}
            />
          </div>
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
        style={{ backgroundColor: colors.cardBackground, borderTop: `1px solid ${colors.border}` }}
      >
        {/* ═══ هدر ═══ */}
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
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              رزرو نوبت
            </span>
            <span className="text-xs font-[Vazir] truncate" style={{ color: colors.textSecondary }}>
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

        {/* ═══ Step Indicator ═══ */}
        {!showSuccess && <BookingStepIndicator steps={STEPS} currentStep={currentStep} />}

        {/* ═══ محتوای اسکرولی ═══ */}
        <div className="flex-1 overflow-y-auto px-4 pt-2 pb-10">
          {/* ═══════ مرحله ۱: بررسی + خلاصه مالی + قوانین ═══════ */}
          {currentStep === 1 && !showSuccess && (
            <div className="flex flex-col gap-3.5">
              {/* ═══ بخش خلاصه مالی ═══ */}
              <div className="flex items-center gap-2.5 mb-1">
                <div
                  className="w-9 h-9 rounded-[11px] flex items-center justify-center"
                  style={{ backgroundColor: '#43A04715' }}
                >
                  <FiCreditCard size={20} color="#43A047" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span
                    className="text-[15px] font-[Vazir-Bold]"
                    style={{ color: colors.textMain }}
                  >
                    خلاصه پرداخت
                  </span>
                  <span
                    className="text-[11px] font-[Vazir]"
                    style={{ color: colors.textSecondary }}
                  >
                    فقط بیعانه را الان پرداخت کنید
                  </span>
                </div>
              </div>

              {/* کارت قیمت */}
              <div
                className="rounded-2xl border overflow-hidden"
                style={{ borderColor: colors.border, backgroundColor: colors.cardBackground }}
              >
                {/* ردیف ۱: مبلغ کل */}
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FiDollarSign size={16} style={{ color: colors.textSecondary }} />
                    <span
                      className="text-[13px] font-[Vazir]"
                      style={{ color: colors.textSecondary }}
                    >
                      مبلغ کل خدمت
                    </span>
                  </div>
                  <span
                    className="text-[14px] font-[Vazir-Bold]"
                    style={{ color: colors.textMain }}
                  >
                    {formatPrice(originalPrice)}
                  </span>
                </div>

                {/* خط جدا */}
                <div className="h-px mx-4" style={{ backgroundColor: colors.border }} />

                {/* ردیف ۲: تخفیف */}
                {discountPercent > 0 && (
                  <>
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FiTag size={16} color="#4CAF50" />
                        <span
                          className="text-[13px] font-[Vazir]"
                          style={{ color: colors.textSecondary }}
                        >
                          تخفیف ({toPersianDigit(discountPercent)}٪)
                        </span>
                      </div>
                      <span className="text-[14px] font-[Vazir-Bold]" style={{ color: '#4CAF50' }}>
                        - {formatPrice(discountAmount)}
                      </span>
                    </div>
                    <div className="h-px mx-4" style={{ backgroundColor: colors.border }} />
                  </>
                )}

                {/* ردیف ۳: قیمت نهایی */}
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FiInfo size={16} style={{ color: colors.textMain }} />
                    <span
                      className="text-[13px] font-[Vazir-Bold]"
                      style={{ color: colors.textMain }}
                    >
                      قیمت نهایی خدمت
                    </span>
                  </div>
                  <span
                    className="text-[15px] font-[Vazir-Bold]"
                    style={{ color: colors.textMain }}
                  >
                    {formatPrice(finalPrice)}
                  </span>
                </div>

                {/* خط جدا */}
                <div className="h-px mx-4" style={{ backgroundColor: colors.border }} />

                {/* ═══ بخش بیعانه (هایلایت شده) ═══ */}
                <div
                  className="flex items-center justify-between px-4 py-4"
                  style={{ backgroundColor: colors.primary + '08' }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <FiCreditCard size={14} color="#fff" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span
                        className="text-[13px] font-[Vazir-Bold]"
                        style={{ color: colors.primary }}
                      >
                        مبلغ بیعانه (پرداخت آنلاین)
                      </span>
                      <span
                        className="text-[10px] font-[Vazir]"
                        style={{ color: colors.textSecondary }}
                      >
                        {toPersianDigit(depositPercent)}٪ از قیمت نهایی
                      </span>
                    </div>
                  </div>
                  <span className="text-[16px] font-[Vazir-Bold]" style={{ color: colors.primary }}>
                    {formatPrice(depositAmount)}
                  </span>
                </div>

                {/* ردیف ۴: مابقی مبلغ */}
                {remainingAmount > 0 && (
                  <>
                    <div className="h-px mx-4" style={{ backgroundColor: colors.border }} />
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px]">🏪</span>
                        <span
                          className="text-[12px] font-[Vazir]"
                          style={{ color: colors.textSecondary }}
                        >
                          مابقی (پرداخت در سالن)
                        </span>
                      </div>
                      <span className="text-[13px] font-[Vazir-Bold]" style={{ color: '#2196F3' }}>
                        {formatPrice(remainingAmount)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* پیام مهم: فقط بیعانه پرداخت می‌شود */}
              <div
                className="flex items-start gap-2.5 p-3.5 rounded-xl border"
                style={{
                  backgroundColor: '#43A04708',
                  borderColor: '#43A04730',
                }}
              >
                <FiInfo size={16} color="#43A047" className="flex-shrink-0 mt-0.5" />
                <p
                  className="text-[12px] font-[Vazir] leading-[20px] flex-1"
                  style={{ color: colors.textSecondary }}
                >
                  شما الان فقط{' '}
                  <span className="font-[Vazir-Bold]" style={{ color: '#43A047' }}>
                    بیعانه ({formatPrice(depositAmount)})
                  </span>{' '}
                  را پرداخت می‌کنید. مابقی مبلغ پس از انجام خدمت در سالن دریافت می‌شود.
                </p>
              </div>

              {/* ═══ بخش قوانین ═══ */}
              <RulesCard colors={colors} />
            </div>
          )}

          {/* ═══════ مرحله ۲: انتخاب تاریخ ═══════ */}
          {currentStep === 2 && !showSuccess && (
            <div className="flex flex-col gap-3.5">
              <BookingDateSelector selectedDate={selectedDate} onDateSelect={setSelectedDate} />
            </div>
          )}

          {/* ═══════ مرحله ۳: انتخاب ساعت + سوئیچ اعتماد ═══════ */}
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
                    {toPersianDigit(selectedDate.jd)} {PERSIAN_MONTHS[selectedDate.jm - 1]}{' '}
                    {toPersianDigit(selectedDate.jy)}
                  </span>
                </button>
              )}

              {/* یادآوری پرداخت بیعانه */}
              <div
                className="flex items-center gap-2 p-2.5 rounded-[12px] border"
                style={{ backgroundColor: '#43A04710', borderColor: '#43A04735' }}
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

              {/* ✅ سوئیچ اعتماد - فقط برای مشتریان با سابقه رزرو */}
              {hasPreviousBookings && (
                <TrustToggle enabled={trustEnabled} onToggle={setTrustEnabled} />
              )}
            </div>
          )}

          {/* ═══════ مرحله موفقیت ═══════ */}
          {showSuccess && (
            <div className="flex flex-col items-center justify-center py-12 px-6 gap-4">
              <div
                className="relative w-[100px] h-[100px] rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: '#43A047' }}
              >
                <FiCheck size={48} color="#fff" />
              </div>
              <span
                className="text-xl font-[Vazir-Bold] text-center"
                style={{ color: colors.textMain }}
              >
                رزرو با موفقیت ثبت شد!
              </span>
              <span
                className="text-[13px] font-[Vazir] text-center leading-[21px]"
                style={{ color: colors.textSecondary }}
              >
                {/* ✅ پیام بر اساس وضعیت اعتماد */}
                {trustEnabled
                  ? 'نوبت شما بدون نیاز به کد تایید ثبت شد. پیامک تایید نوبت ارسال می‌شود.'
                  : 'کد تایید ۴ رقمی به شماره شما ارسال خواهد شد'}
              </span>

              {/* خلاصه رزرو */}
              <div
                className="w-full p-4 rounded-2xl border flex flex-col gap-2.5 mt-2"
                style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
              >
                <div className="flex items-center gap-2">
                  <FiInfo size={16} style={{ color: colors.textSecondary }} />
                  <span
                    className="text-xs font-[Vazir] min-w-[90px]"
                    style={{ color: colors.textSecondary }}
                  >
                    خدمت:
                  </span>
                  <span
                    className="text-[13px] font-[Vazir-Bold] flex-1"
                    style={{ color: colors.textMain }}
                  >
                    {currentService?.name || ''}
                  </span>
                </div>
                {selectedDate && (
                  <div className="flex items-center gap-2">
                    <FiCalendar size={16} style={{ color: colors.textSecondary }} />
                    <span
                      className="text-xs font-[Vazir] min-w-[90px]"
                      style={{ color: colors.textSecondary }}
                    >
                      تاریخ:
                    </span>
                    <span
                      className="text-[13px] font-[Vazir-Bold] flex-1"
                      style={{ color: colors.textMain }}
                    >
                      {toPersianDigit(selectedDate.jd)} {PERSIAN_MONTHS[selectedDate.jm - 1]}
                    </span>
                  </div>
                )}
                {selectedTime && (
                  <div className="flex items-center gap-2">
                    <FiClock size={16} style={{ color: colors.textSecondary }} />
                    <span
                      className="text-xs font-[Vazir] min-w-[90px]"
                      style={{ color: colors.textSecondary }}
                    >
                      ساعت:
                    </span>
                    <span
                      className="text-[13px] font-[Vazir-Bold] flex-1"
                      style={{ color: colors.textMain }}
                    >
                      {selectedTime.time}
                    </span>
                  </div>
                )}
                {/* ✅ مبلغ پرداختی = بیعانه */}
                <div className="flex items-center gap-2">
                  <FiCreditCard size={16} color="#43A047" />
                  <span
                    className="text-xs font-[Vazir] min-w-[90px]"
                    style={{ color: colors.textSecondary }}
                  >
                    بیعانه پرداختی:
                  </span>
                  <span
                    className="text-[13px] font-[Vazir-Bold] flex-1"
                    style={{ color: '#43A047' }}
                  >
                    {formatPrice(depositAmount)}
                  </span>
                </div>

                {/* ✅ نمایش وضعیت اعتماد در خلاصه */}
                {trustEnabled && (
                  <div className="flex items-center gap-2">
                    <FiShield size={16} style={{ color: colors.primary }} />
                    <span
                      className="text-xs font-[Vazir] min-w-[90px]"
                      style={{ color: colors.textSecondary }}
                    >
                      وضعیت کد:
                    </span>
                    <span
                      className="text-[13px] font-[Vazir-Bold] flex-1"
                      style={{ color: colors.primary }}
                    >
                      بدون نیاز به کد تایید
                    </span>
                  </div>
                )}
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

        {/* ═══ فوتر دکمه‌ها ═══ */}
        {!showSuccess && (
          <div
            className="pt-2.5 pb-1.5 border-t px-4"
            style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
          >
            {renderFooter()}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
