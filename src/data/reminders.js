// src/data/reminders.js

/**
 * 🔔 یادآوری تمدید خدمت
 * جایگزین MOCK_REMINDER_CUSTOMERS در manage/reminders/page.jsx
 */
export const MOCK_REMINDER_CUSTOMERS = [
  { id: 'rem_1', customerName: 'نازنین کریمی', customerPhone: '09121112233', serviceId: 'svc_1', serviceName: 'فیشیال تخصصی پوست', lastServiceDate: '۱۴۰۵/۰۳/۲۰', renewalDays: 30, dueDate: '۱۴۰۵/۰۴/۲۰', daysRemaining: 2, reminderSent: false, sentDate: null, hasNewBookingAfterSend: false },
  { id: 'rem_2', customerName: 'الهام محمدی', customerPhone: '09124445566', serviceId: 'svc_1', serviceName: 'فیشیال تخصصی پوست', lastServiceDate: '۱۴۰۵/۰۳/۱۸', renewalDays: 30, dueDate: '۱۴۰۵/۰۴/۱۸', daysRemaining: 0, reminderSent: false, sentDate: null, hasNewBookingAfterSend: false },
  { id: 'rem_3', customerName: 'زهرا حسینی', customerPhone: '09127778899', serviceId: 'svc_1', serviceName: 'فیشیال تخصصی پوست', lastServiceDate: '۱۴۰۵/۰۳/۱۵', renewalDays: 30, dueDate: '۱۴۰۵/۰۴/۱۵', daysRemaining: -3, reminderSent: true, sentDate: '۱۴۰۵/۰۴/۱۳', hasNewBookingAfterSend: false },
  // ... بقیه آیتم‌ها از reminders/page.jsx منتقل شوند
];