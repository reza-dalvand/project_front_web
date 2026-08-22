// src/app/profile/bank-info/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiCreditCard, FiCheckCircle, FiClock } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Dropdown from '@/components/common/Dropdown';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { toPersianDigit, toEnglishDigits } from '@/utils/numberUtils';
import { validateNationalId, validateSheba } from '@/utils/validators';
import { bankInfoService } from '@/api';

// ═══════ ثابت محلی: لیست بانک‌ها ═══════
// ⚠️ بک‌اند اندپوینت لیست بانک‌ها ندارد — این ثابت محلی باقی می‌ماند
const IRANIAN_BANKS = [
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
  { id: 'karafarin', label: 'بانک کارآفرین' },
  { id: 'tosee', label: 'بانک توسعه صادرات' },
  { id: 'post_bank', label: 'پست بانک ایران' },
  { id: 'shahr', label: 'بانک شهر' },
];

export default function BankInfoPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    bank_name: '',
    bank_id: '',
    sheba: '',
    card_number: '',
    owner_name: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [isComplete, setIsComplete] = useState(false);

  // دریافت اطلاعات بانکی از بک‌اند
  useEffect(() => {
    const fetchBankInfo = async () => {
      setIsLoading(true);
      try {
        const result = await bankInfoService.getBankInfo();
        const data = result.data;
        setFormData({
          bank_name: data.bank_name || '',
          bank_id: data.bank_id || '',
          sheba: data.sheba || '',
          card_number: data.card_number || '',
          owner_name: data.owner_name || '',
        });
        setIsComplete(data.is_complete || false);
      } catch (error) {
        console.error('Failed to fetch bank info:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBankInfo();
  }, []);

  const handleSave = async () => {
    const newErrors = {};
    if (!formData.bank_name.trim()) {
      newErrors.bank_name = 'نام بانک الزامی است';
    }
    if (formData.sheba && !validateSheba(formData.sheba)) {
      newErrors.sheba = 'شماره شبا باید با IR شروع شده و ۲۶ کاراکتر باشد';
    }
    if (formData.card_number && formData.card_number.replace(/[^0-9]/g, '').length !== 16) {
      newErrors.card_number = 'شماره کارت باید ۱۶ رقم باشد';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSaving(true);
    try {
      await bankInfoService.updateBankInfo({
        bank_name: formData.bank_name,
        bank_id: formData.bank_id,
        sheba: formData.sheba,
        card_number: formData.card_number,
        owner_name: formData.owner_name,
      });
      setIsSaving(false);
      showToast('اطلاعات بانکی با موفقیت ذخیره شد', 'success');
      setIsComplete(true);
    } catch (err) {
      setIsSaving(false);
      showToast(err.message || 'خطا در ذخیره اطلاعات', 'error');
    }
  };

  const handleShebaChange = (text) => {
    let cleaned = toEnglishDigits(text).trim().toUpperCase();
    if (!cleaned.startsWith('IR') && cleaned.length > 0) {
      cleaned = 'IR' + cleaned;
    }
    cleaned = cleaned.replace(/[^0-9IR]/g, '');
    if (cleaned.length <= 26) {
      setFormData((prev) => ({ ...prev, sheba: cleaned }));
      if (errors.sheba) setErrors((prev) => ({ ...prev, sheba: '' }));
    }
  };

  const handleCardChange = (text) => {
    const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
    if (cleaned.length <= 16) {
      setFormData((prev) => ({ ...prev, card_number: cleaned }));
      if (errors.card_number) setErrors((prev) => ({ ...prev, card_number: '' }));
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <Header title="اطلاعات بانکی" onBackPress={() => router.back()} />
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner label="در حال بارگذاری..." />
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper padding={0}>
      <Header title="اطلاعات بانکی" onBackPress={() => router.back()} />
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-10 space-y-5">
        {/* وضعیت */}
        <Card
          variant="default"
          padding={14}
          radius={14}
          className="border"
          style={{
            backgroundColor: isComplete ? '#43A04710' : '#FF980010',
            borderColor: isComplete ? '#43A04740' : '#FF980040',
          }}
        >
          <div className="flex items-center gap-3">
            {isComplete ? (
              <FiCheckCircle size={24} color="#43A047" />
            ) : (
              <FiClock size={24} color="#FF9800" />
            )}
            <div className="flex-1">
              <p
                className="text-sm font-[Vazir-Bold]"
                style={{ color: isComplete ? '#43A047' : '#FF9800' }}
              >
                {isComplete ? 'اطلاعات بانکی کامل است' : 'اطلاعات بانکی ناقص است'}
              </p>
              <p className="text-xs" style={{ color: colors.textSecondary }}>
                {isComplete
                  ? 'تمام فیلدهای مورد نیاز تکمیل شده است'
                  : 'لطفاً اطلاعات بانکی خود را تکمیل کنید'}
              </p>
            </div>
          </div>
        </Card>

        {/* فرم */}
        <Card variant="elevated" padding={20} radius={18}>
          <div className="flex items-center gap-2 mb-5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.primary + '15' }}
            >
              <FiCreditCard size={16} style={{ color: colors.primary }} />
            </div>
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              اطلاعات حساب بانکی
            </span>
          </div>

          <Dropdown
            label="نام بانک *"
            placeholder="بانک را انتخاب کنید"
            value={formData.bank_name}
            options={IRANIAN_BANKS}
            onSelect={(val) => {
              setFormData((prev) => ({ ...prev, bank_name: val }));
              if (errors.bank_name) setErrors((prev) => ({ ...prev, bank_name: '' }));
            }}
          />
          {errors.bank_name && (
            <p className="text-xs text-[#E53935] mt-1 mb-3">{errors.bank_name}</p>
          )}

          <Input
            label="نام صاحب حساب"
            placeholder="مثال: مریم حسینی"
            value={formData.owner_name}
            onChangeText={(t) => setFormData((prev) => ({ ...prev, owner_name: t }))}
          />

          <Input
            label="شماره شبا"
            placeholder="IR000000000000000000000000"
            value={formData.sheba}
            onChangeText={handleShebaChange}
            maxLength={26}
            error={errors.sheba}
            hint="شماره شبا باید با IR شروع شده و ۲۶ کاراکتر باشد"
          />

          <Input
            label="شماره کارت"
            placeholder="۶۰۳۷۹۹۱۸۱۲۳۴۵۶۷۸"
            value={toPersianDigit(formData.card_number)}
            onChangeText={handleCardChange}
            type="tel"
            maxLength={16}
            error={errors.card_number}
            rightIcon={<FiCreditCard size={18} style={{ color: colors.textSecondary }} />}
          />
        </Card>

        {/* دکمه ذخیره */}
        <Button
          title="ذخیره اطلاعات"
          onPress={handleSave}
          loading={isSaving}
          disabled={isSaving}
          variant="primary"
          size="lg"
          fullWidth
        />
      </div>
    </ScreenWrapper>
  );
}