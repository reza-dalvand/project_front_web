// src/components/common/OTPInput.jsx
'use client';
import { useRef, useEffect } from 'react';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit, toEnglishDigits } from '@/utils/numberUtils';

/**
 * کامپوننت ورودی OTP مشترک
 *
 * @param {string[]} value - آرایه ارقام ['','','','','']
 * @param {function} onChange - (newOtpArray) => void
 * @param {number} length - تعداد ارقام (پیش‌فرض: 5)
 * @param {string} error - پیام خطا
 * @param {number} currentBox - ایندکس باکس فعال
 * @param {function} onCurrentBoxChange - تغییر باکس فعال
 */
export default function OTPInput({
  value = [],
  onChange,
  length = 5,
  error = '',
  currentBox = 0,
  onCurrentBoxChange,
}) {
  const { colors } = useTheme();
  const inputRefs = useRef([]);

  // فوکوس روی اولین باکس هنگام mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[currentBox]?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [currentBox]);

  const handleChange = (text, index) => {
    const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
    const newOtp = [...value];

    // پیست چند رقمی
    if (cleaned.length > 1) {
      const digits = cleaned.slice(0, length).split('');
      digits.forEach((digit, i) => {
        if (index + i < length) newOtp[index + i] = digit;
      });
      onChange(newOtp);
      const nextIndex = Math.min(index + digits.length, length - 1);
      onCurrentBoxChange?.(nextIndex);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    // تک رقم
    const digit = cleaned[0] || '';
    newOtp[index] = digit;
    onChange(newOtp);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      onCurrentBoxChange?.(index + 1);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      onCurrentBoxChange?.(index - 1);
    }
  };

  return (
    <div className="flex justify-center gap-2.5" dir="ltr">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={toPersianDigit(value[index] || '')}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={() => onCurrentBoxChange?.(index)}
          className="w-14 h-16 rounded-2xl text-center text-2xl font-[Vazir-Bold] outline-none transition-all"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor:
              error && !value[index]
                ? '#E57373'
                : currentBox === index
                  ? colors.primary
                  : colors.border,
            borderWidth: currentBox === index ? 2 : 1.5,
            color: colors.textMain,
          }}
        />
      ))}
    </div>
  );
}