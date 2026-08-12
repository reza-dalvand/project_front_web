// src/components/home/NotificationModal.jsx
'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  FiX,
  FiBell,
  FiCalendar,
  FiTag,
  FiInfo,
  FiStar,
  FiRotateCcw,
  FiCheck,
  FiTrash2,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';
import { notificationsService } from '@/api';
import { USE_MOCK } from '@/api/config';
import { MOCK_NOTIFICATIONS } from '@/data/notifications';

// ═══════ نگاشت نوع اعلان به آیکون و رنگ ═══════
const NOTIFICATION_TYPE_META = {
  booking_confirmed: { icon: FiCalendar, color: '#2196F3', label: 'تایید رزرو' },
  booking_reminder: { icon: FiBell, color: '#FF9800', label: 'یادآوری نوبت' },
  booking_cancelled: { icon: FiX, color: '#E53935', label: 'لغو نوبت' },
  booking_done: { icon: FiCheck, color: '#43A047', label: 'انجام خدمت' },
  payment_success: { icon: FiCheck, color: '#43A047', label: 'پرداخت موفق' },
  payment_refunded: { icon: FiRotateCcw, color: '#1E88E5', label: 'استرداد وجه' },
  settlement_completed: { icon: FiCheck, color: '#4CAF50', label: 'تسویه تکمیل شد' },
  new_review: { icon: FiStar, color: '#FFC107', label: 'نظر جدید' },
  business_approved: { icon: FiCheck, color: '#43A047', label: 'تایید کسب‌وکار' },
  business_rejected: { icon: FiX, color: '#E53935', label: 'رد کسب‌وکار' },
  system: { icon: FiInfo, color: '#9C27B0', label: 'سیستمی' },
  promo: { icon: FiTag, color: '#FF5722', label: 'تبلیغاتی' },
  // سازگاری با فرمت قدیمی MOCK
  booking: { icon: FiCalendar, color: '#2196F3', label: 'رزرو' },
  discount: { icon: FiTag, color: '#4CAF50', label: 'تخفیف' },
  reminder: { icon: FiBell, color: '#FF9800', label: 'یادآوری' },
  review: { icon: FiStar, color: '#FFC107', label: 'نظر' },
  refund: { icon: FiRotateCcw, color: '#1E88E5', label: 'استرداد' },
};

const getNotificationMeta = (type) => NOTIFICATION_TYPE_META[type] || NOTIFICATION_TYPE_META.system;

export default function NotificationModal({ visible, onClose }) {
  const { colors } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const instanceId = useRef('notification-modal');

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead && !n.is_read).length,
    [notifications]
  );

  // ═══════ دریافت اعلان‌ها از API ═══════
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      if (USE_MOCK) {
        setNotifications(MOCK_NOTIFICATIONS);
      } else {
        const result = await notificationsService.getNotifications();
        setNotifications(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      releaseScrollLock(instanceId.current);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      fetchNotifications();
      acquireScrollLock(instanceId.current);
    } else {
      releaseScrollLock(instanceId.current);
    }
    return () => releaseScrollLock(instanceId.current);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  // ═══════ خواندن همه ═══════
  const markAllAsRead = async () => {
    try {
      if (!USE_MOCK) {
        await notificationsService.markAsRead([]);
      }
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, is_read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  // ═══════ خواندن یک اعلان ═══════
  const markAsRead = async (id) => {
    try {
      if (!USE_MOCK) {
        await notificationsService.markAsRead([id]);
      }
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true, is_read: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  // ═══════ حذف یک اعلان ═══════
  const deleteNotification = async (id) => {
    try {
      if (!USE_MOCK) {
        await notificationsService.deleteNotification(id);
      }
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  // ═══════ حذف همه خوانده‌شده‌ها ═══════
  const deleteAllRead = async () => {
    try {
      if (!USE_MOCK) {
        await notificationsService.deleteAll();
      }
      setNotifications((prev) => prev.filter((n) => !n.isRead && !n.is_read));
    } catch (error) {
      console.error('Failed to delete all read:', error);
    }
  };

  if (!mounted || !visible) return null;

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md max-h-[85vh] rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden"
        style={{ backgroundColor: colors.cardBackground }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-11 h-11 rounded-[14px] flex items-center justify-center"
              style={{ backgroundColor: colors.primary + '15' }}
            >
              <FiBell size={22} style={{ color: colors.primary }} />
            </div>
            <div>
              <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                اعلان‌ها
              </h3>
              {unreadCount > 0 && (
                <p className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
                  {unreadCount} اعلان خوانده نشده
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={20} style={{ color: colors.textMain }} />
          </button>
        </div>

        {/* دکمه‌های عملیات */}
        {(unreadCount > 0 || notifications.length > 0) && (
          <div
            className="flex items-center justify-between px-5 py-2.5 border-b"
            style={{ borderColor: colors.border }}
          >
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 text-xs font-[Vazir-Bold]"
                style={{ color: colors.primary }}
              >
                <FiCheck size={14} />
                خواندن همه
              </button>
            )}
            {notifications.some((n) => n.isRead || n.is_read) && (
              <button
                onClick={deleteAllRead}
                className="flex items-center gap-1.5 text-xs font-[Vazir-Bold]"
                style={{ color: '#E53935' }}
              >
                <FiTrash2 size={14} />
                حذف خوانده‌شده‌ها
              </button>
            )}
          </div>
        )}

        {/* لیست اعلان‌ها */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div
                className="w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin"
                style={{ color: colors.primary }}
              />
            </div>
          ) : notifications.length === 0 ? (
            <EmptyState
              icon="🔔"
              title="اعلانی وجود ندارد"
              description="اعلان‌های جدید اینجا نمایش داده می‌شوند"
            />
          ) : (
            notifications.map((notification) => {
              const meta = getNotificationMeta(notification.type);
              const Icon = meta.icon;
              const isRead = notification.isRead || notification.is_read;
              return (
                <div
                  key={notification.id}
                  className="flex gap-3 p-3 rounded-2xl border transition-all cursor-pointer"
                  style={{
                    backgroundColor: isRead ? colors.background : meta.color + '08',
                    borderColor: isRead ? colors.border : meta.color + '30',
                  }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: meta.color + '18' }}
                  >
                    <Icon size={18} color={meta.color} />
                  </div>
                  <div className="flex-1 min-w-0 gap-1">
                    <div className="flex items-center gap-2">
                      <p
                        className="text-[13px] flex-1 truncate"
                        style={{
                          color: colors.textMain,
                          fontFamily: isRead ? 'Vazir' : 'Vazir-Bold',
                        }}
                      >
                        {notification.title}
                      </p>
                      {!isRead && (
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: meta.color }}
                        />
                      )}
                    </div>
                    <p
                      className="text-[11px] font-[Vazir] leading-[17px] line-clamp-2"
                      style={{ color: colors.textSecondary }}
                    >
                      {notification.body || notification.message}
                    </p>
                    <p
                      className="text-[10px] font-[Vazir]"
                      style={{ color: colors.textSecondary + '90' }}
                    >
                      {notification.time || notification.created_at}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 self-start"
                    style={{ backgroundColor: colors.background }}
                  >
                    <FiX size={14} style={{ color: colors.textSecondary }} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* فوتر */}
        <div className="px-5 py-3 border-t" style={{ borderColor: colors.border }}>
          <Button title="بستن" onPress={onClose} variant="outline" size="lg" fullWidth />
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
