// src/app/auth/verify-otp/page.jsx
'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiMessageSquare, FiEdit, FiRefreshCw } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/common';
import OTPInput from '@/components/common/OTPInput';
import { toPersianDigit } from '@/utils/numberUtils';
import { authService } from '@/api';
import { OTP_CONFIG } from '@/api/config';

const OTP_LENGTH = OTP_CONFIG.CODE_LENGTH;
const RESEND_SECONDS = OTP_CONFIG.RESEND_COOLDOWN_SECONDS;

function VerifyOtpPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { colors } = useTheme();
  const login = useAuthStore((s) => s.login);
  const pendingPhone = useAuthStore((s) => s.pendingPhone);
  const isLoggingIn = useRef(false);
  const redirectUrl = searchParams.get('redirect') || '/';

  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [currentBox, setCurrentBox] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!pendingPhone && !isLoggingIn.current) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`);
    }
  }, [pendingPhone, router, redirectUrl]);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const maskedPhone = pendingPhone ? pendingPhone.slice(-4) + '***' + pendingPhone.slice(0, 4) : '';

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setError(`لطفاً کد ${toPersianDigit(OTP_LENGTH)} رقمی را کامل وارد کنید`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await authService.verifyOTP(pendingPhone, code);

      if (!result?.data?.user) {
        throw new Error('خطا در ورود. لطفاً دوباره تلاش کنید.');
      }

      const { user, access_token, refresh_token } = result.data;
      isLoggingIn.current = true;

      login(user, { access_token, refresh_token });
      router.replace(redirectUrl);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'کد وارد شده صحیح نیست');
      setOtp(['', '', '', '', '']);
      setCurrentBox(0);
    }
  };

  const handleResend = async () => {
    try {
      await authService.sendOTP(pendingPhone);
      setTimer(RESEND_SECONDS);
      setCanResend(false);
      setOtp(['', '', '', '', '']);
      setCurrentBox(0);
    } catch (err) {
      setError(err.message || 'خطا در ارسال مجدد کد');
    }
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
          <h1 className="text-2xl font-[Vazir-Bold] mb-2" style={{ color: colors.textMain }}>
            کد تایید را وارد کنید
          </h1>
          <p className="text-sm leading-6 px-4" style={{ color: colors.textSecondary }}>
            کد {toPersianDigit(OTP_LENGTH)} رقمی پیامک‌شده به{' '}
            <span className="font-[Vazir-Bold]" style={{ color: colors.primary }}>
              {toPersianDigit(maskedPhone)}
            </span>{' '}
            را وارد کنید
          </p>
        </div>

        {/* OTP Inputs */}
        <OTPInput
          value={otp}
          onChange={(newOtp) => {
            setOtp(newOtp);
            if (error) setError('');
          }}
          length={OTP_LENGTH}
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
