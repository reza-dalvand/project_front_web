// src/utils/phoneUtils.js
import { toEnglishDigits, toPersianDigit } from './numberUtils';

// اعتبارسنجی شماره موبایل ایرانی
export const validatePhone = (v) => /^09[0-9]{9}$/.test(toEnglishDigits(v));

// مخفی کردن وسط شماره (مثلاً ۰۹۱۲***۶۷۸۹)
export const maskPhone = (phone) => {
  if (!phone || phone.length < 11) return phone || '';
  return (
    phone.slice(0, 4) +
    String.fromCharCode(8204) + // نیم‌فاصله
    '***' +
    String.fromCharCode(8204) +
    phone.slice(-4)
  );
};

// تمیز کردن شماره (فقط ارقام و +)
export const cleanPhone = (phone) => toEnglishDigits(phone).replace(/[^0-9+]/g, '');
