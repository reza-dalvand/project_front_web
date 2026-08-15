// src/components/profile/paymentHistory/PaymentDetailModal.jsx
'use client';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  FiX,
  FiShare2,
  FiFileText,
  FiClock,
  FiCreditCard,
  FiCheckCircle,
  FiXCircle,
  FiRotateCcw,
  FiDollarSign,
  FiTag,
  FiCalendar,
  FiUser,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/common/Button';
import InfoRow from '@/components/common/InfoRow';
import { formatPrice, toPersianDigit } from '@/utils/numberUtils';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

// ═══════ وضعیت‌های پرداخت مشتری ═══════
const STATUS_CONFIG = {
  success: { label: 'موفق', color: '#43A047', Icon: FiCheckCircle },
  failed: { label: 'ناموفق', color: '#E53935', Icon: FiXCircle },
  pending: { label: 'در انتظار', color: '#FFA000', Icon: FiClock },
  refunded: { label: 'مسترد شده', color: '#1E88E5', Icon: FiRotateCcw },
};

// ═══════ انواع پرداخت ═══════
const TYPE_CONFIG = {
  deposit: { label: 'بیعانه', color: '#FF9800' },
  full_payment: { label: 'پرداخت کامل', color: '#2196F3' },
  service_purchase: { label: 'خرید سرویس', color: '#9C27B0' },
  refund: { label: 'استرداد', color: '#1E88E5' },
};

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

  const status = STATUS_CONFIG[payment.status] || STATUS_CONFIG.pending;
  const type = TYPE_CONFIG[payment.type] || TYPE_CONFIG.deposit;
  const StatusIcon = status.Icon;

  // ═══ ساخت پیام اشتراک‌گذاری ═══
  const buildShareMessage = () =>
    [
      '🧾 فاکتور زیبانو',
      `📋 ${payment.businessName || 'پرداخت'}`,
      `💰 مبلغ: ${formatPrice(payment.paidAmount || payment.amount || 0)}`,
      `🔖 کد پیگیری: ${payment.trackingCode || payment.tracking_code || '—'}`,
      '✅ زیبانو - رزرو آنلاین خدمات زیبایی',
    ].join('');

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
        {/* ═══ هدر ═══ */}
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
              {payment.trackingCode || payment.tracking_code || 'بدون کد پیگیری'}
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

        {/* ═══ محتوای اسکرولی ═══ */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Badge وضعیت */}
          <div className="flex justify-center">
            <span
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-[Vazir-Bold]"
              style={{ backgroundColor: status.color + '18', color: status.color }}
            >
              <StatusIcon size={16} />
              {status.label}
            </span>
          </div>

          {/* ═══ مبلغ پرداختی ═══ */}
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
              {formatPrice(payment.paidAmount || payment.amount || 0)}
            </span>
          </div>

          {/* ═══ دلیل ناموفق بودن ═══ */}
          {payment.status === 'failed' && payment.failureReason && (
            <div
              className="flex items-start gap-2.5 p-3.5 rounded-xl border"
              style={{ backgroundColor: '#E5393508', borderColor: '#E5393530' }}
            >
              <FiXCircle size={16} color="#E53935" className="flex-shrink-0 mt-0.5" />
              <p className="text-xs font-[Vazir] leading-5 flex-1" style={{ color: '#E53935' }}>
                {payment.failureReason}
              </p>
            </div>
          )}

          {/* ═══ اطلاعات استرداد ═══ */}
          {payment.status === 'refunded' && (
            <div
              className="rounded-2xl border p-3 space-y-1"
              style={{ borderColor: '#1E88E540', backgroundColor: '#1E88E508' }}
            >
              <InfoRow
                icon={<FiRotateCcw size={16} />}
                iconColor="#1E88E5"
                label="مبلغ مسترد شده"
                value={formatPrice(payment.refundAmount || 0)}
                valueColor="#1E88E5"
                valueBold
                showDivider
              />
              {payment.cancellationFee > 0 && (
                <InfoRow
                  icon={<FiXCircle size={16} />}
                  iconColor="#E53935"
                  label="جریمه لغو"
                  value={formatPrice(payment.cancellationFee)}
                  valueColor="#E53935"
                />
              )}
            </div>
          )}

          {/* ═══ جزئیات مالی ═══ */}
          <div className="rounded-2xl border p-3 space-y-1" style={{ borderColor: colors.border }}>
            {payment.totalPrice > 0 && (
              <InfoRow
                icon={<FiDollarSign size={16} />}
                iconColor={colors.textSecondary}
                label="مبلغ کل خدمت"
                value={formatPrice(payment.totalPrice)}
                showDivider
              />
            )}
            {payment.discountPercent > 0 && (
              <InfoRow
                icon={<FiTag size={16} />}
                iconColor="#4CAF50"
                label={`تخفیف (${toPersianDigit(payment.discountPercent)}٪)`}
                value={`- ${formatPrice(payment.discountAmount || 0)}`}
                valueColor="#4CAF50"
                showDivider
              />
            )}
            {payment.depositAmount > 0 && (
              <InfoRow
                icon={<FiCreditCard size={16} />}
                iconColor="#FF9800"
                label="بیعانه"
                value={formatPrice(payment.depositAmount)}
                showDivider
              />
            )}
            {payment.remainingAmount > 0 && (
              <InfoRow
                icon={<FiDollarSign size={16} />}
                iconColor="#2196F3"
                label="باقی‌مانده (پرداخت در سالن)"
                value={formatPrice(payment.remainingAmount)}
                valueColor="#2196F3"
              />
            )}
          </div>

          {/* ═══ اطلاعات کسب‌وکار و خدمت ═══ */}
          <div className="rounded-2xl border p-3 space-y-1" style={{ borderColor: colors.border }}>
            {payment.businessLogo && (
              <div className="flex items-center gap-3 mb-2">
                <Image
                  src={payment.businessLogo}
                  alt={payment.businessName || ''}
                  width={40}
                  height={40}
                  className="rounded-xl"
                />
                <div className="flex-1 min-w-0">
                  <span
                    className="text-sm font-[Vazir-Bold] block truncate"
                    style={{ color: colors.textMain }}
                  >
                    {payment.businessName}
                  </span>
                  {payment.serviceName && (
                    <span
                      className="text-xs truncate block"
                      style={{ color: colors.textSecondary }}
                    >
                      {payment.serviceName}
                    </span>
                  )}
                </div>
              </div>
            )}
            {payment.employeeName && (
              <InfoRow
                icon={<FiUser size={16} />}
                iconColor="#9C27B0"
                label="کارمند"
                value={payment.employeeName}
                showDivider
              />
            )}
            {payment.appointmentDate && (
              <InfoRow
                icon={<FiCalendar size={16} />}
                iconColor={colors.textSecondary}
                label="تاریخ نوبت"
                value={`${payment.appointmentDate} - ${payment.appointmentTime || ''}`}
                showDivider
              />
            )}
            <InfoRow
              icon={<FiClock size={16} />}
              iconColor={colors.textSecondary}
              label="تاریخ تراکنش"
              value={`${payment.dayName || ''} ${payment.date || ''} - ${payment.time || ''}`}
            />
          </div>

          {/* ═══ اطلاعات درگاه پرداخت ═══ */}
          <div className="rounded-2xl border p-3 space-y-1" style={{ borderColor: colors.border }}>
            <InfoRow
              icon={<FiCreditCard size={16} />}
              iconColor="#2196F3"
              label="درگاه پرداخت"
              value={payment.paymentGateway || payment.gateway || '—'}
              showDivider
            />
            {payment.cardNumber && (
              <InfoRow
                icon={<span className="text-base">💳</span>}
                label="شماره کارت"
                value={payment.cardNumber}
                monospace
                showDivider
              />
            )}
            {payment.cardBank && (
              <InfoRow
                icon={<span className="text-base">🏦</span>}
                label="بانک کارت"
                value={payment.cardBank}
              />
            )}
          </div>

          {/* ═══ کد پیگیری ═══ */}
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
                {payment.trackingCode || payment.tracking_code || '—'}
              </span>
            </div>
          </div>
          {payment.refNumber && (
            <div
              className="flex items-center justify-between p-4 rounded-2xl border -mt-2"
              style={{ borderColor: colors.border }}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">📄</span>
                <span className="text-xs" style={{ color: colors.textSecondary }}>
                  شماره مرجع
                </span>
              </div>
              <span
                className="text-sm font-[Vazir-Bold]"
                style={{ color: colors.textMain, direction: 'ltr' }}
              >
                {payment.refNumber}
              </span>
            </div>
          )}
        </div>

        {/* ═══ فوتر ═══ */}
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
