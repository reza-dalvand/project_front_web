// src/api/services/profile.service.js
/**
 * 👤 Profile Service
 *
 * مدیریت پروفایل کاربر:
 * - مشاهده و بروزرسانی پروفایل
 * - تغییر شماره موبایل
 */
import apiClient from '../api-client';

export const profileService = {
  /**
   * مشاهده پروفایل
   * GET /accounts/profile/
   */
  getProfile: () => {
    return apiClient.get('/accounts/profile/');
  },

  /**
   * بروزرسانی پروفایل
   * PUT /accounts/profile/
   */
  updateProfile: (data) => {
    return apiClient.put('/accounts/profile/', data);
  },

  /**
   * آپلود آواتار
   * PUT /accounts/profile/ (با FormData)
   */
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.upload('/accounts/profile/', formData);
  },

  // ═══════════ Change Phone ═══════════

  /**
   * درخواست تغییر شماره (ارسال OTP به شماره جدید)
   * POST /accounts/profile/change-phone/
   */
  requestChangePhone: (newPhone) => {
    return apiClient.post('/accounts/profile/change-phone/', { new_phone: newPhone });
  },

  /**
   * تایید تغییر شماره
   * POST /accounts/profile/change-phone/confirm/
   */
  confirmChangePhone: (newPhone, code) => {
    return apiClient.post('/accounts/profile/change-phone/confirm/', {
      new_phone: newPhone,
      code,
    });
  },
};
