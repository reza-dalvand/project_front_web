// src/api/services/auth.service.js
/**
 * 🔐 Auth Service
 *
 * مدیریت احراز هویت:
 * - ارسال و تایید OTP
 * - Refresh Token
 * - Logout
 * - استعلام کد ملی (شاهکار)
 * - مدیریت دستگاه‌ها
 * - حذف حساب
 */
import apiClient from '../api-client';

export const authService = {
  // ═══════════ OTP ═══════════

  /**
   * ارسال کد تایید
   * POST /accounts/auth/otp/send/
   */
  sendOTP: (phone) => {
    return apiClient.post('/accounts/auth/otp/send/', { phone });
  },

  /**
   * تایید کد OTP و ورود/ثبت‌نام
   * POST /accounts/auth/otp/verify/
   */
  verifyOTP: (phone, code) => {
    return apiClient.post('/accounts/auth/otp/verify/', { phone, code });
  },

  // ═══════════ Token ═══════════

  /**
   * Refresh Token
   * POST /accounts/auth/token/refresh/
   */
  refreshToken: (refreshToken) => {
    return apiClient.post('/accounts/auth/token/refresh/', { refresh: refreshToken });
  },

  /**
   * Verify Token
   * POST /accounts/auth/token/verify/
   */
  verifyToken: (token) => {
    return apiClient.post('/accounts/auth/token/verify/', { token });
  },

  // ═══════════ Logout ═══════════

  /**
   * خروج از حساب
   * POST /accounts/auth/logout/
   */
  logout: (refreshToken = null, allDevices = false) => {
    return apiClient.post('/accounts/auth/logout/', {
      refresh_token: refreshToken,
      all_devices: allDevices,
    });
  },

  // ═══════════ National ID ═══════════

  /**
   * استعلام کد ملی (شاهکار)
   * POST /accounts/auth/national-id/verify/
   */
  verifyNationalId: (nationalId) => {
    return apiClient.post('/accounts/auth/national-id/verify/', { national_id: nationalId });
  },

  // ═══════════ Devices ═══════════

  /**
   * لیست دستگاه‌های فعال
   * GET /accounts/devices/
   */
  getDevices: () => {
    return apiClient.get('/accounts/devices/');
  },

  /**
   * خروج از یک دستگاه خاص
   * POST /accounts/devices/{device_id}/revoke/
   */
  revokeDevice: (deviceId) => {
    return apiClient.post(`/accounts/devices/${deviceId}/revoke/`);
  },

  // ═══════════ Account ═══════════

  /**
   * حذف حساب کاربری
   * POST /accounts/account/delete/
   */
  deleteAccount: (confirmationCode) => {
    return apiClient.post('/accounts/account/delete/', { confirmation_code: confirmationCode });
  },
};
