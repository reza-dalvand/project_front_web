// src/hooks/useAppointmentsManager.js
/**
 * ✅ FIX فاز ۲: رفع خطای خاموش (Silent Failure)
 * قبلاً نتیجه از بک‌اند دریافت می‌شد ولی هرگز در هیچ
 * State یا Store ذخیره نمی‌شد → لیست همیشه خالی بود
 */
'use client';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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
 * نگاشت پاسخ بک‌اند به فرمت فرانت
 * ✅ فاز ۳: فیلدها بعد از response-normalizer به camelCase تبدیل شده‌اند
 * ✅ FIX 3.6: اضافه شدن فیلد employeeName
 */
const mapAppointmentFromApi = (apt) => ({
  id: apt.id,
  customerName: apt.customerName || '',
  customerPhone: apt.customerPhone || '',
  serviceName: apt.serviceName || '',
  // ✅ FIX 3.6: نگاشت فیلد employeeName (نام آرایشگر/پرسنل)
  employeeName: apt.employeeName || apt.employee_name || '',
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

  // ✅ FIX 3.2: ref برای جلوگیری از race condition در درخواست‌های متوالی
  const fetchIdRef = useRef(0);

  const today = useMemo(() => todayJalaali(), []);
  const todayNumber = jalaaliToNumber(today);
  const threeMonthsAgoNumber = useMemo(
    () => jalaaliToNumber(subtractJalaaliMonths(today, 3)),
    [today]
  );

  // ═══════ ✅ FIX 3.2: دریافت داده‌ها — فیلترها فقط به سرور ارسال می‌شوند ═══════
  useEffect(() => {
    const currentFetchId = ++fetchIdRef.current;
    let cancelled = false;

    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = {};

        // ✅ FIX 3.2: فیلتر status فقط به سرور ارسال می‌شود (دیگر محلی فیلتر نمی‌شود)
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

        // ✅ FIX 3.2: فیلتر search فقط به سرور ارسال می‌شود
        if (searchQuery) params.search = searchQuery;
        if (dateFilter) params.date_filter = dateFilter;

        const result = await appointmentsService.getBusinessAppointments(params);

        // ✅ FIX 3.2: جلوگیری از race condition — فقط آخرین درخواست اعمال شود
        if (!cancelled && currentFetchId === fetchIdRef.current) {
          let mapped = (result.data || []).map(mapAppointmentFromApi);

          // ✅ FIX 3.2: فیلتر محلی فقط برای needs_code و trust_based
          // چون سرور ممکن است هر دو را با status=reserved برگرداند
          if (activeFilter === 'needs_code') {
            mapped = mapped.filter((a) => a.status === 'reserved' && !a.trustBased);
          } else if (activeFilter === 'trust_based') {
            mapped = mapped.filter((a) => a.status === 'reserved' && a.trustBased);
          }

          setAppointmentsList(mapped);
        }
      } catch (err) {
        if (!cancelled && currentFetchId === fetchIdRef.current) {
          console.error('Failed to fetch appointments:', err);
          setError(err.message);
          showToast('خطا در دریافت نوبت‌ها', 'error');
        }
      } finally {
        if (!cancelled && currentFetchId === fetchIdRef.current) {
          setIsLoading(false);
        }
      }
    };

    // ✅ FIX 3.2: debounce برای searchQuery — جلوگیری از درخواست‌های مکرر
    const debounceTimer = setTimeout(fetchAppointments, searchQuery ? 300 : 0);

    return () => {
      cancelled = true;
      clearTimeout(debounceTimer);
    };
  }, [activeFilter, searchQuery, dateFilter]);

  // ─── ✅ FIX 3.2: فیلتر محلی — فقط محدودیت بازه زمانی ۳ ماهه ───
  // فیلترهای status/search/dateFilter دیگر اینجا اعمال نمی‌شوند
  // چون سرور خودش آن‌ها را اعمال کرده و نتیجه فیلترشده برمی‌گرداند
  const filteredAppointments = useMemo(() => {
    return appointmentsList.filter((apt) => {
      if (!apt.date) return false;
      return jalaaliToNumber(apt.date) >= threeMonthsAgoNumber;
    });
  }, [appointmentsList, threeMonthsAgoNumber]);

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