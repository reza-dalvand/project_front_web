// src/api/services/payments.service.js
/**
 * 💳 Payments Service — نسخه نهایی هماهنگ با بک‌اند
 *
 * ⚠️ تسویه به صورت خودکار انجام می‌شود.
 *    endpoint‌های requestSettlement و getSettlements حذف شدند.
 */
import apiClient from '../api-client';
export const paymentsService = {
  // ═══════════ Gateway ═══════════
  initiatePayment: (appointmentId) => {
    return apiClient.post('/payments/initiate/', {
      appointment_id: appointmentId,
    });
  },
  // ═══════════ Customer History ═══════════
  getPaymentHistory: (params = {}) => {
    return apiClient.get('/payments/history/', { params });
  },
  getTransactionDetail: (transactionId) => {
    return apiClient.get(`/payments/history/${transactionId}/`);
  },
  // ═══════════ Business Financial ═══════════
  getBusinessStats: () => {
    return apiClient.get('/payments/business/stats/');
  },
  getBusinessTransactions: (params = {}) => {
    return apiClient.get('/payments/business/transactions/', { params });
  },
  // ❌ requestSettlement حذف شد — تسویه خودکار است
  // ❌ getSettlements حذف شد — تسویه خودکار است
};
