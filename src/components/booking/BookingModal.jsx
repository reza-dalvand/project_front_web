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
import BookingFailedStep from './BookingFailedStep';
import BookingModalFooter from './BookingModalFooter';
import TrustToggle from './TrustToggle';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';
import { appointmentsService, schedulesService } from '@/api';
import { toJalaaliKey } from '@/utils/date-converter';
import { buildPriceSummary } from '@/utils/price-utils';
import { useAuth } from '@/stores/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';

let modalCounter = 0;
const generateModalId = () => `booking-modal-${++modalCounter}-${Date.now()}`;

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
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const currentService = service || {};
  const instanceId = useRef(generateModalId());

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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [nameErrors, setNameErrors] = useState({ firstName: '', lastName: '', confirm: '' });
  const [bookingFailed, setBookingFailed] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  const needsNameStep = useMemo(() => {
    const name = user?.name?.trim();
    return !name || name === 'کاربر بیو کلاب' || name.length < 3;
  }, [user?.name]);

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

  const prefillNameFromUser = () => {
    if (user?.firstName) setFirstName(user.firstName);
    if (user?.lastName) setLastName(user.lastName);
    if (!user?.firstName && !user?.lastName && user?.name) {
      const parts = user.name.trim().split(' ');
      if (parts.length >= 2) {
        setFirstName(parts[0]);
        setLastName(parts.slice(1).join(' '));
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      releaseScrollLock(instanceId.current);
    };
  }, []);

  useEffect(() => {
    if (visible && !isAuthenticated) {
      // ✅ اگر در صفحه پروفایل هستیم و کاربر لاگین نکرده، بعد از لاگین به صفحه هوم بره
      // در غیر این صورت به همون صفحه‌ای که بوده برگرده
      const redirectPath = pathname === '/profile' ? '/' : pathname;
      router.push(`/auth/login?redirect=${encodeURIComponent(redirectPath)}`);
      onClose?.();
    }
  }, [visible, isAuthenticated, pathname]);

  useEffect(() => {
    if (visible) {
      setCurrentStep(1);
      setSelectedDate(null);
      setSelectedTime(null);
      setTrustEnabled(false);
      setIsSubmitting(false);
      setBookingResult(null);
      setBookingFailed(false);
      setBookingError(null);
      setFirstName('');
      setLastName('');
      setNameConfirmed(false);
      setNameErrors({ firstName: '', lastName: '', confirm: '' });
      setAvailableSlots([]);
      if (needsNameStep) prefillNameFromUser();
      acquireScrollLock(instanceId.current);
      // ✅ همیشه از بک‌اند روزهای آزاد را بگیر
      if (businessId && currentService.id) fetchAvailableDates();
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

  const fetchAvailableDates = async () => {
    try {
      const result = await schedulesService.getAvailableDates(businessId, currentService.id, 30);
      setAvailableDates(result.data || []);
    } catch (err) {
      console.error('Failed to fetch available dates:', err);
    }
  };

  const fetchAvailableSlots = async (date) => {
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

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    fetchAvailableSlots(date);
  };
  const handleNext = () => {
    if (needsNameStep && currentStep === nameStepId) {
      if (!validateName()) return;
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      updateUser({ name: fullName, firstName: firstName.trim(), lastName: lastName.trim() });
    }
    if (currentStep < timeStepId) setCurrentStep((p) => p + 1);
  };
  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((p) => p - 1);
  };
  const handleClose = () => {
    setCurrentStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingResult(null);
    setBookingFailed(false);
    setBookingError(null);
    setFirstName('');
    setLastName('');
    setNameConfirmed(false);
    setNameErrors({ firstName: '', lastName: '', confirm: '' });
    onClose?.();
  };
  const handleRetry = () => {
    setBookingFailed(false);
    setBookingError(null);
    setCurrentStep(timeStepId);
  };

  // ✅ FIX فاز ۳: ارسال trust_based به بک‌اند
  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);

    try {
      const result = await appointmentsService.createAppointment({
        service_id: currentService.id,
        jy: selectedDate.jy,
        jm: selectedDate.jm,
        jd: selectedDate.jd,
        time_slot: selectedTime.start_time,
        trust_based: trustEnabled, // ✅ فاز ۳: وضعیت اعتماد
      });

      setBookingResult(result.data);
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
      setBookingFailed(true);
      setBookingError({
        message: err.message || 'ارتباط با درگاه پرداخت برقرار نشد',
        code: err.code || 'UNKNOWN',
        trackingCode: err.details?.tracking_code || err.details?.trackingCode || null,
      });
    }
  };

  const canProceed = useMemo(() => {
    if (needsNameStep && currentStep === nameStepId) {
      return firstName.trim().length >= 2 && lastName.trim().length >= 2 && nameConfirmed;
    }
    if (currentStep === reviewStepId) return true;
    if (currentStep === dateStepId) return !!selectedDate;
    if (currentStep === timeStepId) return !!selectedTime;
    return false;
  }, [currentStep, selectedDate, selectedTime, needsNameStep, firstName, lastName, nameConfirmed]);

  const renderStepContent = () => {
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
          onNameConfirmedChange={(c) => {
            setNameConfirmed(c);
            if (nameErrors.confirm) setNameErrors((p) => ({ ...p, confirm: '' }));
          }}
        />
      );
    }
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
              style={{ backgroundColor: colors.primary + '10', borderColor: colors.primary + '40' }}
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
        style={{ backgroundColor: colors.cardBackground, borderTop: `1px solid ${colors.border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center gap-3 px-4 sm:px-5 py-4 border-b flex-shrink-0"
          style={{ borderColor: colors.border }}
        >
          <div
            className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: bookingFailed ? '#E5393515' : colors.primary + '15' }}
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
        {!bookingResult && !bookingFailed && (
          <BookingStepIndicator steps={STEPS} currentStep={currentStep} />
        )}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-2 pb-10 w-full">
          {renderStepContent()}
        </div>
        {!bookingResult && !bookingFailed && (
          <div
            className="px-4 sm:px-5 pt-4 border-t flex-shrink-0"
            style={{
              borderColor: colors.border,
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
