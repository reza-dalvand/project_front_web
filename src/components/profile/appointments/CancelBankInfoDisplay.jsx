// src/components/profile/appointments/CancelBankInfoDisplay.jsx
'use client';
import { FiCheckCircle, FiShield } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function CancelBankInfoDisplay({ bankInfo }) {
  const { colors } = useTheme();

  return (
    <>
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
        <FiShield size={18} color="#4CAF50" className="flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-[Vazir] leading-6" style={{ color: colors.textMain }}>
            بازگشت وجه به حساب شما انجام خواهد شد.
          </p>
        </div>
      </div>
    </>
  );
}
