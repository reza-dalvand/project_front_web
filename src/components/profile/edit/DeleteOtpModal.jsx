// src/components/profile/edit/DeleteOtpModal.jsx
'use client';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import OTPInput from '@/components/common/OTPInput';
import { toPersianDigit } from '@/utils/numberUtils';
import { maskPhone } from '@/utils/phoneUtils';

export default function DeleteOtpModal({
  visible,
  otp,
  onOtpChange,
  error,
  loading,
  timer,
  canResend,
  phone,
  otpLength,
  onConfirm,
  onResend,
  onClose,
}) {
  const { colors } = useTheme();

  if (!visible) return null;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return toPersianDigit(`${m}:${s.toString().padStart(2, '0')}`);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-6 flex flex-col gap-4"
        style={{ backgroundColor: colors.cardBackground }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            کد تایید حذف حساب
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={16} style={{ color: colors.textMain }} />
          </button>
        </div>
        <p className="text-xs text-center" style={{ color: colors.textSecondary }}>
          کد ارسال‌شده به{' '}
          <span className="font-[Vazir-Bold]" style={{ color: colors.primary }}>
            {toPersianDigit(maskPhone(phone || '09123456789'))}
          </span>{' '}
          را وارد کنید
        </p>
        {/* OTP Inputs */}
        <OTPInput
          value={otp}
          onChange={onOtpChange}
          length={otpLength}
          error={error}
        />
        {error && (
          <p className="text-center text-sm" style={{ color: '#E57373' }}>
            {error}
          </p>
        )}
        {/* ارسال مجدد */}
        <div className="flex justify-center">
          {canResend ? (
            <button onClick={onResend} type="button">
              <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.primary }}>
                ارسال مجدد کد
              </span>
            </button>
          ) : (
            <span className="text-sm" style={{ color: colors.textSecondary }}>
              ارسال مجدد تا {formatTime(timer)}
            </span>
          )}
        </div>
        <Button
          title={loading ? 'در حال حذف...' : 'تایید و حذف حساب'}
          onPress={onConfirm}
          loading={loading}
          disabled={otp.join('').length < otpLength || loading}
          variant="primary"
          size="lg"
          fullWidth
          style={{ backgroundColor: '#E53935' }}
        />
      </div>
    </div>,
    document.body
  );
}