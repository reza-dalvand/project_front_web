// src/components/booking/hooks/useBookingSteps.js
'use client';
import { useState, useMemo } from 'react';

/**
 * Hook برای مدیریت مراحل رزرو نوبت
 * @param {boolean} needsNameStep - آیا مرحله وارد کردن نام نیاز است
 * @returns {Object} آبجکت شامل مراحل، وضعیت فعلی و متدهای ناوبری
 */
export function useBookingSteps(needsNameStep) {
  const [currentStep, setCurrentStep] = useState(1);

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

  const handleNext = () => {
    if (currentStep < timeStepId) {
      setCurrentStep((p) => p + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((p) => p - 1);
    }
  };

  const resetSteps = () => {
    setCurrentStep(1);
  };

  return {
    currentStep,
    setCurrentStep,
    STEPS,
    nameStepId,
    reviewStepId,
    dateStepId,
    timeStepId,
    handleNext,
    handlePrev,
    resetSteps,
  };
}
