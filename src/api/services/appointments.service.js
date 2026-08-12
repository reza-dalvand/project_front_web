// src/api/services/appointments.service.js
/**
 * 📅 Appointments Service
 *
 * مدیریت نوبت‌ها:
 * - ایجاد نوبت
 * - لیست نوبت‌های مشتری و کسب‌وکار
 * - جزئیات نوبت
 * - لغو نوبت
 * - تایید کد خدمت
 * - آمار نوبت‌ها
 */
import apiClient from '../api-client';

export const appointmentsService = {
  // ═══════════ Booking ═══════════

  /**
   * ایجاد نوبت جدید
   * POST /appointments/create/
   *
   * @param {object} data - { service_id, jy, jm, jd, time_slot }
   */
  createAppointment: (data) => {
    return apiClient.post('/appointments/create/', data);
  },

  /**
   * لیست نوبت‌های مشتری
   * GET /appointments/my-appointments/?status=upcoming|past|all
   */
  getMyAppointments: (status = 'all') => {
    return apiClient.get('/appointments/my-appointments/', { params: { status } });
  },

  /**
   * لیست نوبت‌های کسب‌وکار
   * GET /appointments/business-appointments/
   */
  getBusinessAppointments: (params = {}) => {
    return apiClient.get('/appointments/business-appointments/', { params });
  },

  /**
   * آمار نوبت‌های کسب‌وکار
   * GET /appointments/business-stats/
   */
  getBusinessStats: () => {
    return apiClient.get('/appointments/business-stats/');
  },

  /**
   * جزئیات نوبت
   * GET /appointments/{pk}/
   */
  getAppointmentDetail: (appointmentId) => {
    return apiClient.get(`/appointments/${appointmentId}/`);
  },

  // ═══════════ Customer Actions ═══════════

  /**
   * لغو نوبت توسط مشتری
   * POST /appointments/{pk}/cancel/
   */
  cancelAppointment: (appointmentId, reasonText = '') => {
    return apiClient.post(`/appointments/${appointmentId}/cancel/`, {
      reason_text: reasonText,
    });
  },

  /**
   * تولید مجدد کد تایید
   * POST /appointments/{pk}/regenerate-code/
   */
  regenerateCode: (appointmentId) => {
    return apiClient.post(`/appointments/${appointmentId}/regenerate-code/`);
  },

  // ═══════════ Business Actions ═══════════

  /**
   * لغو نوبت توسط کسب‌وکار
   * POST /appointments/{pk}/cancel-by-business/
   */
  cancelByBusiness: (appointmentId, reasonText = '') => {
    return apiClient.post(`/appointments/${appointmentId}/cancel-by-business/`, {
      reason_text: reasonText,
    });
  },

  /**
   * تایید کد خدمت
   * POST /appointments/{pk}/verify-code/
   */
  verifyServiceCode: (appointmentId, code) => {
    return apiClient.post(`/appointments/${appointmentId}/verify-code/`, { code });
  },
};
