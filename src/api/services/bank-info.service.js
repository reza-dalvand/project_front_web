// src/api/services/bank-info.service.js
/**
 * 🏦 Bank Info Service — اطلاعات بانکی کاربر
 *
 * این سرویس در فرانت وجود نداشت و باید اضافه شود
 *
 * Endpoints:
 *   GET /accounts/bank-info/
 *   PUT /accounts/bank-info/
 */
import apiClient from '../api-client';

export const bankInfoService = {
  /**
   * دریافت اطلاعات بانکی کاربر
   * GET /accounts/bank-info/
   * @returns {Promise} - { bank_name, bank_id, sheba, card_number, owner_name, is_complete }
   */
  getBankInfo: () => {
    return apiClient.get('/accounts/bank-info/');
  },

  /**
   * ثبت/بروزرسانی اطلاعات بانکی
   * PUT /accounts/bank-info/
   * @param {object} data - { bank_name, bank_id, sheba, card_number, owner_name }
   * @returns {Promise} - اطلاعات بانکی بروزرسانی‌شده
   */
  updateBankInfo: (data) => {
    return apiClient.put('/accounts/bank-info/', data);
  },
};
