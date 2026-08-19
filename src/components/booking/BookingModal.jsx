// src/components/booking/BookingModal.jsx
'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiCalendar, FiClock, FiX } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@/hooks/useToast';
import BookingStepIndicator from './BookingStepIndicator';
import BookingDateSelector from './BookingDateSelector';
import BookingTimeSelector from './BookingTimeSelector';
import BookingNameStep from './BookingNameStep';
import BookingReviewStep from './BookingReviewStep';
import BookingSuccessStep from './BookingSuccessStep';
import BookingFailedStep from './BookingFailedStep'; // ✅ جدید: مدال پرداخت ناموفق
import BookingModalFooter from './BookingModalFooter';
import TrustToggle from './TrustToggle';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';
import { appointmentsService, schedulesService } from '@/api';
import { USE_MOCK } from '@/api/config';
import { toJalaaliKey } from '@/utils/date-converter';
import { buildPriceSummary } from '@/utils/price-utils';

export default function BookingModal({
  visible,
  onClose,
  service,
  businessName,
  businessId,
  onConfirm,
}) {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const currentService = service || {};
  const instanceId = useRef('booking-modal');

  // ─── State‌های اصلی ───
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [trustEnabled, setTrustEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ═══════ ✅ FIX فاز ۳: State‌های استپ نام ═══════
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [nameErrors, setNameErrors] = useState({
    firstName: '',
    lastName: '',
    confirm: '',
  });

  // ═══════ ✅ FIX: State‌های پرداخت ناموفق ═══════
  const [bookingFailed, setBookingFailed] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  // ═══════════════════════════════════════════════════════

  // ─── تشخیص نیاز به استپ نام ───
  const needsNameStep = useMemo(() => {
    const name = user?.name?.trim();
    return !name || name === 'کاربر بیو کلاب' || name.length < 3;
  }, [user?.name]);

  // ─── ساخت داینامیک استپ‌ها ───
  const STEPS = useMemo(() => {
    if (needsNameStep) {
      return [
        { id: 1, label: 'مشخصات', icon: 'user' },
        { id: 2, label: 'بررسی', icon: 'info' },
        { id: 3, label: 'تاریخ', icon: 'calendar' },
        { id: 4, label: 'ساعت', icon: 'clock' },
      ];
    }
    return [
      { id: 1, label: 'بررسی', icon: 'info' },
      { id: 2, label: 'تاریخ', icon: 'calendar' },
      { id: 3, label: 'ساعت', icon: 'clock' },
    ];
  }, [needsNameStep]);

  const nameStepId = needsNameStep ? 1 : 0;
  const reviewStepId = needsNameStep ? 2 : 1;
  const dateStepId = needsNameStep ? 3 : 2;
  const timeStepId = needsNameStep ? 4 : 3;

  // ═══════ ✅ FIX فاز ۳: اعتبارسنجی نام ═══════
  const validateName = () => {
    const errors = { firstName: '', lastName: '', confirm: '' };
    let isValid = true;

    if (!firstName.trim()) {
      errors.firstName = 'نام الزامی است';
      isValid = false;
    } else if (firstName.trim().length < 2) {
      errors.firstName = 'نام باید حداقل ۲ کاراکتر باشد';
      isValid = false;
    }

    if (!lastName.trim()) {
      errors.lastName = 'نام خانوادگی الزامی است';
      isValid = false;
    } else if (lastName.trim().length < 2) {
      errors.lastName = 'نام خانوادگی باید حداقل ۲ کاراکتر باشد';
      isValid = false;
    }

    if (!nameConfirmed) {
      errors.confirm = 'لطفاً تایید کنید که اطلاعات مطابق کارت بانکی است';
      isValid = false;
    }

    setNameErrors(errors);
    return isValid;
  };

  // ═══════ ✅ FIX فاز ۳: پیش‌پر کردن نام از پروفایل ═══════
  const prefillNameFromUser = () => {
    if (user?.firstName) setFirstName(user.firstName);
    if (user?.lastName) setLastName(user.lastName);
    // اگر نام کامل در user.name هست و firstName/lastName خالی هستند
    if (!user?.firstName && !user?.lastName && user?.name) {
      const parts = user.name.trim().split(' ');
      if (parts.length >= 2) {
        setFirstName(parts[0]);
        setLastName(parts.slice(1).join(' '));
      }
    }
  };

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
      setTrustEnabled(false);
      setIsSubmitting(false);
      setBookingResult(null);
      // ═══════ ✅ FIX: ریست حالت خطا ═══════
      setBookingFailed(false);
      setBookingError(null);
      // ═══════ ✅ FIX فاز ۳: ریست state‌های نام ═══════
      setFirstName('');
      setLastName('');
      setNameConfirmed(false);
      setNameErrors({ firstName: '', lastName: '', confirm: '' });
      setAvailableSlots([]);

      // پیش‌پر کردن نام از پروفایل کاربر
      if (needsNameStep) {
        prefillNameFromUser();
      }

      acquireScrollLock(instanceId.current);

      // دریافت روزهای آزاد
      if (businessId && currentService.id && !USE_MOCK) {
        fetchAvailableDates();
      }
    } else {
      releaseScrollLock(instanceId.current);
    }
    return () => releaseScrollLock(instanceId.current);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible]);

  // ─── دریافت روزهای آزاد ───
  const fetchAvailableDates = async () => {
    if (USE_MOCK) return;
    try {
      const result = await schedulesService.getAvailableDates(businessId, currentService.id, 30);
      setAvailableDates(result.data || []);
    } catch (err) {
      console.error('Failed to fetch available dates:', err);
    }
  };

  // ─── دریافت اسلات‌های آزاد برای تاریخ انتخابی ───
  const fetchAvailableSlots = async (date) => {
    if (USE_MOCK) {
      const mockSlots = [];
      for (let h = 9; h < 21; h++) {
        for (let m = 0; m < 60; m += 30) {
          const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
          mockSlots.push({
            id: `${date.jy}${String(date.jm).padStart(2, '0')}${String(date.jd).padStart(2, '0')}_${time.replace(':', '')}`,
            jy: date.jy,
            jm: date.jm,
            jd: date.jd,
            date_key: toJalaaliKey(date.jy, date.jm, date.jd),
            start_time: time,
            end_time: `${String(h).padStart(2, '0')}:${String((m + 30) % 60).padStart(2, '0')}`,
            is_available: Math.random() > 0.3,
            display_time: time,
          });
        }
      }
      setAvailableSlots(mockSlots.filter((s) => s.is_available));
      return;
    }
    setSlotsLoading(true);
    try {
      const result = await schedulesService.getAvailableSlots(
        businessId,
        currentService.id,
        date.jy,
        date.jm,
        date.jd
      );
      setAvailableSlots(result.data || []);
    } catch (err) {
      console.error('Failed to fetch slots:', err);
      showToast('خطا در دریافت ساعات آزاد', 'error');
    } finally {
      setSlotsLoading(false);
    }
  };

  // ─── محاسبات قیمت ───
  const priceSummary = useMemo(() => {
    const originalPrice = currentService.originalPrice ?? currentService.price ?? 0;
    const discountPercent = currentService.discountPercent ?? currentService.discount ?? 0;
    return buildPriceSummary(
      originalPrice,
      discountPercent,
      currentService.hasDeposit,
      currentService.depositPercent ?? 30
    );
  }, [currentService]);

  // ─── Handlers ───
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    fetchAvailableSlots(date);
  };

  // ═══════ ✅ FIX فاز ۳: اعتبارسنجی در استپ نام ═══════
  const handleNext = () => {
    if (needsNameStep && currentStep === nameStepId) {
      if (!validateName()) return;
      // ذخیره نام در پروفایل کاربر برای استفاده‌های بعدی
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      updateUser({
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
    }
    if (currentStep < timeStepId) setCurrentStep((p) => p + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((p) => p - 1);
  };

  // ═══════ ✅ FIX فاز ۳ + FIX: ریست کامل در handleClose ═══════
  const handleClose = () => {
    setCurrentStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingResult(null);
    // ریست حالت خطا
    setBookingFailed(false);
    setBookingError(null);
    // ریست state‌های نام
    setFirstName('');
    setLastName('');
    setNameConfirmed(false);
    setNameErrors({ firstName: '', lastName: '', confirm: '' });
    onClose?.();
  };

  // ═══════ ✅ FIX: تلاش مجدد پس از خطا ═══════
  const handleRetry = () => {
    setBookingFailed(false);
    setBookingError(null);
    // برگشت به استپ ساعت برای پرداخت مجدد
    setCurrentStep(timeStepId);
  };
  // ═══════════════════════════════════════════════════════

  // ─── تایید رزرو و پرداخت ───
  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) return;
    setIsSubmitting(true);
    try {
      let result;
      if (!USE_MOCK) {
        result = await appointmentsService.createAppointment({
          service_id: currentService.id,
          jy: selectedDate.jy,
          jm: selectedDate.jm,
          jd: selectedDate.jd,
          time_slot: selectedTime.start_time,
        });
      } else {
        await new Promise((r) => setTimeout(r, 1200));
        result = {
          data: {
            id: 'apt_' + Date.now(),
            status: 'reserved',
            verification_code: trustEnabled ? null : '5892',
            date_key: toJalaaliKey(selectedDate.jy, selectedDate.jm, selectedDate.jd),
            time_slot: selectedTime.start_time,
            total_price: priceSummary.finalPrice,
            deposit_amount: priceSummary.depositAmount,
            remaining_amount: priceSummary.remaining,
          },
        };
      }
      setBookingResult(result.data);
      // اطمینان از پاک بودن حالت خطا
      setBookingFailed(false);
      setBookingError(null);
      setIsSubmitting(false);
      onConfirm?.({
        ...result.data,
        service: currentService,
        date: selectedDate,
        time: selectedTime,
        trustBased: trustEnabled,
      });
    } catch (err) {
      setIsSubmitting(false);

      // ═══════ ✅ FIX: نمایش مدال خطا به جای فقط toast ═══════
      const isPaymentError =
        err.code === 'PAYMENT_FAILED' ||
        err.code === 'GATEWAY_ERROR' ||
        err.code === 'TRANSACTION_FAILED' ||
        err.message?.includes('پرداخت') ||
        err.message?.includes('درگاه') ||
        err.message?.includes('بانکی');

      if (isPaymentError || !USE_MOCK) {
        // خطای پرداخت → مدال ناموفق
        setBookingFailed(true);
        setBookingError({
          message: err.message || 'ارتباط با درگاه پرداخت برقرار نشد',
          code: err.code || 'UNKNOWN',
          trackingCode: err.details?.tracking_code || err.details?.trackingCode || null,
        });
      } else {
        // خطای غیر پرداختی → toast
        showToast(err.message || 'خطا در رزرو نوبت', 'error');
      }
      // ═══════════════════════════════════════════════════════
    }
  };

  // ─── canProceed ═══
  const canProceed = useMemo(() => {
    // ═══════ ✅ FIX فاز ۳: اعتبارسنجی استپ نام ═══════
    if (needsNameStep && currentStep === nameStepId) {
      const isFirstNameValid = firstName.trim().length >= 2;
      const isLastNameValid = lastName.trim().length >= 2;
      return isFirstNameValid && isLastNameValid && nameConfirmed;
    }
    if (currentStep === reviewStepId) return true;
    if (currentStep === dateStepId) return !!selectedDate;
    if (currentStep === timeStepId) return !!selectedTime;
    return false;
  }, [currentStep, selectedDate, selectedTime, needsNameStep, firstName, lastName, nameConfirmed]);

  // ─── رندر استپ فعلی ───
  const renderStepContent = () => {
    // ═══════ ✅ FIX: مدال پرداخت ناموفق ═══════
    if (bookingFailed) {
      return (
        <BookingFailedStep
          service={currentService}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          depositAmount={priceSummary.depositAmount}
          errorMessage={bookingError?.message}
          trackingCode={bookingError?.trackingCode}
          onRetry={handleRetry}
          onClose={handleClose}
        />
      );
    }
    // ═══════════════════════════════════════════════════════

    // مدال موفقیت
    if (bookingResult) {
      return (
        <BookingSuccessStep
          trustEnabled={trustEnabled}
          service={currentService}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          depositAmount={priceSummary.depositAmount}
          verificationCode={bookingResult.verification_code}
          onClose={handleClose}
        />
      );
    }

    // ═══════ ✅ FIX فاز ۳: پاس دادن props به BookingNameStep ═══════
    if (needsNameStep && currentStep === nameStepId) {
      return (
        <BookingNameStep
          firstName={firstName}
          lastName={lastName}
          nameConfirmed={nameConfirmed}
          nameErrors={nameErrors}
          onFirstNameChange={(text) => {
            setFirstName(text);
            if (nameErrors.firstName) {
              setNameErrors((prev) => ({ ...prev, firstName: '' }));
            }
          }}
          onLastNameChange={(text) => {
            setLastName(text);
            if (nameErrors.lastName) {
              setNameErrors((prev) => ({ ...prev, lastName: '' }));
            }
          }}
          onNameConfirmedChange={(confirmed) => {
            setNameConfirmed(confirmed);
            if (nameErrors.confirm) {
              setNameErrors((prev) => ({ ...prev, confirm: '' }));
            }
          }}
        />
      );
    }
    // ═══════════════════════════════════════════════════════

    if (currentStep === reviewStepId) {
      return (
        <BookingReviewStep
          originalPrice={priceSummary.originalPrice}
          discountPercent={priceSummary.discountPercent}
          discountAmount={priceSummary.discountAmount}
          finalPrice={priceSummary.finalPrice}
          depositPercent={priceSummary.depositPercent}
          depositAmount={priceSummary.depositAmount}
          remainingAmount={priceSummary.remaining}
        />
      );
    }

    if (currentStep === dateStepId) {
      return (
        <BookingDateSelector
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          availableDates={availableDates}
        />
      );
    }

    if (currentStep === timeStepId) {
      return (
        <div className="flex flex-col gap-3.5">
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
                {selectedDate.jd} {selectedDate.jm}/{selectedDate.jy}
              </span>
            </button>
          )}
          {slotsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div
                className="w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin"
                style={{ color: colors.primary }}
              />
            </div>
          ) : (
            <>
              {/* یادآوری بیعانه */}
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
                slots={availableSlots}
                selectedId={selectedTime?.id}
                onSelect={(slot) => setSelectedTime(slot)}
              />
              {/* سوئیچ اعتماد */}
              {isAuthenticated && <TrustToggle enabled={trustEnabled} onToggle={setTrustEnabled} />}
            </>
          )}
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
        className="relative w-full max-w-lg max-h-[92vh] rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden"
        style={{
          backgroundColor: colors.cardBackground,
          borderTop: `1px solid ${colors.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div
          className="flex items-center gap-3 px-4 sm:px-5 py-4 border-b flex-shrink-0"
          style={{ borderColor: colors.border }}
        >
          {/* ✅ FIX: آیکون و عنوان متفاوت در حالت خطا */}
          <div
            className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: bookingFailed ? '#E5393515' : colors.primary + '15',
            }}
          >
            {bookingFailed ? (
              <FiX size={22} color="#E53935" />
            ) : (
              <FiCalendar size={22} style={{ color: colors.primary }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-[Vazir-Bold] truncate" style={{ color: colors.textMain }}>
              {bookingFailed ? 'خطا در پرداخت' : 'رزرو نوبت'}
            </h3>
            <p className="text-xs truncate" style={{ color: colors.textSecondary }}>
              {currentService.name || 'خدمت'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={20} style={{ color: colors.textMain }} />
          </button>
        </div>

        {/* Step Indicator — ✅ FIX: مخفی در حالت خطا */}
        {!bookingResult && !bookingFailed && (
          <BookingStepIndicator steps={STEPS} currentStep={currentStep} />
        )}

        {/* محتوای اسکرولی */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-2 pb-10 w-full">
          {renderStepContent()}
        </div>
        {/* فوتر — ✅ FIX: مخفی در حالت خطا */}
        {!bookingResult && !bookingFailed && (
          <div
            className="px-4 sm:px-5 pt-4 border-t flex-shrink-0"
            style={{
              borderColor: colors.border,
              /* ✅ فاصله از Navigation Bar گوشی */
              paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
            }}
          >
            <BookingModalFooter
              currentStep={currentStep}
              needsNameStep={needsNameStep}
              canProceed={canProceed}
              depositAmount={priceSummary.depositAmount}
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
