// src/utils/numberUtils.js
/**
 * 🔢 ابزارهای فرمت اعداد فارسی
 *
 * ⚠️ FIX P1: توابع calculateAppFee، APP_FEE_TIERS، MAX_APP_FEE
 *    و getCurrentFeeTier از این فایل حذف شدند.
 *    منبع اصلی: '@/utils/price-utils'
 */

// تبدیل اعداد انگلیسی به فارسی
export const toPersianDigit = (str) => String(str ?? '').replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

// تبدیل اعداد فارسی/عربی به انگلیسی
export const toEnglishDigits = (str) =>
  String(str ?? '')
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

// استخراج عدد از رشته
export const parseNumber = (str) => {
  const cleaned = toEnglishDigits(str).replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
};

// فرمت قیمت با تومان
export const formatPrice = (num) => `${toPersianDigit((num || 0).toLocaleString('en-US'))} تومان`;

// فرمت کوتاه قیمت (K و M)
export const formatPriceShort = (num) => {
  if (num >= 1000000) return `${toPersianDigit((num / 1000000).toFixed(1))}M`;
  if (num >= 1000) return `${toPersianDigit((num / 1000).toFixed(0))}K`;
  return toPersianDigit(num);
};

// فرمت ورودی قیمت (با جداکننده هزارگان)
export const formatPriceInput = (text) => {
  const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  return toPersianDigit(parseInt(cleaned, 10).toLocaleString('en-US'));
};

// فرمت ورودی درصد (حداکثر ۱۰۰)
export const formatPercentInput = (text) => {
  const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  return toPersianDigit(String(Math.min(parseInt(cleaned, 10), 100)));
};

const toFiniteNumber = (value) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  const normalized = toEnglishDigits(String(value ?? ''))
    .replace(/[^\d.-]/g, '');

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const trimDecimalZero = (value) => {
  const fixed = value.toFixed(1);
  return fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed;
};

const COMPACT_TOMAN_SCALES = [
  { threshold: 1000000000, label: 'میلیارد', decimals: 1 },
  { threshold: 1000000, label: 'میلیون', decimals: 1 },
  { threshold: 1000, label: 'هزار', decimals: 0 },
];

/**
 * فرمت فشرده مبلغ به تومان
 * مثال:
 * 5000000 -> ۵ میلیون تومان
 * 300000 -> ۳۰۰ هزار تومان
 * 1500000 -> ۱.۵ میلیون تومان
 */
export const formatCompactToman = (value) => {
  const numeric = Math.max(0, Math.floor(toFiniteNumber(value)));

  if (numeric < 1000) {
    return `${toPersianDigit(numeric)} تومان`;
  }

  for (const scale of COMPACT_TOMAN_SCALES) {
    if (numeric >= scale.threshold) {
      const rawScaled = numeric / scale.threshold;

      const scaled =
        scale.decimals === 0
          ? Math.floor(rawScaled)
          : Math.floor(rawScaled * 10) / 10;

      const displayNumber =
        scale.decimals === 0
          ? toPersianDigit(scaled)
          : toPersianDigit(trimDecimalZero(scaled));

      return `${displayNumber} ${scale.label} تومان`;
    }
  }

  return `${toPersianDigit(numeric)} تومان`;
};

/**
 * فرمت قیمت اجاره ثابت لاین
 * اگر رهن صفر باشد، فقط اجاره ماهانه نمایش داده می‌شود.
 */
export const formatLineRentalFixedPrice = (fixedAmount, fixedDeposit = 0) => {
  const rentText = formatCompactToman(fixedAmount);
  const depositValue = toFiniteNumber(fixedDeposit);

  if (depositValue > 0) {
    return `${rentText} + ${formatCompactToman(depositValue)} رهن`;
  }

  return rentText;
};

const hasValue = (value) => value !== undefined && value !== null && value !== '';

/**
 * ساخت priceDisplay استاندارد برای آگهی‌های Line Rental
 * - percent: بدون تغییر منطق درصدی
 * - fixed: فشرده + رهن اختیاری
 * - hourly: فقط مبلغ فشرده؛ suffix / ساعت در کامپوننت‌های لازم اضافه می‌شود
 */
export const getLineRentalPriceDisplay = (rental = {}) => {
  const collabType = rental.collab_type || rental.collabType;

  if (collabType === 'percent') {
    const salon = rental.percent_salon ?? rental.percentSalon;
    const partner = rental.percent_partner ?? rental.percentPartner;

    if (hasValue(salon) && hasValue(partner)) {
      return toPersianDigit(
        `${toFiniteNumber(salon)}-${toFiniteNumber(partner)}٪`
      );
    }

    return rental.priceDisplay || '';
  }

  if (collabType === 'fixed') {
    const amount = rental.fixed_amount ?? rental.fixedAmount;
    const deposit = rental.fixed_deposit ?? rental.fixedDeposit;

    if (hasValue(amount)) {
      return formatLineRentalFixedPrice(amount, deposit);
    }

    return rental.priceDisplay || '';
  }

  if (collabType === 'hourly') {
    const rate = rental.hourly_rate ?? rental.hourlyRate;

    if (hasValue(rate)) {
      return formatCompactToman(rate);
    }

    // اگر فقط priceDisplay داشتیم و suffix / ساعت داشت، آن را حذف می‌کنیم
    // تا در کارت‌هایی که خودشون پیشوند "ساعتی" می‌زنند تکراری نشود.
    return String(rental.priceDisplay || '')
      .replace(/\s*\/\s*ساعت\s*$/, '')
      .trim();
  }

  return rental.priceDisplay || '';
};


