'use client';

import { FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { TX_STATUS_META, formatPrice } from './constants';

const STATUS_ICONS = {
  blocked: '⏳',
  settling: '🔄',
  settled: '✅',
  refunded: '↩️',
};

export default function TransactionItem({ tx, onPress }) {
  const { colors } = useTheme();
  const meta = TX_STATUS_META[tx.status];

  // نام خدمت یا عنوان تراکنش
  const serviceName = tx.serviceName || tx.title || 'تراکنش';
  // تاریخ نوبت (یا تاریخ پرداخت/تسویه)
  const appointmentDate =
    tx.appointmentDate || tx.settledAt || tx.completedAt || tx.createdAt || '—';

  // رنگ مبلغ بر اساس وضعیت
  const getAmountColor = () => {
    if (tx.status === 'refunded') return '#E53935';
    if (tx.status === 'settled') return '#43A047';
    return meta?.color || colors.textMain;
  };

  return (
    <button
      onClick={() => onPress?.(tx)}
      className="w-full text-right mb-2.5 active:scale-[0.99] transition-transform"
    >
      <div
        className="flex items-center gap-3 p-3.5 rounded-2xl border"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        {/* آیکون وضعیت */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
          style={{ backgroundColor: meta?.bg || '#607D8B15' }}
        >
          {STATUS_ICONS[tx.status] || '💰'}
        </div>

        {/* اطلاعات اصلی */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          {/* ردیف اول: نام خدمت */}
          <span className="text-sm font-[Vazir-Bold] truncate" style={{ color: colors.textMain }}>
            {serviceName}
          </span>

          {/* ردیف دوم: تاریخ نوبت + تگ وضعیت */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
              📅 {appointmentDate}
            </span>

            {/* تگ وضعیت */}
            <span
              className="text-[10px] font-[Vazir-Bold] px-2 py-0.5 rounded-md flex items-center gap-1"
              style={{
                backgroundColor: meta?.bg || '#607D8B15',
                color: meta?.color || '#607D8B',
              }}
            >
              {meta?.shortLabel || meta?.label || 'نامشخص'}
            </span>
          </div>
        </div>

        {/* مبلغ + فلش */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[14px] font-[Vazir-Bold]" style={{ color: getAmountColor() }}>
              {formatPrice(tx.amount)}
            </span>
          </div>
          <FiChevronLeft size={18} style={{ color: colors.textSecondary }} />
        </div>
      </div>
    </button>
  );
}
