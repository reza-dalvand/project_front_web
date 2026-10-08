/**
 * 🔐 useAuthFlow — Hook مشترک جریان احراز هویت OTP
 *
 * استفاده شده در:
 *   - src/app/auth/verify-otp/page.jsx
 *   - src/components/common/AuthModal.jsx
 *
 * ✅ FIX: استفاده از camelCase به جای snake_case
 * ✅ FIX F-16: استفاده از timestamp سرور به جای countdown سمت کلاینت
 */
import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { authService } from '@/api';
import { OTP_CONFIG } from '@/api/config';

const OTP_LENGTH = OTP_CONFIG.CODE_LENGTH;
const RESEND_SECONDS = OTP_CONFIG.RESEND_COOLDOWN_SECONDS;

export const useAuthFlow = (options = {}) => {
  const { enabled = true, onVerifySuccess } = options;

  const login = useAuthStore((s) => s.login);
  const updateUser = useAuthStore((s) => s.updateUser);
  const completeProfile = useAuthStore((s) => s.completeProfile);

  // ─── State‌ها ───
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // ✅ FIX F-16: استفاده از timestamp مطلق به جای countdown
  const [resendAvailableAt, setResendAvailableAt] = useState(null); // timestamp ms
  const [timer, setTimer] = useState(0); // seconds remaining
  const [canResend, setCanResend] = useState(false);

  // ─── ✅ FIX F-16: تایمر بر اساس timestamp سرور ───
  useEffect(() => {
    if (!enabled || !resendAvailableAt) {
      setCanResend(true);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((resendAvailableAt - now) / 1000));
      
      setTimer(remaining);
      setCanResend(remaining <= 0);
    };

    // اولین محاسبه
    updateTimer();

    // آپدیت هر ثانیه
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [resendAvailableAt, enabled]);

  // ─── تایید کد OTP ───
  const verifyOtp = useCallback(
    async (phone, code) => {
      if (!code || code.length < OTP_LENGTH) {
        const msg = `کد ${OTP_LENGTH} رقمی را کامل وارد کنید`;
        setError(msg);
        return { success: false, error: msg };
      }

      setLoading(true);
      setError('');

      try {
        const result = await authService.verifyOTP(phone, code);

        if (!result?.data?.user) {
          throw new Error('خطا در ورود. لطفاً دوباره تلاش کنید.');
        }

        const data = result.data;

        login(
          data.user,
          {
            accessToken: data.accessToken, 
            refreshToken: data.refreshToken,
          },
          {
            needsProfileCompletion: data.needsProfileCompletion ?? false, 
            isSuspended: data.isSuspended ?? false, 
            suspensionReason: data.suspensionReason ?? '', 
          }
        );

        setLoading(false);

        if (onVerifySuccess) {
          onVerifySuccess({
            isNewUser: data.isNewUser,
            needsProfileCompletion: data.needsProfileCompletion,
            isSuspended: data.isSuspended ?? false,
          });
        }

        return { success: true, data };
      } catch (err) {
        setLoading(false);
        const errorMsg = err.message || 'خطا در تایید کد';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    },
    [login, onVerifySuccess]
  );

  // ─── ارسال مجدد کد OTP ───
  const resendOtp = useCallback(async (phone) => {
    try {
      const result = await authService.sendOTP(phone);
      const data = result?.data;
      
      // ✅ FIX F-16: استفاده از timestamp سرور
      const resendAfter = data?.resendAfter || data?.resend_after || RESEND_SECONDS;
      const availableAt = Date.now() + (resendAfter * 1000);
      
      setResendAvailableAt(availableAt);
      setOtp(Array(OTP_LENGTH).fill(''));
      setError('');
      return { success: true, resendAvailableAt: availableAt };
    } catch (err) {
      // ✅ FIX F-16: اگر سرور remaining_seconds برگرداند
      if (err?.details?.remainingSeconds) {
        const availableAt = Date.now() + (err.details.remainingSeconds * 1000);
        setResendAvailableAt(availableAt);
      }
      
      const errorMsg = err.message || 'خطا در ارسال مجدد';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  // ─── ذخیره پروفایل کاربر جدید ───
  const saveProfile = useCallback(
    async (firstName, lastName) => {
      if (!firstName.trim() || !lastName.trim()) {
        return { success: false, error: 'نام و نام خانوادگی الزامی است' };
      }
      if (firstName.trim().length < 2 || lastName.trim().length < 2) {
        return {
          success: false,
          error: 'نام و نام خانوادگی باید حداقل ۲ کاراکتر باشد',
        };
      }

      setLoading(true);
      try {
        const { profileService } = await import('@/api/services/profile.service');
        await profileService.updateProfile({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        });

        updateUser({
          name: `${firstName.trim()} ${lastName.trim()}`,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        });
        completeProfile();

        setLoading(false);
        return { success: true };
      } catch (err) {
        setLoading(false);
        return {
          success: false,
          error: err.message || 'خطا در ذخیره پروفایل',
        };
      }
    },
    [updateUser, completeProfile]
  );

  // ─── ریست کامل state ───
  const reset = useCallback(() => {
    setOtp(Array(OTP_LENGTH).fill(''));
    setLoading(false);
    setError('');
    // ✅ FIX F-16: تنظیم resendAvailableAt بر اساس زمان فعلی
    setResendAvailableAt(Date.now() + (RESEND_SECONDS * 1000));
  }, []);

  // ─── فرمت زمان برای نمایش ───
  const formatTimer = useCallback(() => {
    const m = Math.floor(timer / 60);
    const s = timer % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, [timer]);

  return {
    otp,
    setOtp,
    loading,
    error,
    setError,
    timer,
    canResend,
    otpLength: OTP_LENGTH,
    resendSeconds: RESEND_SECONDS,
    verifyOtp,
    resendOtp,
    saveProfile,
    reset,
    formatTimer,
    // ✅ FIX F-16: expose برای کامپوننت‌ها
    resendAvailableAt,
  };
};