'use client';

import { useState } from 'react';
import {
  FiShield,
  FiSmartphone,
  FiLock,
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiRefreshCw,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import InfoRow from '@/components/common/InfoRow';
import { toPersianDigit, toEnglishDigits } from '@/utils/numberUtils';
import { validateNationalId } from '@/utils/validators';
import { maskPhone } from '@/utils/phoneUtils';

const TEST_NATIONAL_ID = '0012345679';

const verifyNationalIdWithPhone = async (nationalId, phone) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const cleanedId = toEnglishDigits(nationalId).replace(/[^0-9]/g, '');
    const cleanedPhone = toEnglishDigits(phone || '').replace(/[^0-9]/g, '');

    if (cleanedId === TEST_NATIONAL_ID) {
      return {
        success: true,
        name: 'کاربر آزمایشی زیبانو',
        message: 'کد ملی با شماره ثبت‌نام شده تطابق دارد',
      };
    }

    if (!validateNationalId(cleanedId)) {
      return { success: false, message: 'فرمت کد ملی صحیح نیست' };
    }

    if (Math.random() > 0.3 && cleanedPhone.startsWith('09')) {
      return {
        success: true,
        name: 'نام و نام خانوادگی تایید شده',
        message: 'کد ملی با شماره ثبت‌نام شده تطابق دارد',
      };
    }

    return {
      success: false,
      message: 'کد ملی وارد شده با شماره موبایل ثبت‌نام شده شما تطابق ندارد',
    };
  } catch (error) {
    return { success: false, message: 'خطا در برقراری ارتباط با سامانه استعلام' };
  }
};

