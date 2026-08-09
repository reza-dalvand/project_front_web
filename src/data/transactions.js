// src/data/transactions.js

/**
 * 💰 تراکنش‌های مالی مدیریت کسب‌وکار
 * جایگزین MOCK_TRANSACTIONS در financial/constants.js
 */
export const MOCK_TRANSACTIONS = [
  { id: 'tx_1', type: 'deposit', customerName: 'نازنین کریمی', serviceName: 'فیشیال تخصصی پوست', amount: 200000, status: 'blocked', appointmentDate: '۱۴۰۵/۰۵/۲۰', appointmentTime: '۱۰:۳۰', createdAt: '۱۴۰۵/۰۵/۱۰ - ۱۴:۳۲', trackingCode: 'TRK-1234567890' },
  { id: 'tx_2', type: 'deposit', customerName: 'الهام محمدی', serviceName: 'کاشت ناخن ژله‌ای', amount: 100000, status: 'settling', appointmentDate: '۱۴۰۵/۰۵/۱۸', appointmentTime: '۱۴:۳۰', completedAt: '۱۴۰۵/۰۵/۱۸ - ۱۶:۴۵', estimatedSettlement: 'تا ۱۴۰۵/۰۵/۲۰ - ساعت ۱۷', trackingCode: 'TRK-9876543210' },
  // ... بقیه آیتم‌ها از financial/constants.js منتقل شوند
];