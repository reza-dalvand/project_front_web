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
];

// ✅ حذف شد: MOCK_BANK_INFO
// اطلاعات بانکی فقط از بک‌اند و از طریق
// bankInfoService.getBankInfo() دریافت می‌شود.
