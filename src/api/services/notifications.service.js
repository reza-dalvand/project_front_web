// src/api/services/notifications.service.js
/**
 * 🔔 Notifications Service
 *
 * مدیریت اعلان‌ها:
 * - لیست اعلان‌ها
 * - تعداد اعلان‌های خوانده‌نشده
 * - علامت‌گذاری خوانده‌شده
 * - حذف اعلان‌ها
 */
import apiClient from '../api-client';

export const notificationsService = {
  /**
   * لیست اعلان‌ها
   * GET /notifications/?is_read=true|false&type=...
   */
  getNotifications: (params = {}) => {
    return apiClient.get('/notifications/', { params });
  },

  /**
   * تعداد اعلان‌ها
   * GET /notifications/count/
   */
  getNotificationsCount: () => {
    return apiClient.get('/notifications/count/');
  },

  /**
   * علامت‌گذاری به عنوان خوانده‌شده
   * POST /notifications/mark-read/
   *
   * @param {number[]} notificationIds - لیست شناسه‌ها (خالی = همه)
   */
  markAsRead: (notificationIds = []) => {
    return apiClient.post('/notifications/mark-read/', { notification_ids: notificationIds });
  },

  /**
   * حذف همه اعلان‌های خوانده‌شده
   * DELETE /notifications/delete-all/
   */
  deleteAll: () => {
    return apiClient.delete('/notifications/delete-all/');
  },

  /**
   * حذف یک اعلان
   * DELETE /notifications/{pk}/
   */
  deleteNotification: (notificationId) => {
    return apiClient.delete(`/notifications/${notificationId}/`);
  },
};
