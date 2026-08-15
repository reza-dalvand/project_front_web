// src/components/common/auth/AuthInfoStep.jsx
'use client';
import { FiUser, FiSmartphone, FiCheck } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { toPersianDigit, toEnglishDigits } from '@/utils/numberUtils';

export default function AuthInfoStep({
  phone,
  onPhoneChange,
  termsAccepted,
  onTermsChange,
  error,
  loading,
  onSendOtp,
}) {
  const { colors } = useTheme();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-3 mb-2">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: colors.primary + '15' }}
        >
          <FiUser size={32} style={{ color: colors.primary }} />
        </div>
        <p className="text-sm text-center" style={{ color: colors.textSecondary }}>
          شماره موبایل خود را وارد کنید
        </p>
      </div>
      <Input
        label="شماره موبایل"
        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
        value={toPersianDigit(phone)}
        onChangeText={(t) => {
          const cleaned = toEnglishDigits(t).replace(/[^0-9]/g, '');
          if (cleaned.length <= 11) onPhoneChange(cleaned);
        }}
        type="tel"
        maxLength={11}
        error={error}
        rightIcon={<FiSmartphone size={18} style={{ color: colors.textSecondary }} />}
      />
      <label className="flex items-start gap-3 cursor-pointer py-2">
        <button
          onClick={() => onTermsChange(!termsAccepted)}
          className="mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors"
          style={{
            backgroundColor: termsAccepted ? colors.primary : 'transparent',
            borderColor: termsAccepted ? colors.primary : colors.border,
          }}
          type="button"
        >
          {termsAccepted && <FiCheck size={14} style={{ color: '#fff' }} />}
        </button>
        <span className="text-[13px] leading-5" style={{ color: colors.textMain }}>
          با{' '}
          <span className="font-[Vazir-Bold] underline" style={{ color: colors.primary }}>
            قوانین و مقررات
          </span>{' '}
          موافقم
        </span>
      </label>
      <div className="pb-6">
        <Button
          title="دریافت کد تایید"
          onPress={onSendOtp}
          loading={loading}
          disabled={phone.length !== 11 || !termsAccepted || loading}
          variant="primary"
          size="lg"
          fullWidth
        />
      </div>
    </div>
  );
}