export const getLineRentalCollabLabel = (rental = {}) => {
  const collabType = rental.collab_type || rental.collabType;

  if (collabType === 'percent') return 'درصدی';
  if (collabType === 'fixed') return 'اجاره ثابت';
  if (collabType === 'hourly') return 'ساعتی';

  return 'همکاری';
};

/**
 * ساخت ساختار نمایشی جدا برای مبالغ آگهی لاین
 *
 * خروجی:
 * {
 *   rows: [
 *     { id, label, value, tone }
 *   ],
 *   tags: [
 *     { id, label, tone }
 *   ]
 * }
 *
 * مثال fixed با رهن:
 * rows:
 *   اجاره ماهانه: ۵ میلیون تومان
 *   رهن: ۲۰ میلیون تومان
 *
 * مثال fixed بدون رهن:
 * rows:
 *   اجاره ماهانه: ۵ میلیون تومان
 * tags:
 *   بدون رهن
 *
 * مثال hourly:
 * rows:
 *   نرخ ساعتی: ۱۵۰ هزار تومان
 *
 * مثال percent:
 * rows:
 *   سهم سالن: ۴۰٪
 *   سهم همکار: ۶۰٪
 */
export const getLineRentalPricePresentation = (rental = {}) => {
  const collabType = rental.collab_type || rental.collabType;
  const rows = [];
  const tags = [];

  if (collabType === 'percent') {
    const salon = rental.percent_salon ?? rental.percentSalon;
    const partner = rental.percent_partner ?? rental.percentPartner;

    if (hasValue(salon) || hasValue(partner)) {
      rows.push({
        id: 'salon',
        label: 'سهم سالن',
        value: `${toPersianDigit(toFiniteNumber(salon))}٪`,
        tone: 'purple',
      });

      rows.push({
        id: 'partner',
        label: 'سهم همکار',
        value: `${toPersianDigit(toFiniteNumber(partner))}٪`,
        tone: 'indigo',
      });
    }
  } else if (collabType === 'fixed') {
    const amount = rental.fixed_amount ?? rental.fixedAmount;
    const deposit = rental.fixed_deposit ?? rental.fixedDeposit;

    const amountValue = toFiniteNumber(amount);
    const depositValue = toFiniteNumber(deposit);

    if (amountValue > 0) {
      rows.push({
        id: 'rent',
        label: 'اجاره ماهانه',
        value: formatCompactToman(amountValue),
        tone: 'blue',
      });
    }

    if (depositValue > 0) {
      rows.push({
        id: 'deposit',
        label: 'رهن',
        value: formatCompactToman(depositValue),
        tone: 'amber',
      });
    } else if (amountValue > 0 || hasValue(amount) || hasValue(deposit)) {
      tags.push({
        id: 'no-deposit',
        label: 'بدون رهن',
        tone: 'success',
      });
    }
  } else if (collabType === 'hourly') {
    const rate = rental.hourly_rate ?? rental.hourlyRate;
    const rateValue = toFiniteNumber(rate);

    if (rateValue > 0) {
      rows.push({
        id: 'hourly',
        label: 'نرخ ساعتی',
        value: formatCompactToman(rateValue),
        tone: 'orange',
      });
    }
  }

  // fallback اگر هیچ‌کدام از فیلدهای عددی موجود نبود
  if (rows.length === 0 && tags.length === 0) {
    const fallback = rental.priceDisplay || getLineRentalPriceDisplay(rental);
    if (fallback) {
      rows.push({
        id: 'fallback',
        label: 'قیمت',
        value: fallback,
        tone: 'gray',
      });
    }
  }

  return { rows, tags };
};


// ═══════════════════════════════════════════════════════
//    ⚠️ DEPRECATED — فقط برای سازگاری موقت
//    این export‌ها صرفاً re-export از price-utils هستند
//    تا فایل‌هایی که هنوز import قدیمی دارند نشکنند.
//    در مرحله بعدی import آن فایل‌ها تغییر می‌کند و
//    این بخش حذف می‌شود.
// ═══════════════════════════════════════════════════════
export { calculateAppFee, APP_FEE_TIERS, MAX_APP_FEE, getCurrentFeeTier } from './price-utils';
