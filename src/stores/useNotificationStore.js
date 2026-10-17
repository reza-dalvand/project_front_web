// src/stores/useNotificationStore.js
/**
 * Store اعلان‌ها
 *
 * هماهنگ با بک‌اند:
 * - لیست اعلان‌ها
 * - تعداد خوانده‌نشده‌ها
 * - علامت‌گذاری خوانده‌شده
 * - حذف اعلان
 *
 * ✅ FIX دسته ۴:
 * - محاسبه دقیق unreadCount هنگام markAsRead جزئی
 * - محاسبه دقیق totalCount در deleteAllRead
 * - جلوگیری از منفی شدن شمارنده‌ها
 */
import { create } from 'zustand';
import { notificationsService } from '@/api';

export const useNotificationStore = create((set, get) => ({
  // ─── State ──
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
      await notificationsService.markAsRead(notificationIds);

      set((state) => {
        const ids =
          notificationIds.length > 0 ? new Set(notificationIds) : null;

        let changedCount = 0;

        const notifications = state.notifications.map((n) => {
          const shouldMark = !ids || ids.has(n.id);

          if (shouldMark && !n.isRead) {
            changedCount += 1;
            return { ...n, isRead: true };
          }

          return n;
        });

        return {
          notifications,
          unreadCount: Math.max(0, state.unreadCount - changedCount),
        };
      });
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

      set((state) => {
        const removedLocally = state.notifications.filter((n) => n.isRead).length;

        const deletedCount = Number(
          result?.data?.deletedCount ??
            result?.data?.deleted_count ??
            removedLocally
        ) || removedLocally;

        return {
          notifications: state.notifications.filter((n) => !n.isRead),
          totalCount: Math.max(0, state.totalCount - deletedCount),
        };
      });
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