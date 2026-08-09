// src/data/notifications.js
/**
 * 🔔 اعلان‌ها
 * استفاده شده در: NotificationModal
 */
export const MOCK_NOTIFICATIONS = [
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