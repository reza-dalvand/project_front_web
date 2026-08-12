// src/components/booking/BookingModal.jsx
'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiUser, FiInfo, FiCalendar, FiClock, FiX } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@/hooks/useToast';
import BookingStepIndicator from './BookingStepIndicator';
import BookingDateSelector from './BookingDateSelector';
import BookingTimeSelector from './BookingTimeSelector';
import BookingNameStep from './BookingNameStep';
import BookingReviewStep from './BookingReviewStep';
import BookingSuccessStep from './BookingSuccessStep';
import BookingModalFooter from './BookingModalFooter';
import TrustToggle from './TrustToggle';
import { PERSIAN_MONTHS } from '@/utils/dateUtils';
import { toPersianDigit } from '@/utils/numberUtils';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';
// ═══════ فاز ۲: لایه API ═══════
import { appointmentsService } from '@/api';
import { USE_MOCK } from '@/api/config';
// ═══════ فاز ۴: Utils جدید ═══════
import { buildPriceSummary } from '@/utils/price-utils';
import { toJalaaliKey } from '@/utils/date-converter';

// ═══════════ MOCK TIME SLOTS ═══════════
const MOCK_TIME_SLOTS = [
  { id: 't1', time: '09:00', isAvailable: true },
  { id: 't2', time: '09:30', isAvailable: true },
  { id: 't3', time: '10:00', isAvailable: false },
  { id: 't4', time: '10:30', isAvailable: true },
  { id: 't5', time: '11:00', isAvailable: true },
  { id: 't6', time: '11:30', isAvailable: false },
  { id: 't7', time: '12:00', isAvailable: true },
  { id: 't8', time: '14:00', isAvailable: true },
  { id: 't9', time: '14:30', isAvailable: true },
  { id: 't10', time: '15:00', isAvailable: false },
  { id: 't11', time: '15:30', isAvailable: true },
  { id: 't12', time: '16:00', isAvailable: true },
];

// ═══════════ MOCK SERVICE ═══════════
const MOCK_SERVICE = {
  id: 's1',
  name: 'فیشیال تخصصی پوست VIP',
  businessName: 'سالن زیبایی نیلارام',
  originalPrice: 850000,
  discount: 12,
  hasDeposit: true,
  depositAmount: 200000, // ✅ بیعانه مستقیم از سرویس
  depositPercent: 30,
  duration: 60,
};

// ═══════════ نام پیش‌فرض ═══════════
const DEFAULT_NAME = 'کاربر زیبانو';

