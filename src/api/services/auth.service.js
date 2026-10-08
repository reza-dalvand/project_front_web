// src/api/services/auth.service.js
/**
 * 🔐 Auth Service — نسخه نهایی هماهنگ با بک‌اند (فاز ۲)
 */
import apiClient from '../api-client';

export const authService = {
  sendOTP: async (phone) => {
    const response = await apiClient.post('/accounts/auth/otp/send/', { phone });
    return response;
  },

  verifyOTP: async (phone, code) => {
    const response = await apiClient.post('/accounts/auth/otp/verify/', { phone, code });
    return response;
  },

  refreshToken: async (refreshToken) => {
    const response = await apiClient.post('/accounts/auth/refresh/', {
      refresh: refreshToken,
    });
    return response;
  },

  logout: async (refreshToken, allDevices = false) => {
    const response = await apiClient.post('/accounts/auth/logout/', {
      refresh_token: refreshToken,
      all_devices: allDevices,
    });
    return response;
  },

  getSessionStatus: async () => {
    const response = await apiClient.get('/accounts/auth/session-status/');
    return response;
  },

  sendDeleteAccountOTP: async () => {
    const response = await apiClient.post('/accounts/auth/delete-account/send-otp/');
    return response;
  },

  deleteAccount: async (confirmationCode) => {
    const response = await apiClient.post('/accounts/auth/delete-account/', {
      confirmation_code: confirmationCode,
    });
    return response;
  },

  /**
   * ✅ FIX P0: تایید کد ملی (احراز هویت مدیر)
   * POST /accounts/verify-national-id/
   */
  verifyNationalId: async (nationalId) => {
    const response = await apiClient.post('/accounts/verify-national-id/', {
      national_id: nationalId,
    });
    return response;
  },


    /**
   * 📱 دریافت لیست دستگاه‌های فعال کاربر
   * GET /accounts/devices/
   */
  getDevices: async () => {
    const response = await apiClient.get('/accounts/devices/');
    return response;
  },

  /**
   * ❌ خروج از یک دستگاه خاص (Revoke)
   * POST /accounts/devices/{id}/revoke/
   */
  revokeDevice: async (deviceId) => {
    const response = await apiClient.post(`/accounts/devices/${deviceId}/revoke/`);
    return response;
  },
};