// src/hooks/useAppointmentsManager.js
'use client';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import { appointmentsService } from '@/api';
import {
  todayJalaali,
  jalaaliToNumber,
  jalaaliToDate,
  subtractJalaaliMonths,
  isSameJalaaliDay,
} from '@/utils/dateUtils';

// ✅ FIX باگ ۸ و ۱۲: نگاشت ایمن و دقیق تاریخ و فیلدها
const mapAppointmentFromApi = (apt) => {
  const jy = apt.jy ?? apt.year;
  const jm = apt.jm ?? apt.month;
  const jd = apt.jd ?? apt.day;

  return {
    id: apt.id,
    customerName: apt.customerName || apt.customer_name || '',
    customerPhone: apt.customerPhone || apt.customer_phone || '',
    serviceName: apt.serviceName || apt.service_name || '',
    date: (jy !== undefined && jm !== undefined && jd !== undefined) ? { jy, jm, jd } : null,
    dateKey: apt.dateKey || apt.date_key || '',
    time: apt.timeSlot || apt.time_slot || '',
    timeSlot: apt.timeSlot || apt.time_slot || '',
    status: apt.status || '',
    price: apt.totalPrice || apt.total_price || 0,
    depositPaid: apt.depositPaid || apt.deposit_paid || 0,
    depositAmount: apt.depositAmount || apt.deposit_amount || 0,
    verificationCode: apt.verificationCode || apt.verification_code || null,
    trustBased: apt.trustBased ?? apt.trust_based ?? false,
    isVerified: apt.isVerified ?? apt.is_verified ?? false,
    isUpcoming: apt.isUpcoming ?? apt.is_upcoming ?? false,
    canCancel: apt.canCancel ?? apt.can_cancel ?? false,
    cancellationReason: apt.cancellationReason || apt.cancellation_reason || '',
  };
};

export const useAppointmentsManager = () => {
  const { showToast } = useToast();

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appointmentsList, setAppointmentsList] = useState([]);

  const today = useMemo(() => todayJalaali(), []);
  const threeMonthsAgoNumber = useMemo(
    () => jalaaliToNumber(subtractJalaaliMonths(today, 3)),
    [today]
  );

  useEffect(() => {
    let cancelled = false;
    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = {};
        if (activeFilter !== 'all') {
          if (activeFilter === 'cancelled') params.status = 'cancelled';
          else if (activeFilter === 'done') params.status = 'done';
          else if (['reserved', 'needs_code', 'trust_based'].includes(activeFilter)) params.status = 'reserved';
          else params.status = activeFilter;
        }
        if (searchQuery) params.search = searchQuery;
        if (dateFilter) params.date_filter = dateFilter;

        const result = await appointmentsService.getBusinessAppointments(params);
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
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchAppointments();
    return () => { cancelled = true; };
  }, [activeFilter, searchQuery, dateFilter, showToast]);

  const filteredAppointments = useMemo(() => {
    let result = appointmentsList.filter((apt) => {
      if (!apt.date) return false;
      return jalaaliToNumber(apt.date) >= threeMonthsAgoNumber;
    });

    if (activeFilter !== 'all') {
      if (activeFilter === 'cancelled') {
        result = result.filter((a) => ['cancelled_by_salon', 'cancelled_by_customer', 'cancelled'].includes(a.status));
      } else if (activeFilter === 'needs_code') {
        result = result.filter((a) => a.status === 'reserved' && !a.trustBased && !a.isVerified);
      } else if (activeFilter === 'trust_based') {
        result = result.filter((a) => a.status === 'reserved' && a.trustBased);
      } else if (activeFilter === 'reserved') {
        result = result.filter((a) => a.status === 'reserved');
      } else if (activeFilter === 'done') {
        result = result.filter((a) => a.status === 'done');
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
  }, [appointmentsList, activeFilter, searchQuery, dateFilter, today, threeMonthsAgoNumber]);

  const counts = useMemo(() => {
    const base = appointmentsList.filter((apt) => apt.date && jalaaliToNumber(apt.date) >= threeMonthsAgoNumber);
    return {
      all: base.length,
      reserved: base.filter((a) => a.status === 'reserved').length,
      needs_code: base.filter((a) => a.status === 'reserved' && !a.trustBased && !a.isVerified).length,
      trust_based: base.filter((a) => a.status === 'reserved' && a.trustBased).length,
      done: base.filter((a) => a.status === 'done').length,
      cancelled: base.filter((a) => ['cancelled_by_salon', 'cancelled_by_customer', 'cancelled'].includes(a.status)).length,
    };
  }, [appointmentsList, threeMonthsAgoNumber]);

  const handleVerify = useCallback(async (appointmentId, code) => {
    try {
      await appointmentsService.verifyServiceCode(appointmentId, code);
      showToast('✓ کد تایید شد • بیعانه به حساب شما واریز می‌شود', 'success');
      return true;
    } catch (err) {
      showToast(err.message || 'خطا در تایید کد', 'error');
      return false;
    }
  }, [showToast]);

  const handleTrustConfirm = useCallback(async (appointmentId) => {
    try {
      await appointmentsService.verifyServiceCode(appointmentId, '0000');
      showToast('✓ خدمت تایید شد (بدون نیاز به کد) • بیعانه آزاد شد', 'success');
      return true;
    } catch (err) {
      showToast(err.message || 'خطا در تایید', 'error');
      return false;
    }
  }, [showToast]);

  const handleCancel = useCallback(async (appointmentId, reason) => {
    try {
      await appointmentsService.cancelByBusiness(appointmentId, reason);
      showToast('نوبت لغو شد • بیعانه به مشتری مسترد می‌شود', 'info');
      return true;
    } catch (err) {
      showToast(err.message || 'خطا در لغو نوبت', 'error');
      return false;
    }
  }, [showToast]);

  return {
    appointments: filteredAppointments,
    counts,
    activeFilter, setActiveFilter,
    searchQuery, setSearchQuery,
    dateFilter, setDateFilter,
    handleVerify, handleTrustConfirm, handleCancel,
    isLoading, error,
  };
};