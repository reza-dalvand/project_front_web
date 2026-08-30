// src/components/booking/hooks/useBookingData.js
'use client';
import { useCallback } from 'react';
import { appointmentsService, schedulesService } from '@/api';
import { useToast } from '@/hooks/useToast';

/**
 * Hook برای مدیریت داده‌های رزرو (تاریخ‌ها و ساعات آزاد)
 * @param {string} businessId - شناسه کسب‌وکار
 * @param {number} serviceId - شناسه خدمت
 * @returns {Object} آبجکت شامل داده‌ها و متدهای fetch
 */
export function useBookingData(businessId, serviceId) {
  const { showToast } = useToast();

  const fetchAvailableDates = useCallback(async () => {
    if (!businessId || !serviceId) return [];

    try {
      const result = await schedulesService.getAvailableDates(businessId, serviceId, 30);
      return result.data || [];
    } catch (err) {
      console.error('Failed to fetch available dates:', err);
      return [];
    }
  }, [businessId, serviceId]);

  const fetchAvailableSlots = useCallback(
    async (date) => {
      if (!businessId || !serviceId || !date) return [];

      try {
        const result = await schedulesService.getAvailableSlots(
          businessId,
          serviceId,
          date.jy,
          date.jm,
          date.jd
        );
        return result.data || [];
      } catch (err) {
        console.error('Failed to fetch slots:', err);
        showToast('خطا در دریافت ساعات آزاد', 'error');
        return [];
      }
    },
    [businessId, serviceId, showToast]
  );

  const createAppointment = useCallback(async (appointmentData) => {
    try {
      const result = await appointmentsService.createAppointment(appointmentData);
      return { success: true, data: result.data };
    } catch (err) {
      return {
        success: false,
        error: {
          message: err.message || 'ارتباط با درگاه پرداخت برقرار نشد',
          code: err.code || 'UNKNOWN',
          trackingCode: err.details?.tracking_code || err.details?.trackingCode || null,
        },
      };
    }
  }, []);

  return {
    fetchAvailableDates,
    fetchAvailableSlots,
    createAppointment,
  };
}
