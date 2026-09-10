// src/components/booking/hooks/useBookingState.js
'use client';
import { useState } from 'react';

/**
 * Hook برای مدیریت وضعیت‌های رزرو نوبت
 * @returns {Object} آبجکت شامل stateها و setterهای مربوط به رزرو
 */
export function useBookingState() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [trustEnabled, setTrustEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingFailed, setBookingFailed] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  const resetBookingState = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setTrustEnabled(false);
    setIsSubmitting(false);
    setBookingResult(null);
    setBookingFailed(false);
    setBookingError(null);
    setAvailableSlots([]);
  };

  return {
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
    availableDates,
    setAvailableDates,
    slotsLoading,
    setSlotsLoading,
    bookingFailed,
    setBookingFailed,
    bookingError,
    setBookingError,
    resetBookingState,
  };
}
