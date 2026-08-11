'use client';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  FiX,
  FiUser,
  FiCalendar,
  FiCreditCard,
  FiTag,
  FiShare2,
  FiDownload,
  FiFileText,
  FiClock,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import InfoRow from '@/components/common/InfoRow';
import PriceBreakdown from '@/components/common/PriceBreakdown';
import { formatPrice } from '@/utils/numberUtils';
import { PAYMENT_METHOD_META, STATUS_META } from '@/constants/meta';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';
import { useToast } from '@/hooks/useToast';

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

  const statusMeta = STATUS_META[payment.status] || STATUS_META.pending;

  // ═══ ساخت متن فاکتور ═══
  const buildShareMessage = () =>
    [
      '🧾 فاکتور زیبانو',
      `📋 ${payment.title || payment.serviceName}`,
      `🏪 ${payment.businessName}`,
      `📅 ${payment.dayName} ${payment.date} - ساعت ${payment.time}`,
      `💰 مبلغ پرداختی: ${formatPrice(payment.paidAmount)}`,
      `🔖 کد پیگیری: ${payment.trackingCode}`,
      '✅ زیبانو - رزرو آنلاین خدمات زیبایی',
    ].join('\n');

  // ═══ تابع کمکی کپی (با fallback امن) ═══
  const copyToClipboard = async (text) => {
    // روش ۱: Clipboard API مدرن (فقط HTTPS/localhost)
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn('Clipboard API failed:', err);
      }
    }
    // روش ۲: execCommand fallback (برای HTTP و WebView و کپاسیتور)
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch (err) {
      console.error('execCommand copy failed:', err);
      return false;
    }
  };

  // ═══ اشتراک‌گذاری فاکتور ═══
  const handleShare = async () => {
    const msg = buildShareMessage();
    const shareUrl = typeof window !== 'undefined' ? window.location.href : undefined;

    // ۱. تلاش برای Web Share API (موبایل)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'فاکتور زیبانو',
          text: msg,
          url: shareUrl,
        });
        return; // موفق بود → خروج
      } catch (err) {
        // اگر کاربر خودش cancel کرد، هیچ کاری نکن
        if (err?.name === 'AbortError') return;
        // در غیر این صورت به fallback برو
      }
    }

    // ۲. Fallback: کپی در کلیپ‌بورد
    const copied = await copyToClipboard(msg);
    if (copied) {
      showToast('فاکتور با موفقیت کپی شد', 'success');
    } else {
      showToast('امکان کپی فاکتور وجود ندارد', 'error');
    }
  };

  // ═══ دانلود PDF (با print) ═══
  const handleDownloadPDF = () => {
    const printContent = `
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>فاکتور زیبانو - ${payment.refNumber}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: 'Vazir', Tahoma, sans-serif; padding: 30px; direction: rtl; color: #2C2521; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #A88B7D; padding-bottom: 15px; }
          .header h1 { color: #A88B7D; font-size: 24px; margin: 0 0 8px 0; }
          .header p { color: #5A504B; font-size: 13px; margin: 0; }
          .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .row .label { color: #666; font-size: 13px; }
          .row .value { font-weight: bold; font-size: 13px; }
          .total { background: #F5F0EC; padding: 14px; border-radius: 10px; margin-top: 18px; border: 1px solid #DCD1CB; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 11px; border-top: 1px solid #eee; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🌸 فاکتور زیبانو</h1>
          <p>شماره ارجاع: ${payment.refNumber}</p>
        </div>
        <div class="row"><span class="label">کسب‌وکار</span><span class="value">${payment.businessName}</span></div>
        <div class="row"><span class="label">خدمت</span><span class="value">${payment.serviceName}</span></div>
        <div class="row"><span class="label">کارمند</span><span class="value">${payment.employeeName}</span></div>
        <div class="row"><span class="label">تاریخ نوبت</span><span class="value">${payment.appointmentDate} - ${payment.appointmentTime}</span></div>
        <div class="row"><span class="label">تاریخ تراکنش</span><span class="value">${payment.dayName} ${payment.date} - ${payment.time}</span></div>
        <div class="row"><span class="label">مبلغ کل خدمت</span><span class="value">${formatPrice(payment.totalPrice)}</span></div>
        ${payment.discountPercent > 0 ? `<div class="row"><span class="label">تخفیف (${payment.discountPercent}٪)</span><span class="value" style="color:#43A047">- ${formatPrice(payment.discountAmount)}</span></div>` : ''}
        <div class="row"><span class="label">بیعانه پرداختی</span><span class="value">${formatPrice(payment.paidAmount)}</span></div>
        ${payment.remainingAmount > 0 ? `<div class="row"><span class="label">باقیمانده (در سالن)</span><span class="value" style="color:#2196F3">${formatPrice(payment.remainingAmount)}</span></div>` : ''}
        <div class="row"><span class="label">وضعیت</span><span class="value">${statusMeta.label}</span></div>
        <div class="row"><span class="label">درگاه پرداخت</span><span class="value">${payment.paymentGateway}</span></div>
        ${payment.cardNumber ? `<div class="row"><span class="label">شماره کارت</span><span class="value">${payment.cardNumber}</span></div>` : ''}
        <div class="row"><span class="label">کد پیگیری</span><span class="value">${payment.trackingCode}</span></div>
        <div class="total">
          <div class="row" style="border:none"><span class="label" style="font-size:15px">مبلغ نهایی پرداخت شده</span><span class="value" style="font-size:18px;color:#A88B7D">${formatPrice(payment.paidAmount)}</span></div>
        </div>
        <div class="footer">
          <p>زیبانو — رزرو آنلاین خدمات زیبایی و سلامت</p>
          <p>این فاکتور به صورت خودکار تولید شده است</p>
        </div>
      </body>
      </html>
    `;

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        showToast('لطفاً پنجره‌های بازشو (Popup) را فعال کنید', 'warning');
        return;
      }
      printWindow.document.write(printContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 500);
      showToast('در حال آماده‌سازی PDF...', 'info');
    } catch (err) {
      console.error('Print failed:', err);
      showToast('خطا در آماده‌سازی PDF', 'error');
    }
  };

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
            <FiFileText size={22} style={{ color: colors.primary }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              فاکتور پرداخت
            </h3>
            <p className="text-xs truncate" style={{ color: colors.textSecondary }}>
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
          {/* وضعیت */}
          <div className="flex justify-center">
            <span
              className="px-4 py-2 rounded-xl text-sm font-[Vazir-Bold]"
              style={{
                backgroundColor: statusMeta.bg || statusMeta.color + '18',
                color: statusMeta.color,
              }}
            >
              {statusMeta.label}
            </span>
          </div>

          {/* کسب‌وکار */}
          <div
            className="flex items-center gap-3 p-3.5 rounded-2xl border"
            style={{ backgroundColor: colors.background, borderColor: colors.border }}
          >
            <Avatar uri={payment.businessLogo} name={payment.businessName} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-[Vazir-Bold] truncate" style={{ color: colors.textMain }}>
                {payment.businessName}
              </p>
              <p className="text-xs truncate" style={{ color: colors.textSecondary }}>
                {payment.serviceName}
              </p>
            </div>
          </div>

          {/* اطلاعات نوبت */}
          <div className="rounded-2xl border p-3 space-y-1" style={{ borderColor: colors.border }}>
            <InfoRow
              icon={<FiCalendar size={16} />}
              iconColor={colors.textSecondary}
              label="تاریخ و ساعت نوبت"
              value={`${payment.appointmentDate} - ساعت ${payment.appointmentTime}`}
              showDivider
            />
            <InfoRow
              icon={<FiUser size={16} />}
              iconColor={colors.textSecondary}
              label="کارمند"
              value={payment.employeeName}
              showDivider
            />
            <InfoRow
              icon={<FiClock size={16} />}
              iconColor={colors.textSecondary}
              label="وضعیت نوبت"
              value={
                payment.appointmentStatus === 'done'
                  ? 'انجام شده ✓'
                  : payment.appointmentStatus === 'upcoming'
                  ? 'در پیش رو'
                  : payment.appointmentStatus === 'cancelled'
                  ? 'لغو شده'
                  : '—'
              }
              valueColor={
                payment.appointmentStatus === 'done'
                  ? '#43A047'
                  : payment.appointmentStatus === 'cancelled'
                  ? '#E53935'
                  : colors.textMain
              }
            />
          </div>

          {/* جزئیات مالی */}
          <PriceBreakdown
            originalPrice={payment.originalPrice}
            discountPercent={payment.discountPercent}
            finalPrice={payment.totalPrice}
            hasDeposit={payment.depositAmount > 0}
            depositAmount={payment.paidAmount}
            showRemaining={payment.remainingAmount > 0}
            variant="detailed"
          />

          {/* اطلاعات تراکنش */}
          <div className="rounded-2xl border p-3 space-y-1" style={{ borderColor: colors.border }}>
            <InfoRow
              icon={<FiCalendar size={16} />}
              iconColor={colors.textSecondary}
              label="تاریخ تراکنش"
              value={`${payment.dayName} ${payment.date} - ${payment.time}`}
              showDivider
            />
            <InfoRow
              icon={<FiCreditCard size={16} />}
              iconColor={colors.textSecondary}
              label="درگاه پرداخت"
              value={payment.paymentGateway}
              showDivider
            />
            {payment.cardNumber && (
              <InfoRow
                icon={<FiCreditCard size={16} />}
                iconColor={colors.textSecondary}
                label="شماره کارت"
                value={`${payment.cardNumber} (${payment.cardBank})`}
                monospace
                showDivider
              />
            )}
            <InfoRow
              icon={<FiTag size={16} />}
              iconColor={colors.textSecondary}
              label="کد پیگیری"
              value={payment.trackingCode}
              monospace
            />
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
            <Button
              title="دانلود PDF"
              onPress={handleDownloadPDF}
              variant="primary"
              size="lg"
              className="flex-1"
              icon={<FiDownload size={18} color="#fff" />}
              iconPosition="right"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}