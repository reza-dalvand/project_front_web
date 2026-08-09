// src/data/payments.js

/**
 * 💳 تاریخچه پرداخت‌های مشتری
 * جایگزین MOCK_PAYMENTS در profile/paymentHistory/constants.js
 */
export const MOCK_PAYMENTS = [
  {
    id: 'pay_1', type: 'deposit', title: 'بیعانه رزرو - فیشیال تخصصی پوست',
    businessName: 'سالن زیبایی نیلارام', businessLogo: 'https://picsum.photos/100/100?random=21',
    serviceName: 'فیشیال تخصصی پوست VIP', employeeName: 'سارا احمدی',
    date: '۱۴۰۳/۰۴/۱۰', dayName: 'شنبه', time: '۱۴:۳۲', month: 4, year: 1403,
    originalPrice: 750000, discountPercent: 10, discountAmount: 75000, totalPrice: 675000,
    depositAmount: 200000, paidAmount: 200000, remainingAmount: 475000,
    status: 'success', appointmentStatus: 'done',
    appointmentDate: '۱۴۰۳/۰۴/۱۵', appointmentTime: '۱۰:۳۰',
    paymentMethod: 'online', paymentGateway: 'درگاه بانک ملت',
    cardNumber: '6037 9918 **** 1234', cardBank: 'بانک ملی',
    trackingCode: 'TRK-1234567890', refNumber: 'REF-2024-001', verificationCode: '۵۸۹۲',
  },
  {
    id: 'pay_2', type: 'deposit', title: 'بیعانه رزرو - لیزر فول بادی',
    businessName: 'مرکز لیزر رویال', businessLogo: 'https://picsum.photos/100/100?random=25',
    serviceName: 'لیزر فول بادی با دستگاه الکس', employeeName: 'دکتر رضایی',
    date: '۱۴۰۳/۰۴/۰۵', dayName: 'دوشنبه', time: '۱۱:۱۸', month: 4, year: 1403,
    originalPrice: 2500000, discountPercent: 15, discountAmount: 375000, totalPrice: 2125000,
    depositAmount: 500000, paidAmount: 500000, remainingAmount: 1625000,
    status: 'success', appointmentStatus: 'upcoming',
    appointmentDate: '۱۴۰۳/۰۴/۲۰', appointmentTime: '۱۶:۰۰',
    paymentMethod: 'online', paymentGateway: 'درگاه بانک پاسارگاد',
    cardNumber: '6219 8610 **** 5678', cardBank: 'بانک سامان',
    trackingCode: 'TRK-9876543210', refNumber: 'REF-2024-002', verificationCode: '۲۵۷۱',
  },
  // ... بقیه آیتم‌ها از constants.js منتقل شوند
];