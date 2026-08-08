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

/**
 * هوک مدیریت نوبت‌ها
 * تمام منطق فیلتر، جستجو، آمار و اکشن‌ها را یکجا مدیریت می‌کند
 */
export const useAppointmentsManager = () => {
  const { showToast } = useToast();

  // اتصال مستقیم به Store سراسری
  const appointments = useBusinessStore((s) => s.businessData?.appointments) || [];
  const verifyAppointment = useBusinessStore((s) => s.verifyAppointment);
  const cancelAppointment = useBusinessStore((s) => s.cancelAppointment);

  // State‌های فیلتر
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState(null);

  // تاریخ‌های مرجع
  const today = useMemo(() => todayJalaali(), []);
  const todayNumber = jalaaliToNumber(today);

  const todayDate = useMemo(() => {
    const d = jalaaliToDate(today);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [today]);

  // محدودیت: فقط امروز و ۳ ماه گذشته (و آینده) قابل نمایش است
  const threeMonthsAgoNumber = useMemo(
    () => jalaaliToNumber(subtractJalaaliMonths(today, 3)),
    [today]
  );

  // ═══════ فیلتر + جستجو ═══════
  const filteredAppointments = useMemo(() => {
    // گام ۱: حذف نوبت‌های قدیمی‌تر از ۳ ماه
    let result = appointments.filter((apt) => {
      if (!apt.date) return false;
      return jalaaliToNumber(apt.date) >= threeMonthsAgoNumber;
    });

    // گام ۲: فیلتر وضعیت
    if (activeFilter !== 'all') {
      if (activeFilter === 'cancelled') {
        result = result.filter((a) => a.status === 'cancelled_by_salon');
      } else {
        result = result.filter((a) => a.status === activeFilter);
      }
    }

    // گام ۳: جستجو
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (a) =>
          (a.customerName || '').toLowerCase().includes(q) ||
          (a.serviceName || '').toLowerCase().includes(q) ||
          (a.employeeName || '').toLowerCase().includes(q) ||
          (a.customerPhone || '').includes(q)
      );
    }

    // گام ۴: فیلتر تاریخ
    if (dateFilter === 'today') {
      result = result.filter((a) => isSameJalaaliDay(a.date, today));
    } else if (dateFilter === 'week') {
      // از امروز تا ۷ روز بعد
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

  // ═══════ آمار (برای Badge فیلترها) ═══════
  const counts = useMemo(() => {
    const base = appointments.filter((apt) => {
      if (!apt.date) return false;
      return jalaaliToNumber(apt.date) >= threeMonthsAgoNumber;
    });
    return {
      all: base.length,
      reserved: base.filter((a) => a.status === 'reserved').length,
      cancelled: base.filter((a) => a.status === 'cancelled_by_salon').length,
      done: base.filter((a) => a.status === 'done').length,
    };
  }, [appointments, threeMonthsAgoNumber]);

  // ═══════ اکشن‌ها (مستقیم روی Store) ═══════
  const handleVerify = useCallback(
    (appointmentId) => {
      verifyAppointment(appointmentId);
      showToast('✓ خدمت تایید شد • بیعانه به حساب شما واریز می‌شود', 'success');
    },
    [verifyAppointment, showToast]
  );

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
    handleCancel,
  };
};
