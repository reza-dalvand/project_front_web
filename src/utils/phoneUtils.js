// src/utils/phoneUtils.js
import { toEnglishDigits } from './numberUtils';

// اعتبارسنجی شماره موبایل ایرانی
export const validatePhone = (v) => /^09[0-9]{9}$/.test(toEnglishDigits(v));

// ✅ FIX: ماسک معکوس + مدیریت null
export const maskPhone = (phone) => {
  if (phone === null || phone === undefined) return phone;
  if (!phone || phone.length < 11) return phone;
  const p = toEnglishDigits(phone);
  return p.slice(-4) + '***' + p.slice(0, 4);
};

// تمیز کردن شماره (فقط ارقام و +)
export const cleanPhone = (phone) => toEnglishDigits(phone).replace(/[^0-9+]/g, '');
