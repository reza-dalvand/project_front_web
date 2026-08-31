// src/app/auth/verify-otp/page.jsx
'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiMessageSquare, FiEdit, FiRefreshCw, FiCheck } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@/hooks/useToast';
import { useAuthFlow } from '@/hooks/useAuthFlow'; // ✅ جدید
import { Button } from '@/components/common';
import OTPInput from '@/components/common/OTPInput';
import { toPersianDigit, toEnglishDigits } from '@/utils/numberUtils';
import { OTP_CONFIG } from '@/api/config';

const OTP_LENGTH = OTP_CONFIG.CODE_LENGTH;

function VerifyOtpPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { colors } = useTheme();
  const { showToast } = useToast();
  const pendingPhone = useAuthStore((s) => s.pendingPhone);
  const isLoggingIn = useRef(false);
  const redirectUrl = searchParams.get('redirect') || '/';

  // ─── State‌های مخصوص صفحه ───
  const [currentBox, setCurrentBox] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // ═══════ استفاده از hook مشترک ═══════
  const {
    otp,
    setOtp,
    loading,
    error,
    setError,
    timer,
    canResend,
    otpLength,
    verifyOtp,
    resendOtp,
    formatTimer,
  } = useAuthFlow({
    enabled: true,
    onVerifySuccess: ({ needsProfileCompletion }) => {
      isLoggingIn.current = true;
      setShowSuccess(true);
      setTimeout(() => {
        if (needsProfileCompletion) {
          router.replace('/profile/edit?welcome=1');
        } else {
          router.replace(redirectUrl === '/' ? '/' : redirectUrl);
        }
      }, 1500);
    },
  });

  // ریدایرکت اگر شماره‌ای در انتظار نیست
  useEffect(() => {
    if (!pendingPhone && !isLoggingIn.current) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`);
    }
  }, [pendingPhone, router, redirectUrl]);

  const maskedPhone = pendingPhone ? pendingPhone.slice(-4) + '***' + pendingPhone.slice(0, 4) : '';

  // ─── تایید کد ───
  const handleVerifyOtp = async () => {
    const code = otp.join('');
    await verifyOtp(pendingPhone, code);
  };

  // ─── ارسال مجدد ───
  const handleResend = async () => {
    const result = await resendOtp(pendingPhone);
    if (result.success) {
      showToast('کد جدید ارسال شد', 'success');
    }
  };

  // ─── مدیریت ورودی OTP ───
  const handleChange = (text, index) => {
    const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
    const newOtp = [...otp];

    // پیست چند رقمی
    if (cleaned.length > 1) {
      const digits = cleaned.slice(0, otpLength).split('');
      digits.forEach((digit, i) => {
        if (index + i < otpLength) newOtp[index + i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, otpLength - 1);
      setCurrentBox(nextIndex);
      return;
    }

    // تک رقم
    const digit = cleaned[0] || '';
    newOtp[index] = digit;
    setOtp(newOtp);

    if (error) setError('');

    if (digit && index < otpLength - 1) {
      setCurrentBox(index + 1);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      setCurrentBox(index - 1);
    }
  };

  // ─── صفحه موفقیت ───
  if (showSuccess) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6 gap-6"
        style={{ backgroundColor: colors.background }}
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
          style={{ backgroundColor: '#4CAF50' }}
        >
          <FiCheck size={50} style={{ color: '#fff' }} />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-[Vazir-Bold] mb-2" style={{ color: colors.textMain }}>
            ورود موفقیت‌آمیز! 🎉
          </h2>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            در حال انتقال...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: colors.background }}
    >
      <div className="w-full max-w-md flex flex-col gap-5">
        {/* آیکون */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <FiMessageSquare size={40} style={{ color: colors.primary }} />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              کد تایید را وارد کنید
            </h1>
            <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
              کد ارسال‌شده به{' '}
              <span className="font-[Vazir-Bold]" style={{ color: colors.primary }}>
                {toPersianDigit(maskedPhone)}
              </span>
            </p>
          </div>
        </div>

        {/* OTP Inputs */}
        <OTPInput
          value={otp}
          onChange={(newOtp) => {
            setOtp(newOtp);
            if (error) setError('');
          }}
          length={otpLength}
          error={error}
          currentBox={currentBox}
          onCurrentBoxChange={setCurrentBox}
        />

        {error && (
          <p className="text-center text-sm" style={{ color: '#E57373' }}>
            {error}
          </p>
        )}

        {/* ارسال مجدد / ویرایش */}
        <div className="flex justify-between items-center px-2">
          <button
            onClick={() =>
              router.replace(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`)
            }
            className="flex items-center gap-1"
            type="button"
          >
            <FiEdit size={14} style={{ color: colors.primary }} />
            <span className="text-sm font-[Vazir-Medium]" style={{ color: colors.primary }}>
              ویرایش شماره
            </span>
          </button>

          {canResend ? (
            <button onClick={handleResend} className="flex items-center gap-1" type="button">
              <FiRefreshCw size={14} style={{ color: colors.primary }} />
              <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.primary }}>
                ارسال مجدد کد
              </span>
            </button>
          ) : (
            <span className="text-sm" style={{ color: colors.textSecondary }}>
              ارسال مجدد تا {toPersianDigit(formatTimer())}
            </span>
          )}
        </div>

        {/* دکمه تایید */}
        <Button
          title="تایید و ورود"
          onPress={handleVerifyOtp}
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

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-app">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyOtpPageContent />
    </Suspense>
  );
}
