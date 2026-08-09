// src/hooks/useAppointmentsManager.js
'use client';
import { useState, useMemo, useCallback } from 'react';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useToast } from '@/hooks/useToast';
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

  const today = useMemo(() => todayJalaali(), []);
  const todayNumber = jalaaliToNumber(today);
  const todayDate = useMemo(() => {
    const d = jalaaliToDate(today);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [today]);

  const threeMonthsAgoNumber = useMemo(
    () => jalaaliToNumber(subtractJalaaliMonths(today, 3)),
    [today]
  );

  // ═══════ فیلتر + جستجو ═══════
  const filteredAppointments = useMemo(() => {
    let result = appointments.filter((apt) => {
      if (!apt.date) return false;
      return jalaaliToNumber(apt.date) >= threeMonthsAgoNumber;
    });

    // فیلتر وضعیت
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

    // جستجو
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
  }, [appointments, activeFilter, searchQuery, dateFilter, today, todayDate, threeMonthsAgoNumber]);

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

  // تایید با کد (نوبت معمولی)
  const handleVerify = useCallback(
    (appointmentId) => {
      verifyAppointment(appointmentId);
      showToast('✓ کد تایید شد • بیعانه به حساب شما واریز می‌شود', 'success');
    },
    [verifyAppointment, showToast]
  );

  // تایید بدون کد (نوبت اعتمادی)
  const handleTrustConfirm = useCallback(
    (appointmentId) => {
      confirmTrustAppointment(appointmentId);
      showToast('✓ خدمت تایید شد (بدون نیاز به کد) • بیعانه آزاد شد', 'success');
    },
    [confirmTrustAppointment, showToast]
  );

  // لغو نوبت
  const handleCancel = useCallback(
    (appointmentId, reason) => {
      cancelAppointment(appointmentId, reason);
      showToast('نوبت لغو شد • بیعانه به مشتری مسترد می‌شود', 'info');
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
  };
};
