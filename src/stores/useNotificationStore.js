// src/stores/useNotificationStore.js
/**
 * Store اعلان‌ها
 *
 * هماهنگ با بک‌اند:
 * - لیست اعلان‌ها
 * - تعداد خوانده‌نشده‌ها
 * - علامت‌گذاری خوانده‌شده
 * - حذف اعلان
 */
import { create } from 'zustand';
import { notificationsService } from '@/api';

export const useNotificationStore = create((set, get) => ({
  // ─── State ───
  notifications: [],
  unreadCount: 0,
  totalCount: 0,
  isLoading: false,
  error: null,

  // ─── Actions ───
  /**
   * دریافت لیست اعلان‌ها از API
   * @param {object} params - { is_read, type }
   */
  fetchNotifications: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const result = await notificationsService.getNotifications(params);
      set({
        notifications: result.data || [],
        isLoading: false,
      });
    } catch (error) {
      console.error('Fetch notifications failed:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  /**
   * دریافت تعداد اعلان‌های خوانده‌نشده
   */
  fetchUnreadCount: async () => {
    try {
      const result = await notificationsService.getNotificationsCount();
      set({
        unreadCount: result.data.unread || 0,
        totalCount: result.data.total || 0,
      });
    } catch (error) {
      console.error('Fetch unread count failed:', error);
    }
  },

  /**
   * علامت‌گذاری اعلان‌ها به عنوان خوانده‌شده
   * @param {number[]} notificationIds - لیست شناسه‌ها (خالی = همه)
   */
  markAsRead: async (notificationIds = []) => {
    try {
      const result = await notificationsService.markAsRead(notificationIds);

      // بروزرسانی محلی
      set((state) => ({
        notifications: state.notifications.map((n) =>
          notificationIds.length === 0 || notificationIds.includes(n.id)
            ? { ...n, isRead: true } // ✅ فاز ۳: isRead (نه is_read)
            : n
        ),
        unreadCount: Math.max(0, state.unreadCount - (notificationIds.length || state.unreadCount)),
      }));
    } catch (error) {
      console.error('Mark as read failed:', error);
      throw error;
    }
  },

  /**
   * حذف یک اعلان
   * @param {number} notificationId
   */
  deleteNotification: async (notificationId) => {
    try {
      await notificationsService.deleteNotification(notificationId);

      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== notificationId),
        totalCount: Math.max(0, state.totalCount - 1),
      }));
    } catch (error) {
      console.error('Delete notification failed:', error);
      throw error;
    }
  },

  /**
   * حذف همه اعلان‌های خوانده‌شده
   */
  deleteAllRead: async () => {
    try {
      const result = await notificationsService.deleteAll();
      set((state) => ({
        notifications: state.notifications.filter((n) => !n.isRead), // ✅ فاز ۳
        totalCount: Math.max(0, state.totalCount - (result.data?.deletedCount || 0)), // ✅ فاز ۳
      }));
    } catch (error) {
      console.error('Delete all read failed:', error);
      throw error;
    }
  },

  /**
   * پاک کردن state (خروج از حساب)
   */
  clearNotifications: () => {
    set({
      notifications: [],
      unreadCount: 0,
      totalCount: 0,
    });
  },
}));
