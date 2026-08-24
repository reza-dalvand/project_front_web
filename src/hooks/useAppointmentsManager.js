// src/hooks/useAppointmentsManager.js
/**
 * ✅ FIX فاز ۲: رفع خطای خاموش (Silent Failure)
 * قبلاً نتیجه از بک‌اند دریافت می‌شد ولی هرگز در هیچ
 * State یا Store ذخیره نمی‌شد → لیست همیشه خالی بود
 */
'use client';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useToast } from '@/hooks/useToast';
import { appointmentsService } from '@/api';
import {
  todayJalaali,
  jalaaliToNumber,
  jalaaliToDate,
  subtractJalaaliMonths,
  isSameJalaaliDay,
} from '@/utils/dateUtils';

/**
 * ✅ FIX فاز ۲: نگاشت پاسخ بک‌اند به فرمت فرانت
 */
/**
 * نگاشت پاسخ بک‌اند به فرمت فرانت
 * ✅ فاز ۳: فیلدها بعد از response-normalizer به camelCase تبدیل شده‌اند
 */
const mapAppointmentFromApi = (apt) => ({
  id: apt.id,
  customerName: apt.customerName || '',
  customerPhone: apt.customerPhone || '',
  serviceName: apt.serviceName || '',
  date: apt.jm && apt.jd ? { jy: apt.jy, jm: apt.jm, jd: apt.jd } : null,
  dateKey: apt.dateKey || '',
  time: apt.timeSlot || '',
  timeSlot: apt.timeSlot || '',
  status: apt.status || '',
  price: apt.totalPrice || 0,
  depositPaid: apt.depositPaid || 0,
  depositAmount: apt.depositAmount || 0,
  verificationCode: apt.verificationCode || null,
  trustBased: apt.trustBased || false,
  isVerified: apt.isVerified || false,
  isUpcoming: apt.isUpcoming || false,
  canCancel: apt.canCancel || false,
});

export const useAppointmentsManager = () => {
  const { showToast } = useToast();

  // ─── State‌ها ───
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // ✅ FIX فاز ۲: لیست نوبت‌ها حالا واقعاً ذخیره می‌شود
  const [appointmentsList, setAppointmentsList] = useState([]);

  const today = useMemo(() => todayJalaali(), []);
  const todayNumber = jalaaliToNumber(today);
  const threeMonthsAgoNumber = useMemo(
    () => jalaaliToNumber(subtractJalaaliMonths(today, 3)),
    [today]
  );

  // ═══════ ✅ FIX فاز ۲: دریافت و ذخیره داده‌ها ═══════
  useEffect(() => {
    let cancelled = false;
    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = {};
        if (activeFilter !== 'all') {
          if (activeFilter === 'cancelled') {
            params.status = 'cancelled';
          } else if (activeFilter === 'done') {
            params.status = 'done';
          } else if (
            activeFilter === 'reserved' ||
            activeFilter === 'needs_code' ||
            activeFilter === 'trust_based'
          ) {
            params.status = 'reserved';
          } else {
            params.status = activeFilter;
          }
        }
        if (searchQuery) params.search = searchQuery;
        if (dateFilter) params.date_filter = dateFilter;

        const result = await appointmentsService.getBusinessAppointments(params);
        // ✅ FIX فاز ۲: ذخیره نتیجه در state
        if (!cancelled) {
          const mapped = (result.data || []).map(mapAppointmentFromApi);
          setAppointmentsList(mapped);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to fetch appointments:', err);
          setError(err.message);
          showToast('خطا در دریافت نوبت‌ها', 'error');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };
    fetchAppointments();
    return () => {
      cancelled = true;
    };
  }, [activeFilter, searchQuery, dateFilter]);

  // ─── فیلتر محلی (بر روی داده‌های ذخیره‌شده) ───
  const filteredAppointments = useMemo(() => {
    let result = appointmentsList.filter((apt) => {
      if (!apt.date) return false;
      return jalaaliToNumber(apt.date) >= threeMonthsAgoNumber;
    });

    // فیلتر بر اساس وضعیت
    if (activeFilter !== 'all') {
      if (activeFilter === 'cancelled') {
        result = result.filter((a) => a.status === 'cancelled_by_salon');
      } else if (activeFilter === 'needs_code') {
        result = result.filter((a) => a.status === 'reserved' && !a.trustBased);
      } else if (activeFilter === 'trust_based') {
        result = result.filter((a) => a.status === 'reserved' && a.trustBased);
      } else if (activeFilter === 'reserved') {
        result = result.filter((a) => a.status === 'reserved');
      } else if (activeFilter === 'done') {
        result = result.filter((a) => a.status === 'done');
      }
    }

    // فیلتر جستجو
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (a) =>
          (a.customerName || '').toLowerCase().includes(q) ||
          (a.serviceName || '').toLowerCase().includes(q) ||
          (a.customerPhone || '').includes(q)
      );
    }

    // فیلتر تاریخ
    if (dateFilter === 'today') {
      result = result.filter((a) => isSameJalaaliDay(a.date, today));
    } else if (dateFilter === 'week') {
      const todayDate = jalaaliToDate(today);
      const weekEnd = new Date(todayDate);
      weekEnd.setDate(weekEnd.getDate() + 7);
      result = result.filter((a) => {
        const d = jalaaliToDate(a.date);
        return d >= todayDate && d <= weekEnd;
      });
    } else if (dateFilter === 'month') {
      result = result.filter((a) => a.date.jy === today.jy && a.date.jm === today.jm);
    }

    return result;
  }, [appointmentsList, activeFilter, searchQuery, dateFilter, today, threeMonthsAgoNumber]);

  // ─── شمارنده‌ها ───
  const counts = useMemo(() => {
    const base = appointmentsList.filter((apt) => {
      if (!apt.date) return false;
      return jalaaliToNumber(apt.date) >= threeMonthsAgoNumber;
    });
    return {
      all: base.length,
      reserved: base.filter((a) => a.status === 'reserved').length,
      needs_code: base.filter((a) => a.status === 'reserved' && !a.trustBased).length,
      trust_based: base.filter((a) => a.status === 'reserved' && a.trustBased).length,
      done: base.filter((a) => a.status === 'done').length,
      cancelled: base.filter((a) => a.status === 'cancelled_by_salon').length,
    };
  }, [appointmentsList, threeMonthsAgoNumber]);

  // ─── تایید کد ───
  const handleVerify = useCallback(
    async (appointmentId, code) => {
      try {
        await appointmentsService.verifyServiceCode(appointmentId, code);
        showToast('✓ کد تایید شد • بیعانه به حساب شما واریز می‌شود', 'success');
        return true;
      } catch (err) {
        showToast(err.message || 'خطا در تایید کد', 'error');
        return false;
      }
    },
    [showToast]
  );

  // ─── تایید بدون کد ───
  const handleTrustConfirm = useCallback(
    async (appointmentId) => {
      try {
        await appointmentsService.verifyServiceCode(appointmentId, '0000');
        showToast('✓ خدمت تایید شد (بدون نیاز به کد) • بیعانه آزاد شد', 'success');
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
    appointments: filteredAppointments,
    counts,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    dateFilter,
    setDateFilter,
    handleVerify,
    handleTrustConfirm,
    handleCancel,
    isLoading,
    error,
  };
};
