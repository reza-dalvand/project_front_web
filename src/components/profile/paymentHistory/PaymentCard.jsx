// src/components/profile/paymentHistory/PaymentCard.jsx
'use client';
import Image from 'next/image';
import {
  FiCheckCircle, FiXCircle, FiClock, FiRotateCcw,
  FiUser, FiCalendar, FiCreditCard, FiTag,
  FiDollarSign, FiFileText,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Avatar from '@/components/common/Avatar';
import { toPersianDigit, formatPrice } from '@/utils/numberUtils';
import { PAYMENT_TYPE_META } from './constants';

const STATUS_ICONS = {
  success: FiCheckCircle,
  failed: FiXCircle,
  pending: FiClock,
  refunded: FiRotateCcw,
};

const STATUS_LABELS = {
  success: 'موفق',
  failed: 'ناموفق',
  pending: 'در انتظار',
  refunded: 'مسترد شده',
};

const STATUS_COLORS = {
  success: '#43A047',
  failed: '#E53935',
  pending: '#FFA000',
  refunded: '#1E88E5',
};

export default function PaymentCard({ payment, onOpenInvoice }) {
  const { colors } = useTheme();
  const StatusIcon = STATUS_ICONS[payment.status] || FiClock;
  const statusColor = STATUS_COLORS[payment.status] || '#FFA000';
  const typeMeta = PAYMENT_TYPE_META[payment.type] || PAYMENT_TYPE_META.deposit;

  return (
    <div
      className="rounded-[20px] border overflow-hidden shadow-sm"
      style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
    >
      {/* هدر */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <Avatar uri={payment.businessLogo} name={payment.businessName} size="md" />
        <div className="flex-1 min-w-0 gap-1">
          <p className="text-sm font-[Vazir-Bold] truncate" style={{ color: colors.textMain }}>
            {payment.businessName}
          </p>
          <p className="text-xs truncate" style={{ color: colors.textSecondary }}>
            {payment.serviceName}
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl flex-shrink-0"
          style={{ backgroundColor: statusColor + '20' }}
        >
          <StatusIcon size={14} color={statusColor} />
          <span className="text-[11px] font-[Vazir-Bold]" style={{ color: statusColor }}>
            {STATUS_LABELS[payment.status]}
          </span>
        </div>
      </div>

      {/* متا */}
      <div className="flex items-center gap-4 px-4 py-2.5 flex-wrap" style={{ borderBottom: `1px solid ${colors.border}40` }}>
        <div className="flex items-center gap-1.5">
          <FiCalendar size={13} color={colors.textSecondary} />
          <span className="text-[11px]" style={{ color: colors.textMain }}>
            {payment.dayName} {payment.date}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <FiClock size={13} color={colors.textSecondary} />
          <span className="text-[11px]" style={{ color: colors.textMain }}>
            {payment.time}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="text-[10px] font-[Vazir-Bold] px-2 py-0.5 rounded-lg"
            style={{ backgroundColor: typeMeta.color + '18', color: typeMeta.color }}
          >
            {typeMeta.label}
          </span>
        </div>
      </div>

      {/* جزئیات مالی */}
      <div
        className="mx-4 my-3 p-3 rounded-2xl border gap-2.5"
        style={{ backgroundColor: colors.background, borderColor: colors.border }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <FiDollarSign size={14} color={colors.textSecondary} />
            <span className="text-xs" style={{ color: colors.textSecondary }}>مبلغ کل خدمت</span>
          </div>
          <span className="text-xs font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            {formatPrice(payment.totalPrice)}
          </span>
        </div>
        {payment.discountPercent > 0 && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <FiTag size={14} color="#43A047" />
              <span className="text-xs" style={{ color: colors.textSecondary }}>تخفیف اعمال‌شده</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="text-[10px] font-[Vazir-Bold] px-2 py-0.5 rounded-lg"
                style={{ backgroundColor: '#43A04720', color: '#43A047' }}
              >
                {toPersianDigit(payment.discountPercent)}٪
              </span>
              <span className="text-xs font-[Vazir-Bold]" style={{ color: '#43A047' }}>
                - {formatPrice(payment.discountAmount)}
              </span>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <FiCreditCard size={14} color={colors.primary} />
            <span className="text-xs" style={{ color: colors.textSecondary }}>مبلغ پرداختی شما</span>
          </div>
          <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.primary }}>
            {formatPrice(payment.paidAmount)}
          </span>
        </div>
      </div>

      {/* فوتر */}
      <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderTopColor: colors.border }}>
        <button
          onClick={onOpenInvoice}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all hover:opacity-80"
          style={{ backgroundColor: colors.primary }}
        >
          <FiFileText size={14} color="#fff" />
          <span className="text-xs font-[Vazir-Bold] text-white">مشاهده فاکتور کامل</span>
        </button>
      </div>
    </div>
  );
}