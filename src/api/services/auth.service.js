// src/api/services/auth.service.js
/**
 * 🔐 Auth Service — نسخه نهایی هماهنگ با بک‌اند (فاز ۲)
 *
 * Endpoints:
 * POST /accounts/auth/otp/send/
 * POST /accounts/auth/otp/verify/
 * POST /accounts/auth/refresh/
 * POST /accounts/auth/logout/
 * ✅ NEW: GET /accounts/auth/session-status/
 */
import apiClient from '../api-client';

export const authService = {
  /**
   * ارسال کد OTP
   * ✅ FIX F-16: برگرداندن resend_available_at
   */
  sendOTP: async (phone) => {
    const response = await apiClient.post('/accounts/auth/otp/send/', { phone });
    return response;
  },

  /**
   * تایید کد OTP و ورود
   */
  verifyOTP: async (phone, code) => {
    const response = await apiClient.post('/accounts/auth/otp/verify/', { phone, code });
    return response;
  },

  /**
   * Refresh Token
   */
  refreshToken: async (refreshToken) => {
    const response = await apiClient.post('/accounts/auth/refresh/', {
      refresh: refreshToken,
    });
    return response;
  },

  /**
   * Logout
   */
  logout: async (refreshToken, allDevices = false) => {
    const response = await apiClient.post('/accounts/auth/logout/', {
      refresh_token: refreshToken,
      all_devices: allDevices,
    });
    return response;
  },

  /**
   * ✅ FIX F-15: بررسی وضعیت session
   * Returns: { isSuspended, suspensionReason, isDeactivated, isActive }
   */
  getSessionStatus: async () => {
    const response = await apiClient.get('/accounts/auth/session-status/');
    return response;
  },

  /**
   * ارسال کد تایید حذف حساب
   */
  sendDeleteAccountOTP: async () => {
    const response = await apiClient.post('/accounts/auth/delete-account/send-otp/');
    return response;
  },

  /**
   * حذف حساب کاربری
   */
  deleteAccount: async (confirmationCode) => {
    const response = await apiClient.post('/accounts/auth/delete-account/', {
      confirmation_code: confirmationCode,
    });
    return response;
  },
};