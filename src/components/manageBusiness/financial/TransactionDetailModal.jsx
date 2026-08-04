'use client';
import { FiX, FiCopy } from 'react-icons/fi';
import { createPortal } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import InfoRow from '@/components/common/InfoRow';
import { TX_STATUS_META, formatPrice } from './constants';
import { toPersianDigit } from '@/utils/numberUtils';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

export default function TransactionDetailModal({ visible, tx, onClose }) {
  const { colors } = useTheme();
  const [mounted, setMounted] = useState(false);
  const instanceId = useRef('tx-detail-modal');

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      releaseScrollLock(instanceId.current);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      acquireScrollLock(instanceId.current);
    } else {
      releaseScrollLock(instanceId.current);
    }
    return () => {
      releaseScrollLock(instanceId.current);
    };
  }, [visible]);

  // بستن با Escape
  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  if (!mounted || !visible || !tx) return null;

  const meta = TX_STATUS_META[tx.status];

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg max-h-[85vh] rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden
        shadow-2xl"
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
              backgroundColor: meta.bg,
              borderColor: meta.color + '40',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-[Vazir-Bold] mb-1" style={{ color: meta.color }}>
                  {meta.label}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  {meta.description}
                </p>
              </div>
              <span className="text-xl font-[Vazir-Bold]" style={{ color: meta.color }}>
                {formatPrice(tx.amount)}
              </span>
            </div>
          </div>

          {/* اطلاعات مشتری */}
          {tx.customerName && (
            <div
              className="p-4 rounded-2xl border"
              style={{ borderColor: colors.border }}
            >
              <InfoRow
                icon="👤"
                label="نام مشتری"
                value={tx.customerName}
                showDivider
              />
              {tx.serviceName && (
                <InfoRow icon="💆‍♀️" label="خدمت" value={tx.serviceName} showDivider />
              )}
              {tx.appointmentDate && (
                <InfoRow
                  icon="📅"
                  label="تاریخ نوبت"
                  value={`${tx.appointmentDate} • ${tx.appointmentTime}`}
                />
              )}
            </div>
          )}

          {/* اطلاعات زمانی */}
          <div
            className="p-4 rounded-2xl border"
            style={{ borderColor: colors.border }}
          >
            {(tx.createdAt || tx.completedAt) && (
              <InfoRow
                icon="⏰"
                label={
                  tx.status === 'settled'
                    ? 'تسویه در'
                    : tx.completedAt
                    ? 'تایید خدمت در'
                    : 'پرداخت در'
                }
                value={tx.settledAt || tx.completedAt || tx.createdAt}
                showDivider
              />
            )}
            {tx.estimatedSettlement && (
              <InfoRow
                icon="🔄"
                label="پیش‌بینی واریز"
                value={tx.estimatedSettlement}
                valueColor="#2196F3"
                valueBold
                highlight
                showDivider
              />
            )}
            {tx.destinationBank && (
              <InfoRow
                icon="🏦"
                label="بانک مقصد"
                value={`حساب تایید شده - ${tx.destinationBank}`}
              />
            )}
            {tx.reason && (
              <InfoRow icon="⚠️" label="دلیل" value={tx.reason} warn />
            )}
          </div>

          {/* کد پیگیری */}
          {tx.trackingCode && (
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
                  style={{ color: colors.textMain, letterSpacing: '1px' }}
                >
                  {toPersianDigit(tx.trackingCode)}
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