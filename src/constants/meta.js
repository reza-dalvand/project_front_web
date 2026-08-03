// src/constants/meta.js

// وضعیت‌های نوبت
export const APPOINTMENT_STATUS_META = {
  reserved: {
    label: 'رزرو شده',
    color: '#2196F3',
    icon: 'calendar-check',
    bg: '#2196F320',
  },
  upcoming: {
    label: 'نوبت آینده',
    color: '#2196F3',
    icon: 'calendar',
  },
  done: {
    label: 'انجام شده',
    color: '#43A047',
    icon: 'check-circle',
    bg: '#43A04720',
  },
  cancelled: {
    label: 'لغو شده',
    color: '#E53935',
    icon: 'x-circle',
  },
  cancelled_by_salon: {
    label: 'لغو توسط سالن',
    color: '#E53935',
    icon: 'x-circle',
    bg: '#E5393520',
  },
};

// وضعیت‌های پرداخت
export const STATUS_META = {
  success: {
    label: 'موفق',
    color: '#43A047',
    icon: 'check-circle',
    bg: '#43A04715',
  },
  failed: {
    label: 'ناموفق',
    color: '#E53935',
    icon: 'x-circle',
    bg: '#E5393515',
  },
  pending: {
    label: 'در انتظار',
    color: '#FFA000',
    icon: 'clock',
    bg: '#FFA00015',
  },
  refunded: {
    label: 'مسترد شده',
    color: '#1E88E5',
    icon: 'rotate-ccw',
    bg: '#1E88E515',
  },
};

// روش‌های پرداخت
export const PAYMENT_METHOD_META = {
  online: {
    label: 'درگاه بانکی',
    icon: 'credit-card',
    color: '#2196F3',
  },
  wallet: {
    label: 'کیف پول',
    icon: 'wallet',
    color: '#9C27B0',
  },
  refund: {
    label: 'استرداد به کارت',
    icon: 'rotate-ccw',
    color: '#1E88E5',
  },
};

// انواع پرداخت
export const PAYMENT_TYPE_META = {
  deposit: {
    label: 'بیعانه',
    color: '#FF9800',
    icon: 'wallet',
  },
  full_payment: {
    label: 'پرداخت کامل',
    color: '#2196F3',
    icon: 'credit-card',
  },
  service_purchase: {
    label: 'خرید سرویس',
    color: '#9C27B0',
    icon: 'award',
  },
  refund: {
    label: 'استرداد',
    color: '#1E88E5',
    icon: 'rotate-ccw',
  },
};