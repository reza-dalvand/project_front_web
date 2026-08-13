// src/constants/collabTypes.js
/**
 * 📦 گزینه‌های همکاری لاین و هزینه مدلینگ
 *
 * استفاده شده در:
 * - CreateLineRentalAdSheet
 * - LineRentalFilterModal
 * - ModelRequestForm
 * - ModelRequestFilterModal
 */

// ═══════════════════════════════════════
//    گزینه‌های نوع همکاری لاین (Line Rental)
// ═══════════════════════════════════════
export const COLLAB_TYPES = [
  {
    id: 'percent',
    label: 'درصدی',
    icon: 'pie-chart',
    color: '#9C27B0',
    hint: 'تقسیم درآمد با درصد توافقی',
  },
  {
    id: 'fixed',
    label: 'اجاره ثابت',
    icon: 'attach-money',
    color: '#2196F3',
    hint: 'مبلغ ثابت ماهانه + رهن (اختیاری)',
  },
  {
    id: 'hourly',
    label: 'ساعتی',
    icon: 'schedule',
    color: '#FF9800',
    hint: 'به ازای هر ساعت',
  },
];

// ═══════════════════════════════════════
//    گزینه‌های نوع هزینه مدلینگ (Model Request)
// ═══════════════════════════════════════
export const COST_TYPE_OPTIONS = [
  {
    id: 'paid',
    label: 'با هزینه',
    icon: 'attach-money',
    color: '#2196F3',
    subtitle: 'مدل بخشی از هزینه خدمت را پرداخت می‌کند',
  },
  {
    id: 'material_cost',
    label: 'با هزینه مواد',
    icon: 'science',
    color: '#FF9800',
    subtitle: 'فقط هزینه مواد مصرفی دریافت می‌شود',
  },
  {
    id: 'free',
    label: 'کاملاً رایگان',
    icon: 'redeem',
    color: '#4CAF50',
    subtitle: 'هیچ هزینه‌ای از مدل دریافت نمی‌شود',
  },
];

// ═══════════════════════════════════════
//    گزینه‌های فیلتر نوع خدمت (لایه بالا)
// ═══════════════════════════════════════
export const SERVICE_FILTER_OPTIONS = [
  { id: 'all', label: 'همه خدمات' },
  { id: 'facial', label: 'فیشیال و پوست' },
  { id: 'nail', label: 'کاشت ناخن' },
  { id: 'hair_color', label: 'رنگ و لایت مو' },
  { id: 'hair', label: 'رنگ و لایت مو' }, // alias
  { id: 'keratin', label: 'کراتین و احیا' },
  { id: 'laser', label: 'لیزر' },
  { id: 'makeup', label: 'میکاپ و گریم' },
  { id: 'eyelash', label: 'کاشت مژه' },
  { id: 'massage', label: 'ماساژ' },
  { id: 'hair_cut', label: 'کوتاهی مو' },
  { id: 'bridal', label: 'خدمات عروس' },
];

// ═══════════════════════════════════════
//    گزینه‌های مدت زمان هر نوبت
// ═══════════════════════════════════════
export const SLOT_DURATIONS = [
  { id: 15, label: '۱۵ دقیقه', hint: 'کوتاه' },
  { id: 30, label: '۳۰ دقیقه', hint: 'استاندارد' },
  { id: 45, label: '۴۵ دقیقه', hint: 'متوسط' },
  { id: 60, label: '۶۰ دقیقه', hint: 'یک ساعت' },
  { id: 90, label: '۹۰ دقیقه', hint: 'طولانی' },
  { id: 120, label: '۱۲۰ دقیقه', hint: 'ویژه' },
];

// ═══════════════════════════════════════
//    محدودیت‌های اعتبارسنجی
// ═══════════════════════════════════════
export const LIMITS = {
  MIN_FINAL_PRICE: 50000, // حداقل قیمت نهایی خدمت
  MIN_DEPOSIT: 50000, // حداقل مبلغ بیعانه
  MAX_DESCRIPTION_LENGTH: 300, // حداکثر طول توضیحات
  MAX_TITLE_LENGTH: 100, // حداکثر طول عنوان
  OTP_LENGTH: 5, // طول کد تایید
  VERIFICATION_CODE_LENGTH: 4, // طول کد تایید نوبت
  RESEND_OTP_SECONDS: 60, // زمان انتظار ارسال مجدد OTP
  REGENERATE_CODE_SECONDS: 300, // زمان بین تولید مجدد کد تایید
};

// ═══════════════════════════════════════
//    توابع کمکی
// ═══════════════════════════════════════
export const getCollabTypeById = (id) => COLLAB_TYPES.find((c) => c.id === id) || COLLAB_TYPES[0];

export const getCostTypeById = (id) =>
  COST_TYPE_OPTIONS.find((c) => c.id === id) || COST_TYPE_OPTIONS[1];

export const getTitleForCollabType = (collabType) => {
  switch (collabType) {
    case 'percent':
      return 'درصد تقسیم درآمد';
    case 'fixed':
      return 'مبلغ اجاره ماهانه + رهن';
    case 'hourly':
      return 'نرخ ساعتی';
    default:
      return 'قیمت';
  }
};
