// src/components/profile/appointments/CancelBankForm.jsx
'use client';
import { FiAlertTriangle, FiInfo, FiCreditCard } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Input from '@/components/common/Input';
import Dropdown from '@/components/common/Dropdown';
import { toPersianDigit } from '@/utils/numberUtils';
// ✅ FIX P2: import از فایل مشترک به جای تعریف محلی
import { getBankOptions } from '@/constants/banks';

export default function CancelBankForm({
  bankId,
  sheba,
  cardNumber,
  userName,
  onBankChange,
  onShebaChange,
  onCardChange,
}) {
  const { colors } = useTheme();

  // ✅ FIX P2: استفاده از لیست مشترک
  const bankOptions = getBankOptions();

  return (
    <>
      <div
        className="flex items-start gap-3 p-4 rounded-2xl border"
        style={{ backgroundColor: '#FF980008', borderColor: '#FF980030' }}
      >
        <FiAlertTriangle size={18} color="#FF9800" className="flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs font-[Vazir] leading-5" style={{ color: colors.textSecondary }}>
            برای استرداد وجه، اطلاعات حساب بانکی خود را وارد کنید.
          </p>
        </div>
      </div>

      <Dropdown
        label="نام بانک *"
        placeholder="بانک خود را انتخاب کنید"
        value={bankId}
        options={bankOptions}
        onSelect={onBankChange}
      />

      <Input
        label="شماره شبا *"
        placeholder="IR000000000000000000000000"
        value={sheba}
        onChangeText={onShebaChange}
        maxLength={26}
        hint="شماره شبا باید با IR شروع شده و ۲۶ کاراکتر باشد"
      />

      <Input
        label="شماره کارت *"
        placeholder="۶۰۳۷۹۹۱۸۱۲۳۴۵۶۷۸"
        value={toPersianDigit(cardNumber)}
        onChangeText={onCardChange}
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
            {userName || 'صاحب حساب'}
          </span>{' '}
          باشد.
        </p>
      </div>
    </>
  );
}
