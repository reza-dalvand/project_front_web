'use client';

import { FiClock, FiRefreshCw, FiCheckCircle, FiRotateCcw, FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import InfoRow from '@/components/common/InfoRow';
import { TX_STATUS_META, formatPrice } from './constants';
import { toPersianDigit } from '@/utils/numberUtils';

const STATUS_ICONS = {
  blocked: FiClock,
  settling: FiRefreshCw,
  settled: FiCheckCircle,
  refunded: FiRotateCcw,
};

export default function TransactionItem({ tx, onPress }) {
  const { colors } = useTheme();
  const meta = TX_STATUS_META[tx.status];
  const StatusIcon = STATUS_ICONS[tx.status] || FiClock;

  const getSignAndColor = () => {
    if (tx.status === 'refunded') return { value: tx.amount, color: '#E53935' };
    if (tx.type === 'settlement' && tx.status === 'settled')
      return { value: tx.amount, color: '#43A047' };
    return { value: tx.amount, color: meta.color };
  };

  const { value, color: amtColor } = getSignAndColor();
  const mainTitle =
    tx.type === 'deposit' || tx.type === 'refund' ? tx.customerName : tx.title || 'تراکنش';

  return (
    <button onClick={() => onPress?.(tx)} className="w-full text-right mb-3">
      <Card variant="elevated" padding={0} radius={18}>
        {/* هدر */}
        <div
          className="flex items-center gap-3 p-3.5 border-b"
          style={{ borderColor: colors.border }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: meta.bg }}
          >
            <StatusIcon size={22} style={{ color: meta.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-[Vazir-Bold] truncate" style={{ color: colors.textMain }}>
              {mainTitle}
            </p>
            {tx.serviceName && (
              <p className="text-xs truncate" style={{ color: colors.textSecondary }}>
                {tx.serviceName}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm font-[Vazir-Bold]" style={{ color: amtColor }}>
              {formatPrice(value)}
            </span>
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-lg"
              style={{ backgroundColor: meta.bg }}
            >
              <span className="text-[10px] font-[Vazir-Bold]" style={{ color: meta.color }}>
                {meta.shortLabel}
              </span>
            </div>
          </div>
          <FiChevronLeft size={20} style={{ color: colors.textSecondary }} />
        </div>

        {/* جزئیات */}
        <div className="p-3.5 flex flex-col gap-1">
          {tx.type === 'deposit' && tx.appointmentDate && (
            <InfoRow
              icon="📅"
              label="تاریخ نوبت:"
              value={`${tx.appointmentDate} • ${tx.appointmentTime}`}
            />
          )}
          {tx.type === 'settlement' && tx.status === 'settled' && (
            <>
              <InfoRow
                icon="⏰"
                label="تسویه در:"
                value={tx.settledAt}
                valueColor="#43A047"
                valueBold
              />
              {tx.destinationBank && (
                <InfoRow icon="🏦" label="مقصد:" value={`حساب تایید شده • ${tx.destinationBank}`} />
              )}
            </>
          )}
          {tx.type === 'refund' && (
            <>
              <InfoRow icon="⏰" label="تاریخ استرداد:" value={tx.createdAt} />
              {tx.reason && <InfoRow icon="⚠️" label="دلیل:" value={tx.reason} warn />}
            </>
          )}
          {tx.status === 'settling' && tx.estimatedSettlement && (
            <InfoRow
              icon="🔄"
              label="تخمین واریز:"
              value={tx.estimatedSettlement}
              valueColor="#2196F3"
              valueBold
              highlight
            />
          )}
          {tx.status === 'blocked' && tx.createdAt && (
            <InfoRow icon="⏰" label="پرداخت در:" value={tx.createdAt} />
          )}
        </div>
      </Card>
    </button>
  );
}
