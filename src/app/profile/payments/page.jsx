// src/app/profile/payments/page.jsx
'use client';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiFilter, FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PaymentCompactCard from '@/components/profile/paymentHistory/PaymentCompactCard';
import PaymentStatsCard from '@/components/profile/paymentHistory/PaymentStatsCard';
import { paymentsService } from '@/api';
import { usePaymentStore } from '@/stores/usePaymentStore';
import dynamic from 'next/dynamic';
import { formatPrice, toPersianDigit } from '@/utils/numberUtils';

const PaymentDetailModal = dynamic(
  () => import('@/components/profile/paymentHistory/PaymentDetailModal'),
  { ssr: false, loading: () => null }
);

const PaymentFilterSheet = dynamic(
  () => import('@/components/profile/paymentHistory/PaymentFilterSheet'),
  { ssr: false, loading: () => null }
);

const FILTER_OPTIONS = [
  { id: 'all', label: 'همه پرداخت‌ها' },
  { id: 'yesterday', label: 'دیروز' },
  { id: 'last_week', label: 'هفته قبل' },
  { id: 'last_month', label: 'ماه قبل' },
  { id: 'last_3months', label: 'سه ماه قبل' },
];

// ═══════════════════════════════════════════════
//   کامپوننت داخلی که از useSearchParams استفاده می‌کند
// ═══════════════════════════════════════════════
function PaymentsPageContent() {
  const { colors } = useTheme();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  const { customerPayments, isLoading, fetchCustomerPayments } = usePaymentStore();

  const authority = searchParams.get('Authority');
  const zarinpalStatus = searchParams.get('Status'); 
  
  const [paymentResult, setPaymentResult] = useState(null);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
      if (!authority) return;

      const verify = async () => {
          try {
              const result = await paymentsService.verifyPayment(authority, zarinpalStatus);
              setPaymentResult({
                  success: true,
                  amount: result.data.amount,
                  tracking_code: result.data.tracking_code,
              });
              showToast(
                  `پرداخت ${formatPrice(result.data.amount)} با موفقیت انجام شد ✅`,
                  'success',
                  5000
              );
          } catch (err) {
              const code = err?.code || err?.response?.data?.error?.code;
              const reasonMessages = {
                  PAYMENT_FAILED: 'پرداخت توسط شما لغو شد یا ناموفق بود',
                  TRANSACTION_NOT_FOUND: 'تراکنش مورد نظر یافت نشد',
                  VERIFY_ERROR: 'خطا در تایید تراکنش',
                  GATEWAY_ERROR: 'خطا در ارتباط با درگاه پرداخت',
              };
              const message = reasonMessages[code] || err?.message || 'پرداخت ناموفق بود';
              
              setPaymentResult({
                  success: false,
                  reason: code,
                  tracking_code: authority,
              });
              showToast(message, 'error', 5000);
          } finally {
              // پاک کردن query params از URL بدون رفرش صفحه
              if (typeof window !== 'undefined') {
                  const url = new URL(window.location.href);
                  url.searchParams.delete('Authority');
                  url.searchParams.delete('Status');
                  window.history.replaceState({}, '', url.pathname);
              }
              // رفرش لیست تراکنش‌ها
              fetchCustomerPayments().catch(() => {});
          }
      };

      verify();
  }, [authority, zarinpalStatus, showToast, fetchCustomerPayments]);

  // ═══ فیلتر ═══
  const filteredPayments = useMemo(() => {
    if (activeFilter === 'all') return customerPayments;

    const now = new Date();
    let cutoff;
    switch (activeFilter) {
      case 'yesterday':
        cutoff = new Date(now);
        cutoff.setDate(cutoff.getDate() - 1);
        break;
      case 'last_week':
        cutoff = new Date(now);
        cutoff.setDate(cutoff.getDate() - 7);
        break;
      case 'last_month':
        cutoff = new Date(now);
        cutoff.setMonth(cutoff.getMonth() - 1);
        break;
      case 'last_3months':
        cutoff = new Date(now);
        cutoff.setMonth(cutoff.getMonth() - 3);
        break;
      default:
        return customerPayments;
    }
    return customerPayments.filter((p) => new Date(p.created_at) >= cutoff);
  }, [customerPayments, activeFilter]);

  // ═══ آمار ═══
  const stats = useMemo(() => {
    const successful = customerPayments.filter(
      (p) => p.status === 'settled' || p.status === 'blocked' || p.status === 'settling'
    );
    return {
      totalPaid: successful.reduce((s, p) => s + (p.amount || 0), 0),
      totalDiscount: 0,
      successCount: successful.length,
    };
  }, [customerPayments]);

  const handleOpenDetail = (payment) => {
    setSelectedPayment(payment);
    setDetailVisible(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p style={{ color: colors.textMain }}>در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: colors.background }}>
      {/* ═══ ✅ فاز ۶: بنر نتیجه پرداخت ═══ */}
      {paymentResult && (
          <div
              className="mx-4 mt-4 mb-2 p-4 rounded-2xl border flex items-start gap-3"
              style={{
                  backgroundColor: paymentResult.success ? '#43A04710' : '#E5393510',
                  borderColor: paymentResult.success ? '#43A04740' : '#E5393540',
              }}
          >
              {paymentResult.success ? (
                  <FiCheckCircle size={22} color="#43A047" className="flex-shrink-0 mt-0.5" />
              ) : (
                  <FiXCircle size={22} color="#E53935" className="flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                  <p
                      className="text-sm font-[Vazir-Bold] mb-1"
                      style={{
                          color: paymentResult.success ? '#43A047' : '#E53935',
                      }}
                  >
                      {paymentResult.success ? 'پرداخت موفق' : 'پرداخت ناموفق'}
                  </p>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                      {paymentResult.success
                          ? `مبلغ ${formatPrice(paymentResult.amount)} با موفقیت پرداخت شد. نوبت شما ثبت گردید.`
                          : paymentResult.reason === 'PAYMENT_FAILED'
                          ? 'پرداخت توسط شما لغو شد. نوبت رزرو نشده است.'
                          : 'خطایی در فرآیند پرداخت رخ داد. لطفاً دوباره تلاش کنید.'}
                  </p>
                  {paymentResult.tracking_code && (
                      <p
                          className="text-[11px] mt-2 font-mono"
                          style={{ color: colors.textSecondary, direction: 'ltr', textAlign: 'right' }}
                      >
                          کد پیگیری: {toPersianDigit(paymentResult.tracking_code)}
                      </p>
                  )}
              </div>
          </div>
      )}

      {/* هدر + فیلتر */}
      <div className="px-4 pt-3 pb-2 border-b" style={{ borderBottomColor: colors.border }}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            تاریخچه پرداخت‌ها
          </h2>
          <button
            onClick={() => setFilterVisible(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border-[1.5px] transition-all"
            style={{
              backgroundColor:
                activeFilter !== 'all' ? colors.primary + '15' : colors.cardBackground,
              borderColor: activeFilter !== 'all' ? colors.primary : colors.border,
            }}
          >
            <FiFilter
              size={16}
              style={{ color: activeFilter !== 'all' ? colors.primary : colors.textMain }}
            />
            <span
              className="text-xs font-[Vazir-Bold]"
              style={{ color: activeFilter !== 'all' ? colors.primary : colors.textMain }}
            >
              {FILTER_OPTIONS.find((f) => f.id === activeFilter)?.label}
            </span>
          </button>
        </div>
      </div>

      {/* آمار */}
      <div className="px-4 pt-3">
        <PaymentStatsCard stats={stats} />
      </div>

      {/* لیست پرداخت‌ها */}
      <div className="px-4 pb-32 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="در حال بارگذاری..." />
          </div>
        ) : filteredPayments.length > 0 ? (
          filteredPayments.map((payment) => (
            <PaymentCompactCard key={payment.id} payment={payment} onPress={handleOpenDetail} />
          ))
        ) : (
          <EmptyState
            icon="💳"
            title="پرداختی ثبت نشده"
            description="پس از اولین پرداخت، سوابق مالی شما اینجا نمایش داده می‌شود"
          />
        )}
      </div>

      {/* مدال‌ها */}
      <PaymentDetailModal
        visible={detailVisible}
        payment={selectedPayment}
        onClose={() => {
          setDetailVisible(false);
          setSelectedPayment(null);
        }}
      />
      <PaymentFilterSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setActiveFilter}
        currentFilter={activeFilter}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════
//   صفحه اصلی با Suspense برای useSearchParams
// ═══════════════════════════════════════════════
export default function PaymentsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-app">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentsPageContent />
    </Suspense>
  );
}
