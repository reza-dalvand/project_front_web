// src/components/profile/paymentHistory/PaymentDetailModal.jsx
'use client';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiShare2, FiDownload, FiFileText, FiClock, FiCreditCard } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/common/Button';
import InfoRow from '@/components/common/InfoRow';
import { TX_STATUS_MAP, TX_TYPE_MAP } from '@/stores/usePaymentStore';
import { formatPrice, toPersianDigit } from '@/utils/numberUtils';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

/**
 * مدال جزئیات پرداخت مشتری
 *
 * @param {object} payment - از API (TransactionDetailSerializer)
 */
export default function PaymentDetailModal({ visible, payment, onClose }) {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const instanceId = useRef('payment-detail-modal');

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

  if (!visible || !payment) return null;

  const statusMeta = TX_STATUS_MAP[payment.status] || TX_STATUS_MAP.failed;
  const typeMeta = TX_TYPE_MAP[payment.type] || TX_TYPE_MAP.deposit;

  const buildShareMessage = () =>
    [
      '🧾 فاکتور زیبانو',
      `📋 ${payment.business_name || 'پرداخت'}`,
      `💰 مبلغ: ${formatPrice(payment.amount)}`,
      `🔖 کد پیگیری: ${payment.tracking_code}`,
      '✅ زیبانو - رزرو آنلاین خدمات زیبایی',
    ].join('\n');

  const handleShare = async () => {
    const msg = buildShareMessage();
    if (navigator.share) {
      try {
        await navigator.share({ title: 'فاکتور زیبانو', text: msg });
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(msg);
      showToast('فاکتور کپی شد', 'success');
    } catch {
      showToast('امکان کپی وجود ندارد', 'error');
    }
  };

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md max-h-[90vh] rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden shadow-2xl"
        style={{
          backgroundColor: colors.cardBackground,
          borderTop: `1px solid ${colors.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div
          className="flex items-center gap-3 px-5 py-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <div
            className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <FiFileText size={22} style={{ color: colors.primary }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              جزئیات پرداخت
            </h3>
            <p className="text-xs truncate" style={{ color: colors.textSecondary }}>
              {payment.tracking_code}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={20} style={{ color: colors.textMain }} />
          </button>
        </div>

        {/* محتوا */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Badge وضعیت */}
          <div className="flex justify-center">
            <span
              className="px-4 py-2 rounded-xl text-sm font-[Vazir-Bold]"
              style={{
                backgroundColor: statusMeta.color + '18',
                color: statusMeta.color,
              }}
            >
              {statusMeta.label}
            </span>
          </div>

          {/* مبلغ */}
          <div
            className="flex items-center justify-between p-4 rounded-2xl border"
            style={{
              backgroundColor: colors.primary + '08',
              borderColor: colors.primary + '25',
            }}
          >
            <div className="flex items-center gap-2">
              <FiCreditCard size={18} style={{ color: colors.primary }} />
              <span className="text-sm font-[Vazir]" style={{ color: colors.textSecondary }}>
                مبلغ پرداختی
              </span>
            </div>
            <span className="text-xl font-[Vazir-Bold]" style={{ color: colors.primary }}>
              {formatPrice(payment.amount)}
            </span>
          </div>

          {/* اطلاعات تراکنش */}
          <div className="rounded-2xl border p-3 space-y-1" style={{ borderColor: colors.border }}>
            {payment.business_name && (
              <InfoRow
                icon={<span className="text-base">🏪</span>}
                label="کسب‌وکار"
                value={payment.business_name}
                showDivider
              />
            )}
            {payment.created_at && (
              <InfoRow
                icon={<FiClock size={16} />}
                iconColor={colors.textSecondary}
                label="تاریخ تراکنش"
                value={payment.created_at}
                showDivider
              />
            )}
            {payment.gateway && (
              <InfoRow
                icon={<FiCreditCard size={16} />}
                iconColor={colors.textSecondary}
                label="درگاه پرداخت"
                value={payment.gateway}
                showDivider
              />
            )}
            {payment.card_number && (
              <InfoRow
                icon={<span className="text-base">💳</span>}
                label="شماره کارت"
                value={`${payment.card_number} (${payment.card_bank || ''})`}
                monospace
                showDivider
              />
            )}
            {payment.tracking_code && (
              <InfoRow
                icon={<span className="text-base">🔖</span>}
                label="کد پیگیری"
                value={toPersianDigit(payment.tracking_code)}
                monospace
              />
            )}
          </div>
        </div>

        {/* فوتر */}
        <div
          className="px-5 pt-4 border-t space-y-3"
          style={{
            borderColor: colors.border,
            paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <div className="flex gap-3">
            <Button
              title="اشتراک‌گذاری"
              onPress={handleShare}
              variant="outline"
              size="lg"
              className="flex-1"
              icon={<FiShare2 size={18} style={{ color: colors.primary }} />}
              iconPosition="left"
            />
            <Button title="بستن" onPress={onClose} variant="primary" size="lg" className="flex-1" />
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
