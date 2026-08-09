// src/utils/phoneUtils.js
import { toEnglishDigits } from './numberUtils';

// اعتبارسنجی شماره موبایل ایرانی
export const validatePhone = (v) => /^09[0-9]{9}$/.test(toEnglishDigits(v));

// ✅ ماسک معکوس: ۴ رقم آخر + *** + ۴ رقم اول
// مثال: 09901232001 → 2001***0990
export const maskPhone = (phone) => {
  if (!phone || phone.length < 11) return phone || '';
  const p = toEnglishDigits(phone);
  return p.slice(-4) + '***' + p.slice(0, 4);
};

// تمیز کردن شماره (فقط ارقام و +)
export const cleanPhone = (phone) => toEnglishDigits(phone).replace(/[^0-9+]/g, '');