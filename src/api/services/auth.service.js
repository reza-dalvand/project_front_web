// src/api/services/auth.service.js
/**
 * 🔐 Auth Service — نسخه نهایی هماهنگ با بک‌اند (فاز ۲)
 *
 * Endpoints:
 *   POST /accounts/auth/otp/send/
 *   POST /accounts/auth/otp/verify/
 *   POST /accounts/auth/token/refresh/
 *   POST /accounts/auth/token/verify/
 *   POST /accounts/auth/logout/
 *   POST /accounts/auth/national-id/verify/
 *   GET  /accounts/devices/
 *   POST /accounts/devices/{device_id}/revoke/
 *   POST /accounts/account/delete/
 *   POST /accounts/account/delete/send-otp/  ← جدید
 */
import apiClient from '../api-client';

export const authService = {
  // ═══════════ OTP ═══════════
  /**
   * ارسال کد تایید
   * POST /accounts/auth/otp/send/
   * @param {string} phone
   * @returns {Promise} - { expires_in, resend_after, is_registered }
   */
  sendOTP: (phone) => {
    return apiClient.post('/accounts/auth/otp/send/', { phone });
  },

  /**
   * تایید کد OTP و ورود/ثبت‌نام
   * POST /accounts/auth/otp/verify/
   * @param {string} phone
   * @param {string} code
   * @returns {Promise} - { is_new_user, needs_profile_completion, access_token, refresh_token, user }
   */
  verifyOTP: (phone, code) => {
    return apiClient.post('/accounts/auth/otp/verify/', { phone, code });
  },

  // ═══════════ Token ═══════════
  /**
   * Refresh Token با چرخش خودکار
   * POST /accounts/auth/token/refresh/
   * @param {string} refreshToken
   * @returns {Promise} - { access, refresh, token_type, user }
   */
  refreshToken: (refreshToken) => {
    return apiClient.post('/accounts/auth/token/refresh/', { refresh: refreshToken });
  },

  /**
   * Verify Token
   * POST /accounts/auth/token/verify/
   * @param {string} token
   */
  verifyToken: (token) => {
    return apiClient.post('/accounts/auth/token/verify/', { token });
  },

  // ═══════════ Logout ═══════════
  /**
   * خروج از حساب
   * POST /accounts/auth/logout/
   * @param {string|null} refreshToken
   * @param {boolean} allDevices
   */
  logout: (refreshToken = null, allDevices = false) => {
    const payload = {};
    if (refreshToken) payload.refresh_token = refreshToken;
    if (allDevices) payload.all_devices = allDevices;
    return apiClient.post('/accounts/auth/logout/', payload);
  },

  // ═══════════ National ID (شاهکار) ═══════════
  /**
   * استعلام کد ملی
   * POST /accounts/auth/national-id/verify/
   * @param {string} nationalId
   */
  verifyNationalId: (nationalId) => {
    return apiClient.post('/accounts/auth/national-id/verify/', { national_id: nationalId });
  },

  // ═══════════ Devices ═══════════
  getDevices: () => {
    return apiClient.get('/accounts/devices/');
  },

  revokeDevice: (deviceId) => {
    return apiClient.post(`/accounts/devices/${deviceId}/revoke/`);
  },

  // ═══════════ Account ═══════════
  /**
   * ✅ جدید: ارسال OTP برای حذف حساب
   * POST /accounts/account/delete/send-otp/
   */
  sendDeleteAccountOTP: () => {
    return apiClient.post('/accounts/account/delete/send-otp/');
  },

  /**
   * حذف حساب کاربری
   * POST /accounts/account/delete/
   * @param {string} confirmationCode - کد ۵ رقمی OTP
   */
  deleteAccount: (confirmationCode) => {
    return apiClient.post('/accounts/account/delete/', {
      confirmation_code: confirmationCode,
    });
  },
};
