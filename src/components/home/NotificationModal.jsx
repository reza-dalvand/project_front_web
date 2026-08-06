'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiBell, FiCalendar, FiTag, FiInfo, FiStar, FiRotateCcw } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

const NOTIFICATION_ICONS = {
  booking: FiCalendar,
  discount: FiTag,
  reminder: FiBell,
  system: FiInfo,
  review: FiStar,
  refund: FiRotateCcw,
};

const MOCK_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'booking',
    color: '#2196F3',
    title: 'رزرو شما تایید شد',
    message: 'رزرو فیشیال تخصصی شما در سالن نیلارام با موفقیت تایید شد. کد تایید: ۵۸۹۲',
    time: '۵ دقیقه پیش',
    isRead: false,
  },
  {
    id: 'n2',
    type: 'discount',
    color: '#4CAF50',
    title: 'تخفیف ویژه برای شما!',
    message: '۳۰٪ تخفیف روی خدمات لیزر در مرکز رویال فقط تا فردا.',
    time: '۱ ساعت پیش',
    isRead: false,
  },
  {
    id: 'n3',
    type: 'reminder',
    color: '#FF9800',
    title: 'یادآوری نوبت فردا',
    message: 'فردا ساعت ۱۰:۳۰ نوبت کاشت ناخن در سالن افرا دارید.',
    time: '۳ ساعت پیش',
    isRead: false,
  },
  {
    id: 'n4',
    type: 'system',
    color: '#9C27B0',
    title: 'به‌روزرسانی اپلیکیشن',
    message: 'نسخه جدید زیبانو با قابلیت‌های بیشتر و رفع باگ‌ها منتشر شد.',
    time: 'دیروز',
    isRead: true,
  },
  {
    id: 'n5',
    type: 'review',
    color: '#FFC107',
    title: 'از نظر شما متشکریم',
    message: 'نظر شما برای سالن افرا با موفقیت ثبت شد.',
    time: '۲ روز پیش',
    isRead: true,
  },
  {
    id: 'n6',
    type: 'refund',
    color: '#1E88E5',
    title: 'استرداد وجه',
    message: 'مبلغ ۳۰۰,۰۰۰ تومان به حساب شما واریز شد (لغو نوبت توسط سالن).',
    time: '۳ روز پیش',
    isRead: true,
  },
];

export default function NotificationModal({ visible, onClose }) {
  const { colors } = useTheme();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [mounted, setMounted] = useState(false);
  const instanceId = useRef('notification-modal');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      releaseScrollLock(instanceId.current);
    };
  }, []);

  useEffect(() => {
    if (visible) {
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

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
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
              <FiBell size={22} color={colors.primary} />
            </div>
            <div>
              <p className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                اعلان‌ها
              </p>
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
            <FiX size={20} color={colors.textMain} />
          </button>
        </div>

        {/* دکمه خواندن همه */}
        {unreadCount > 0 && (
          <div className="px-5 py-2 border-b" style={{ borderColor: colors.border }}>
            <button
              onClick={markAllAsRead}
              className="text-xs font-[Vazir-Bold]"
              style={{ color: colors.primary }}
            >
              خواندن همه
            </button>
          </div>
        )}

        {/* لیست اعلان‌ها */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.primary + '10' }}
              >
                <FiBell size={40} style={{ color: colors.textSecondary + '60' }} />
              </div>
              <p className="text-sm font-[Vazir]" style={{ color: colors.textSecondary }}>
                اعلانی وجود ندارد
              </p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = NOTIFICATION_ICONS[notification.type] || FiBell;
              return (
                <div
                  key={notification.id}
                  className="flex gap-3 p-3 rounded-2xl border transition-all cursor-pointer"
                  style={{
                    backgroundColor: notification.isRead
                      ? colors.background
                      : notification.color + '08',
                    borderColor: notification.isRead ? colors.border : notification.color + '30',
                  }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: notification.color + '18' }}
                  >
                    <Icon size={18} color={notification.color} />
                  </div>
                  <div className="flex-1 min-w-0 gap-1">
                    <div className="flex items-center gap-2">
                      <p
                        className="text-[13px] flex-1 truncate"
                        style={{
                          color: colors.textMain,
                          fontFamily: notification.isRead ? 'Vazir' : 'Vazir-Bold',
                        }}
                      >
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: notification.color }}
                        />
                      )}
                    </div>
                    <p
                      className="text-[11px] font-[Vazir] leading-[17px] line-clamp-2"
                      style={{ color: colors.textSecondary }}
                    >
                      {notification.message}
                    </p>
                    <p
                      className="text-[10px] font-[Vazir]"
                      style={{ color: colors.textSecondary + '90' }}
                    >
                      {notification.time}
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
