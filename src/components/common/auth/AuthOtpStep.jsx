// src/components/common/auth/AuthOtpStep.jsx
'use client';
import { useRef, useEffect } from 'react';
import { FiEdit } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import { toPersianDigit, toEnglishDigits } from '@/utils/numberUtils';

export default function AuthOtpStep({
  otp,
  onOtpChange,
  maskedPhone,
  error,
  loading,
  timer,
  canResend,
  onVerify,
  onResend,
  onEditPhone,
  otpLength = 5,
}) {
  const { colors } = useTheme();
  const inputRefs = useRef([]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return toPersianDigit(`${m}:${s.toString().padStart(2, '0')}`);
  };

  const handleChange = (text, index) => {
    const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    if (cleaned.length > 1) {
      const digits = cleaned.slice(0, otpLength).split('');
      digits.forEach((d, i) => {
        if (index + i < otpLength) newOtp[index + i] = d;
      });
      onOtpChange(newOtp);
      const nextIndex = Math.min(index + digits.length, otpLength - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }
    newOtp[index] = cleaned[0] || '';
    onOtpChange(newOtp);
    if (cleaned && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          کد ارسال‌شده به{' '}
          <span className="font-[Vazir-Bold]" style={{ color: colors.primary }}>
            {toPersianDigit(maskedPhone)}
          </span>
        </p>
      </div>
      <div className="flex justify-center gap-2" dir="ltr">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={toPersianDigit(digit)}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="outline-none"
            style={{
              width: '52px',
              height: '60px',
              borderRadius: '14px',
              backgroundColor: colors.cardBackground,
              border: `2px solid ${error && digit === '' ? '#E57373' : colors.border}`,
              color: colors.textMain,
              fontSize: '22px',
              fontFamily: "'Vazir-Bold', sans-serif",
              textAlign: 'center',
              lineHeight: '56px',
              padding: 0,
              direction: 'ltr',
              boxSizing: 'border-box',
            }}
          />
        ))}
      </div>
      {error && (
        <p className="text-center text-sm" style={{ color: '#E57373' }}>
          {error}
        </p>
      )}
      <div className="flex justify-between items-center px-1">
        <button onClick={onEditPhone} className="flex items-center gap-1" type="button">
          <FiEdit size={14} style={{ color: colors.primary }} />
          <span className="text-sm font-[Vazir-Medium]" style={{ color: colors.primary }}>
            ویرایش شماره
          </span>
        </button>
        {canResend ? (
          <button onClick={onResend} type="button">
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.primary }}>
              ارسال مجدد کد
            </span>
          </button>
        ) : (
          <span className="text-sm" style={{ color: colors.textSecondary }}>
            ارسال مجدد تا {formatTime(timer)}
          </span>
        )}
      </div>
      <div className="pb-6">
        <Button
          title="تایید و ورود"
          onPress={onVerify}
          loading={loading}
          disabled={otp.join('').length < otpLength || loading}
          variant="primary"
          size="lg"
          fullWidth
        />
      </div>
    </div>
  );
}
