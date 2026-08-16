// src/hooks/useAuthFlow.js
/**
 * 🔐 useAuthFlow — Hook مشترک جریان احراز هویت OTP
 *
 * استفاده شده در:
 *   - src/app/auth/verify-otp/page.jsx
 *   - src/components/common/AuthModal.jsx
 *
 * مسئولیت‌ها:
 *   - مدیریت state OTP (آرایه ارقام)
 *   - تایمر ارسال مجدد
 *   - تایید کد OTP (verifyOtp)
 *   - ارسال مجدد کد (resendOtp)
 *   - ذخیره پروفایل کاربر جدید (saveProfile)
 *   - مدیریت خطاها و loading
 *
 * ⚠️ FIX فاز ۱: استفاده از camelCase (accessToken, refreshToken, ...)
 */
import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { authService } from '@/api';
import { OTP_CONFIG } from '@/api/config';

const OTP_LENGTH = OTP_CONFIG.CODE_LENGTH;
const RESEND_SECONDS = OTP_CONFIG.RESEND_COOLDOWN_SECONDS;

/**
 * @param {object} options
 * @param {boolean} options.enabled - آیا تایمر فعال باشد (پیش‌فرض: true)
 * @param {function} options.onVerifySuccess - callback پس از تایید موفق
 *   دریافت می‌کند: { user, isNewUser, needsProfileCompletion }
 * @returns {object} - state و action‌های جریان احراز هویت
 */
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
  /**
   * @param {string} phone - شماره موبایل
   * @param {string} code - کد OTP واردشده (otp.join(''))
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  const verifyOtp = useCallback(
    async (phone, code) => {
      // بررسی کامل بودن کد
      if (!code || code.length < OTP_LENGTH) {
        const msg = `کد ${OTP_LENGTH} رقمی را کامل وارد کنید`;
        setError(msg);
        return { success: false, error: msg };
      }

      setLoading(true);
      setError('');

      try {
        const result = await authService.verifyOTP(phone, code);

        // بررسی null بودن data
        if (!result?.data?.user) {
          throw new Error('خطا در ورود. لطفاً دوباره تلاش کنید.');
        }

        // ✅ FIX فاز ۱: camelCase — response-normalizer تبدیل کرده
        const { user, accessToken, refreshToken, isNewUser, needsProfileCompletion } = result.data;

        // ذخیره در store
        login(user, { accessToken, refreshToken }, { isNewUser, needsProfileCompletion });

        // callback اختیاری
        onVerifySuccess?.({ user, isNewUser, needsProfileCompletion });

        setLoading(false);
        return { success: true, data: result.data };
      } catch (err) {
        setLoading(false);
        const errorMsg = err.message || 'کد وارد شده صحیح نیست';
        setError(errorMsg);
        setOtp(Array(OTP_LENGTH).fill(''));
        return { success: false, error: errorMsg };
      }
    },
    [login, onVerifySuccess]
  );

  // ─── ارسال مجدد کد OTP ───
  /**
   * @param {string} phone - شماره موبایل
   * @returns {Promise<{success: boolean, error?: string}>}
   */
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
  /**
   * @param {string} firstName
   * @param {string} lastName
   * @returns {Promise<{success: boolean, error?: string}>}
   */
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
    // State
    otp,
    setOtp,
    loading,
    error,
    setError,
    timer,
    canResend,

    // ثابت‌ها
    otpLength: OTP_LENGTH,
    resendSeconds: RESEND_SECONDS,

    // Action‌ها
    verifyOtp,
    resendOtp,
    saveProfile,
    reset,
    formatTimer,
  };
};
