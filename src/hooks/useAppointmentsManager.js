// src/hooks/useAppointmentsManager.js
'use client';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useToast } from '@/hooks/useToast';
import { appointmentsService } from '@/api';
import { USE_MOCK } from '@/api/config';
import {
  todayJalaali,
  jalaaliToNumber,
  jalaaliToDate,
  subtractJalaaliMonths,
  isSameJalaaliDay,
} from '@/utils/dateUtils';

export const useAppointmentsManager = () => {
  const { showToast } = useToast();
  const appointments = useBusinessStore((s) => s.businessData?.appointments) || [];
  const verifyAppointment = useBusinessStore((s) => s.verifyAppointment);
  const confirmTrustAppointment = useBusinessStore((s) => s.confirmTrustAppointment);
  const cancelAppointment = useBusinessStore((s) => s.cancelAppointment);

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const today = useMemo(() => todayJalaali(), []);
  const todayNumber = jalaaliToNumber(today);
  const threeMonthsAgoNumber = useMemo(
    () => jalaaliToNumber(subtractJalaaliMonths(today, 3)),
    [today]
  );

  // ═══════ دریافت نوبت‌ها از API ═══════
  useEffect(() => {
    const fetchAppointments = async () => {
      if (USE_MOCK) return;
      setIsLoading(true);
      setError(null);
      try {
        const result = await appointmentsService.getBusinessAppointments({
          status: activeFilter !== 'all' ? activeFilter : undefined,
          search: searchQuery || undefined,
          date_filter: dateFilter || undefined,
        });
        // در آینده: آپدیت store با داده‌های API
      } catch (err) {
        setError(err.message);
        showToast('خطا در دریافت نوبت‌ها', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, [activeFilter, searchQuery, dateFilter]);

  // ═══════ فیلتر + جستجو ═══════
  const filteredAppointments = useMemo(() => {
    let result = appointments.filter((apt) => {
      if (!apt.date) return false;
      return jalaaliToNumber(apt.date) >= threeMonthsAgoNumber;
    });

    if (activeFilter !== 'all') {
      if (activeFilter === 'cancelled') {
        result = result.filter((a) => a.status === 'cancelled_by_salon');
      } else if (activeFilter === 'needs_code') {
        result = result.filter((a) => a.status === 'reserved' && !a.trustBased);
      } else if (activeFilter === 'trust_based') {
        result = result.filter((a) => a.status === 'reserved' && a.trustBased);
      } else {
        result = result.filter((a) => a.status === activeFilter);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (a) =>
          (a.customerName || '').toLowerCase().includes(q) ||
          (a.serviceName || '').toLowerCase().includes(q) ||
          (a.customerPhone || '').includes(q)
      );
    }

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
  }, [appointments, activeFilter, searchQuery, dateFilter, today, threeMonthsAgoNumber]);

  // ═══════ آمار ═══════
  const counts = useMemo(() => {
    const base = appointments.filter((apt) => {
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
  }, [appointments, threeMonthsAgoNumber]);

  // ═══════ اکشن‌ها ═══════
  const handleVerify = useCallback(
    async (appointmentId, code) => {
      if (!USE_MOCK) {
        try {
          await appointmentsService.verifyServiceCode(appointmentId, code);
        } catch (err) {
          showToast(err.message || 'خطا در تایید کد', 'error');
          return false;
        }
      }
      verifyAppointment(appointmentId);
      showToast('✓ کد تایید شد • بیعانه به حساب شما واریز می‌شود', 'success');
      return true;
    },
    [verifyAppointment, showToast]
  );

  const handleTrustConfirm = useCallback(
    async (appointmentId) => {
      if (!USE_MOCK) {
        try {
          await appointmentsService.verifyServiceCode(appointmentId, '0000');
        } catch (err) {
          showToast(err.message || 'خطا در تایید', 'error');
          return false;
        }
      }
      confirmTrustAppointment(appointmentId);
      showToast('✓ خدمت تایید شد (بدون نیاز به کد) • بیعانه آزاد شد', 'success');
      return true;
    },
    [confirmTrustAppointment, showToast]
  );

  const handleCancel = useCallback(
    async (appointmentId, reason) => {
      if (!USE_MOCK) {
        try {
          await appointmentsService.cancelByBusiness(appointmentId, reason);
        } catch (err) {
          showToast(err.message || 'خطا در لغو نوبت', 'error');
          return false;
        }
      }
      cancelAppointment(appointmentId, reason);
      showToast('نوبت لغو شد • بیعانه به مشتری مسترد می‌شود', 'info');
      return true;
    },
    [cancelAppointment, showToast]
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
