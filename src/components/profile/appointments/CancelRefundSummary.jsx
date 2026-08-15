// src/components/profile/appointments/CancelRefundSummary.jsx
'use client';
import { FiCreditCard } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { formatPrice } from '@/utils/numberUtils';

export default function CancelRefundSummary({ refundAmount }) {
  const { colors } = useTheme();

  return (
    <div
      className="flex items-center gap-3 p-4 rounded-2xl border"
      style={{
        backgroundColor: colors.primary + '08',
        borderColor: colors.primary + '25',
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: colors.primary + '20' }}
      >
        <FiCreditCard size={18} style={{ color: colors.primary }} />
      </div>
      <div className="flex-1">
        <p className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
          مبلغ قابل استرداد
        </p>
        <p className="text-lg font-[Vazir-Bold]" style={{ color: colors.primary }}>
          {formatPrice(refundAmount)}
        </p>
      </div>
    </div>
  );
}