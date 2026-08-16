// src/constants/banks.js
/**
 * 🏦 لیست بانک‌های ایران — منبع واحد (Single Source of Truth)
 *
 * استفاده شده در:
 * - BankEditFormFields (مدیریت مالی کسب‌وکار)
 * - bank-info/page (اطلاعات بانکی پروفایل)
 * - CancelAppointmentModal (استرداد وجه)
 *
 * ⚠️ هرگونه تغییر فقط در این فایل انجام شود
 */

// ═══════════════════════════════════════
//    لیست کامل بانک‌ها
// ═══════════════════════════════════════
export const IRANIAN_BANKS = [
  // ─── بانک‌های دولتی ───
  { id: 'meli', label: 'بانک ملی ایران', type: 'government' },
  { id: 'sepah', label: 'بانک سپه', type: 'government' },
  { id: 'keshavarzi', label: 'بانک کشاورزی', type: 'government' },
  { id: 'maskan', label: 'بانک مسکن', type: 'government' },
  { id: 'refah', label: 'بانک رفاه کارگران', type: 'government' },
  { id: 'saderat', label: 'بانک صادرات ایران', type: 'government' },
  { id: 'tejarat', label: 'بانک تجارت', type: 'government' },
  { id: 'mellat', label: 'بانک ملت', type: 'government' },
  { id: 'tosee', label: 'بانک توسعه صادرات', type: 'government' },
  { id: 'sanat', label: 'بانک صنعت و معدن', type: 'government' },

  // ─── بانک‌های خصوصی ───
  { id: 'pasargad', label: 'بانک پاسارگاد', type: 'private' },
  { id: 'parsian', label: 'بانک پارسیان', type: 'private' },
  { id: 'eghtesad', label: 'بانک اقتصاد نوین', type: 'private' },
  { id: 'saman', label: 'بانک سامان', type: 'private' },
  { id: 'ansar', label: 'بانک انصار', type: 'private' },
  { id: 'gardeshgari', label: 'بانک گردشگری', type: 'private' },
  { id: 'ayandeh', label: 'بانک آینده', type: 'private' },
  { id: 'shahr', label: 'بانک شهر', type: 'private' },
  { id: 'sina', label: 'بانک سینا', type: 'private' },
  { id: 'day', label: 'بانک دی', type: 'private' },
  { id: 'karafarin', label: 'بانک کارآفرین', type: 'private' },
  { id: 'sarmayeh', label: 'بانک سرمایه', type: 'private' },
  { id: 'tosee-taavon', label: 'بانک توسعه تعاون', type: 'private' },
  { id: 'iran-zamin', label: 'بانک ایران زمین', type: 'private' },
  { id: 'khavarmianeh', label: 'بانک خاورمیانه', type: 'private' },
  { id: 'melal', label: 'بانک ملل', type: 'private' },

  // ─── موسسات اعتباری ───
  { id: 'kosar', label: 'موسسه اعتباری کوثر', type: 'credit' },
  { id: 'noor', label: 'موسسه اعتباری نور', type: 'credit' },
];

// ═══════════════════════════════════════
//    توابع کمکی
// ═══════════════════════════════════════

/**
 * پیدا کردن بانک بر اساس ID
 * @param {string} bankId
 * @returns {object|null}
 */
export const getBankById = (bankId) => {
  return IRANIAN_BANKS.find((b) => b.id === bankId) || null;
};

/**
 * پیدا کردن نام بانک بر اساس ID
 * @param {string} bankId
 * @returns {string}
 */
export const getBankName = (bankId) => {
  return getBankById(bankId)?.label || 'بانک نامشخص';
};

/**
 * لیست بانک‌ها برای Dropdown (بدون فیلد type)
 * @returns {Array<{id: string, label: string}>}
 */
export const getBankOptions = () => {
  return IRANIAN_BANKS.map(({ id, label }) => ({ id, label }));
};

/**
 * فیلتر بانک‌ها بر اساس نوع
 * @param {'government'|'private'|'credit'} type
 * @returns {Array}
 */
export const getBanksByType = (type) => {
  return IRANIAN_BANKS.filter((b) => b.type === type);
};

/**
 * لیست ساده برای Dropdown‌های کوچک (۱۲ بانک پرکاربرد)
 * @returns {Array<{id: string, label: string}>}
 */
export const COMMON_BANKS = [
  'meli',
  'mellat',
  'saman',
  'pasargad',
  'saderat',
  'tejarat',
  'sepah',
  'keshavarzi',
  'maskan',
  'refah',
  'parsian',
  'eghtesad',
]
  .map((id) => {
    const bank = getBankById(id);
    return bank ? { id: bank.id, label: bank.label } : null;
  })
  .filter(Boolean);
