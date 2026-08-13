// src/api/services/payments.service.js
/**
 * 💳 Payments Service — نسخه نهایی هماهنگ با بک‌اند
 *
 * Endpoints:
 *   POST   /payments/initiate/                    → شروع پرداخت (درگاه زیبال)
 *   GET    /payments/callback/                    → Callback درگاه
 *   GET    /payments/history/                     → تاریخچه پرداخت‌های مشتری
 *   GET    /payments/history/{pk}/                → جزئیات تراکنش مشتری
 *   GET    /payments/business/stats/              → آمار مالی کسب‌وکار
 *   GET    /payments/business/transactions/       → لیست تراکنش‌های کسب‌وکار
 *   POST   /payments/business/settlement/request/ → درخواست تسویه
 *   GET    /payments/business/settlements/        → لیست تسویه‌ها
 *
 * مدل Transaction بک‌اند:
 *   type: deposit | full_payment | refund | settlement
 *   status: blocked | settling | settled | refunded | failed
 *
 * مدل Settlement بک‌اند:
 *   status: pending | processing | completed | failed
 */
import apiClient from '../api-client';

export const paymentsService = {
  // ═══════════ Gateway ═══════════

  /**
   * شروع پرداخت بیعانه
   * POST /payments/initiate/
   *
   * Payload:
   * { appointment_id: number }
   *
   * Response:
   * { payment_url, track_id, tracking_code, transaction_id, amount }
   */
  initiatePayment: (appointmentId) => {
    return apiClient.post('/payments/initiate/', {
      appointment_id: appointmentId,
    });
  },

  // ═══════════ Customer History ═══════════

  /**
   * تاریخچه پرداخت‌های مشتری
   * GET /payments/history/
   *
   * Response (TransactionListSerializer):
   * [{ id, tracking_code, ref_number, type, type_display,
   *    status, status_display, amount, app_fee,
   *    gateway, gateway_transaction_id, card_number, card_bank,
   *    settled_at, estimated_settlement,
   *    customer_phone, business_name, created_at }]
   */
  getPaymentHistory: (params = {}) => {
    return apiClient.get('/payments/history/', { params });
  },

  /**
   * جزئیات تراکنش مشتری
   * GET /payments/history/{pk}/
   *
   * Response (TransactionDetailSerializer):
   * TransactionListSerializer + appointment_id + refund_reason
   */
  getTransactionDetail: (transactionId) => {
    return apiClient.get(`/payments/history/${transactionId}/`);
  },

  // ═══════════ Business Financial ═══════════

  /**
   * آمار مالی کسب‌وکار
   * GET /payments/business/stats/
   *
   * Response (BusinessFinancialStatsSerializer):
   * { blocked, settling, settled, refunded, total, pending_commission }
   */
  getBusinessStats: () => {
    return apiClient.get('/payments/business/stats/');
  },

  /**
   * لیست تراکنش‌های کسب‌وکار
   * GET /payments/business/transactions/
   *
   * Params:
   *   status: all | blocked | settling | settled | refunded | failed
   *   page, page_size
   */
  getBusinessTransactions: (params = {}) => {
    return apiClient.get('/payments/business/transactions/', { params });
  },

  /**
   * درخواست تسویه
   * POST /payments/business/settlement/request/
   *
   * Payload:
   * { amount?: number } — اگر خالی باشد = کل مبلغ قابل تسویه
   *
   * Response (SettlementSerializer):
   * { id, amount, status, bank_sheba, bank_name, settled_at, business_name, created_at }
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
