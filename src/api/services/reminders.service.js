// src/api/services/reminders.service.js
/**
 * 🔔 Reminders Service — هماهنگ کامل با بک‌اند
 *
 * Endpoints:
 *   GET  /reminders/              → یادآوری‌های کسب‌وکار
 *   GET  /reminders/my-reminders/ → یادآوری‌های مشتری
 *   POST /reminders/send/         → ارسال یادآوری
 *
 * قوانین بک‌اند:
 *   - هر مشتری فقط یک بار پیام دریافت می‌کند
 *   - پس از ارسال، تا زمانی که مشتری نوبت جدیدی رزرو نکند، امکان ارسال مجدد نیست
 *   - اگر مشتری نوبت جدید رزرو کند، has_new_booking_after_send = true
 */
import apiClient from '../api-client';

export const remindersService = {
  /**
   * لیست یادآوری‌های تمدید برای کسب‌وکار
   * GET /reminders/
   *
   * Response: RenewalReminderSerializer[]
   *   { id, business, business_name, customer, customer_name,
   *     customer_phone, service, service_name,
   *     last_service_date, due_date, days_remaining,
   *     reminder_sent, sent_date, has_new_booking_after_send }
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

  /**
   * ارسال یادآوری تمدید به مشتریان
   * POST /reminders/send/
   *
   * @param {number[]} reminderIds - لیست شناسه یادآوری‌ها
   *
   * ⚠️ قوانین:
   *   - حداکثر ۵۰ یادآوری در هر ارسال
   *   - هر مشتری فقط یک بار پیام دریافت می‌کند
   *   - پس از ارسال، تا زمانی که مشتری نوبت جدیدی رزرو نکند، امکان ارسال مجدد نیست
   *
   * Response:
   * {
   *   sent_count: number,
   *   skipped_count: number,
   *   message: string
   * }
   */
  sendReminders: (reminderIds) => {
    return apiClient.post('/reminders/send/', {
      reminder_ids: reminderIds,
    });
  },
};