export default function BookingModal({
  visible,
  onClose,
  service,
  businessName,
  businessLogo,
  onConfirm,
}) {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const currentService = service || MOCK_SERVICE;

  // ═══════ تشخیص نیاز به استپ نام ═══════
  const needsNameStep = useMemo(() => {
    const name = user?.name?.trim();
    return !name || name === DEFAULT_NAME || name.length < 3;
  }, [user?.name]);

  // ═══════ ساخت داینامیک استپ‌ها ═══════
  const STEPS = useMemo(() => {
    if (needsNameStep) {
      return [
        { id: 1, label: 'مشخصات', icon: FiUser },
        { id: 2, label: 'بررسی', icon: FiInfo },
        { id: 3, label: 'تاریخ', icon: FiCalendar },
        { id: 4, label: 'ساعت', icon: FiClock },
      ];
    }
    return [
      { id: 1, label: 'بررسی', icon: FiInfo },
      { id: 2, label: 'تاریخ', icon: FiCalendar },
      { id: 3, label: 'ساعت', icon: FiClock },
    ];
  }, [needsNameStep]);

  // شناسه هر استپ
  const nameStepId = needsNameStep ? 1 : 0;
  const reviewStepId = needsNameStep ? 2 : 1;
  const dateStepId = needsNameStep ? 3 : 2;
  const timeStepId = needsNameStep ? 4 : 3;

  // ─── State ───
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [trustEnabled, setTrustEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null); // ✅ نتیجه رزرو برای SuccessStep
  const instanceId = useRef('booking-modal');

  // ─── State‌های استپ نام ───
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nameErrors, setNameErrors] = useState({ firstName: '', lastName: '', confirm: '' });
  const [nameConfirmed, setNameConfirmed] = useState(false);

  // ✅ تشخیص اینکه مشتری قبلاً حداقل یک نوبت ثبت کرده
  const hasPreviousBookings = isAuthenticated;

  // ═══════ محاسبات قیمت با price-utils (فاز ۴) ═══════
  const priceSummary = useMemo(() => {
    const originalPrice = currentService.originalPrice ?? currentService.price ?? 0;
    const discountPercent = currentService.discount ?? currentService.discountPercent ?? 0;
    // ✅ بیعانه مستقیم از depositAmount سرویس (هماهنگ با بک‌اند: Service.deposit_amount)
    const depositAmount = currentService.hasDeposit ? (currentService.depositAmount ?? 0) : 0;
    return buildPriceSummary(
      originalPrice,
      discountPercent,
      currentService.hasDeposit,
      currentService.depositPercent ?? 30
    );
  }, [currentService]);

  // مقادیر نهایی برای استفاده در کامپوننت‌ها
  const originalPrice = priceSummary.originalPrice;
  const discountPercent = priceSummary.discountPercent;
  const discountAmount = priceSummary.discountAmount;
  const finalPrice = priceSummary.finalPrice;
  const hasDeposit = currentService.hasDeposit || false;
  const depositPercent = currentService.depositPercent ?? 30;
  // ✅ بیعانه: اگر depositAmount در سرویس بود، همون؛ وگرنه محاسبه‌شده
  const depositAmount = currentService.depositAmount ?? priceSummary.depositAmount;
  const remainingAmount = Math.max(0, finalPrice - depositAmount);

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
      setIsSubmitting(false);
      setBookingResult(null);
      setFirstName('');
      setLastName('');
      setNameErrors({ firstName: '', lastName: '', confirm: '' });
      setNameConfirmed(false);
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
    // اگر در استپ نام هستیم، اعتبارسنجی کن
    if (needsNameStep && currentStep === nameStepId) {
      const errors = {};
      if (!firstName.trim() || firstName.trim().length < 2) {
        errors.firstName = 'نام باید حداقل ۲ کاراکتر باشد';
      }
      if (!lastName.trim() || lastName.trim().length < 2) {
        errors.lastName = 'نام خانوادگی باید حداقل ۲ کاراکتر باشد';
      }
      if (!nameConfirmed) {
        errors.confirm = 'لطفاً تایید کنید که مسئولیت صحت اطلاعات را می‌پذیرید';
      }
      setNameErrors(errors);
      if (Object.keys(errors).length > 0) return;
      // ذخیره نام در پروفایل کاربر
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      updateUser({ name: fullName });
    }
    if (currentStep < timeStepId) setCurrentStep((p) => p + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((p) => p - 1);
  };

  // ═══════ تایید رزرو — هماهنگ با بک‌اند ═══════
  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      // ✅ ساخت payload مطابق بک‌اند (appointments/serializers)
      // { service_id, jy, jm, jd, time_slot }
      const payload = {
        service_id: currentService.id,
        jy: selectedDate.jy,
        jm: selectedDate.jm,
        jd: selectedDate.jd,
        time_slot: selectedTime.time, // "HH:MM" — هماهنگ با TimeField بک‌اند
      };

      let result;
      if (!USE_MOCK) {
        // در آینده: فراخوانی واقعی API
        result = await appointmentsService.createAppointment(payload);
      } else {
        // حالت Mock — شبیه‌سازی پاسخ بک‌اند
        await new Promise((r) => setTimeout(r, 1200));
        result = {
          data: {
            id: 'apt_' + Date.now(),
            status: 'reserved',
            verification_code: trustEnabled ? null : '5892',
            date_key: toJalaaliKey(selectedDate.jy, selectedDate.jm, selectedDate.jd),
            time_slot: selectedTime.time,
            total_price: finalPrice,
            deposit_amount: depositAmount,
            remaining_amount: remainingAmount,
          },
        };
      }

      setBookingResult(result.data);
      setIsSubmitting(false);
      setShowSuccess(true);

      // اجرای callback پس از ۳ ثانیه (نمایش موفقیت)
      setTimeout(() => {
        onConfirm?.({
          service: currentService,
          date: selectedDate,
          time: selectedTime,
          trustBased: trustEnabled,
          verificationCode: trustEnabled ? null : result.data.verification_code,
          appointmentId: result.data.id,
          dateKey: result.data.date_key,
        });
      }, 3000);
    } catch (err) {
      setIsSubmitting(false);
      showToast(err.message || 'خطا در رزرو نوبت. لطفاً دوباره تلاش کنید.', 'error');
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setShowSuccess(false);
    setBookingResult(null);
    onClose?.();
  };

  // ─── canProceed ───
  const canProceed = useMemo(() => {
    if (needsNameStep && currentStep === nameStepId) {
      return firstName.trim().length >= 2 && lastName.trim().length >= 2 && nameConfirmed;
    }
    switch (currentStep) {
      case reviewStepId:
        return true;
      case dateStepId:
        return !!selectedDate;
      case timeStepId:
        return !!selectedTime;
      default:
        return false;
    }
  }, [currentStep, selectedDate, selectedTime, firstName, lastName, nameConfirmed, needsNameStep]);

  // ─── رندر محتوای استپ فعلی ───
  const renderStepContent = () => {
    if (showSuccess) {
      return (
        <BookingSuccessStep
          trustEnabled={trustEnabled}
          service={currentService}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          depositAmount={depositAmount}
          verificationCode={bookingResult?.verification_code}
          onClose={handleClose}
        />
      );
    }
    if (needsNameStep && currentStep === nameStepId) {
      return (
        <BookingNameStep
          firstName={firstName}
          lastName={lastName}
          nameConfirmed={nameConfirmed}
          nameErrors={nameErrors}
          onFirstNameChange={(t) => {
            setFirstName(t);
            if (nameErrors.firstName) setNameErrors((p) => ({ ...p, firstName: '' }));
          }}
          onLastNameChange={(t) => {
            setLastName(t);
            if (nameErrors.lastName) setNameErrors((p) => ({ ...p, lastName: '' }));
          }}
          onNameConfirmedChange={(v) => {
            setNameConfirmed(v);
            if (nameErrors.confirm) setNameErrors((p) => ({ ...p, confirm: '' }));
          }}
        />
      );
    }
    if (currentStep === reviewStepId) {
      return (
        <BookingReviewStep
          originalPrice={originalPrice}
          discountPercent={discountPercent}
          discountAmount={discountAmount}
          finalPrice={finalPrice}
          depositPercent={depositPercent}
          depositAmount={depositAmount}
          remainingAmount={remainingAmount}
        />
      );
    }
    if (currentStep === dateStepId) {
      return <BookingDateSelector selectedDate={selectedDate} onDateSelect={setSelectedDate} />;
    }
    if (currentStep === timeStepId) {
      return (
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
            <span className="text-base flex-shrink-0">✅</span>
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
          {/* سوئیچ اعتماد */}
          {hasPreviousBookings && <TrustToggle enabled={trustEnabled} onToggle={setTrustEnabled} />}
        </div>
      );
    }
    return null;
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
          {renderStepContent()}
          <div className="h-16" />
        </div>

        {/* ═══ فوتر دکمه‌ها ═══ */}
        {!showSuccess && (
          <div
            className="pt-2.5 pb-1.5 border-t px-4"
            style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
          >
            <BookingModalFooter
              currentStep={currentStep}
              needsNameStep={needsNameStep}
              canProceed={canProceed}
              depositAmount={depositAmount}
              isSubmitting={isSubmitting}
              onNext={handleNext}
              onPrev={handlePrev}
              onConfirm={handleConfirm}
            />
          </div>
        )}
      </div>
    </div>
  );
  return createPortal(content, document.body);
}
