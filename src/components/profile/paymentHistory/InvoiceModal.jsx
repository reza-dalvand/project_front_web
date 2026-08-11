// src/components/profile/paymentHistory/InvoiceModal.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  FiX,
  FiUser,
  FiCalendar,
  FiCreditCard,
  FiDollarSign,
  FiTag,
  FiCheckCircle,
  FiShare2,
  FiFileText,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import InfoRow from '@/components/common/InfoRow';
import PriceBreakdown from '@/components/common/PriceBreakdown';
import { formatPrice } from '@/utils/numberUtils';
import { PAYMENT_METHOD_META } from '@/constants/meta';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

export default function InvoiceModal({ visible, payment, onClose, onShare }) {
  const { colors } = useTheme();
  const instanceId = useRef('invoice-modal');

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

  const methodMeta = PAYMENT_METHOD_META[payment.paymentMethod] || PAYMENT_METHOD_META.online;

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden"
        style={{ backgroundColor: colors.cardBackground, borderTop: `1px solid ${colors.border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div
          className="flex items-center gap-3 px-5 py-4 border-b"
          style={{ borderBottomColor: colors.border }}
        >
          <div
            className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <FiFileText size={22} color={colors.primary} />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              فاکتور پرداخت
            </h3>
            <p className="text-xs" style={{ color: colors.textSecondary }}>
              {payment.refNumber}
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
          {/* کسب‌وکار */}
          <div
            className="flex items-center gap-3 p-3.5 rounded-2xl border"
            style={{ backgroundColor: colors.background, borderColor: colors.border }}
          >
            <Avatar uri={payment.businessLogo} name={payment.businessName} size="md" />
            <div className="flex-1 gap-1">
              <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                {payment.businessName}
              </p>
              <p className="text-xs" style={{ color: colors.textSecondary }}>
                {payment.serviceName}
              </p>
            </div>
          </div>

          {/* اطلاعات نوبت */}
          <div className="space-y-1">
            <p className="text-sm font-[Vazir-Bold] mb-2" style={{ color: colors.textMain }}>
              اطلاعات نوبت
            </p>
            <div className="rounded-2xl border p-3 gap-1" style={{ borderColor: colors.border }}>
              <InfoRow
                icon={<FiCalendar size={16} />}
                iconColor={colors.textSecondary}
                label="تاریخ و ساعت"
                value={`${payment.appointmentDate} - ساعت ${payment.appointmentTime}`}
              />
              <InfoRow
                icon={<FiUser size={16} />}
                iconColor={colors.textSecondary}
                label="کارمند"
                value={payment.employeeName}
              />
              {payment.verificationCode && (
                <InfoRow
                  icon={<FiCheckCircle size={16} />}
                  iconColor="#43A047"
                  label="کد تایید نوبت"
                  value={payment.verificationCode}
                  valueColor="#43A047"
                  valueBold
                  monospace
                />
              )}
            </div>
          </div>

          {/* جزئیات مالی */}
          <div className="space-y-1">
            <p className="text-sm font-[Vazir-Bold] mb-2" style={{ color: colors.textMain }}>
              جزئیات مالی
            </p>
            <PriceBreakdown
              originalPrice={payment.originalPrice}
              discountPercent={payment.discountPercent}
              finalPrice={payment.totalPrice}
              hasDeposit={payment.depositAmount > 0}
              depositAmount={payment.paidAmount}
              showRemaining={payment.remainingAmount > 0}
              variant="detailed"
            />
            {payment.remainingAmount > 0 && (
              <div
                className="mt-2 p-3 rounded-2xl border gap-1"
                style={{ backgroundColor: '#2196F308', borderColor: '#2196F330' }}
              >
                <InfoRow
                  icon={<FiDollarSign size={16} />}
                  iconColor="#2196F3"
                  label="باقیمانده (پرداخت در سالن)"
                  value={formatPrice(payment.remainingAmount)}
                  valueColor="#2196F3"
                  valueBold
                />
              </div>
            )}
            <div
              className="mt-2 p-3 rounded-2xl border"
              style={{ backgroundColor: colors.primary + '08', borderColor: colors.primary + '30' }}
            >
              <InfoRow
                icon={<FiCreditCard size={16} />}
                iconColor={colors.primary}
                label="مبلغ پرداختی شما"
                value={formatPrice(payment.paidAmount)}
                valueColor={colors.primary}
                valueBold
              />
            </div>
          </div>

          {/* اطلاعات تراکنش */}
          <div className="space-y-1">
            <p className="text-sm font-[Vazir-Bold] mb-2" style={{ color: colors.textMain }}>
              اطلاعات تراکنش
            </p>
            <div className="rounded-2xl border p-3 gap-1" style={{ borderColor: colors.border }}>
              <InfoRow
                icon={<FiCalendar size={16} />}
                iconColor={colors.textSecondary}
                label="تاریخ تراکنش"
                value={`${payment.dayName} ${payment.date} - ${payment.time}`}
              />
              <InfoRow
                icon={<FiCreditCard size={16} />}
                iconColor={colors.textSecondary}
                label="درگاه پرداخت"
                value={payment.paymentGateway}
              />
              {payment.cardNumber && (
                <InfoRow
                  icon={<FiCreditCard size={16} />}
                  iconColor={colors.textSecondary}
                  label="شماره کارت"
                  value={`${payment.cardNumber} (${payment.cardBank})`}
                  monospace
                />
              )}
              <InfoRow
                icon={<FiTag size={16} />}
                iconColor={colors.textSecondary}
                label="کد پیگیری"
                value={payment.trackingCode}
                monospace
              />
              <InfoRow
                icon={<FiTag size={16} />}
                iconColor={colors.textSecondary}
                label="شماره ارجاع"
                value={payment.refNumber}
                monospace
              />
            </div>
          </div>
        </div>

        {/* فوتر */}
        <div
          className="px-5 pt-4 border-t"
          style={{
            borderColor: colors.border,
            paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <Button
            title="اشتراک‌گذاری فاکتور"
            onPress={onShare}
            variant="primary"
            size="lg"
            fullWidth
            icon={<FiShare2 size={18} color="#fff" />}
            iconPosition="right"
          />
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
