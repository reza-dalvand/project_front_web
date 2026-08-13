// src/api/services/schedules.service.js
/**
 * 🕐 Schedules Service — نسخه نهایی هماهنگ با بک‌اند
 *
 * Endpoints:
 *   GET    /schedules/                    → لیست زمان‌بندی‌ها
 *   POST   /schedules/                    → ایجاد زمان‌بندی
 *   GET    /schedules/{pk}/               → جزئیات
 *   PUT    /schedules/{pk}/               → بروزرسانی
 *   PATCH  /schedules/{pk}/               → بروزرسانی جزئی
 *   DELETE /schedules/{pk}/               → حذف
 *   GET    /schedules/by-date/            → بر اساس تاریخ جلالی
 *   GET    /schedules/available-slots/    → اسلات‌های آزاد
 *   GET    /schedules/available-dates/    → روزهای دارای اسلات آزاد
 */
import apiClient from '../api-client';

export const schedulesService = {
  // ═══════════ CRUD ═══════════

  /**
   * لیست زمان‌بندی‌ها
   * GET /schedules/
   * @param {object} params - { service_id }
   */
  getSchedules: (params = {}) => {
    return apiClient.get('/schedules/', { params });
  },

  /**
   * ایجاد زمان‌بندی جدید
   * POST /schedules/
   * @param {object} data
   * {
   *   service: number,         // Service ID
   *   jy: number,              // سال جلالی
   *   jm: number,              // ماه جلالی (1-12)
   *   jd: number,              // روز جلالی (1-31)
   *   work_start: string,      // "09:00"
   *   work_end: string,        // "21:00"
   *   slot_duration: number,   // دقیقه
   *   breaks: [{start: "13:00", end: "14:00"}],
   * }
   */
  createSchedule: (data) => {
    return apiClient.post('/schedules/', data);
  },

  /**
   * جزئیات یک زمان‌بندی
   * GET /schedules/{pk}/
   */
  getScheduleDetail: (scheduleId) => {
    return apiClient.get(`/schedules/${scheduleId}/`);
  },

  /**
   * بروزرسانی زمان‌بندی
   * PUT /schedules/{pk}/
   */
  updateSchedule: (scheduleId, data) => {
    return apiClient.put(`/schedules/${scheduleId}/`, data);
  },

  /**
   * بروزرسانی جزئی
   * PATCH /schedules/{pk}/
   */
  patchSchedule: (scheduleId, data) => {
    return apiClient.patch(`/schedules/${scheduleId}/`, data);
  },

  /**
   * حذف زمان‌بندی
   * DELETE /schedules/{pk}/
   */
  deleteSchedule: (scheduleId) => {
    return apiClient.delete(`/schedules/${scheduleId}/`);
  },

  // ═══════════ Query Endpoints ═══════════

  /**
   * دریافت زمان‌بندی بر اساس تاریخ جلالی
   * GET /schedules/by-date/?jy=1405&jm=4&jd=22&service_id=1
   */
  getSchedulesByDate: (jy, jm, jd, serviceId = null) => {
    const params = { jy, jm, jd };
    if (serviceId) params.service_id = serviceId;
    return apiClient.get('/schedules/by-date/', { params });
  },

  /**
   * 🆕 دریافت اسلات‌های آزاد برای یک تاریخ
   * GET /schedules/available-slots/?business_id=&service_id=&jy=&jm=&jd=
   *
   * Response: [{
   *   id, jy, jm, jd, date_key,
   *   start_time, end_time,
   *   is_available, display_time
   * }]
   */
  getAvailableSlots: (businessId, serviceId, jy, jm, jd) => {
    return apiClient.get('/schedules/available-slots/', {
      params: { business_id: businessId, service_id: serviceId, jy, jm, jd },
    });
  },

  /**
   * 🆕 دریافت روزهای دارای اسلات آزاد
   * GET /schedules/available-dates/?business_id=&service_id=&days_ahead=30
   *
   * Response: [{
   *   jy, jm, jd, date_key,
   *   day_of_week, weekday_name,
   *   available_slots_count,
   *   is_today, is_friday
   * }]
   */
  getAvailableDates: (businessId, serviceId, daysAhead = 30) => {
    return apiClient.get('/schedules/available-dates/', {
      params: { business_id: businessId, service_id: serviceId, days_ahead: daysAhead },
    });
  },
};
