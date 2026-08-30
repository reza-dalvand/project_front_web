// src/components/booking/BookingModal.jsx
'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { FiCalendar, FiClock, FiX } from 'react-icons/fi';
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
  const user = useAuthStore((s) => s.user);
  const currentService = service || {};
  const instanceId = useRef(generateModalId());

  // Custom hooks for state management
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
    availableSlots,
    setAvailableSlots,
    availableDates,
    setAvailableDates,
    slotsLoading,
    setSlotsLoading,
    bookingFailed,
    setBookingFailed,
    bookingError,
    setBookingError,
    resetBookingState,
  } = useBookingState();

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

  const { fetchAvailableDates, fetchAvailableSlots, createAppointment } = useBookingData(
    businessId,
    currentService.id
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      releaseScrollLock(instanceId.current);
    };
  }, []);

  useEffect(() => {
    if (visible && !isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      onClose?.();
    }
  }, [visible, isAuthenticated]);

  useEffect(() => {
    if (visible) {
      resetSteps();
      resetBookingState();
      resetNameState();
      setAvailableSlots([]);
      if (needsNameStep) prefillNameFromUser();
      acquireScrollLock(instanceId.current);
      if (businessId && currentService.id) fetchAvailableDates().then(setAvailableDates);
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

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    const slots = await fetchAvailableSlots(date);
    setAvailableSlots(slots);
  };

  const handleNext = () => {
    if (needsNameStep && currentStep === nameStepId) {
      if (!validateName()) return;
      updateUserName();
    }
    nextStep();
  };

  const handleClose = () => {
    resetSteps();
    resetBookingState();
    resetNameState();
    onClose?.();
  };
  const handleRetry = () => {
    setBookingFailed(false);
    setBookingError(null);
    setCurrentStep(timeStepId);
  };

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    const result = await createAppointment({
      service_id: currentService.id,
      jy: selectedDate.jy,
      jm: selectedDate.jm,
      jd: selectedDate.jd,
      time_slot: selectedTime.start_time,
      trust_based: trustEnabled,
    });

    if (result.success) {
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
    } else {
      setIsSubmitting(false);
      setBookingFailed(true);
      setBookingError(result.error);
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
