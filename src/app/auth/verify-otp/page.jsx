// src/app/auth/verify-otp/page.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiMessageSquare, FiEdit, FiCheck, FiRefreshCw } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/common';
import { toPersianDigit, toEnglishDigits } from '@/utils/numberUtils';

const OTP_LENGTH = 5;
const RESEND_SECONDS = 60;
const MOCK_OTP = '12345';

export default function VerifyOtpPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const login = useAuthStore((s) => s.login);
  const pendingPhone = useAuthStore((s) => s.pendingPhone);
  const pendingName = useAuthStore((s) => s.pendingName);

  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [currentBox, setCurrentBox] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  // اگر شماره موبایل ذخیره نشده، برگرد به لاگین
  useEffect(() => {
    if (!pendingPhone) {
      router.replace('/auth/login')
    }
  }, [pendingPhone, router]);

  // تایمر ارسال مجدد
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const maskedPhone = pendingPhone
    ? pendingPhone.slice(0, 4) + '***' + pendingPhone.slice(-4)
    : '';

  const handleChange = (text, index) => {
    const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');

    if (cleaned.length > 1) {
      const digits = cleaned.slice(0, OTP_LENGTH).split('');
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < OTP_LENGTH) newOtp[index + i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, OTP_LENGTH - 1);
      setCurrentBox(nextIndex);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const digit = cleaned[0] || '';
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (error) setError('');

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
      setCurrentBox(index + 1);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setCurrentBox(index - 1);
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setError(`لطفاً کد ${OTP_LENGTH} رقمی را کامل وارد کنید`);
      return;
    }

    setLoading(true);
    setError('');

    await new Promise((r) => setTimeout(r, 1200));

    if (code === MOCK_OTP) {
      login(pendingPhone, pendingName || 'کاربر زیبانو');
      router.replace('/');
    } else {
      setError('کد وارد شده صحیح نیست');
      setLoading(false);
    }
  };

  const handleResend = () => {
    setTimer(RESEND_SECONDS);
    setCanResend(false);
    setOtp(['', '', '', '', '']);
    setCurrentBox(0);
    inputRefs.current[0]?.focus();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${toPersianDigit(m)}:${toPersianDigit(s.toString().padStart(2, '0'))}`;
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: colors.background }}
    >
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* آیکون */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center self-center"
          style={{ backgroundColor: colors.primary + '15' }}
        >
          <FiMessageSquare size={48} style={{ color: colors.primary }} />
        </div>

        {/* عنوان */}
        <div className="text-center">
          <h1
            className="text-2xl font-[Vazir-Bold] mb-2"
            style={{ color: colors.textMain }}
          >
            کد تایید را وارد کنید
          </h1>
          <p
            className="text-sm leading-6 px-4"
            style={{ color: colors.textSecondary }}
          >
            کد {toPersianDigit(OTP_LENGTH)} رقمی پیامک‌شده به{' '}
            <span className="font-[Vazir-Bold]" style={{ color: colors.primary }}>
              {toPersianDigit(maskedPhone)}
            </span>{' '}
            را وارد کنید
          </p>
        </div>

        {/* باکس‌های OTP */}
        <div className="flex justify-center gap-3" dir="ltr">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={toPersianDigit(digit)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyPress(e, index)}
              onFocus={() => setCurrentBox(index)}
              className="w-14 h-16 rounded-2xl text-center text-2xl font-[Vazir-Bold] outline-none transition-all"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor:
                  error && digit === ''
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

        {/* پیام خطا */}
        {error && (
          <p
            className="text-center text-sm"
            style={{ color: '#E57373' }}
          >
            {error}
          </p>
        )}

        {/* بخش ارسال مجدد و ویرایش */}
        <div className="flex justify-between items-center px-2">
          <button
            onClick={() => router.replace('/auth/login')}
            className="flex items-center gap-1"
            type="button"
          >
            <FiEdit size={14} style={{ color: colors.primary }} />
            <span
              className="text-sm font-[Vazir-Medium]"
              style={{ color: colors.primary }}
            >
              ویرایش شماره
            </span>
          </button>

          {canResend ? (
            <button onClick={handleResend} className="flex items-center gap-1" type="button">
              <FiRefreshCw size={14} style={{ color: colors.primary }} />
              <span
                className="text-sm font-[Vazir-Bold]"
                style={{ color: colors.primary }}
              >
                ارسال مجدد کد
              </span>
            </button>
          ) : (
            <span
              className="text-sm"
              style={{ color: colors.textSecondary }}
            >
              ارسال مجدد تا {formatTime(timer)}
            </span>
          )}
        </div>

        {/* دکمه تایید */}
        <Button
          title="تایید و ورود"
          onPress={handleVerify}
          loading={loading}
          disabled={otp.join('').length < OTP_LENGTH || loading}
          variant="primary"
          size="lg"
          fullWidth
          icon={<FiCheck size={18} />}
          iconPosition="left"
        />

        {/* راهنمای کد تست */}
        <div
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border"
          style={{
            backgroundColor: colors.primary + '10',
            borderColor: colors.primary + '30',
          }}
        >
          <span
            className="text-xs"
            style={{ color: colors.primary }}
          >
            حالت آزمایشی: کد تایید{' '}
            <span className="font-[Vazir-Bold]">۱۲۳۴۵</span> است
          </span>
        </div>
      </div>
    </div>
  );
}