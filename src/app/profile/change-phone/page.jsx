'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSmartphone, FiEdit, FiRefreshCw } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { toPersianDigit, toEnglishDigits } from '@/utils/numberUtils';
import { validatePhone } from '@/utils/phoneUtils';
import { useToast } from '@/hooks/useToast';

const OTP_LENGTH = 5;
const RESEND_SECONDS = 60;
const MOCK_OTP = '12345';

export default function ChangePhonePage() {
  const router = useRouter();
  const { colors } = useTheme();
  const updateUser = useAuthStore((s) => s.updateUser);
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [newPhone, setNewPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [currentBox, setCurrentBox] = useState(0);
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (step !== 2) return;
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  const handlePhoneChange = (text) => {
    const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
    if (cleaned.length <= 11) {
      setNewPhone(cleaned);
      if (phoneError) setPhoneError('');
    }
  };

  const handleSendOtp = async () => {
    if (!validatePhone(newPhone)) {
      setPhoneError('شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)');
      return;
    }
    setLoading(true);
    setPhoneError('');
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setStep(2);
    setTimer(RESEND_SECONDS);
    setCanResend(false);
    showToast(`کد تایید به شماره ${toPersianDigit(newPhone)} ارسال شد`, 'success');
    setTimeout(() => inputRefs.current[0]?.focus(), 300);
  };

  const handleChangeOtp = (text, index) => {
    const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
    const newOtp = [...otp];

    if (cleaned.length > 1) {
      const digits = cleaned.slice(0, OTP_LENGTH).split('');
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
    newOtp[index] = digit;
    setOtp(newOtp);
    if (otpError) setOtpError('');

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

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setOtpError(`کد ${OTP_LENGTH} رقمی را کامل وارد کنید`);
      return;
    }
    setLoading(true);
    setOtpError('');
    await new Promise((r) => setTimeout(r, 1000));

    if (code === MOCK_OTP) {
      setLoading(false);
      updateUser({ phone: newPhone });
      showToast('شماره موبایل با موفقیت تغییر یافت', 'success');
      setTimeout(() => router.back(), 1200);
    } else {
      setOtpError('کد وارد شده صحیح نیست');
      setLoading(false);
    }
  };

  const handleResend = () => {
    setTimer(RESEND_SECONDS);
    setCanResend(false);
    setOtp(['', '', '', '', '']);
    setCurrentBox(0);
    inputRefs.current[0]?.focus();
    showToast('کد جدید ارسال شد', 'info');
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return toPersianDigit(`${m}:${s.toString().padStart(2, '0')}`);
  };

  const maskedPhone = newPhone
    ? newPhone.slice(0, 4) + '***' + newPhone.slice(-4)
    : '';

  return (
    <ScreenWrapper padding={0}>
      <Header
        title="تغییر شماره موبایل"
        onBackPress={() => router.back()}
      />

      <div className="flex-1 overflow-y-auto px-5 pt-8 pb-10">
        {step === 1 && (
          <div className="space-y-5">
            <div className="flex flex-col items-center gap-4 mb-6">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.primary + '15' }}
              >
                <FiSmartphone size={44} style={{ color: colors.primary }} />
              </div>
              <div className="text-center">
                <h3
                  className="text-xl font-[Vazir-Bold] mb-2"
                  style={{ color: colors.textMain }}
                >
                  تغییر شماره موبایل
                </h3>
                <p
                  className="text-sm leading-6 px-4"
                  style={{ color: colors.textSecondary }}
                >
                  برای امنیت بیشتر، شماره جدید شما باید با کد تایید (OTP) احراز هویت شود
                </p>
              </div>
            </div>

            <Card
              variant="default"
              padding={14}
              radius={14}
              className="border"
            >
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0">ℹ️</span>
                <p
                  className="text-xs font-[Vazir] leading-5 flex-1"
                  style={{ color: colors.textMain }}
                >
                  پس از تغییر شماره، برای ورود به حساب از شماره جدید استفاده خواهید کرد
                </p>
              </div>
            </Card>

            <Input
              label="شماره موبایل جدید"
              placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
              value={toPersianDigit(newPhone)}
              onChangeText={handlePhoneChange}
              type="tel"
              maxLength={11}
              error={phoneError}
              rightIcon={<FiSmartphone size={18} style={{ color: colors.textSecondary }} />}
            />

            <Button
              title="ارسال کد تایید"
              onPress={handleSendOtp}
              loading={loading}
              disabled={!newPhone || loading}
              variant="primary"
              size="lg"
              fullWidth
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="flex flex-col items-center gap-4 mb-6">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.primary + '15' }}
              >
                <span className="text-4xl">💬</span>
              </div>
              <div className="text-center">
                <h3
                  className="text-xl font-[Vazir-Bold] mb-2"
                  style={{ color: colors.textMain }}
                >
                  کد تایید را وارد کنید
                </h3>
                <p
                  className="text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  کد {toPersianDigit(OTP_LENGTH)} رقمی پیامک‌شده به{' '}
                  <span className="font-[Vazir-Bold]" style={{ color: colors.primary }}>
                    {toPersianDigit(maskedPhone)}
                  </span>
                </p>
              </div>
            </div>

            {/* OTP Inputs */}
            <div className="flex justify-center gap-2.5" dir="ltr">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={toPersianDigit(digit)}
                  onChange={(e) => handleChangeOtp(e.target.value, index)}
                  onKeyDown={(e) => handleKeyPress(e, index)}
                  onFocus={() => setCurrentBox(index)}
                  className="w-14 h-[60px] rounded-[14px] text-center text-[22px] font-[Vazir-Bold] outline-none transition-all"
                  style={{
                    backgroundColor: colors.cardBackground,
                    borderColor:
                      otpError && digit === ''
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

            {otpError && (
              <p className="text-center text-sm" style={{ color: '#E57373' }}>
                {otpError}
              </p>
            )}

            <div className="flex justify-between items-center px-1">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1"
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
                <button onClick={handleResend}>
                  <span
                    className="text-sm font-[Vazir-Bold]"
                    style={{ color: colors.primary }}
                  >
                    ارسال مجدد کد
                  </span>
                </button>
              ) : (
                <span
                  className="text-sm font-[Vazir]"
                  style={{ color: colors.textSecondary }}
                >
                  ارسال مجدد تا {formatTime(timer)}
                </span>
              )}
            </div>

            <Button
              title="تایید و تغییر شماره"
              onPress={handleVerifyOtp}
              loading={loading}
              disabled={otp.join('').length < OTP_LENGTH || loading}
              variant="primary"
              size="lg"
              fullWidth
            />

            <div
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border"
              style={{
                backgroundColor: colors.primary + '10',
                borderColor: colors.primary + '30',
              }}
            >
              <span className="text-xs font-[Vazir]" style={{ color: colors.primary }}>
                حالت آزمایشی: کد تایید{' '}
                <span className="font-[Vazir-Bold]">۱۲۳۴۵</span> است
              </span>
            </div>
          </div>
        )}
      </div>
    </ScreenWrapper>
  );
}