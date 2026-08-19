// src/components/createbusiness/NationalIdVerificationStep.jsx
'use client';
import { useState } from 'react';
import {
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowLeft,
  FiLock,
  FiUser,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/common/Button';
import { toPersianDigit, toEnglishDigits } from '@/utils/numberUtils';
import { validateNationalId } from '@/utils/validators';
import { authService } from '@/api';
import { USE_MOCK } from '@/api/config';

export default function NationalIdVerificationStep({
  formData,
  onUpdate,
  registeredPhone,
  onVerified,
}) {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const [nationalId, setNationalId] = useState(formData.nationalId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [verifiedName, setVerifiedName] = useState('');

  const handleNationalIdChange = (text) => {
    const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
    if (cleaned.length <= 10) {
      setNationalId(cleaned);
      setError('');
    }
  };

  const isValid = nationalId.length === 10 && validateNationalId(nationalId);

  const handleVerify = async () => {
    if (!nationalId) {
      setError('لطفاً کد ملی خود را وارد کنید');
      return;
    }
    if (nationalId.length !== 10) {
      setError('کد ملی باید دقیقاً ۱۰ رقم باشد');
      return;
    }
    if (!validateNationalId(nationalId)) {
      setError('کد ملی وارد شده معتبر نیست');
      return;
    }

    setLoading(true);
    setError('');
    try {
      let result;
      if (!USE_MOCK) {
        result = await authService.verifyNationalId(nationalId);
      } else {
        await new Promise((r) => setTimeout(r, 1500));
        result = {
          data: { verified_name: 'کاربر آزمایشی بیو کلاب', national_id: nationalId },
        };
      }
      const name = result.data?.verified_name || '';
      setVerifiedName(name);
      setSuccess(true);
      onUpdate('nationalId', nationalId);
      onUpdate('verifiedName', name);
      showToast('هویت شما با موفقیت تایید شد', 'success');
      setTimeout(() => onVerified?.(), 1000);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'خطا در استعلام کد ملی');
    }
  };

  const maskedPhone = registeredPhone
    ? registeredPhone.slice(0, 4) + '***' + registeredPhone.slice(-4)
    : '';

  // ─── حالت موفقیت ───
  if (success) {
    return (
      <div className="px-5 pt-10 pb-6 flex flex-col items-center gap-6">
        <div className="relative">
          <div
            className="absolute -inset-4 rounded-full animate-ping opacity-20"
            style={{ backgroundColor: '#4CAF50' }}
          />
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center relative z-10"
            style={{ backgroundColor: '#4CAF50' }}
          >
            <FiCheckCircle size={48} color="#fff" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-[Vazir-Bold] mb-2" style={{ color: colors.textMain }}>
            هویت شما تایید شد
          </h3>
          {verifiedName && (
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {verifiedName}
            </p>
          )}
        </div>
        <div
          className="w-full max-w-xs p-4 rounded-2xl border text-center"
          style={{ backgroundColor: '#4CAF5008', borderColor: '#4CAF5030' }}
        >
          <span className="text-sm font-[Vazir]" style={{ color: '#4CAF50' }}>
            در حال انتقال به مرحله بعد...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-6 space-y-6">
      {/* ─── هدر ─── */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div
            className="absolute -inset-3 rounded-full border-2 border-dashed"
            style={{ borderColor: '#4CAF5030' }}
          />
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center relative z-10"
            style={{ backgroundColor: '#4CAF5015' }}
          >
            <FiShield size={36} color="#4CAF50" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-[Vazir-Bold] mb-1" style={{ color: colors.textMain }}>
            احراز هویت مدیر
          </h3>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            کد ملی شما با شماره{' '}
            <span className="font-[Vazir-Bold]" style={{ color: colors.primary }}>
              {maskedPhone}
            </span>{' '}
            تطبیق داده می‌شود
          </p>
        </div>
      </div>

      {/* ─── کارت ورودی ─── */}
      <div
        className="rounded-3xl border p-5 space-y-4"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: error ? '#E5393540' : colors.border,
        }}
      >
        <label className="block text-sm font-[Vazir-Medium]" style={{ color: colors.textMain }}>
          کد ملی <span style={{ color: '#E53935' }}>*</span>
        </label>

        {/* ورودی کد ملی */}
        <div
          className="flex items-center gap-3 px-4 h-14 rounded-2xl border-2 transition-colors"
          style={{
            backgroundColor: colors.background,
            borderColor: error
              ? '#E53935'
              : nationalId.length === 10 && isValid
                ? '#4CAF50'
                : colors.border,
          }}
        >
          <FiUser
            size={20}
            style={{
              color: error
                ? '#E53935'
                : nationalId.length === 10 && isValid
                  ? '#4CAF50'
                  : colors.textSecondary,
            }}
          />
          <input
            type="tel"
            inputMode="numeric"
            value={toPersianDigit(nationalId)}
            onChange={(e) => handleNationalIdChange(e.target.value)}
            placeholder="۰۰۱۲۳۴۵۶۷۹"
            maxLength={10}
            className="flex-1 bg-transparent outline-none text-base font-[Vazir-Medium] text-center tracking-widest"
            style={{ color: colors.textMain, direction: 'ltr' }}
          />
          {nationalId.length === 10 && isValid && <FiCheckCircle size={20} color="#4CAF50" />}
        </div>

        {/* شمارنده رقم */}
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            {toPersianDigit(nationalId.length)} از ۱۰ رقم
          </span>
          {nationalId.length === 10 && !isValid && (
            <span className="text-xs flex items-center gap-1" style={{ color: '#E53935' }}>
              <FiAlertCircle size={12} />
              کد ملی معتبر نیست
            </span>
          )}
        </div>

        {/* نوار پیشرفت */}
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: colors.border }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${(nationalId.length / 10) * 100}%`,
              backgroundColor: nationalId.length === 10 && isValid ? '#4CAF50' : colors.primary,
            }}
          />
        </div>

        {/* خطا */}
        {error && (
          <div
            className="flex items-center gap-2 p-3 rounded-xl"
            style={{ backgroundColor: '#E5393510' }}
          >
            <FiAlertCircle size={14} color="#E53935" />
            <span className="text-xs" style={{ color: '#E53935' }}>
              {error}
            </span>
          </div>
        )}
      </div>

      {/* ─── نکات امنیتی ─── */}
      <div
        className="rounded-2xl p-4 space-y-3"
        style={{
          backgroundColor: colors.primary + '06',
          border: `1px solid ${colors.primary}20`,
        }}
      >
        {[
          'اطلاعات شما محرمانه و رمزنگاری‌شده نگهداری می‌شود',
          'پس از تایید، امکان تغییر کد ملی وجود ندارد',
          'کد ملی باید متعلق به شماره ثبت‌نام شده باشد',
        ].map((tip, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div
              className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
              style={{ backgroundColor: colors.primary }}
            />
            <span className="text-xs leading-5" style={{ color: colors.textSecondary }}>
              {tip}
            </span>
          </div>
        ))}
      </div>

      {/* ─── دکمه استعلام ─── */}
      <Button
        title={loading ? 'در حال استعلام...' : 'استعلام و تایید کد ملی'}
        onPress={handleVerify}
        loading={loading}
        disabled={!isValid || loading}
        variant="primary"
        size="lg"
        fullWidth
        icon={<FiArrowLeft size={18} color="#fff" />}
        iconPosition="left"
        style={{ backgroundColor: '#4CAF50', opacity: !isValid ? 0.5 : 1 }}
      />
    </div>
  );
}
