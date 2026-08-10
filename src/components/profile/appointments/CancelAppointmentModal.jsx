'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  FiX,
  FiXCircle,
  FiCheckCircle,
  FiCreditCard,
  FiAlertTriangle,
  FiInfo,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import Input from '@/components/common/Input';
import Dropdown from '@/components/common/Dropdown';
import { formatPrice, toEnglishDigits, toPersianDigit } from '@/utils/numberUtils';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

const BANKS = [
  { id: 'meli', label: 'بانک ملی ایران' },
  { id: 'mellat', label: 'بانک ملت' },
  { id: 'saman', label: 'بانک سامان' },
  { id: 'pasargad', label: 'بانک پاسارگاد' },
  { id: 'saderat', label: 'بانک صادرات ایران' },
  { id: 'tejarat', label: 'بانک تجارت' },
  { id: 'sepah', label: 'بانک سپه' },
  { id: 'keshavarzi', label: 'بانک کشاورزی' },
  { id: 'maskan', label: 'بانک مسکن' },
  { id: 'refah', label: 'بانک رفاه کارگران' },
  { id: 'parsian', label: 'بانک پارسیان' },
  { id: 'eghtesad', label: 'بانک اقتصاد نوین' },
];

const formatSheba = (text) => {
  let cleaned = toEnglishDigits(text)
    .replace(/[^0-9A-Za-z]/g, '')
    .toUpperCase();
  if (!cleaned.startsWith('IR')) cleaned = 'IR' + cleaned.replace(/IR/g, '');
  return cleaned.slice(0, 26);
};

const formatCard = (text) => {
  const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
  return cleaned.slice(0, 16);
};

/**
 * مدال لغو نوبت
 * - اگر اطلاعات بانکی کامل ثبت شده → پیام ساده واریز
 * - اگر ثبت نشده → فرم اطلاعات بانکی
 */
