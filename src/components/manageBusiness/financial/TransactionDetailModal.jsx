// src/components/manageBusiness/financial/TransactionDetailModal.jsx
'use client';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiCopy, FiCheckCircle, FiClock, FiRefreshCw, FiRotateCcw } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import InfoRow from '@/components/common/InfoRow';
import { TX_STATUS_MAP, TX_TYPE_MAP } from '@/stores/usePaymentStore';
import { formatPrice, toPersianDigit } from '@/utils/numberUtils';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

export default function TransactionDetailModal({ visible, tx, onClose }) {
  const { colors } = useTheme();
  const instanceId = useRef('tx-detail-modal');

  useEffect(() => {
    if (visible) acquireScrollLock(instanceId.current);
    else releaseScrollLock(instanceId.current);
    return () => releaseScrollLock(instanceId.current);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  if (!visible || !tx) return null;

  const statusMeta = TX_STATUS_MAP[tx.status] || TX_STATUS_MAP.failed;
  const typeMeta = TX_TYPE_MAP[tx.type] || TX_TYPE_MAP.deposit;

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg max-h-[85vh] rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden shadow-2xl"
        style={{
          backgroundColor: colors.cardBackground,
          borderTop: `1px solid ${colors.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            جزئیات تراکنش
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={20} style={{ color: colors.textMain }} />
          </button>
        </div>

        {/* محتوا */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* باکس وضعیت */}
          <div
            className="p-4 rounded-2xl border-2"
            style={{
              backgroundColor: statusMeta.color + '08',
              borderColor: statusMeta.color + '40',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-[Vazir-Bold] mb-1" style={{ color: statusMeta.color }}>
                  {statusMeta.label}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  {statusMeta.description}
                </p>
              </div>
              <span className="text-xl font-[Vazir-Bold]" style={{ color: statusMeta.color }}>
                {formatPrice(tx.amount)}
              </span>
            </div>
          </div>

          {/* اطلاعات مشتری */}
          {tx.customer_phone && (
            <div
              className="rounded-2xl border p-3 space-y-1"
              style={{ borderColor: colors.border }}
            >
              <InfoRow
                icon={<span className="text-base">👤</span>}
                label="شماره مشتری"
                value={toPersianDigit(tx.customer_phone)}
                showDivider
              />
              {tx.service_name && (
                <InfoRow
                  icon={<span className="text-base">💆‍♀️</span>}
                  label="خدمت"
                  value={tx.service_name}
                  showDivider
                />
              )}
              {tx.appointment_date && (
                <InfoRow
                  icon={<span className="text-base">📅</span>}
                  label="تاریخ نوبت"
                  value={tx.appointment_date}
                />
              )}
            </div>
          )}

          {/* اطلاعات زمانی */}
          <div className="rounded-2xl border p-3 space-y-1" style={{ borderColor: colors.border }}>
            {(tx.created_at || tx.settled_at) && (
              <InfoRow
                icon={<FiClock size={16} />}
                iconColor={colors.textSecondary}
                label={
                  tx.status === 'settled'
                    ? 'تسویه در'
                    : tx.settled_at
                      ? 'تایید خدمت در'
                      : 'پرداخت در'
                }
                value={tx.settled_at || tx.created_at || '—'}
                showDivider
              />
            )}
            {tx.estimated_settlement && (
              <InfoRow
                icon={<FiRefreshCw size={16} />}
                iconColor="#2196F3"
                label="پیش‌بینی واریز"
                value={tx.estimated_settlement}
                valueColor="#2196F3"
                valueBold
                highlight
                showDivider
              />
            )}
            {tx.gateway && (
              <InfoRow
                icon={<span className="text-base">🏦</span>}
                label="درگاه پرداخت"
                value={tx.gateway}
                showDivider
              />
            )}
            {tx.card_number && (
              <InfoRow
                icon={<span className="text-base">💳</span>}
                label="شماره کارت"
                value={`${tx.card_number} (${tx.card_bank || ''})`}
                monospace
              />
            )}
          </div>

          {/* کد پیگیری */}
          {tx.tracking_code && (
            <div
              className="flex items-center justify-between p-4 rounded-2xl border"
              style={{ borderColor: colors.border }}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🔖</span>
                <span className="text-xs" style={{ color: colors.textSecondary }}>
                  کد پیگیری
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-[Vazir-Bold]"
                  style={{ color: colors.textMain, letterSpacing: '1px', direction: 'ltr' }}
                >
                  {toPersianDigit(tx.trackingCode || '—')}
                </span>
                <button
                  onClick={() => navigator.clipboard?.writeText(tx.trackingCode)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: colors.primary + '15' }}
                >
                  <FiCopy size={14} style={{ color: colors.primary }} />
                </button>
              </div>
            </div>
          )}

          {/* دلیل استرداد */}
          {tx.refund_reason && (
            <div
              className="flex items-start gap-2 p-3 rounded-xl border"
              style={{ backgroundColor: '#E5393508', borderColor: '#E5393530' }}
            >
              <FiRotateCcw size={14} color="#E53935" className="flex-shrink-0 mt-0.5" />
              <span className="text-xs font-[Vazir]" style={{ color: '#E53935' }}>
                {tx.refund_reason}
              </span>
            </div>
          )}
        </div>

        {/* فوتر */}
        <div className="p-5 border-t" style={{ borderColor: colors.border }}>
          <Button title="بستن" onPress={onClose} variant="outline" size="lg" fullWidth />
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
