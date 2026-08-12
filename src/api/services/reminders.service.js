// src/api/services/reminders.service.js
/**
 * 🔔 Reminders Service
 *
 * مدیریت یادآوری‌های تمدید خدمت:
 * - لیست یادآوری‌ها برای کسب‌وکار
 * - لیست یادآوری‌ها برای مشتری
 */
import apiClient from '../api-client';

export const remindersService = {
  /**
   * لیست یادآوری‌های تمدید برای کسب‌وکار
   * GET /reminders/
   */
  getBusinessReminders: (params = {}) => {
    return apiClient.get('/reminders/', { params });
  },

  /**
   * لیست یادآوری‌های تمدید برای مشتری
   * GET /reminders/my-reminders/
   */
  getMyReminders: () => {
    return apiClient.get('/reminders/my-reminders/');
  },
};
