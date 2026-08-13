// src/app/auth/login/page.jsx
'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiSmartphone, FiShield, FiSend } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button, Input } from '@/components/common';
import { validatePhone, cleanPhone } from '@/utils/phoneUtils';
import { toPersianDigit, toEnglishDigits } from '@/utils/numberUtils';
import { authService } from '@/api';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { colors } = useTheme();
  const setPendingAuth = useAuthStore((s) => s.setPendingAuth);
  const redirectUrl = searchParams.get('redirect') || '/';

  const [phone, setPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneChange = (text) => {
    const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
    if (cleaned.length <= 11) {
      setPhone(cleaned);
      if (error) setError('');
    }
  };

  const handleSendOtp = async () => {
    if (!termsAccepted) {
      setError('لطفاً ابتدا قوانین و مقررات را بپذیرید');
      return;
    }
    if (!phone) {
      setError('لطفاً شماره موبایل خود را وارد کنید');
      return;
    }
    if (!validatePhone(phone)) {
      setError('شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cleanedPhone = cleanPhone(phone);
      await authService.sendOTP(cleanedPhone);
      setPendingAuth(cleanedPhone);
      setLoading(false);
      router.push(`/auth/verify-otp?redirect=${encodeURIComponent(redirectUrl)}`);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'خطا در ارسال کد تایید. لطفاً دوباره تلاش کنید.');
    }
  };

  const canSubmit = phone.length === 11 && validatePhone(phone) && termsAccepted && !loading;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* دایره‌های تزئینی */}
      <div
        className="absolute -top-20 -right-20 w-60 h-60 rounded-full"
        style={{ backgroundColor: colors.primary + '18' }}
      />
      <div
        className="absolute top-1/3 -left-24 w-48 h-48 rounded-full"
        style={{ backgroundColor: colors.primary + '12' }}
      />
      <div
        className="absolute -bottom-16 right-1/4 w-40 h-40 rounded-full"
        style={{ backgroundColor: colors.secondary + '15' }}
      />

      <div className="relative z-10 w-full max-w-md flex flex-col gap-8">
        {/* لوگو و برندینگ */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: colors.cardBackground,
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
              style={{ backgroundColor: colors.primary }}
            >
              🌸
            </div>
          </div>
          <h1
            className="text-4xl font-[Vazir-Bold] tracking-wide"
            style={{ color: colors.textMain }}
          >
            زیبانو
          </h1>
          <p className="text-sm text-center" style={{ color: colors.textSecondary }}>
            رزرو آنلاین خدمات زیبایی و سلامت
          </p>
        </div>

        {/* کارت ورود */}
        <div
          className="rounded-3xl p-6 border"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: colors.primary + '15' }}
            >
              <FiSmartphone size={22} style={{ color: colors.primary }} />
            </div>
            <div>
              <h2 className="text-lg font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                ورود به حساب
              </h2>
              <p className="text-xs" style={{ color: colors.textSecondary }}>
                شماره موبایل خود را وارد کنید
              </p>
            </div>
          </div>

          <Input
            label="شماره موبایل"
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            value={toPersianDigit(phone)}
            onChangeText={handlePhoneChange}
            type="tel"
            maxLength={11}
            error={error}
            rightIcon={<FiSmartphone size={18} style={{ color: colors.textSecondary }} />}
          />

          {phone.length > 0 && phone.length < 11 && (
            <div
              className="flex items-center gap-2 py-1.5 px-3 rounded-lg border self-start mb-3"
              style={{
                backgroundColor: colors.primary + '08',
                borderColor: colors.primary + '25',
              }}
            >
              <span className="text-xs font-[Vazir-Medium]" style={{ color: colors.primary }}>
                {toPersianDigit(phone.length)} از ۱۱ رقم وارد شده
              </span>
            </div>
          )}

          {/* چک‌باکس قوانین */}
          <label className="flex items-start gap-3 cursor-pointer py-2 mb-4">
            <button
              onClick={() => setTermsAccepted(!termsAccepted)}
              className="mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors"
              style={{
                backgroundColor: termsAccepted ? colors.primary : 'transparent',
                borderColor: termsAccepted ? colors.primary : colors.border,
              }}
              type="button"
            >
              {termsAccepted && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7l3.5 3.5L12 3.5"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
            <span className="text-[13px] leading-5" style={{ color: colors.textMain }}>
              با{' '}
              <span className="font-[Vazir-Bold] underline" style={{ color: colors.primary }}>
                قوانین و مقررات
              </span>{' '}
              و{' '}
              <span className="font-[Vazir-Bold] underline" style={{ color: colors.primary }}>
                حریم خصوصی
              </span>{' '}
              موافقم
            </span>
          </label>

          <Button
            title="دریافت کد تایید"
            onPress={handleSendOtp}
            loading={loading}
            disabled={!canSubmit}
            variant="primary"
            size="lg"
            fullWidth
            icon={<FiSend size={16} color="#fff" />}
            iconPosition="right"
          />
        </div>

        {/* فوتر اعتماد */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="flex items-center gap-2 py-2 px-4 rounded-full border"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            }}
          >
            <FiShield size={14} style={{ color: colors.primary }} />
            <span className="text-xs font-[Vazir-Medium]" style={{ color: colors.textSecondary }}>
              ورود امن و رمزنگاری شده
            </span>
          </div>
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            زیبانو — نسخه ۱.۰.۰
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
