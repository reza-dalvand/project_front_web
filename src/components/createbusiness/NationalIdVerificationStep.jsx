// src/components/createbusiness/NationalIdVerificationStep.jsx
'use client';
import { useState } from 'react';
import { FiShield, FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useToast } from '@/hooks/useToast';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
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
          data: {
            verified_name: 'کاربر آزمایشی زیبانو',
            national_id: nationalId,
          },
        };
      }

      const name = result.data?.verified_name || '';
      setVerifiedName(name);
      setSuccess(true);
      onUpdate('nationalId', nationalId);
      onUpdate('verifiedName', name);
      showToast('هویت شما با موفقیت تایید شد', 'success');

      // رفتن به استپ بعد
      setTimeout(() => onVerified?.(), 800);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'خطا در استعلام کد ملی');
    }
  };

  const maskedPhone = registeredPhone
    ? registeredPhone.slice(0, 4) + '***' + registeredPhone.slice(-4)
    : '';

  return (
    <div className="px-5 pt-4 pb-6 space-y-5">
      {/* هدر */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#4CAF5015' }}
        >
          <FiShield size={40} color="#4CAF50" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            احراز هویت مدیر
          </h3>
          <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
            کد ملی شما با شماره ثبت‌نام شده تطبیق داده می‌شود
          </p>
        </div>
      </div>

      {/* شماره ثبت‌نام */}
      <Card
        variant="default"
        padding={14}
        radius={14}
        className="border"
        style={{ borderColor: colors.primary + '30' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">📱</span>
          <div className="flex-1">
            <p className="text-xs" style={{ color: colors.textSecondary }}>
              شماره ثبت‌نام شده
            </p>
            <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              {maskedPhone}
            </p>
          </div>
        </div>
      </Card>

      {/* فیلد کد ملی */}
      <Input
        label="کد ملی *"
        placeholder="مثال: ۰۰۱۲۳۴۵۶۷۹"
        value={toPersianDigit(nationalId)}
        onChangeText={handleNationalIdChange}
        type="tel"
        maxLength={10}
        error={error}
        hint={nationalId.length < 10 ? `${toPersianDigit(nationalId.length)} از ۱۰ رقم` : undefined}
      />

      {/* نتیجه موفق */}
      {success && (
        <Card
          variant="default"
          padding={16}
          radius={14}
          className="border-2"
          style={{ borderColor: '#4CAF50' }}
        >
          <div className="flex items-center gap-3">
            <FiCheckCircle size={28} color="#4CAF50" />
            <div>
              <p className="text-base font-[Vazir-Bold]" style={{ color: '#4CAF50' }}>
                هویت شما تایید شد ✓
              </p>
              {verifiedName && (
                <p className="text-sm mt-1" style={{ color: colors.textMain }}>
                  {verifiedName}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* دکمه استعلام */}
      {!success && (
        <Button
          title={loading ? 'در حال استعلام...' : 'استعلام کد ملی'}
          onPress={handleVerify}
          loading={loading}
          disabled={nationalId.length !== 10 || loading}
          variant="primary"
          size="lg"
          fullWidth
          icon={<FiShield size={18} color="#fff" />}
          iconPosition="right"
        />
      )}

      {/* راهنما */}
      <Card variant="default" padding={14} radius={14}>
        <div className="flex items-center gap-2 mb-2">
          <FiInfo size={18} style={{ color: colors.primary }} />
          <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            نکات مهم
          </span>
        </div>
        <div className="space-y-2">
          {[
            'کد ملی باید متعلق به شماره ثبت‌نام شده باشد',
            'اطلاعات شما محرمانه نگهداری می‌شود',
            'پس از تایید، امکان تغییر کد ملی وجود ندارد',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-xs mt-0.5" style={{ color: colors.primary }}>
                •
              </span>
              <p className="text-xs leading-5" style={{ color: colors.textSecondary }}>
                {tip}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
