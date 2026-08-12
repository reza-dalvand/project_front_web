// src/components/profile/paymentHistory/constants.js
// ✅ بازنویسی کامل — حذف MOCK_PAYMENTS محلی

export { STATUS_META, PAYMENT_TYPE_META, PAYMENT_METHOD_META } from '@/constants/meta';
export { formatPrice } from '@/utils/numberUtils';
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

export const FILTER_OPTIONS = [
  { id: 'all', label: 'همه پرداخت‌ها' },
  { id: 'yesterday', label: 'دیروز' },
  { id: 'last_week', label: 'هفته قبل' },
  { id: 'last_month', label: 'ماه قبل' },
  { id: 'last_3months', label: 'سه ماه قبل' },
];
