// src/components/booking/BookingModal.jsx
'use client';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FiCalendar, FiX } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';
import { buildPriceSummary } from '@/utils/price-utils';
import BookingStepIndicator from './BookingStepIndicator';
import BookingDateSelector from './BookingDateSelector';
import BookingTimeSelector from './BookingTimeSelector';
import BookingNameStep from './BookingNameStep';
import BookingReviewStep from './BookingReviewStep';
import BookingSuccessStep from './BookingSuccessStep';
import BookingFailedStep from './BookingFailedStep';
import BookingModalFooter from './BookingModalFooter';
import TrustToggle from './TrustToggle';
import { useBookingSteps, useBookingState, useBookingName, useBookingData } from './hooks';

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
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();
  const instanceId = useRef(generateModalId());
  const currentService = service || {};
  const serviceId = currentService.id;
  const [datesLoading, setDatesLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const abortRef = useRef(null);

  // ─── useBookingState ───
  const {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    trustEnabled,
    setTrustEnabled,
    isSubmitting,
    setIsSubmitting,
    bookingResult,
    setBookingResult,
    availableSlots,
    setAvailableSlots,
    slotsLoading,
    setSlotsLoading,
    bookingFailed,
    setBookingFailed,
    bookingError,
    setBookingError,
    resetBookingState,
  } = useBookingState();

  // ─── useBookingName ───
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    nameConfirmed,
    setNameConfirmed,
    nameErrors,
    setNameErrors,
    needsNameStep,
    validateName,
    prefillNameFromUser,
    updateUserName,
    resetNameState,
  } = useBookingName();

  // ─── useBookingSteps ───
  const {
    currentStep,
    setCurrentStep,
    STEPS,
    nameStepId,
    reviewStepId,
    dateStepId,
    timeStepId,
    handleNext: nextStep,
    handlePrev: prevStep,
    resetSteps,
  } = useBookingSteps(needsNameStep);

  // ─── useBookingData ───
  const { fetchAvailableDates, fetchAvailableSlots, createAppointment } = useBookingData(
    businessId,
    serviceId
  );

  const [mounted, setMounted] = useState(false);

  // ═══════ Mount / Unmount ═══════
  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      releaseScrollLock(instanceId.current);
    };
  }, []);

  // ═══════ Redirect to Login ═══════
  useEffect(() => {
    if (visible && !isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      onClose?.();
    }
  }, [visible, isAuthenticated, router, onClose]);

  // ═══════ ✅ FIX ۱: useEffect اصلی با dependencies کامل ═══════
  useEffect(() => {
    if (!visible) {
      releaseScrollLock(instanceId.current);
      // لغو request های pending
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
      return;
    }

    abortRef.current = new AbortController();

    resetSteps();
    resetBookingState();
    resetNameState();
    setAvailableSlots([]);
    setAvailableDates([]);

    if (needsNameStep) {
      prefillNameFromUser();
    }

    acquireScrollLock(instanceId.current);

    if (businessId && serviceId) {
      setDatesLoading(true);
      fetchAvailableDates()
        .then((dates) => {
          if (!abortRef.current?.signal.aborted) {
            setAvailableDates(dates || []);
          }
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            console.error('Failed to fetch available dates:', err);
          }
        })
        .finally(() => {
          if (!abortRef.current?.signal.aborted) {
            setDatesLoading(false);
          }
        });
    }

    return () => {
      releaseScrollLock(instanceId.current);
    };
    // ✅ FIX ۱: dependencies کامل
  }, [visible, businessId, serviceId, needsNameStep]);

  // ═══════ Escape Key ═══════
  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible]); // handleClose با useCallback پایدار است

  // ═══════ Price Summary ═══════
  const priceSummary = useMemo(() => {
    const originalPrice = currentService.originalPrice ?? currentService.price ?? 0;
    const discountPercent = currentService.discountPercent ?? currentService.discount ?? 0;
    const hasDeposit = currentService.hasDeposit ?? currentService.has_deposit ?? false;
    const depositPercent = currentService.depositPercent ?? currentService.deposit_percent ?? 30;
    return buildPriceSummary(originalPrice, discountPercent, hasDeposit, depositPercent);
  }, [currentService]);

  // ═══════ ✅ FIX ۸: useCallback برای جلوگیری از re-render ═══════
  const handleDateSelect = useCallback(
    async (date) => {
      setSelectedDate(date);
      setSelectedTime(null);
      setSlotsLoading(true);
      try {
        const slots = await fetchAvailableSlots(date);
        setAvailableSlots(slots || []);
      } catch (err) {
        console.error('Failed to fetch slots:', err);
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    },
    [fetchAvailableSlots, setSelectedDate, setSelectedTime, setAvailableSlots, setSlotsLoading]
  );

  const handleNext = useCallback(() => {
    if (needsNameStep && currentStep === nameStepId) {
      if (!validateName()) return;
      updateUserName();
    }
    nextStep();
  }, [needsNameStep, currentStep, nameStepId, validateName, updateUserName, nextStep]);

  const handleClose = useCallback(() => {
    resetSteps();
    resetBookingState();
    resetNameState();
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    onClose?.();
  }, [resetSteps, resetBookingState, resetNameState, onClose]);

  const handleRetry = useCallback(() => {
    setBookingFailed(false);
    setBookingError(null);
    setCurrentStep(timeStepId);
  }, [setBookingFailed, setBookingError, setCurrentStep, timeStepId]);

  const handleConfirm = useCallback(async () => {
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    try {
      const result = await createAppointment({
        service_id: serviceId,
        jy: selectedDate.jy,
        jm: selectedDate.jm,
        jd: selectedDate.jd,
        // ✅ FIX ۳: پشتیبانی از هر دو فرمت
        time_slot: selectedTime.start_time || selectedTime.time_slot || selectedTime.display_time,
        trust_based: trustEnabled,
      });

      if (result?.success !== false) {
        const appointmentData = result?.data || result;
        setBookingResult(appointmentData);
        setBookingFailed(false);
        setBookingError(null);

        onConfirm?.({
          ...appointmentData,
          service: currentService,
          date: selectedDate,
          time: selectedTime,
          trustBased: trustEnabled,
        });
      } else {
        setBookingFailed(true);
        setBookingError(result?.error || { message: 'خطا در ثبت نوبت' });
      }
    } catch (err) {
      console.error('Create appointment error:', err);
      setBookingFailed(true);
      setBookingError({
        message: err?.message || 'خطای شبکه. لطفاً دوباره تلاش کنید.',
        code: err?.code || 'NETWORK_ERROR',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    selectedDate,
    selectedTime,
    serviceId,
    trustEnabled,
    createAppointment,
    currentService,
    onConfirm,
    setBookingResult,
    setBookingFailed,
    setBookingError,
    setIsSubmitting,
  ]);

  // ═══════ canProceed ═══════
  const canProceed = useMemo(() => {
    if (bookingFailed || bookingResult) return false;
    if (needsNameStep && currentStep === nameStepId) {
      return firstName.trim().length >= 2 && lastName.trim().length >= 2 && nameConfirmed;
    }
    if (currentStep === reviewStepId) return true;
    if (currentStep === dateStepId) return !!selectedDate;
    if (currentStep === timeStepId) return !!selectedTime;
    return false;
  }, [
    currentStep,
    selectedDate,
    selectedTime,
    needsNameStep,
    firstName,
    lastName,
    nameConfirmed,
    nameStepId,
    reviewStepId,
    dateStepId,
    timeStepId,
    bookingFailed,
    bookingResult,
  ]);

  // ✅ FIX ۳: استخراج verificationCode با پشتیبانی از هر دو فرمت
  const verificationCode =
    bookingResult?.verification_code || bookingResult?.verificationCode || '';

  // ═══════ Render Step Content ═══════
  const renderStepContent = () => {
    if (bookingFailed) {
      return (
        <BookingFailedStep
          service={currentService}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          depositAmount={priceSummary.depositAmount}
          errorMessage={bookingError?.message || 'خطا در ثبت نوبت'}
          trackingCode={bookingError?.trackingCode || bookingError?.tracking_code}
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
          verificationCode={verificationCode}
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
          isLoading={datesLoading}
        />
      );
    }
    if (currentStep === timeStepId) {
      return (
        <div className="flex flex-col gap-3.5">
          {selectedDate && (
            <button
              onClick={prevStep}
              className="flex items-center gap-1.5 self-start py-2 px-3.5 rounded-[14px] border"
              style={{ backgroundColor: colors.primary + '10', borderColor: colors.primary + '40' }}
            >
              <FiCalendar size={16} style={{ color: colors.primary }} />
              <span className="text-[13px] font-[Vazir-Bold]" style={{ color: colors.primary }}>
                {selectedDate.jy}/{selectedDate.jm}/{selectedDate.jd}
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
        {/* Header */}
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
              {bookingFailed ? 'خطا در ثبت نوبت' : 'رزرو نوبت'}
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
              onPrev={prevStep}
              onConfirm={handleConfirm}
            />
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
