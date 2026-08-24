// src/constants/banks.js
/**
 * 🏦 لیست بانک‌های ایران
 *
 * این لیست برای انتخاب بانک در فرم‌های اطلاعات بانکی استفاده می‌شود.
 * بک‌اند اندپوینت لیست بانک‌ها ندارد، بنابراین این لیست ثابت محلی است.
 *
 * ⚠️ اطلاعات بانکی کاربر (شبا، کارت، نام صاحب حساب)
 *    از بک‌اند و از طریق bankInfoService.getBankInfo() دریافت می‌شود.
 */

export const IRANIAN_BANKS = [
  { id: 'meli', label: 'بانک ملی ایران' },
  { id: 'mellat', label: 'بانک ملت' },
  { id: 'saman', label: 'بانک سامان' },
  { id: 'pasargad', label: 'بانک پاسارگاد' },
  { id: 'saderat', label: 'بانک صادرات ایران' },
  { id: 'tejarat', label: 'بانک تجارت' },
  { id: 'sepah', label: 'بانک سپه' },
  { id: 'keshavarzi', label: 'بانک کشاورزی' },
  { id: 'maskan', label: 'بانک مسکن' },
  { id: 'refah', label: 'بانک رفاه کارگران' },
  { id: 'parsian', label: 'بانک پارسیان' },
  { id: 'eghtesad', label: 'بانک اقتصاد نوین' },
  { id: 'karafarin', label: 'بانک کارآفرین' },
  { id: 'tosee', label: 'بانک توسعه صادرات' },
  { id: 'post_bank', label: 'پست بانک ایران' },
  { id: 'shahr', label: 'بانک شهر' },
];

/**
 * دریافت لیست بانک‌ها برای استفاده در Dropdown
 * @returns {Array<{id: string, label: string}>}
 */
export const getBankOptions = () => IRANIAN_BANKS;

/**
 * دریافت نام بانک بر اساس شناسه
 * @param {string} bankId
 * @returns {string}
 */
export const getBankLabelById = (bankId) => {
  const bank = IRANIAN_BANKS.find((b) => b.id === bankId);
  return bank ? bank.label : '';
};
