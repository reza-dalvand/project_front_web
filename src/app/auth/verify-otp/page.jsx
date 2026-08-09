// src/app/auth/verify-otp/page.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiMessageSquare, FiEdit, FiCheck, FiRefreshCw } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/common';
import OTPInput from '@/components/common/OTPInput';
import { toPersianDigit } from '@/utils/numberUtils';

const OTP_LENGTH = 5;
const RESEND_SECONDS = 60;
const MOCK_OTP = '12345';

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  // ✅ جلوگیری از redirect به login بعد از لاگین موفق
  const isLoggingIn = useRef(false);

  // ✅ خواندن پارامتر redirect از URL
  const redirectUrl = searchParams.get('redirect') || '/';

  // اگر شماره موبایل ذخیره نشده، برگرد به لاگین
  useEffect(() => {
    if (!pendingPhone && !isLoggingIn.current) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`);
    }
  }, [pendingPhone, router, redirectUrl]);

  // تایمر ارسال مجدد
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // ✅ ماسک معکوس: ۴ رقم آخر + *** + ۴ رقم اول
  const maskedPhone = pendingPhone
    ? pendingPhone.slice(-4) + '***' + pendingPhone.slice(0, 4)
    : '';

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
      isLoggingIn.current = true;
      login(pendingPhone, pendingName || 'کاربر زیبانو');
      router.replace(redirectUrl);
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

        {/* پیام خطا */}
        {error && (
          <p className="text-center text-sm" style={{ color: '#E57373' }}>
            {error}
          </p>
        )}

        {/* بخش ارسال مجدد و ویرایش */}
        <div className="flex justify-between items-center px-2">
          <button
            onClick={() =>
              router.replace(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`)
            }
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
            <button
              onClick={handleResend}
              className="flex items-center gap-1"
              type="button"
            >
              <FiRefreshCw size={14} style={{ color: colors.primary }} />
              <span
                className="text-sm font-[Vazir-Bold]"
                style={{ color: colors.primary }}
              >
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
          <span className="text-xs" style={{ color: colors.primary }}>
            حالت آزمایشی: کد تایید{' '}
            <span className="font-[Vazir-Bold]">۱۲۳۴۵</span> است
          </span>
        </div>
      </div>
    </div>
  );
}