// src/api/services/schedules.service.js
/**
 * 🕐 Schedules Service
 *
 * مدیریت زمان‌بندی خدمات:
 * - لیست زمان‌بندی‌ها
 * - جزئیات زمان‌بندی
 * - دریافت بر اساس تاریخ جلالی
 */
import apiClient from '../api-client';

export const schedulesService = {
  /**
   * لیست زمان‌بندی‌ها
   * GET /schedules/
   */
  getSchedules: (params = {}) => {
    return apiClient.get('/schedules/', { params });
  },

  /**
   * جزئیات یک زمان‌بندی
   * GET /schedules/{pk}/
   */
  getScheduleDetail: (scheduleId) => {
    return apiClient.get(`/schedules/${scheduleId}/`);
  },

  /**
   * دریافت زمان‌بندی بر اساس تاریخ جلالی
   * GET /schedules/by-date/?jy=1405&jm=4&jd=22
   */
  getSchedulesByDate: (jy, jm, jd, serviceId = null) => {
    const params = { jy, jm, jd };
    if (serviceId) params.service_id = serviceId;
    return apiClient.get('/schedules/by-date/', { params });
  },

  /**
   * ایجاد زمان‌بندی جدید
   * POST /schedules/
   */
  createSchedule: (data) => {
    return apiClient.post('/schedules/', data);
  },

  /**
   * بروزرسانی زمان‌بندی
   * PUT /schedules/{pk}/
   */
  updateSchedule: (scheduleId, data) => {
    return apiClient.put(`/schedules/${scheduleId}/`, data);
  },

  /**
   * حذف زمان‌بندی
   * DELETE /schedules/{pk}/
   */
  deleteSchedule: (scheduleId) => {
    return apiClient.delete(`/schedules/${scheduleId}/`);
  },
};
