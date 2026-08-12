'use client';
import { useState, useMemo } from 'react';
import { FiFilter } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useToast } from '@/hooks/useToast';
import EmptyState from '@/components/common/EmptyState';
import PaymentCompactCard from '@/components/profile/paymentHistory/PaymentCompactCard';
import PaymentStatsCard from '@/components/profile/paymentHistory/PaymentStatsCard';
import { MOCK_PAYMENTS } from '@/data/payments';
import dynamic from 'next/dynamic';

const PaymentDetailModal = dynamic(
  () => import('@/components/profile/paymentHistory/PaymentDetailModal'),
  { ssr: false, loading: () => null }
);
const PaymentFilterSheet = dynamic(
  () => import('@/components/profile/paymentHistory/PaymentFilterSheet'),
  { ssr: false, loading: () => null }
);

const FILTER_LABELS = {
  all: 'همه پرداخت‌ها',
  yesterday: 'دیروز',
  last_week: 'هفته قبل',
  last_month: 'ماه قبل',
  last_3months: 'سه ماه قبل',
};

export default function PaymentsPage() {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // ═══ فیلتر پرداخت‌ها بر اساس بازه زمانی ═══
  const filteredPayments = useMemo(() => {
    if (activeFilter === 'all') return MOCK_PAYMENTS;

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

      // روش ۱: Web Share API (موبایل و مرورگرهای مدرن)
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'فاکتور زیبانو',
            text: msg,
          });
          return;
        } catch (err) {
          // اگر کاربر خودش لغو کرد، خروج
          if (err.name === 'AbortError') return;
          // در غیر این صورت به fallback ادامه می‌دهیم
        }
      }

      // روش ۲: Clipboard API مدرن (فقط HTTPS/localhost)
      try {
        await navigator.clipboard.writeText(msg);
        showToast('فاکتور کپی شد', 'success');
        return;
      } catch (err) {
        // fallback به روش ۳
      }

      // روش ۳: execCommand fallback (برای HTTP و WebView)
      try {
        const textArea = document.createElement('textarea');
        textArea.value = msg;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (success) {
          showToast('فاکتور کپی شد', 'success');
        } else {
          showToast('امکان اشتراک‌گذاری وجود ندارد', 'error');
        }
      } catch {
        showToast('امکان اشتراک‌گذاری وجود ندارد', 'error');
      }
    };

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
        return MOCK_PAYMENTS;
    }

    // فیلتر بر اساس ماه و سال (ساده‌شده برای MOCK)
    return MOCK_PAYMENTS.filter((p) => {
      if (activeFilter === 'yesterday') return p.id === 'pay_1';
      if (activeFilter === 'last_week') return ['pay_1', 'pay_2'].includes(p.id);
      if (activeFilter === 'last_month') return ['pay_1', 'pay_2', 'pay_3'].includes(p.id);
      if (activeFilter === 'last_3months') return true;
      return true;
    });
  }, [activeFilter]);

  // ═══ آمار ═══
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

  const handleOpenDetail = (payment) => {
    setSelectedPayment(payment);
    setDetailVisible(true);
  };

  const hasActiveFilter = activeFilter !== 'all';

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: colors.background }}>
      {/* ═══ هدر + فیلتر ═══ */}
      <div className="px-4 pt-3 pb-2 border-b" style={{ borderBottomColor: colors.border }}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            تاریخچه پرداخت‌ها
          </h2>
          <button
            onClick={() => setFilterVisible(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border-[1.5px] transition-all"
            style={{
              backgroundColor: hasActiveFilter ? colors.primary + '15' : colors.cardBackground,
              borderColor: hasActiveFilter ? colors.primary : colors.border,
            }}
          >
            <FiFilter
              size={16}
              style={{ color: hasActiveFilter ? colors.primary : colors.textMain }}
            />
            <span
              className="text-xs font-[Vazir-Bold]"
              style={{ color: hasActiveFilter ? colors.primary : colors.textMain }}
            >
              {FILTER_LABELS[activeFilter]}
            </span>
            {hasActiveFilter && (
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            )}
          </button>
        </div>
      </div>

      {/* ═══ آمار ═══ */}
      <div className="px-4 pt-3">
        <PaymentStatsCard stats={stats} />
      </div>

      {/* ═══ لیست پرداخت‌ها ═══ */}
      <div className="px-4 pb-32 space-y-3">
        {filteredPayments.length > 0 ? (
          filteredPayments.map((payment) => (
            <PaymentCompactCard key={payment.id} payment={payment} onPress={handleOpenDetail} />
          ))
        ) : (
          <EmptyState
            icon="💳"
            title="پرداختی ثبت نشده"
            description={
              hasActiveFilter
                ? 'در این بازه زمانی هیچ پرداختی ثبت نشده است.'
                : 'پس از اولین پرداخت، سوابق مالی شما اینجا نمایش داده می‌شود.'
            }
            actionLabel={hasActiveFilter ? 'حذف فیلتر' : undefined}
            onAction={hasActiveFilter ? () => setActiveFilter('all') : undefined}
          />
        )}
      </div>

      {/* ═══ مدال جزئیات ═══ */}
      <PaymentDetailModal
        visible={detailVisible}
        payment={selectedPayment}
        onClose={() => {
          setDetailVisible(false);
          setSelectedPayment(null);
        }}
      />

      {/* ═══ باتم‌شیت فیلتر ═══ */}
      <PaymentFilterSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setActiveFilter}
        currentFilter={activeFilter}
      />
    </div>
  );
}
