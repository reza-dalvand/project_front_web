// src/components/common/AuthModal.jsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  FiMessageSquare,
  FiSmartphone,
  FiUser,
  FiShield,
  FiCheck,
  FiEdit,
  FiX,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore, useAuthModal } from '@/stores/useAuthStore';
import { useToast } from '@/hooks/useToast';
import Button from './Button';
import Input from './Input';
import { validatePhone, cleanPhone } from '@/utils/phoneUtils';
import { toPersianDigit, toEnglishDigits } from '@/utils/numberUtils';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';
import { authService } from '@/api';
import { OTP_CONFIG } from '@/api/config';

const OTP_LENGTH = OTP_CONFIG.CODE_LENGTH;
const RESEND_SECONDS = OTP_CONFIG.RESEND_COOLDOWN_SECONDS;

export default function AuthModal({ variant = 'bottomsheet' }) {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const login = useAuthStore((s) => s.login);
  const { showAuthModal, closeAuthModal, cancelAuthModal } = useAuthModal();

  const instanceId = useRef('auth-modal');

  // stages: 'info' | 'otp' | 'profile' | 'success'
  const [stage, setStage] = useState('info');
  const [phone, setPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [currentBox, setCurrentBox] = useState(0);
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  // ✅ جدید: فیلدهای پروفایل
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileError, setProfileError] = useState('');

  // Reset هنگام باز شدن
  useEffect(() => {
    if (showAuthModal) {
      setStage('info');
      setPhone('');
      setTermsAccepted(false);
      setOtp(['', '', '', '', '']);
      setCurrentBox(0);
      setTimer(RESEND_SECONDS);
      setCanResend(false);
      setError('');
      setLoading(false);
      setFirstName('');
      setLastName('');
      setProfileError('');
    }
  }, [showAuthModal]);

  // تایمر
  useEffect(() => {
    if (!showAuthModal || stage !== 'otp') return;
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [stage, timer, showAuthModal]);

  // Escape
  useEffect(() => {
    if (!showAuthModal) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') cancelAuthModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showAuthModal, cancelAuthModal]);

  // قفل اسکرول
  useEffect(() => {
    if (showAuthModal) acquireScrollLock(instanceId.current);
    else releaseScrollLock(instanceId.current);
    return () => releaseScrollLock(instanceId.current);
  }, [showAuthModal]);

  // ─── ارسال OTP ───
  const handleSendOtp = async () => {
    if (!termsAccepted) {
      setError('لطفاً ابتدا قوانین را بپذیرید');
      return;
    }
    if (!validatePhone(phone)) {
      setError('شماره موبایل معتبر نیست');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.sendOTP(cleanPhone(phone));
      setLoading(false);
      setStage('otp');
      setTimer(RESEND_SECONDS);
      setCanResend(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 400);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'خطا در ارسال کد تایید');
    }
  };

  // ─── تایید OTP ───
  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setError(`کد ${toPersianDigit(OTP_LENGTH)} رقمی کامل نیست`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await authService.verifyOTP(cleanPhone(phone), code);

      if (!result?.data?.user) {
        throw new Error('خطا در ورود. لطفاً دوباره تلاش کنید.');
      }

      const { user, access_token, refresh_token, is_new_user, needs_profile_completion } =
        result.data;

      login(user, { access_token, refresh_token }, { is_new_user, needs_profile_completion });

      // ✅ اگر پروفایل ناقص است → مرحله پروفایل
      if (needs_profile_completion) {
        setStage('profile');
        setLoading(false);
        return;
      }

      setStage('success');
      setLoading(false);
      setTimeout(() => closeAuthModal(), 1500);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'کد وارد شده صحیح نیست');
      setOtp(['', '', '', '', '']);
      setCurrentBox(0);
    }
  };

  // ─── ارسال مجدد ───
  const handleResend = async () => {
    try {
      await authService.sendOTP(cleanPhone(phone));
      setTimer(RESEND_SECONDS);
      setCanResend(false);
      setOtp(['', '', '', '', '']);
      setCurrentBox(0);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || 'خطا در ارسال مجدد');
    }
  };

  // ─── ذخیره پروفایل ───
  const handleSaveProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setProfileError('نام و نام خانوادگی الزامی است');
      return;
    }
    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setProfileError('نام و نام خانوادگی باید حداقل ۲ کاراکتر باشد');
      return;
    }

    setLoading(true);
    setProfileError('');

    try {
      const { profileService } = await import('@/api/services/profile.service');
      await profileService.updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });

      // بروزرسانی store
      const { useAuthStore } = await import('@/stores/useAuthStore');
      useAuthStore.getState().updateUser({
        name: `${firstName.trim()} ${lastName.trim()}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      useAuthStore.getState().completeProfile();

      setStage('success');
      setLoading(false);
      setTimeout(() => closeAuthModal(), 1500);
    } catch (err) {
      setLoading(false);
      setProfileError(err.message || 'خطا در ذخیره پروفایل');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return toPersianDigit(`${m}:${s.toString().padStart(2, '0')}`);
  };

  const maskedPhone = phone ? phone.slice(-4) + '***' + phone.slice(0, 4) : '';

  if (!showAuthModal) return null;

  const isBottomSheet = variant === 'bottomsheet';

  const containerClass = isBottomSheet
    ? 'fixed inset-0 z-[9999] flex items-end md:items-center justify-center'
    : 'fixed inset-0 z-[9999] flex items-center justify-center p-4';

  const panelClass = isBottomSheet
    ? 'relative w-full max-w-md rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col h-[96dvh] md:h-auto md:max-h-[92dvh]'
    : 'relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[96dvh] md:h-auto md:max-h-[92dvh]';

  const getTitle = () => {
    if (stage === 'info') return 'ورود / ثبت‌نام';
    if (stage === 'otp') return 'کد تایید';
    if (stage === 'profile') return 'تکمیل پروفایل';
    return 'ورود موفق';
  };

  const content = (
    <div
      className={containerClass}
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) cancelAuthModal();
      }}
    >
      <div
        className={panelClass}
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
          borderWidth: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {isBottomSheet && (
          <div className="flex justify-center pt-3 pb-1 md:hidden">
            <div className="w-10 h-1 rounded-full" style={{ backgroundColor: colors.border }} />
          </div>
        )}

        {/* هدر */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <h2 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            {getTitle()}
          </h2>
          <button
            onClick={cancelAuthModal}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={18} style={{ color: colors.textMain }} />
          </button>
        </div>

        <div
          className="p-5 overflow-y-auto flex-1 overscroll-contain"
          style={{
            paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* ═══ مرحله ۱: شماره موبایل ═══ */}
          {stage === 'info' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center gap-3 mb-2">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.primary + '15' }}
                >
                  <FiUser size={32} style={{ color: colors.primary }} />
                </div>
                <p className="text-sm text-center" style={{ color: colors.textSecondary }}>
                  شماره موبایل خود را وارد کنید
                </p>
              </div>

              <Input
                label="شماره موبایل"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                value={toPersianDigit(phone)}
                onChangeText={(t) => {
                  const cleaned = toEnglishDigits(t).replace(/[^0-9]/g, '');
                  if (cleaned.length <= 11) {
                    setPhone(cleaned);
                    if (error) setError('');
                  }
                }}
                type="tel"
                maxLength={11}
                error={error}
                rightIcon={<FiSmartphone size={18} style={{ color: colors.textSecondary }} />}
              />

              <label className="flex items-start gap-3 cursor-pointer py-2">
                <button
                  onClick={() => setTermsAccepted(!termsAccepted)}
                  className="mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{
                    backgroundColor: termsAccepted ? colors.primary : 'transparent',
                    borderColor: termsAccepted ? colors.primary : colors.border,
                  }}
                  type="button"
                >
                  {termsAccepted && <FiCheck size={14} style={{ color: '#fff' }} />}
                </button>
                <span className="text-[13px] leading-5" style={{ color: colors.textMain }}>
                  با{' '}
                  <span className="font-[Vazir-Bold] underline" style={{ color: colors.primary }}>
                    قوانین و مقررات
                  </span>{' '}
                  موافقم
                </span>
              </label>
              <div className="pb-6">
                <Button
                  title="دریافت کد تایید"
                  onPress={handleSendOtp}
                  loading={loading}
                  disabled={
                    phone.length !== 11 || !validatePhone(phone) || !termsAccepted || loading
                  }
                  variant="primary"
                  size="lg"
                  fullWidth
                />
              </div>
            </div>
          )}

          {/* ═══ مرحله ۲: کد OTP ═══ */}
          {stage === 'otp' && (
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
                    onChange={(e) => {
                      const cleaned = toEnglishDigits(e.target.value).replace(/[^0-9]/g, '');
                      const newOtp = [...otp];
                      if (cleaned.length > 1) {
                        const digits = cleaned.slice(0, OTP_LENGTH).split('');
                        digits.forEach((d, i) => {
                          if (index + i < OTP_LENGTH) newOtp[index + i] = d;
                        });
                        setOtp(newOtp);
                        const nextIndex = Math.min(index + digits.length, OTP_LENGTH - 1);
                        setCurrentBox(nextIndex);
                        inputRefs.current[nextIndex]?.focus();
                        return;
                      }
                      newOtp[index] = cleaned[0] || '';
                      setOtp(newOtp);
                      if (error) setError('');
                      if (cleaned && index < OTP_LENGTH - 1) {
                        inputRefs.current[index + 1]?.focus();
                        setCurrentBox(index + 1);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otp[index] && index > 0) {
                        inputRefs.current[index - 1]?.focus();
                        setCurrentBox(index - 1);
                      }
                    }}
                    onFocus={() => setCurrentBox(index)}
                    className="outline-none"
                    style={{
                      width: '52px',
                      height: '60px',
                      borderRadius: '14px',
                      backgroundColor: colors.cardBackground,
                      border: `2px solid ${
                        error && digit === ''
                          ? '#E57373'
                          : currentBox === index
                            ? colors.primary
                            : colors.border
                      }`,
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
                <button
                  onClick={() => setStage('info')}
                  className="flex items-center gap-1"
                  type="button"
                >
                  <FiEdit size={14} style={{ color: colors.primary }} />
                  <span className="text-sm font-[Vazir-Medium]" style={{ color: colors.primary }}>
                    ویرایش شماره
                  </span>
                </button>

                {canResend ? (
                  <button onClick={handleResend} type="button">
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
                  onPress={handleVerifyOtp}
                  loading={loading}
                  disabled={otp.join('').length < OTP_LENGTH || loading}
                  variant="primary"
                  size="lg"
                  fullWidth
                />
              </div>
            </div>
          )}

          {/* ═══ مرحله ۳: تکمیل پروفایل (جدید) ═══ */}
          {stage === 'profile' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center gap-3 mb-2">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#4CAF5015' }}
                >
                  <FiCheck size={32} color="#4CAF50" />
                </div>
                <p className="text-sm text-center" style={{ color: colors.textSecondary }}>
                  ورود موفق! لطفاً نام خود را وارد کنید
                </p>
              </div>

              <Input
                label="نام *"
                placeholder="مثال: مریم"
                value={firstName}
                onChangeText={(t) => {
                  setFirstName(t);
                  if (profileError) setProfileError('');
                }}
                error={profileError && !firstName.trim() ? profileError : ''}
              />

              <Input
                label="نام خانوادگی *"
                placeholder="مثال: حسینی"
                value={lastName}
                onChangeText={(t) => {
                  setLastName(t);
                  if (profileError) setProfileError('');
                }}
                error={profileError && !lastName.trim() ? profileError : ''}
              />

              <div className="pb-6">
                <Button
                  title="ذخیره و ادامه"
                  onPress={handleSaveProfile}
                  loading={loading}
                  disabled={loading}
                  variant="primary"
                  size="lg"
                  fullWidth
                />
              </div>
            </div>
          )}

          {/* ═══ مرحله ۴: موفقیت ═══ */}
          {stage === 'success' && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: '#4CAF50' }}
              >
                <FiCheck size={50} style={{ color: '#fff' }} />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                  خوش آمدید! 🎉
                </h3>
                <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
                  ورود شما با موفقیت انجام شد
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
