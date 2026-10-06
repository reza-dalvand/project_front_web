// src/hooks/useTodayAppointments.js
import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/api/api-client';
import { appointmentsService } from '@/api';
import { useToast } from '@/hooks/useToast';

// ✅ FIX: همسان‌سازی منطق نگاشت تاریخ با useAppointmentsManager
const mapTodayAppointment = (apt) => {
  const jy = apt.jy ?? apt.year;
  const jm = apt.jm ?? apt.month;
  const jd = apt.jd ?? apt.day;

  let displayStatus = 'reserved';
  if (apt.status === 'reserved') {
    if (!apt.trustBased && !apt.isVerified) displayStatus = 'pending_verification';
    else if (apt.trustBased) displayStatus = 'confirmed';
  }

  return {
    id: apt.id,
    customerName: apt.customerName || apt.customer_name || '',
    customerPhone: apt.customerPhone || apt.customer_phone || '',
    serviceName: apt.serviceName || apt.service_name || '',
    employeeName: apt.employeeName || apt.employee_name || null,
    date: (jy !== undefined && jm !== undefined && jd !== undefined) ? { jy, jm, jd } : null,
    dateKey: apt.dateKey || apt.date_key || '',
    time: apt.timeSlot || apt.time_slot || '',
    timeSlot: apt.timeSlot || apt.time_slot || '',
    status: displayStatus,
    backendStatus: apt.status,
    price: apt.totalPrice || apt.total_price || 0,
    depositPaid: apt.depositPaid || apt.deposit_paid || 0,
    depositAmount: apt.depositAmount || apt.deposit_amount || 0,
    verificationCode: apt.verificationCode || apt.verification_code || null,
    trustBased: apt.trustBased ?? apt.trust_based ?? false,
    isVerified: apt.isVerified ?? apt.is_verified ?? false,
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

  const handleVerifyCode = useCallback(async (appointmentId, code) => {
    try {
      await appointmentsService.verifyServiceCode(appointmentId, code);
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: 'reserved', isVerified: true } : apt
        )
      );
      showToast('✓ خدمت تایید شد • بیعانه آزاد شد', 'success');
      return true;
    } catch (err) {
      showToast(err.message || 'کد وارد شده صحیح نیست', 'error');
      return false;
    }
  }, [showToast]);

  const handleTrustConfirm = useCallback(async (appointmentId) => {
    try {
      await appointmentsService.verifyServiceCode(appointmentId, '0000');
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: 'reserved', isVerified: true, trustConfirmed: true } : apt
        )
      );
      showToast('✓ خدمت تایید شد (بدون کد) • بیعانه آزاد شد', 'success');
      return true;
    } catch (err) {
      showToast(err.message || 'خطا در تایید', 'error');
      return false;
    }
  }, [showToast]);

  const handleCancel = useCallback(async (appointmentId, reason) => {
    try {
      await appointmentsService.cancelByBusiness(appointmentId, reason);
      setAppointments((prev) => prev.filter((apt) => apt.id !== appointmentId));
      showToast('نوبت لغو شد • بیعانه به مشتری مسترد می‌شود', 'info');
      return true;
    } catch (err) {
      showToast(err.message || 'خطا در لغو نوبت', 'error');
      return false;
    }
  }, [showToast]);

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