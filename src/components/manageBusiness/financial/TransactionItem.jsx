// src/components/manageBusiness/financial/TransactionItem.jsx
'use client';
import { FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { TX_STATUS_MAP, TX_TYPE_MAP } from '@/stores/usePaymentStore';
import { formatPrice } from '@/utils/numberUtils';

/**
 * آیتم تراکنش در لیست مالی
 *
 * @param {object} tx - از API (TransactionListSerializer):
 *   { id, tracking_code, ref_number, type, type_display,
 *     status, status_display, amount, app_fee,
 *     gateway, gateway_transaction_id, card_number, card_bank,
 *     settled_at, estimated_settlement,
 *     customer_phone, business_name, created_at }
 */
export default function TransactionItem({ tx, onPress }) {
  const { colors } = useTheme();
  const statusMeta = TX_STATUS_MAP[tx.status] || TX_STATUS_MAP.failed;
  const typeMeta = TX_TYPE_MAP[tx.type] || TX_TYPE_MAP.deposit;

  // نمایش نام خدمت یا عنوان تراکنش
  const displayName = tx.service_name || tx.business_name || typeMeta.label;
  // تاریخ نوبت یا تاریخ پرداخت
  const displayDate = tx.appointment_date || tx.created_at || '—';

  // رنگ مبلغ بر اساس وضعیت
  const getAmountColor = () => {
    if (tx.status === 'refunded') return '#E53935';
    if (tx.status === 'settled') return '#43A047';
    return statusMeta.color || colors.textMain;
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
          style={{ backgroundColor: statusMeta.color + '15' }}
        >
          {tx.type === 'deposit' && '⏳'}
          {tx.type === 'full_payment' && '💰'}
          {tx.type === 'refund' && '↩️'}
          {tx.type === 'settlement' && '✅'}
        </div>

        {/* اطلاعات اصلی */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          {/* نام خدمت/عنوان */}
          <span className="text-sm font-[Vazir-Bold] truncate" style={{ color: colors.textMain }}>
            {displayName}
          </span>
          {/* تاریخ + تگ وضعیت */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
              📅 {displayDate}
            </span>
            {/* تگ وضعیت */}
            <span
              className="text-[10px] font-[Vazir-Bold] px-2 py-0.5 rounded-md flex items-center gap-1"
              style={{
                backgroundColor: statusMeta.color + '15',
                color: statusMeta.color,
              }}
            >
              {statusMeta.shortLabel}
            </span>
          </div>
        </div>

        {/* مبلغ + فلش */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[14px] font-[Vazir-Bold]" style={{ color: getAmountColor() }}>
              {formatPrice(tx.amount)}
            </span>
            {/* کمیسیون */}
            {tx.app_fee > 0 && (
              <span className="text-[10px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                کارمزد: {formatPrice(tx.app_fee)}
              </span>
            )}
          </div>
          <FiChevronLeft size={18} style={{ color: colors.textSecondary }} />
        </div>
      </div>
    </button>
  );
}
