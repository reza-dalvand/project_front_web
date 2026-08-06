// src/utils/validators.js
import { toEnglishDigits } from './numberUtils';

// اعتبارسنجی کد ملی
export const validateNationalId = (code) => {
  const cleaned = toEnglishDigits(code).replace(/[^0-9]/g, '');
  if (cleaned.length !== 10) return false;
  if (/^(\d)\1{9}$/.test(cleaned)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i], 10) * (10 - i);
  }
  const remainder = sum % 11;
  const checkDigit = parseInt(cleaned[9], 10);
  return remainder < 2 ? checkDigit === remainder : checkDigit === 11 - remainder;
};

// اعتبارسنجی شماره شبا
export const validateSheba = (sheba) => {
  const en = toEnglishDigits(sheba);
  const cleaned = en.replace(/IR|ir/gi, '').replace(/[^0-9]/g, '');
  return cleaned.length === 24 && en.trim().toUpperCase().startsWith('IR');
};

// اعتبارسنجی شماره کارت
export const validateCardNumber = (card) => {
  const cleaned = toEnglishDigits(card).replace(/[^0-9]/g, '');
  return cleaned.length === 16;
};
