/**
 * Store مالی و پرداخت
 *
 * هماهنگ با بک‌اند:
 * - Transaction: type (deposit/full_payment/refund/settlement)
 *                status (blocked/settling/settled/refunded/failed)
 * - Business Stats: blocked, settling, settled, refunded, total, pending_commission
 *
 * ⚠️ تسویه به صورت خودکار انجام می‌شود.
 *    requestSettlement و fetchSettlements حذف شدند.
 */
import { create } from 'zustand';
import { paymentsService } from '@/api';

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

/**
 * ✅ Helper: استخراج لیست از response با فرمت‌های مختلف
 * فرمت‌های ممکن:
 *   1. [array]                      → مستقیم آرایه
 *   2. {results: [...]}             → paginated استاندارد DRF
 *   3. {data: {results: [...]}}     → double-wrapped (StandardResponseMixin + normalizer)
 *   4. {data: [...]}                → wrapped ساده
 */
const extractListFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data?.results)) return data.data.results;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

// ═══════ Store ═══════
export const usePaymentStore = create((set, get) => ({
  // ─── State ───
  businessStats: null,
  transactions: [],
  customerPayments: [],
  isLoading: false,
  isLoadingStats: false,
  error: null,

  // ─── Business Stats ───
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
  fetchBusinessTransactions: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const result = await paymentsService.getBusinessTransactions(params);
      const list = extractListFromResponse(result.data);
      set({ transactions: list, isLoading: false });
      return list;
    } catch (error) {
      console.error('fetchBusinessTransactions failed:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // ─── Customer Payments ───
  fetchCustomerPayments: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const result = await paymentsService.getPaymentHistory(params);
      const list = extractListFromResponse(result.data);
      set({ customerPayments: list, isLoading: false });
      return list;
    } catch (error) {
      console.error('fetchCustomerPayments failed:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // ─── Payment Initiation ───
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
  getFilteredTransactions: (status) => {
    const { transactions } = get();
    if (!Array.isArray(transactions)) return [];
    if (!status || status === 'all') return transactions;
    return transactions.filter((tx) => tx.status === status);
  },

  getTotalByStatus: (status) => {
    const { transactions } = get();
    if (!Array.isArray(transactions)) return 0;
    return transactions
      .filter((tx) => tx.status === status)
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);
  },

  clearPaymentState: () => {
    set({
      businessStats: null,
      transactions: [],
      customerPayments: [],
      isLoading: false,
      isLoadingStats: false,
      error: null,
    });
  },
}));