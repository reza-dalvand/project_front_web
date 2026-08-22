// src/app/profile/payments/page.jsx
'use client';
import { useState, useMemo, useEffect } from 'react';
import { FiFilter } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PaymentCompactCard from '@/components/profile/paymentHistory/PaymentCompactCard';
import PaymentStatsCard from '@/components/profile/paymentHistory/PaymentStatsCard';
import { paymentsService } from '@/api';
import { usePaymentStore, TX_STATUS_MAP } from '@/stores/usePaymentStore';
import dynamic from 'next/dynamic';

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

export default function PaymentsPage() {
  const { colors } = useTheme();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();
  const { customerPayments, isLoading, fetchCustomerPayments } = usePaymentStore();

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // ═══════ بارگذاری اولیه ═══════
  useEffect(() => {
    fetchCustomerPayments().catch((error) => {
      console.error('Failed to load payments:', error);
      showToast('خطا در بارگذاری تاریخچه پرداخت‌ها', 'error');
    });
  }, []);

  // ═══════ فیلتر ═══════
  const filteredPayments = useMemo(() => {
    if (activeFilter === 'all') return customerPayments;
    // فیلتر زمانی ساده بر اساس created_at
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

  // ═══════ آمار ═══════
  const stats = useMemo(() => {
    const successful = customerPayments.filter(
      (p) => p.status === 'settled' || p.status === 'blocked' || p.status === 'settling'
    );
    return {
      totalPaid: successful.reduce((s, p) => s + (p.amount || 0), 0),
      totalDiscount: 0, // در بک‌اند تخفیف جداگانه نیست
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