export default function CancelAppointmentModal({ visible, appointment, onClose, onConfirmCancel }) {
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const instanceId = useRef('cancel-appointment-modal');

  const [bankId, setBankId] = useState(null);
  const [sheba, setSheba] = useState('IR');
  const [cardNumber, setCardNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ═══ تشخیص اینکه آیا اطلاعات بانکی کامل ثبت شده یا نه ═══
  const bankInfo = user?.bankInfo;
  const hasCompleteBankInfo = Boolean(
    bankInfo?.bankName && bankInfo?.sheba?.length >= 24 && bankInfo?.cardNumber?.length === 16
  );

  useEffect(() => {
    if (visible) {
      setBankId(null);
      setSheba('IR');
      setCardNumber('');
      setLoading(false);
      setError('');
      acquireScrollLock(instanceId.current);
    } else {
      releaseScrollLock(instanceId.current);
    }
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

  if (!visible || !appointment) return null;

  // ═══ تایید لغو ═══
  const handleConfirm = async () => {
    if (!hasCompleteBankInfo) {
      // اعتبارسنجی فرم
      if (!bankId) {
        setError('لطفاً نام بانک را انتخاب کنید');
        return;
      }
      const cleanSheba = toEnglishDigits(sheba);
      if (cleanSheba.length !== 26) {
        setError('شماره شبا باید ۲۶ کاراکتر باشد (IR + ۲۴ رقم)');
        return;
      }
      const cleanCard = toEnglishDigits(cardNumber);
      if (cleanCard.length !== 16) {
        setError('شماره کارت باید ۱۶ رقم باشد');
        return;
      }
      // ذخیره اطلاعات بانکی در پروفایل کاربر
      const selectedBank = BANKS.find((b) => b.id === bankId);
      updateUser({
        bankInfo: {
          bankName: selectedBank?.label || '',
          sheba: cleanSheba,
          cardNumber: cleanCard,
          ownerName: user?.name || '',
        },
      });
    }

    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onConfirmCancel?.(appointment.id);
  };

  const refundAmount =
    appointment.depositPaid > 0 ? appointment.depositPaid : appointment.totalPrice;

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md max-h-[90vh] rounded-t-3xl md:rounded-3xl
          flex flex-col overflow-hidden shadow-2xl"
        style={{
          backgroundColor: colors.cardBackground,
          borderTop: `1px solid ${colors.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: colors.border }} />
        </div>

        {/* هدر */}
        <div
          className="flex items-center gap-3 px-5 py-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <div
            className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#E5393515' }}
          >
            <FiXCircle size={22} color="#E53935" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              لغو نوبت
            </h3>
            <p className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
              {appointment.businessName} • {appointment.serviceName}
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
          {/* خلاصه مبلغ استرداد */}
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

          {hasCompleteBankInfo ? (
            /* ═══════ حالت ۱: اطلاعات بانکی ثبت شده ═══════ */
            <>
              {/* نمایش اطلاعات بانکی ثبت‌شده */}
              <div
                className="rounded-2xl border p-4 space-y-3"
                style={{ borderColor: colors.border, backgroundColor: colors.background }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <FiCheckCircle size={16} color="#4CAF50" />
                  <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                    اطلاعات بانکی ثبت‌شده
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
                    بانک
                  </span>
                  <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                    {bankInfo.bankName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
                    شماره شبا
                  </span>
                  <span
                    className="text-xs font-[Vazir-Bold]"
                    style={{ color: colors.textMain, direction: 'ltr' }}
                  >
                    {bankInfo.sheba}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
                    شماره کارت
                  </span>
                  <span
                    className="text-xs font-[Vazir-Bold]"
                    style={{ color: colors.textMain, direction: 'ltr' }}
                  >
                    {bankInfo.cardNumber}
                  </span>
                </div>
              </div>

              {/* پیام واریز */}
              <div
                className="flex items-start gap-3 p-4 rounded-2xl border"
                style={{ backgroundColor: '#4CAF5008', borderColor: '#4CAF5030' }}
              >
                <FiCheckCircle size={18} color="#4CAF50" className="flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-[Vazir] leading-6" style={{ color: colors.textMain }}>
                    بازگشت وجه به حساب شما انجام خواهد شد.
                  </p>
                  <a
                    href="https://zibano.app/rules/refund"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-[Vazir] underline mt-1 inline-block"
                    style={{ color: colors.primary }}
                  >
                    برای مطالعه قوانین این قسمت به این لینک مراجعه کنید
                  </a>
                </div>
              </div>
            </>
          ) : (
            /* ═══════ حالت ۲: اطلاعات بانکی ثبت نشده → فرم ═══════ */
            <>
              {/* پیام راهنما */}
              <div
                className="flex items-start gap-3 p-4 rounded-2xl border"
                style={{ backgroundColor: '#FF980008', borderColor: '#FF980030' }}
              >
                <FiAlertTriangle size={18} color="#FF9800" className="flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p
                    className="text-xs font-[Vazir] leading-5"
                    style={{ color: colors.textSecondary }}
                  >
                    برای استرداد وجه، اطلاعات حساب بانکی خود را وارد کنید.
                  </p>
                  <a
                    href="https://zibano.app/rules/refund"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-[Vazir] underline mt-1 inline-block"
                    style={{ color: colors.primary }}
                  >
                    برای مطالعه قوانین این قسمت به این لینک مراجعه کنید
                  </a>
                </div>
              </div>

              {/* فرم اطلاعات بانکی */}
              <Dropdown
                label="نام بانک *"
                placeholder="بانک خود را انتخاب کنید"
                value={bankId}
                options={BANKS}
                onSelect={(val) => {
                  setBankId(val);
                  setError('');
                }}
              />
              <Input
                label="شماره شبا *"
                placeholder="IR000000000000000000000000"
                value={sheba}
                onChangeText={(t) => {
                  setSheba(formatSheba(t));
                  setError('');
                }}
                maxLength={26}
                hint="شماره شبا باید با IR شروع شده و ۲۶ کاراکتر باشد"
              />
              <Input
                label="شماره کارت *"
                placeholder="۶۰۳۷۹۹۱۸۱۲۳۴۵۶۷۸"
                value={toPersianDigit(cardNumber)}
                onChangeText={(t) => {
                  setCardNumber(formatCard(t));
                  setError('');
                }}
                type="tel"
                maxLength={16}
                rightIcon={<FiCreditCard size={18} style={{ color: colors.textSecondary }} />}
              />

              {/* راهنمای مالکیت حساب */}
              <div
                className="flex items-start gap-2 p-3 rounded-xl border"
                style={{
                  backgroundColor: colors.primary + '08',
                  borderColor: colors.primary + '25',
                }}
              >
                <FiInfo size={14} style={{ color: colors.primary, flexShrink: 0, marginTop: 2 }} />
                <p
                  className="text-[11px] font-[Vazir] leading-4 flex-1"
                  style={{ color: colors.textSecondary }}
                >
                  حساب بانکی باید به نام{' '}
                  <span className="font-[Vazir-Bold]" style={{ color: colors.primary }}>
                    {user?.name || 'صاحب حساب'}
                  </span>{' '}
                  باشد.
                </p>
              </div>
            </>
          )}

          {/* پیام خطا */}
          {error && (
            <div
              className="flex items-center gap-2 p-3 rounded-xl border"
              style={{ backgroundColor: '#E5393508', borderColor: '#E5393530' }}
            >
              <FiAlertTriangle size={14} color="#E53935" />
              <span className="text-xs font-[Vazir]" style={{ color: '#E53935' }}>
                {error}
              </span>
            </div>
          )}
        </div>

        {/* فوتر */}
        <div
          className="px-5 pt-4 border-t"
          style={{
            borderColor: colors.border,
            paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl border-2 text-sm font-[Vazir-Bold]
              transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{ borderColor: colors.border, color: colors.textMain }}
          >
            انصراف
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl
              text-sm font-[Vazir-Bold] transition-all hover:scale-[1.01] active:scale-[0.99]
              disabled:opacity-60"
            style={{ backgroundColor: '#E53935', color: '#fff' }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <FiXCircle size={16} color="#fff" />
                <span>تایید و لغو نوبت</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
