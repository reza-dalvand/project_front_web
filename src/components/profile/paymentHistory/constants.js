// src/components/profile/paymentHistory/constants.js
// ✅ بازنویسی کامل — حذف MOCK_PAYMENTS محلی

export { STATUS_META, PAYMENT_TYPE_META } from '@/constants/meta';
export { formatPrice } from '@/utils/numberUtils';

// ✅ import از منبع واحد
export { MOCK_PAYMENTS } from '@/data/payments';

export const MONTHS = [
  { id: 0, label: 'همه ماه‌ها' },
  { id: 1, label: 'فروردین' },
  { id: 2, label: 'اردیبهشت' },
  { id: 3, label: 'خرداد' },
  { id: 4, label: 'تیر' },
  { id: 5, label: 'مرداد' },
  { id: 6, label: 'شهریور' },
  { id: 7, label: 'مهر' },
  { id: 8, label: 'آبان' },
  { id: 9, label: 'آذر' },
  { id: 10, label: 'دی' },
  { id: 11, label: 'بهمن' },
  { id: 12, label: 'اسفند' },
];

export const YEARS = [
  { id: 0, label: 'همه سال‌ها' },
  { id: 1403, label: '۱۴۰۳' },
  { id: 1402, label: '۱۴۰۲' },
  { id: 1401, label: '۱۴۰۱' },
];
