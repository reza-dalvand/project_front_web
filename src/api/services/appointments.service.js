// src/api/services/appointments.service.js
/**
 * 📅 Appointments Service — هماهنگ با بک‌اند
 */
import apiClient from '../api-client';

export const appointmentsService = {
  createAppointment: (data) => {
    return apiClient.post('/appointments/create/', data);
  },

  getMyAppointments: (status = 'all') => {
    return apiClient.get('/appointments/my-appointments/', {
      params: { status },
    });
  },

  getMyAppointmentsStats: () => {
    return apiClient.get('/appointments/my-stats/');
  },

  getBusinessAppointments: (params = {}) => {
    return apiClient.get('/appointments/business-appointments/', { params });
  },

  getBusinessStats: () => {
    return apiClient.get('/appointments/business-stats/');
  },

  getAppointmentDetail: (appointmentId) => {
    return apiClient.get(`/appointments/${appointmentId}/`);
  },

  /**
   * ✅ FIX P0: لغو نوبت توسط مشتری
   * POST /appointments/{pk}/cancel/
   */
  cancelAppointment: (appointmentId, reasonText = '') => {
    return apiClient.post(`/appointments/${appointmentId}/cancel/`, {
      reason_text: reasonText,
    });
  },

  cancelByBusiness: (appointmentId, reasonText = '') => {
    return apiClient.post(`/appointments/${appointmentId}/cancel-by-business/`, {
      reason_text: reasonText,
    });
  },

  verifyServiceCode: (appointmentId, code) => {
    return apiClient.post(`/appointments/${appointmentId}/verify-code/`, { code });
  },

  regenerateCode: (appointmentId) => {
    return apiClient.post(`/appointments/${appointmentId}/regenerate-code/`);
  },
};