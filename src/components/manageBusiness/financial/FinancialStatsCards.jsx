// src/components/manageBusiness/financial/FinancialStatsCards.jsx
'use client';
import { FiClock, FiRefreshCw, FiCheckCircle, FiRotateCcw } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { formatPrice } from '@/utils/numberUtils';

/**
 * کارت‌های آمار مالی کسب‌وکار
 *
 * @param {object} stats - از API:
 *   { blocked, settling, settled, refunded, total, pending_commission }
 */
export default function FinancialStatsCards({ stats }) {
  const { colors } = useTheme();

  if (!stats) return null;

  const STAT_CARDS = [
    {
      id: 'blocked',
      key: 'blocked',
      Icon: FiClock,
      label: 'بیعانه بلوکه',
      hint: 'در انتظار انجام خدمت',
      color: '#FF9800',
    },
    {
      id: 'settling',
      key: 'settling',
      Icon: FiRefreshCw,
      label: 'در حال تسویه',
      hint: 'واریز تا ۴۸ ساعت',
      color: '#2196F3',
    },
    {
      id: 'settled',
      key: 'settled',
      Icon: FiCheckCircle,
      label: 'تسویه شده',
      hint: 'واریز شده به حساب',
      color: '#43A047',
    },
    {
      id: 'refunded',
      key: 'refunded',
      Icon: FiRotateCcw,
      label: 'مسترد شده',
      hint: 'بازگشت به مشتری',
      color: '#E53935',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-5">
      {STAT_CARDS.map((card) => {
        const { Icon } = card;
        const amount = stats[card.key] || 0;
        return (
          <div
            key={card.id}
            className="rounded-2xl border p-4 shadow-sm"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            }}
          >
            {/* آیکون */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: card.color + '18' }}
            >
              <Icon size={22} style={{ color: card.color }} />
            </div>
            {/* مبلغ */}
            <span
              className="block text-lg font-[Vazir-Bold] mb-1"
              style={{ color: colors.textMain }}
            >
              {formatPrice(amount).replace(' تومان', '')}
            </span>
            {/* لیبل */}
            <span
              className="block text-[13px] font-[Vazir-Bold] mb-1.5"
              style={{ color: colors.textMain }}
            >
              {card.label}
            </span>
            {/* زیرنویس */}
            {card.hint && (
              <span
                className="block text-[11px] font-[Vazir]"
                style={{ color: colors.textSecondary }}
              >
                {card.hint}
              </span>
            )}
          </div>
        );
      })}

      {/* کل + کمیسیون */}
      <div
        className="col-span-2 rounded-2xl border p-4"
        style={{
          backgroundColor: colors.primary + '08',
          borderColor: colors.primary + '30',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
              مجموع کل تراکنش‌ها
            </span>
            <span
              className="block text-xl font-[Vazir-Bold] mt-1"
              style={{ color: colors.primary }}
            >
              {formatPrice(stats.total || 0)}
            </span>
          </div>
          {stats.pending_commission > 0 && (
            <div className="text-right">
              <span className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
                کمیسیون زیبانو
              </span>
              <span
                className="block text-sm font-[Vazir-Bold] mt-1"
                style={{ color: colors.textMain }}
              >
                {formatPrice(stats.pending_commission)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
