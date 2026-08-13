// src/stores/usePaymentStore.js
/**
 * Store مالی و پرداخت
 *
 * هماهنگ با بک‌اند:
 * - Transaction: type (deposit/full_payment/refund/settlement)
 *                status (blocked/settling/settled/refunded/failed)
 * - Settlement:  status (pending/processing/completed/failed)
 * - Business Stats: blocked, settling, settled, refunded, total, pending_commission
 */
import { create } from 'zustand';
import { paymentsService } from '@/api';
import { USE_MOCK } from '@/api/config';

// ═══════ نگاشت وضعیت‌های بک‌اند به متادیتای فرانت ═══════
export const TX_STATUS_MAP = {
  blocked: {
    label: 'بلوکه (در انتظار خدمت)',
    shortLabel: 'بلوکه',
    color: '#FF9800',
    icon: 'clock',
    description: 'پس از انجام خدمت، وارد چرخه تسویه می‌شود',
  },
  settling: {
    label: 'در حال تسویه',
    shortLabel: 'در حال تسویه',
    color: '#2196F3',
    icon: 'refresh-cw',
    description: 'پول در حال واریز به حساب بانکی شماست (تا ۴۸ ساعت)',
  },
  settled: {
    label: 'تسویه شده',
    shortLabel: 'تسویه شده',
    color: '#43A047',
    icon: 'check-circle',
    description: 'به حساب شما واریز شد',
  },
  refunded: {
    label: 'مسترد به مشتری',
    shortLabel: 'مسترد',
    color: '#E53935',
    icon: 'rotate-ccw',
    description: 'به دلیل لغو نوبت، به حساب مشتری برگشت داده شد',
  },
  failed: {
    label: 'ناموفق',
    shortLabel: 'ناموفق',
    color: '#9E9E9E',
    icon: 'x-circle',
    description: 'پرداخت ناموفق بود',
  },
};

export const TX_TYPE_MAP = {
  deposit: { label: 'بیعانه', color: '#FF9800', icon: 'wallet' },
  full_payment: { label: 'پرداخت کامل', color: '#2196F3', icon: 'credit-card' },
  refund: { label: 'استرداد', color: '#1E88E5', icon: 'rotate-ccw' },
  settlement: { label: 'تسویه', color: '#43A047', icon: 'check-circle' },
};

export const SETTLEMENT_STATUS_MAP = {
  pending: { label: 'در انتظار', color: '#FF9800' },
  processing: { label: 'در حال واریز', color: '#2196F3' },
  completed: { label: 'واریز شده', color: '#43A047' },
  failed: { label: 'ناموفق', color: '#E53935' },
};

// ═══════ Store ═══════
export const usePaymentStore = create((set, get) => ({
  // ─── State ───
  businessStats: null,
  transactions: [],
  settlements: [],
  customerPayments: [],
  isLoading: false,
  isLoadingStats: false,
  error: null,

  // ─── Business Stats ───

  /**
   * دریافت آمار مالی کسب‌وکار
   */
  fetchBusinessStats: async () => {
    set({ isLoadingStats: true, error: null });
    try {
      const result = await paymentsService.getBusinessStats();
      set({ businessStats: result.data, isLoadingStats: false });
      return result.data;
    } catch (error) {
      console.error('fetchBusinessStats failed:', error);
      set({ error: error.message, isLoadingStats: false });
      throw error;
    }
  },

  // ─── Business Transactions ───

  /**
   * دریافت تراکنش‌های کسب‌وکار
   * @param {object} params - { status, page, page_size }
   */
  fetchBusinessTransactions: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const result = await paymentsService.getBusinessTransactions(params);
      set({ transactions: result.data || [], isLoading: false });
      return result.data;
    } catch (error) {
      console.error('fetchBusinessTransactions failed:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // ─── Settlements ───

  /**
   * درخواست تسویه
   * @param {number|null} amount
   */
  requestSettlement: async (amount = null) => {
    try {
      const result = await paymentsService.requestSettlement(amount);
      // بروزرسانی لیست تسویه‌ها
      set((state) => ({
        settlements: [result.data, ...state.settlements],
      }));
      return result.data;
    } catch (error) {
      console.error('requestSettlement failed:', error);
      throw error;
    }
  },

  /**
   * دریافت لیست تسویه‌ها
   */
  fetchSettlements: async () => {
    try {
      const result = await paymentsService.getSettlements();
      set({ settlements: result.data || [] });
      return result.data;
    } catch (error) {
      console.error('fetchSettlements failed:', error);
      throw error;
    }
  },

  // ─── Customer Payments ───

  /**
   * دریافت تاریخچه پرداخت‌های مشتری
   */
  fetchCustomerPayments: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const result = await paymentsService.getPaymentHistory(params);
      set({ customerPayments: result.data || [], isLoading: false });
      return result.data;
    } catch (error) {
      console.error('fetchCustomerPayments failed:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // ─── Payment Initiation ───

  /**
   * شروع پرداخت بیعانه
   * @param {number} appointmentId
   * @returns {object} - { payment_url, track_id, ... }
   */
  initiatePayment: async (appointmentId) => {
    try {
      const result = await paymentsService.initiatePayment(appointmentId);
      return result.data;
    } catch (error) {
      console.error('initiatePayment failed:', error);
      throw error;
    }
  },

  // ─── Helpers ───

  /**
   * فیلتر تراکنش‌ها بر اساس وضعیت
   */
  getFilteredTransactions: (status) => {
    const { transactions } = get();
    if (!status || status === 'all') return transactions;
    return transactions.filter((tx) => tx.status === status);
  },

  /**
   * محاسبه مجموع بر اساس وضعیت
   */
  getTotalByStatus: (status) => {
    const { transactions } = get();
    return transactions
      .filter((tx) => tx.status === status)
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);
  },

  /**
   * پاک کردن state (خروج از حساب)
   */
  clearPaymentState: () => {
    set({
      businessStats: null,
      transactions: [],
      settlements: [],
      customerPayments: [],
      isLoading: false,
      isLoadingStats: false,
      error: null,
    });
  },
}));
