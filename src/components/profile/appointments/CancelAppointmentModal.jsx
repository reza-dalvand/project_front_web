// src/components/profile/appointments/CancelAppointmentModal.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { FiX, FiXCircle, FiAlertTriangle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@/hooks/useToast';
import CancelRefundSummary from './CancelRefundSummary';
import CancelPolicyBox from './CancelPolicyBox';
import CancelBankInfoDisplay from './CancelBankInfoDisplay';
import CancelBankForm from './CancelBankForm';
import { formatPrice, toEnglishDigits, toPersianDigit } from '@/utils/numberUtils';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';
import { appointmentsService } from '@/api';
import { USE_MOCK } from '@/api/config';
import {
  getCancellationPolicy,
  formatHoursLeft,
  CANCELLATION_THRESHOLD_HOURS,
} from '@/utils/cancellation-utils';

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

export default function CancelAppointmentModal({ visible, appointment, onClose, onConfirmCancel }) {
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const { showToast } = useToast();
  const instanceId = useRef('cancel-appointment-modal');
  const [bankId, setBankId] = useState(null);
  const [sheba, setSheba] = useState('IR');
  const [cardNumber, setCardNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const bankInfo = user?.bankInfo;
  const hasCompleteBankInfo = Boolean(
    bankInfo?.bankName && bankInfo?.sheba?.length >= 24 && bankInfo?.cardNumber?.length === 16
  );

  const policy = appointment ? getCancellationPolicy(appointment.date, appointment.time) : null;

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

  const handleConfirm = async () => {
    if (!policy?.canCancel) {
      showToast('امکان لغو این نوبت وجود ندارد', 'error');
      return;
    }
    if (!hasCompleteBankInfo) {
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
    try {
      if (!USE_MOCK) {
        await appointmentsService.cancelAppointment(appointment.id, '');
      } else {
        await new Promise((r) => setTimeout(r, 1200));
      }
      setLoading(false);
      onConfirmCancel?.(appointment.id);
      showToast('نوبت لغو شد. بیعانه ظرف ۴۸ ساعت واریز می‌شود.', 'success');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'خطا در لغو نوبت');
      showToast(err.message || 'خطا در لغو نوبت', 'error');
    }
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
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              لغو نوبت
            </h3>
            <p
              className="text-[11px] font-[Vazir] truncate"
              style={{ color: colors.textSecondary }}
            >
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
          <CancelRefundSummary refundAmount={refundAmount} />
          <CancelPolicyBox canCancel={policy?.canCancel} hoursLeft={policy?.hoursLeft} />
          {policy?.canCancel && (
            <>
              {hasCompleteBankInfo ? (
                <CancelBankInfoDisplay bankInfo={bankInfo} />
              ) : (
                <CancelBankForm
                  bankId={bankId}
                  sheba={sheba}
                  cardNumber={cardNumber}
                  userName={user?.name}
                  onBankChange={(val) => {
                    setBankId(val);
                    setError('');
                  }}
                  onShebaChange={(t) => {
                    setSheba(formatSheba(t));
                    setError('');
                  }}
                  onCardChange={(t) => {
                    setCardNumber(formatCard(t));
                    setError('');
                  }}
                />
              )}
            </>
          )}
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
          <div className="flex gap-3">
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
              disabled={loading || !policy?.canCancel}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl
              text-sm font-[Vazir-Bold] transition-all hover:scale-[1.01] active:scale-[0.99]
              disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
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
    </div>
  );

  return createPortal(content, document.body);
}