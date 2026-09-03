// src/hooks/useTodayAppointments.js
/**
 * هوک دریافت نوبت‌های فعال امروز برای داشبورد مدیریت
 *
 * نگاشت وضعیت بک‌اند → فرانت:
 *   reserved + !trust_based + !is_verified → pending_verification
 *   reserved + trust_based                 → confirmed
 *   reserved + is_verified                 → reserved
 */
import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/api/api-client';
import { appointmentsService } from '@/api';
import { useToast } from '@/hooks/useToast';

/**
 * نگاشت یک نوبت از فرمت بک‌اند به فرمت فرانت
 */
const mapTodayAppointment = (apt) => {
  // تعیین وضعیت نمایشی
  let displayStatus = 'reserved';
  if (apt.status === 'reserved') {
    if (!apt.trustBased && !apt.isVerified) {
      displayStatus = 'pending_verification';
    } else if (apt.trustBased) {
      displayStatus = 'confirmed';
    } else {
      displayStatus = 'reserved';
    }
  }

  return {
    id: apt.id,
    customerName: apt.customerName || '',
    customerPhone: apt.customerPhone || '',
    serviceName: apt.serviceName || '',
    employeeName: apt.employeeName || null,
    date: apt.jm && apt.jd ? { jy: apt.jy, jm: apt.jm, jd: apt.jd } : null,
    dateKey: apt.dateKey || '',
    time: apt.timeSlot || '',
    timeSlot: apt.timeSlot || '',
    status: displayStatus,
    backendStatus: apt.status,
    price: apt.totalPrice || 0,
    depositPaid: apt.depositPaid || 0,
    depositAmount: apt.depositAmount || 0,
    verificationCode: apt.verificationCode || null,
    trustBased: apt.trustBased || false,
    isVerified: apt.isVerified || false,
    isUpcoming: true,
    canCancel: true,
  };
};

export const useTodayAppointments = () => {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodayAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiClient.get('/appointments/business-today/');
      const data = result.data || [];
      const mapped = data.map(mapTodayAppointment);

      // مرتب‌سازی: ابتدا نیاز به کد، سپس بر اساس ساعت
      mapped.sort((a, b) => {
        const aNeedsCode = a.status === 'pending_verification' ? 0 : 1;
        const bNeedsCode = b.status === 'pending_verification' ? 0 : 1;
        if (aNeedsCode !== bNeedsCode) return aNeedsCode - bNeedsCode;
        return (a.time || '').localeCompare(b.time || '');
      });

      setAppointments(mapped);
    } catch (err) {
      console.error('Failed to fetch today appointments:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodayAppointments();
  }, [fetchTodayAppointments]);

  // ─── تایید کد ۴ رقمی ───
  const handleVerifyCode = useCallback(
    async (appointmentId, code) => {
      try {
        await appointmentsService.verifyServiceCode(appointmentId, code);
        // بروزرسانی محلی
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === appointmentId
              ? { ...apt, status: 'reserved', isVerified: true }
              : apt
          )
        );
        showToast('✓ خدمت تایید شد • بیعانه آزاد شد', 'success');
        return true;
      } catch (err) {
        showToast(err.message || 'کد وارد شده صحیح نیست', 'error');
        return false;
      }
    },
    [showToast]
  );

  // ─── تایید بدون کد (اعتمادی) ───
  const handleTrustConfirm = useCallback(
    async (appointmentId) => {
      try {
        await appointmentsService.verifyServiceCode(appointmentId, '0000');
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === appointmentId
              ? { ...apt, status: 'reserved', isVerified: true, trustConfirmed: true }
              : apt
          )
        );
        showToast('✓ خدمت تایید شد (بدون کد) • بیعانه آزاد شد', 'success');
        return true;
      } catch (err) {
        showToast(err.message || 'خطا در تایید', 'error');
        return false;
      }
    },
    [showToast]
  );

  // ─── لغو نوبت ───
  const handleCancel = useCallback(
    async (appointmentId, reason) => {
      try {
        await appointmentsService.cancelByBusiness(appointmentId, reason);
        setAppointments((prev) => prev.filter((apt) => apt.id !== appointmentId));
        showToast('نوبت لغو شد • بیعانه به مشتری مسترد می‌شود', 'info');
        return true;
      } catch (err) {
        showToast(err.message || 'خطا در لغو نوبت', 'error');
        return false;
      }
    },
    [showToast]
  );

  return {
    appointments,
    isLoading,
    error,
    refetch: fetchTodayAppointments,
    handleVerifyCode,
    handleTrustConfirm,
    handleCancel,
  };
};