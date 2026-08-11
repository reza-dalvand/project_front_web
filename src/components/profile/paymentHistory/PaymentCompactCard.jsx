'use client';
import Image from 'next/image';
import { FiCheckCircle, FiXCircle, FiClock, FiRotateCcw, FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit, formatPrice } from '@/utils/numberUtils';

const STATUS_CONFIG = {
  success: { label: 'موفق', color: '#43A047', Icon: FiCheckCircle },
  failed: { label: 'ناموفق', color: '#E53935', Icon: FiXCircle },
  pending: { label: 'در انتظار', color: '#FFA000', Icon: FiClock },
  refunded: { label: 'مسترد شده', color: '#1E88E5', Icon: FiRotateCcw },
};

const TYPE_LABELS = {
  deposit: 'بیعانه',
  full_payment: 'پرداخت کامل',
  service_purchase: 'خرید سرویس',
  refund: 'استرداد',
};

export default function PaymentCompactCard({ payment, onPress }) {
  const { colors } = useTheme();
  const status = STATUS_CONFIG[payment.status] || STATUS_CONFIG.pending;
  const StatusIcon = status.Icon;

  return (
    <button
      onClick={() => onPress?.(payment)}
      className="w-full rounded-2xl border overflow-hidden text-right transition-all
        hover:shadow-sm active:scale-[0.99]"
      style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
    >
      {/* ═══ ردیف اصلی ═══ */}
      <div className="flex items-center gap-3 p-3.5">
        {/* لوگو */}
        <div className="relative flex-shrink-0">
          <Image
            src={payment.businessLogo}
            alt={payment.businessName}
            width={46}
            height={46}
            className="rounded-xl"
          />
          {/* نقطه وضعیت */}
          <div
            className="absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full border-2"
            style={{ backgroundColor: status.color, borderColor: colors.cardBackground }}
          />
        </div>

        {/* اطلاعات */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          {/* نام + تگ نوع */}
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-[Vazir-Bold] truncate flex-1"
              style={{ color: colors.textMain }}
            >
              {payment.businessName}
            </span>
            {/* تگ بیعانه/نوع */}
            <span
              className="text-[10px] font-[Vazir-Bold] px-2 py-0.5 rounded-md flex-shrink-0"
              style={{
                backgroundColor: payment.type === 'deposit' ? '#FF980018' : '#2196F318',
                color: payment.type === 'deposit' ? '#FF9800' : '#2196F3',
              }}
            >
              {TYPE_LABELS[payment.type] || 'بیعانه'}
            </span>
          </div>

          {/* تاریخ + ساعت + مبلغ */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
              📅 {payment.dayName} {payment.date}
            </span>
            <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
              🕐 {payment.time}
            </span>
          </div>

          {/* مبلغ پرداختی */}
          <span className="text-[13px] font-[Vazir-Bold]" style={{ color: colors.primary }}>
            {formatPrice(payment.paidAmount)}
          </span>
        </div>

        {/* وضعیت + فلش */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span
            className="flex items-center gap-1 text-[10px] font-[Vazir-Bold] px-2.5 py-1.5 rounded-lg"
            style={{ backgroundColor: status.color + '18', color: status.color }}
          >
            <StatusIcon size={11} />
            {status.label}
          </span>
          <FiChevronLeft size={16} style={{ color: colors.textSecondary }} />
        </div>
      </div>
    </button>
  );
}