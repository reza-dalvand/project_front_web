// src/api/services/profile.service.js
/**
 * 👤 Profile Service — نسخه نهایی هماهنگ با بک‌اند
 *
 * Endpoints:
 *   GET  /accounts/profile/
 *   PUT  /accounts/profile/
 *   POST /accounts/profile/change-phone/
 *   POST /accounts/profile/change-phone/confirm/
 */
import apiClient from '../api-client';

export const profileService = {
  /**
   * مشاهده پروفایل
   * GET /accounts/profile/
   * @returns {Promise} - UserProfileSerializer
   *   { id, phone, phone_display, first_name, last_name, full_name,
   *     avatar, is_verified, is_national_id_verified, verified_name, date_joined }
   */
  getProfile: () => {
    return apiClient.get('/accounts/profile/');
  },

  /**
   * بروزرسانی پروفایل
   * PUT /accounts/profile/
   * @param {object} data - { first_name, last_name }
   */
  updateProfile: (data) => {
    return apiClient.put('/accounts/profile/', data);
  },

  /**
   * آپلود آواتار
   * PUT /accounts/profile/ با FormData
   * @param {File} file
   */
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.upload('/accounts/profile/', formData);
  },

  /**
   * درخواست تغییر شماره (ارسال OTP به شماره جدید)
   * POST /accounts/profile/change-phone/
   * @param {string} newPhone
   * @returns {Promise} - { new_phone, new_phone_display, expires_in }
   */
  requestChangePhone: (newPhone) => {
    return apiClient.post('/accounts/profile/change-phone/', { new_phone: newPhone });
  },

  /**
   * تایید تغییر شماره
   * POST /accounts/profile/change-phone/confirm/
   * @param {string} newPhone
   * @param {string} code - کد ۵ رقمی
   * @returns {Promise} - UserProfileSerializer
   */
  confirmChangePhone: (newPhone, code) => {
    return apiClient.post('/accounts/profile/change-phone/confirm/', {
      new_phone: newPhone,
      code,
    });
  },
};
