'use client';
import { useState, useMemo } from 'react';
import { useTheme } from '@/stores/useThemeStore';
import { useToast } from '@/hooks/useToast';
import Dropdown from '@/components/common/Dropdown';
import EmptyState from '@/components/common/EmptyState';
import PaymentCard from '@/components/profile/paymentHistory/PaymentCard';
import PaymentStatsCard from '@/components/profile/paymentHistory/PaymentStatsCard';
import {
  MOCK_PAYMENTS,
  MONTHS,
  YEARS,
  formatPrice,
} from '@/components/profile/paymentHistory/constants';
import dynamic from 'next/dynamic';

// ✅ Lazy Load
const InvoiceModal = dynamic(
  () => import('@/components/profile/paymentHistory/InvoiceModal'),
  { ssr: false, loading: () => null }
);


export default function PaymentsPage() {
  const { colors } = useTheme();
  const { showToast } = useToast();

  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);

  const filteredPayments = useMemo(() => {
    return MOCK_PAYMENTS.filter((p) => {
      if (selectedMonth !== 0 && p.month !== selectedMonth) return false;
      if (selectedYear !== 0 && p.year !== selectedYear) return false;
      return true;
    });
  }, [selectedMonth, selectedYear]);

  const stats = useMemo(() => {
    const successful = filteredPayments.filter(
      (p) => p.status === 'success' || p.status === 'refunded'
    );
    return {
      totalPaid: successful.reduce((s, p) => s + p.paidAmount, 0),
      totalDiscount: filteredPayments.reduce((s, p) => s + (p.discountAmount || 0), 0),
      successCount: successful.length,
    };
  }, [filteredPayments]);

  const handleOpenInvoice = (payment) => {
    setSelectedPayment(payment);
    setInvoiceModalVisible(true);
  };

  const handleShareInvoice = async () => {
    if (!selectedPayment) return;
    const msg = [
      '🧾 فاکتور زیبانو',
      `📋 ${selectedPayment.title}`,
      `🏪 ${selectedPayment.businessName}`,
      `📅 ${selectedPayment.dayName} ${selectedPayment.date} - ساعت ${selectedPayment.time}`,
      `💰 مبلغ پرداختی: ${formatPrice(selectedPayment.paidAmount)}`,
      `🔖 کد پیگیری: ${selectedPayment.trackingCode}`,
      '✅ زیبانو - رزرو آنلاین خدمات زیبایی',
    ].join('\n');

    if (navigator.share) {
      try {
        await navigator.share({ message: msg });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(msg);
        showToast('فاکتور کپی شد', 'success');
      } catch {}
    }
  };

  const handleClearFilters = () => {
    setSelectedMonth(0);
    setSelectedYear(0);
  };

  const hasActiveFilter = selectedMonth !== 0 || selectedYear !== 0;

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: colors.background }}>
      {/* فیلتر ماه و سال */}
      <div className="px-4 pt-3 pb-2 border-b" style={{ borderBottomColor: colors.border }}>
        <div className="flex gap-3">
          <div className="flex-1">
            <Dropdown
              label="ماه"
              value={selectedMonth}
              options={MONTHS}
              onSelect={setSelectedMonth}
            />
          </div>
          <div className="flex-1">
            <Dropdown label="سال" value={selectedYear} options={YEARS} onSelect={setSelectedYear} />
          </div>
        </div>
      </div>

      {/* آمار */}
      <div className="px-4 pt-3">
        <PaymentStatsCard stats={stats} />
      </div>

      {/* لیست تراکنش‌ها */}
      <div className="px-4 pb-32 space-y-3.5">
        {filteredPayments.length > 0 ? (
          filteredPayments.map((payment) => (
            <PaymentCard
              key={payment.id}
              payment={payment}
              onOpenInvoice={() => handleOpenInvoice(payment)}
            />
          ))
        ) : (
          <EmptyState
            icon="💳"
            title="پرداختی ثبت نشده"
            description={
              hasActiveFilter
                ? 'در این بازه زمانی هیچ پرداختی ثبت نشده است. فیلترها را تغییر دهید.'
                : 'پس از اولین پرداخت، سوابق مالی شما اینجا نمایش داده می‌شود'
            }
            actionLabel={hasActiveFilter ? 'حذف فیلترها' : undefined}
            onAction={hasActiveFilter ? handleClearFilters : undefined}
          />
        )}
      </div>

      {/* مدال فاکتور */}
      <InvoiceModal
        visible={invoiceModalVisible}
        payment={selectedPayment}
        onClose={() => setInvoiceModalVisible(false)}
        onShare={handleShareInvoice}
      />
    </div>
  );
}
