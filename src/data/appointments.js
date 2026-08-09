// src/data/appointments.js
/**
 * 📅 نوبت‌ها
 * استفاده شده در: صفحه اصلی (ReviewModal)، پروفایل نوبت‌ها
 */

// ═══════ نوبت‌های انجام‌شده برای نظردهی ═══════
export const MOCK_DONE_APPOINTMENTS = [
  {
    id: 'apt_done_1',
    businessName: 'سالن زیبایی نیلارام',
    businessLogo: 'https://picsum.photos/100/100?random=21',
    serviceName: 'فیشیال تخصصی پوست',
    employeeName: 'سارا احمدی',
    date: '۱۴۰۳/۰۴/۱۸',
    time: '۱۰:۳۰',
    status: 'done',
  },
];

// ═══════ نوبت‌های پروفایل مشتری ═══════
export const MOCK_PROFILE_APPOINTMENTS = [
  {
    id: 'apt_1',
    businessName: 'سالن زیبایی نیلارام',
    businessLogo: 'https://picsum.photos/100/100?random=21',
    serviceName: 'فیشیال تخصصی پوست',
    employeeName: 'سارا احمدی',
    date: '۱۴۰۳/۰۴/۱۵',
    time: '۱۰:۳۰',
    status: 'reserved',
    totalPrice: 675000,
    depositPaid: 200000,
    isUpcoming: true,
    hoursLeft: 28,
    verificationCode: '۵۸۹۲',
  },
  {
    id: 'apt_2',
    businessName: 'مرکز لیزر رویال',
    businessLogo: 'https://picsum.photos/100/100?random=25',
    serviceName: 'لیزر فول بادی',
    employeeName: 'دکتر رضایی',
    date: '۱۴۰۳/۰۴/۲۰',
    time: '۱۶:۰۰',
    status: 'reserved',
    totalPrice: 2125000,
    depositPaid: 500000,
    isUpcoming: true,
    hoursLeft: 6,
    verificationCode: '۲۵۷۱',
  },
  {
    id: 'apt_3',
    businessName: 'ناخن گالری پریا',
    businessLogo: 'https://picsum.photos/100/100?random=26',
    serviceName: 'کاشت ناخن ژلیش',
    employeeName: 'مریم',
    date: '۱۴۰۳/۰۳/۱۰',
    time: '۱۴:۰۰',
    status: 'done',
    totalPrice: 450000,
    depositPaid: 0,
    isUpcoming: false,
  },
];
