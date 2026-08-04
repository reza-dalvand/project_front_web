// src/components/manageBusiness/financial/constants.js
import { toPersianDigit, formatPrice } from '@/utils/numberUtils';

// Re-export برای استفاده راحت‌تر
export { toPersianDigit, formatPrice };

// وضعیت‌های تراکنش
export const TX_STATUS_META = {
  blocked: {
    label: 'بلوکه (در انتظار خدمت)',
    shortLabel: 'بلوکه',
    color: '#FF9800',
    icon: 'clock',
    bg: '#FF980015',
    description: 'پس از انجام خدمت، وارد چرخه تسویه می‌شود',
  },
  settling: {
    label: 'در حال تسویه',
    shortLabel: 'در حال تسویه',
    color: '#2196F3',
    icon: 'refresh-cw',
    bg: '#2196F315',
    description: 'پول در حال واریز به حساب بانکی شماست (تا ۴۸ ساعت)',
  },
  settled: {
    label: 'تسویه شده',
    shortLabel: 'تسویه شده',
    color: '#43A047',
    icon: 'check-circle',
    bg: '#43A04715',
    description: 'به حساب شما واریز شد',
  },
  refunded: {
    label: 'مسترد به مشتری',
    shortLabel: 'مسترد',
    color: '#E53935',
    icon: 'rotate-ccw',
    bg: '#E5393515',
    description: 'به دلیل لغو نوبت، به حساب مشتری برگشت داده شد',
  },
};

// تب‌های فیلتر
export const TX_TABS = [
  { id: 'all', label: 'همه' },
  { id: 'blocked', label: 'بلوکه' },
  { id: 'settling', label: 'در حال تسویه' },
  { id: 'settled', label: 'تسویه شده' },
  { id: 'refunded', label: 'مسترد شده' },
];

// داده‌های موقت تراکنش‌ها
export const MOCK_TRANSACTIONS = [
  {
    id: 'tx_1',
    type: 'deposit',
    customerName: 'نازنین کریمی',
    serviceName: 'فیشیال تخصصی پوست',
    amount: 200000,
    status: 'blocked',
    appointmentDate: '۱۴۰۵/۰۵/۲۰',
    appointmentTime: '۱۰:۳۰',
    createdAt: '۱۴۰۵/۰۵/۱۰ - ۱۴:۳۲',
    trackingCode: 'TRK-1234567890',
  },
  {
    id: 'tx_2',
    type: 'deposit',
    customerName: 'الهام محمدی',
    serviceName: 'کاشت ناخن ژله‌ای',
    amount: 100000,
    status: 'settling',
    appointmentDate: '۱۴۰۵/۰۵/۱۸',
    appointmentTime: '۱۴:۳۰',
    completedAt: '۱۴۰۵/۰۵/۱۸ - ۱۶:۴۵',
    estimatedSettlement: 'تا ۱۴۰۵/۰۵/۲۰ - ساعت ۱۷',
    trackingCode: 'TRK-9876543210',
  },
  {
    id: 'tx_3',
    type: 'deposit',
    customerName: 'سمیرا قاسمی',
    serviceName: 'فیشیال VIP عروس',
    amount: 300000,
    status: 'settling',
    appointmentDate: '۱۴۰۵/۰۵/۲۲',
    appointmentTime: '۰۹:۰۰',
    completedAt: '۱۴۰۵/۰۵/۲۲ - ۱۰:۱۵',
    estimatedSettlement: 'تا ۱۴۰۵/۰۵/۲۴ - ساعت ۱۰',
    trackingCode: 'TRK-7777777777',
  },
  {
    id: 'tx_4',
    type: 'settlement',
    title: 'تسویه خودکار - نوبت فیشیال تخصصی',
    amount: 500000,
    status: 'settled',
    customerName: 'زهرا حسینی',
    serviceName: 'لیزر فول بادی',
    settledAt: '۱۴۰۵/۰۵/۲۰ - ۰۸:۱۵',
    destinationBank: 'بانک ملی',
    trackingCode: 'TRK-5555555555',
  },
  {
    id: 'tx_5',
    type: 'settlement',
    title: 'تسویه خودکار - نوبت رنگ و مش مو',
    amount: 400000,
    status: 'settled',
    customerName: 'مریم احمدی',
    serviceName: 'رنگ و لایت مو',
    settledAt: '۱۴۰۵/۰۵/۱۵ - ۱۰:۰۰',
    destinationBank: 'بانک ملی',
    trackingCode: 'TRK-1111222233',
  },
  {
    id: 'tx_6',
    type: 'refund',
    customerName: 'پریسا نوری',
    serviceName: 'میکاپ مجلسی',
    amount: 200000,
    status: 'refunded',
    createdAt: '۱۴۰۵/۰۵/۱۲ - ۱۸:۰۰',
    reason: 'لغو نوبت توسط صاحب کسب و کار',
  },
  {
    id: 'tx_7',
    type: 'deposit',
    customerName: 'فاطمه رضوی',
    serviceName: 'کراتینه مو',
    amount: 250000,
    status: 'blocked',
    appointmentDate: '۱۴۰۵/۰۵/۲۴',
    appointmentTime: '۱۵:۰۰',
    createdAt: '۱۴۰۵/۰۵/۲۰ - ۱۱:۲۰',
    trackingCode: 'TRK-4444888899',
  },
];

// اطلاعات بانکی موقت
export const MOCK_BANK_INFO = {
  ownerName: 'مریم حسینی',
  nationalId: '۰۰۱۲۳۴۵۶۷۸۹',
  sheba: '',
  cardNumber: '',
  bankName: '',
  accountNumber: '',
  isRegistered: false,
  isVerified: false,
};