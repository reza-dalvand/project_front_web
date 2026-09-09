// src/hooks/useAuthFlow.js
/**
 * 🔐 useAuthFlow — Hook مشترک جریان احراز هویت OTP
 *
 * استفاده شده در:
 *   - src/app/auth/verify-otp/page.jsx
 *   - src/components/common/AuthModal.jsx
 *
 * ✅ FIX: استفاده از camelCase به جای snake_case
 *   چون response-normalizer همه کلیدها را به camelCase تبدیل می‌کند
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
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);

  // ─── تایمر ارسال مجدد ───
  useEffect(() => {
    if (!enabled) return;
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, enabled]);

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

        // ✅ FIX: استفاده از camelCase (response-normalizer کلیدها را تبدیل کرده)
        //   access_token → accessToken
        //   refresh_token → refreshToken
        //   is_suspended → isSuspended
        //   suspension_reason → suspensionReason
        //   needs_profile_completion → needsProfileCompletion
        login(
          data.user,
          {
            accessToken: data.accessToken, // ✅ FIX: بود data.access_token
            refreshToken: data.refreshToken, // ✅ FIX: بود data.refresh_token
          },
          {
            needsProfileCompletion: data.needsProfileCompletion ?? false, // ✅ FIX
            isSuspended: data.isSuspended ?? false, // ✅ FIX
            suspensionReason: data.suspensionReason ?? '', // ✅ FIX
          }
        );

        setLoading(false);

        if (onVerifySuccess) {
          onVerifySuccess({
            isNewUser: data.isNewUser, // ✅ FIX
            needsProfileCompletion: data.needsProfileCompletion, // ✅ FIX
            isSuspended: data.isSuspended ?? false, // ✅ FIX
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
      await authService.sendOTP(phone);
      setTimer(RESEND_SECONDS);
      setCanResend(false);
      setOtp(Array(OTP_LENGTH).fill(''));
      setError('');
      return { success: true };
    } catch (err) {
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
    setTimer(RESEND_SECONDS);
    setCanResend(false);
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
  };
};