export default function NationalIdVerificationStep({ formData, onUpdate, registeredPhone }) {
  const { colors } = useTheme();
  const [nationalId, setNationalId] = useState(formData.nationalId || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(
    formData.isNationalIdVerified ? 'success' : null
  );
  const [verifiedName, setVerifiedName] = useState(formData.verifiedName || '');

  const handleNationalIdChange = (text) => {
    const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
    if (cleaned.length <= 10) {
      setNationalId(cleaned);
      setError('');
      if (verificationResult === 'success') {
        setVerificationResult(null);
        onUpdate('isNationalIdVerified', false);
        onUpdate('verifiedName', '');
      }
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

    setLoading(true);
    setError('');
    setVerificationResult(null);

    const phoneToVerify = registeredPhone || '09123456789';
    const result = await verifyNationalIdWithPhone(nationalId, phoneToVerify);

    if (result.success) {
      setVerificationResult('success');
      setVerifiedName(result.name);
      onUpdate('nationalId', nationalId);
      onUpdate('isNationalIdVerified', true);
      onUpdate('verifiedName', result.name);
    } else {
      setVerificationResult('failed');
      setError(result.message);
      onUpdate('isNationalIdVerified', false);
    }

    setLoading(false);
  };

  const canVerify = nationalId.length === 10 && !loading;
  const isTestMode = nationalId === TEST_NATIONAL_ID;

  return (
    <div className="px-5 pt-4 pb-6 space-y-5">
      {/* هدر بخش */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#4CAF5018' }}
        >
          <FiShield size={18} color="#4CAF50" />
        </div>
        <div>
          <h2 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            احراز هویت مدیر
          </h2>
          <p className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
            کد ملی شما با شماره ثبت‌نام شده تطبیق داده می‌شود
          </p>
        </div>
      </div>

      {/* کارت شماره ثبت‌نام */}
      <Card
        variant="default"
        padding={14}
        radius={14}
        className="border"
        style={{
          backgroundColor: colors.primary + '10',
          borderColor: colors.primary + '30',
        }}
      >
        <InfoRow
          icon={<FiSmartphone size={18} />}
          iconColor={colors.primary}
          label="شماره ثبت‌نام شده شما"
          value={maskPhone(registeredPhone) || '۰۹۱۲***۶۷۸۹'}
          valueColor={colors.primary}
          valueBold
        />
      </Card>

      {/* کارت امنیت */}
      <Card variant="default" padding={14} radius={14}>
        <InfoRow
          icon={<FiLock size={18} />}
          iconColor="#2196F3"
          label=""
          value="اطلاعات شما محرمانه است و فقط برای احراز هویت استفاده می‌شود"
        />
      </Card>

      {/* فیلد کد ملی */}
      <div className="space-y-2">
        <label className="text-sm font-[Vazir-Medium]" style={{ color: colors.textMain }}>
          کد ملی مدیر کسب‌وکار
        </label>
        <Input
          placeholder="مثال: ۰۰۱۲۳۴۵۶۷۸۹"
          value={toPersianDigit(nationalId)}
          onChangeText={handleNationalIdChange}
          type="tel"
          maxLength={10}
          error={error}
          rightIcon={
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.primary + '15' }}
            >
              <FiShield size={18} style={{ color: colors.primary }} />
            </div>
          }
          hint={
            <div className="space-y-1 mt-1">
              <p className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
                کد ملی ۱۰ رقمی باید متعلق به شماره ثبت‌نام شده بالا باشد
              </p>
              {nationalId.length > 0 && nationalId.length < 10 && (
                <p className="text-xs font-[Vazir-Bold]" style={{ color: '#FFA000' }}>
                  {toPersianDigit(nationalId.length)} از ۱۰ رقم وارد شده
                </p>
              )}
              {nationalId.length === 10 && !isTestMode && (
                <p className="text-xs font-[Vazir-Bold]" style={{ color: '#4CAF50' }}>
                  ✓ تعداد ارقام صحیح است
                </p>
              )}
              {isTestMode && (
                <p className="text-xs font-[Vazir-Bold]" style={{ color: '#2196F3' }}>
                  🧪 کد تست شناسایی شد - استعلام ۱۰۰٪ موفق خواهد بود
                </p>
              )}
            </div>
          }
        />
      </div>

      {/* دکمه استعلام */}
      <Button
        title={loading ? 'در حال استعلام...' : 'استعلام کد ملی'}
        onPress={handleVerify}
        loading={loading}
        disabled={!canVerify}
        variant="primary"
        size="lg"
        fullWidth
        icon={loading ? null : <FiShield size={18} color="#fff" />}
        iconPosition="right"
      />

      {/* نتیجه موفقیت */}
      {verificationResult === 'success' && (
        <Card
          variant="default"
          padding={16}
          radius={14}
          className="border-2"
          style={{
            backgroundColor: '#4CAF5015',
            borderColor: '#4CAF50',
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#4CAF5022' }}
            >
              <FiCheckCircle size={28} color="#4CAF50" />
            </div>
            <div>
              <p className="text-base font-[Vazir-Bold]" style={{ color: '#4CAF50' }}>
                هویت شما تایید شد ✓
              </p>
              <p className="text-sm font-[Vazir-Bold] mt-1" style={{ color: colors.textMain }}>
                {verifiedName}
              </p>
            </div>
          </div>
          <div className="h-px my-3" style={{ backgroundColor: '#4CAF5030' }} />
          <p className="text-xs font-[Vazir] leading-5" style={{ color: colors.textSecondary }}>
            کد ملی با شماره ثبت‌نام شده شما مطابقت دارد. می‌توانید با دکمه «ثبت نهایی» ادامه دهید.
          </p>
        </Card>
      )}

      {/* نتیجه ناموفق */}
      {verificationResult === 'failed' && (
        <Card
          variant="default"
          padding={16}
          radius={14}
          className="border-2"
          style={{
            backgroundColor: '#E5737315',
            borderColor: '#E57373',
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#E5737322' }}
            >
              <FiXCircle size={28} color="#E57373" />
            </div>
            <div>
              <p className="text-base font-[Vazir-Bold]" style={{ color: '#E57373' }}>
                عدم تطابق اطلاعات
              </p>
              <p className="text-xs font-[Vazir] mt-1" style={{ color: colors.textSecondary }}>
                {error || 'کد ملی وارد شده با شماره ثبت‌نام شده تطابق ندارد'}
              </p>
            </div>
          </div>
          <Button
            title="تلاش مجدد"
            onPress={handleVerify}
            variant="outline"
            size="md"
            className="mt-3"
            icon={<FiRefreshCw size={16} color="#E57373" />}
            iconPosition="right"
          />
        </Card>
      )}

      {/* راهنمای تست */}
      <Card variant="default" padding={14} radius={14}>
        <div className="flex items-center gap-2 mb-2">
          <FiInfo size={18} style={{ color: colors.primary }} />
          <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            راهنمای حالت آزمایشی
          </span>
        </div>
        <p className="text-xs font-[Vazir] leading-5" style={{ color: colors.textSecondary }}>
          برای تست سریع، از کد ملی{' '}
          <span className="font-[Vazir-Bold]" style={{ color: colors.primary }}>
            {toPersianDigit(TEST_NATIONAL_ID)}
          </span>{' '}
          استفاده کنید. این کد همیشه با هر شماره ثبت‌نام شده‌ای تطابق پیدا می‌کند.
        </p>
      </Card>
    </div>
  );
}
