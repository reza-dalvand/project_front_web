// src/components/common/AuthModal.jsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore, useAuthModal } from '@/stores/useAuthStore';
import { useToast } from '@/hooks/useToast';
import { validatePhone, cleanPhone } from '@/utils/phoneUtils';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';
import { authService } from '@/api';
import { OTP_CONFIG } from '@/api/config';
import AuthInfoStep from './auth/AuthInfoStep';
import AuthOtpStep from './auth/AuthOtpStep';
import AuthProfileStep from './auth/AuthProfileStep';
import AuthSuccessStep from './auth/AuthSuccessStep';

const OTP_LENGTH = OTP_CONFIG.CODE_LENGTH;
const RESEND_SECONDS = OTP_CONFIG.RESEND_COOLDOWN_SECONDS;

export default function AuthModal({ variant = 'bottomsheet' }) {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const login = useAuthStore((s) => s.login);
  const { showAuthModal, closeAuthModal, cancelAuthModal } = useAuthModal();
  const instanceId = useRef('auth-modal');

  const [stage, setStage] = useState('info');
  const [phone, setPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    } catch (err) {
      setLoading(false);
      setError(err.message || 'خطا در ارسال کد تایید');
    }
  };

  // ─── تایید OTP ───
  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setError('کد ۵ رقمی کامل نیست');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await authService.verifyOTP(cleanPhone(phone), code);
      if (!result?.data?.user) throw new Error('خطا در ورود. لطفاً دوباره تلاش کنید.');
      const { user, access_token, refresh_token, is_new_user, needs_profile_completion } = result.data;
      login(user, { access_token, refresh_token }, { is_new_user, needs_profile_completion });
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
    }
  };

  // ─── ارسال مجدد ───
  const handleResend = async () => {
    try {
      await authService.sendOTP(cleanPhone(phone));
      setTimer(RESEND_SECONDS);
      setCanResend(false);
      setOtp(['', '', '', '', '']);
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
      const { useAuthStore: authStore } = await import('@/stores/useAuthStore');
      authStore.getState().updateUser({
        name: `${firstName.trim()} ${lastName.trim()}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      authStore.getState().completeProfile();
      setStage('success');
      setLoading(false);
      setTimeout(() => closeAuthModal(), 1500);
    } catch (err) {
      setLoading(false);
      setProfileError(err.message || 'خطا در ذخیره پروفایل');
    }
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

  const renderStep = () => {
    switch (stage) {
      case 'info':
        return (
          <AuthInfoStep
            phone={phone}
            onPhoneChange={setPhone}
            termsAccepted={termsAccepted}
            onTermsChange={setTermsAccepted}
            error={error}
            loading={loading}
            onSendOtp={handleSendOtp}
          />
        );
      case 'otp':
        return (
          <AuthOtpStep
            otp={otp}
            onOtpChange={(newOtp) => {
              setOtp(newOtp);
              if (error) setError('');
            }}
            maskedPhone={maskedPhone}
            error={error}
            loading={loading}
            timer={timer}
            canResend={canResend}
            onVerify={handleVerifyOtp}
            onResend={handleResend}
            onEditPhone={() => setStage('info')}
            otpLength={OTP_LENGTH}
          />
        );
      case 'profile':
        return (
          <AuthProfileStep
            firstName={firstName}
            lastName={lastName}
            onFirstNameChange={(t) => {
              setFirstName(t);
              if (profileError) setProfileError('');
            }}
            onLastNameChange={(t) => {
              setLastName(t);
              if (profileError) setProfileError('');
            }}
            error={profileError}
            loading={loading}
            onSave={handleSaveProfile}
          />
        );
      case 'success':
        return <AuthSuccessStep />;
      default:
        return null;
    }
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
          {renderStep()}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}