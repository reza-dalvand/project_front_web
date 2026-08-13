// src/api/services/appointments.service.js
/**
 * 📅 Appointments Service — هماهنگ با بک‌اند
 *
 * Endpoints:
 *   POST   /appointments/create/                → ایجاد نوبت
 *   GET    /appointments/my-appointments/       → نوبت‌های مشتری
 *   GET    /appointments/business-appointments/ → نوبت‌های کسب‌وکار
 *   GET    /appointments/business-stats/        → آمار نوبت‌ها
 *   GET    /appointments/{pk}/                  → جزئیات نوبت
 *   POST   /appointments/{pk}/cancel/           → لغو توسط مشتری
 *   POST   /appointments/{pk}/cancel-by-business/ → لغو توسط سالن
 *   POST   /appointments/{pk}/verify-code/      → تایید کد خدمت
 *   POST   /appointments/{pk}/regenerate-code/  → تولید مجدد کد
 */
import apiClient from '../api-client';

export const appointmentsService = {
  /**
   * ایجاد نوبت جدید
   * POST /appointments/create/
   *
   * Payload (هماهنگ با AppointmentCreateSerializer):
   * {
   *   service_id: number,
   *   jy: number,        // سال جلالی
   *   jm: number,        // ماه جلالی (1-12)
   *   jd: number,        // روز جلالی (1-31)
   *   time_slot: string, // "HH:MM"
   * }
   *
   * Response (AppointmentDetailSerializer):
   * {
   *   id, jy, jm, jd, date_key, time_slot,
   *   status, status_display,
   *   service_name, business_name, business_logo,
   *   customer_name, customer_phone,
   *   total_price, deposit_amount, deposit_paid, remaining_amount,
   *   verification_code, trust_based, is_verified,
   *   hours_left, is_upcoming, can_cancel,
   *   created_at
   * }
   */
  createAppointment: (data) => {
    return apiClient.post('/appointments/create/', data);
  },

  /**
   * لیست نوبت‌های مشتری
   * GET /appointments/my-appointments/?status=upcoming|past|all
   */
  getMyAppointments: (status = 'all') => {
    return apiClient.get('/appointments/my-appointments/', {
      params: { status },
    });
  },

  /**
   * لیست نوبت‌های کسب‌وکار
   * GET /appointments/business-appointments/
   *
   * Params:
   *   status: all|reserved|cancelled|done
   *   search: string
   *   date_filter: today|week|month|all
   *   date_from: "1405/04/01"
   *   date_to: "1405/04/31"
   */
  getBusinessAppointments: (params = {}) => {
    return apiClient.get('/appointments/business-appointments/', { params });
  },

  /**
   * آمار نوبت‌های کسب‌وکار
   * GET /appointments/business-stats/
   *
   * Response: { total, reserved, done, cancelled, today }
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

  /**
   * لغو نوبت توسط مشتری
   * POST /appointments/{pk}/cancel/
   *
   * Payload: { reason_text: string }
   */
  cancelAppointment: (appointmentId, reasonText = '') => {
    return apiClient.post(`/appointments/${appointmentId}/cancel/`, {
      reason_text: reasonText,
    });
  },

  /**
   * لغو نوبت توسط کسب‌وکار
   * POST /appointments/{pk}/cancel-by-business/
   *
   * Payload: { reason_text: string }
   */
  cancelByBusiness: (appointmentId, reasonText = '') => {
    return apiClient.post(`/appointments/${appointmentId}/cancel-by-business/`, {
      reason_text: reasonText,
    });
  },

  /**
   * تایید کد خدمت (توسط سالن‌دار)
   * POST /appointments/{pk}/verify-code/
   *
   * Payload: { code: "1234" }
   */
  verifyServiceCode: (appointmentId, code) => {
    return apiClient.post(`/appointments/${appointmentId}/verify-code/`, { code });
  },

  /**
   * تولید مجدد کد تایید
   * POST /appointments/{pk}/regenerate-code/
   */
  regenerateCode: (appointmentId) => {
    return apiClient.post(`/appointments/${appointmentId}/regenerate-code/`);
  },
};
