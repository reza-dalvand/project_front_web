// src/api/services/payments.service.js
/**
 * 💳 Payments Service
 *
 * مدیریت پرداخت‌ها:
 * - شروع پرداخت (درگاه زیبال)
 * - تاریخچه پرداخت‌های مشتری
 * - آمار مالی کسب‌وکار
 * - تراکنش‌های کسب‌وکار
 * - درخواست تسویه
 */
import apiClient from '../api-client';

export const paymentsService = {
  // ═══════════ Gateway ═══════════

  /**
   * شروع پرداخت بیعانه
   * POST /payments/initiate/
   */
  initiatePayment: (appointmentId, paymentMethod = 'gateway') => {
    return apiClient.post('/payments/initiate/', {
      appointment_id: appointmentId,
      payment_method: paymentMethod,
    });
  },

  // ═══════════ Customer History ═══════════

  /**
   * تاریخچه پرداخت‌های مشتری
   * GET /payments/history/
   */
  getPaymentHistory: (params = {}) => {
    return apiClient.get('/payments/history/', { params });
  },

  /**
   * جزئیات تراکنش
   * GET /payments/history/{pk}/
   */
  getTransactionDetail: (transactionId) => {
    return apiClient.get(`/payments/history/${transactionId}/`);
  },

  // ═══════════ Business Financial ═══════════

  /**
   * آمار مالی کسب‌وکار
   * GET /payments/business/stats/
   */
  getBusinessStats: () => {
    return apiClient.get('/payments/business/stats/');
  },

  /**
   * لیست تراکنش‌های کسب‌وکار
   * GET /payments/business/transactions/
   */
  getBusinessTransactions: (params = {}) => {
    return apiClient.get('/payments/business/transactions/', { params });
  },

  /**
   * درخواست تسویه
   * POST /payments/business/settlement/request/
   */
  requestSettlement: (amount = null) => {
    return apiClient.post('/payments/business/settlement/request/', { amount });
  },

  /**
   * لیست تسویه‌ها
   * GET /payments/business/settlements/
   */
  getSettlements: () => {
    return apiClient.get('/payments/business/settlements/');
  },
};
