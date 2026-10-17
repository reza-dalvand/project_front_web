// src/hooks/useAppointmentsManager.js
/**
 * ✅ FIX فاز ۲: رفع خطای خاموش (Silent Failure)
 * قبلاً نتیجه از بک‌اند دریافت می‌شد ولی هرگز در هیچ
 * State یا Store ذخیره نمی‌شد → لیست همیشه خالی بود
 *
 * ✅ FIX دسته ۴:
 * - refresh خودکار بعد از تایید/لغو/تایید اعتمادی
 * - جلوگیری از re-render و محاسبه تکراری counts
 * - شمارش صحیح لغو شده‌ها شامل cancelled_by_customer
 * - استفاده از ref برای showToast جهت جلوگیری از dependency ناپایدار
 */
'use client';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useToast } from '@/hooks/useToast';
import { appointmentsService } from '@/api';
import {
  todayJalaali,
  jalaaliToNumber,
  subtractJalaaliMonths,
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

const CANCELLED_STATUSES = new Set([
  'cancelled_by_salon',
  'cancelled_by_customer',
]);

export const useAppointmentsManager = () => {
  const { showToast } = useToast();

  // ✅ FIX عملکرد/پایداری: showToast را در ref نگه می‌داریم
  const showToastRef = useRef(showToast);

  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  // ─── State‌ها ───
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appointmentsList, setAppointmentsList] = useState([]);

  // ✅ FIX: trigger برای refetch بعد از mutate
  const [refreshTick, setRefreshTick] = useState(0);

  // ✅ FIX 3.2: ref برای جلوگیری از race condition در درخواست‌های متوالی
  const fetchIdRef = useRef(0);

  const today = useMemo(() => todayJalaali(), []);
  const threeMonthsAgoNumber = useMemo(
    () => jalaaliToNumber(subtractJalaaliMonths(today, 3)),
    [today]
  );

  // ═══════ دریافت داده‌ها ═══════
  useEffect(() => {
    const currentFetchId = ++fetchIdRef.current;
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

        if (!cancelled && currentFetchId === fetchIdRef.current) {
          let mapped = (result.data || []).map(mapAppointmentFromApi);

          // فیلتر محلی فقط برای needs_code و trust_based
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
          setError(err?.message || 'خطا در دریافت نوبت‌ها');
          showToastRef.current?.('خطا در دریافت نوبت‌ها', 'error');
        }
      } finally {
        if (!cancelled && currentFetchId === fetchIdRef.current) {
          setIsLoading(false);
        }
      }
    };

    const debounceTimer = setTimeout(fetchAppointments, searchQuery ? 300 : 0);

    return () => {
      cancelled = true;
      clearTimeout(debounceTimer);
    };
  }, [activeFilter, searchQuery, dateFilter, refreshTick]);

  // ✅ FIX عملکرد: یک‌بار فیلتر سه‌ماهه، هم برای لیست و هم برای counts
  const baseAppointments = useMemo(() => {
    return appointmentsList.filter((apt) => {
      if (!apt.date) return false;
      return jalaaliToNumber(apt.date) >= threeMonthsAgoNumber;
    });
  }, [appointmentsList, threeMonthsAgoNumber]);

  const filteredAppointments = baseAppointments;

  const counts = useMemo(() => {
    const base = baseAppointments;

    return {
      all: base.length,
      reserved: base.filter((a) => a.status === 'reserved').length,
      needs_code: base.filter((a) => a.status === 'reserved' && !a.trustBased).length,
      trust_based: base.filter((a) => a.status === 'reserved' && a.trustBased).length,
      done: base.filter((a) => a.status === 'done').length,
      cancelled: base.filter((a) => CANCELLED_STATUSES.has(a.status)).length,
    };
  }, [baseAppointments]);

  const refresh = useCallback(() => {
    setRefreshTick((t) => t + 1);
  }, []);

  // ─── تایید کد ───
  const handleVerify = useCallback(
    async (appointmentId, code) => {
      try {
        await appointmentsService.verifyServiceCode(appointmentId, code);
        showToastRef.current?.(
          '✓ کد تایید شد • بیعانه به حساب شما واریز می‌شود',
          'success'
        );
        refresh();
        return true;
      } catch (err) {
        showToastRef.current?.(err?.message || 'خطا در تایید کد', 'error');
        return false;
      }
    },
    [refresh]
  );

  // ─── تایید بدون کد ───
  const handleTrustConfirm = useCallback(
    async (appointmentId) => {
      try {
        await appointmentsService.verifyServiceCode(appointmentId, '0000');
        showToastRef.current?.(
          '✓ خدمت تایید شد (بدون نیاز به کد) • بیعانه آزاد شد',
          'success'
        );
        refresh();
        return true;
      } catch (err) {
        showToastRef.current?.(err?.message || 'خطا در تایید', 'error');
        return false;
      }
    },
    [refresh]
  );

  // ─── لغو نوبت ───
  const handleCancel = useCallback(
    async (appointmentId, reason) => {
      try {
        await appointmentsService.cancelByBusiness(appointmentId, reason);
        showToastRef.current?.(
          'نوبت لغو شد • بیعانه به مشتری مسترد می‌شود',
          'info'
        );
        refresh();
        return true;
      } catch (err) {
        showToastRef.current?.(err?.message || 'خطا در لغو نوبت', 'error');
        return false;
      }
    },
    [refresh]
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
    refresh,
  };
};