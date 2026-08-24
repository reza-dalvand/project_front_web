// src/app/manage/services/edit/page.jsx
'use client';
import { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiSave } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ServiceBasicInfoSection from '@/components/manageBusiness/services/edit/ServiceBasicInfoSection';
import ServicePricingSection from '@/components/manageBusiness/services/edit/ServicePricingSection';
import ServiceDepositSection from '@/components/manageBusiness/services/edit/ServiceDepositSection';
import ServiceDurationSection from '@/components/manageBusiness/services/edit/ServiceDurationSection';
import { toPersianDigit, formatPriceInput, parseNumber } from '@/utils/numberUtils';
import { MIN_FINAL_PRICE, MIN_DEPOSIT } from '@/utils/price-utils';
const MAX_DESCRIPTION_LENGTH = 300;

function EditServicePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('id');
  const { colors } = useTheme();
  const { showToast } = useToast();
  const businessData = useBusinessStore((s) => s.businessData);
  const createServiceApi = useBusinessStore((s) => s.createServiceApi);
  const updateServiceApi = useBusinessStore((s) => s.updateServiceApi);
  const fetchServices = useBusinessStore((s) => s.fetchServices);
  const existingService = serviceId
    ? businessData?.services?.find((s) => s.id === serviceId || String(s.id) === serviceId)
    : null;
  const isEditMode = !!existingService;

  // ═══ State فرم ═══
  const [name, setName] = useState(existingService?.name || '');
  const [categoryId, setCategoryId] = useState(existingService?.categoryId || null);
  const [typeId, setTypeId] = useState(existingService?.typeId || null);
  const [originalPrice, setOriginalPrice] = useState(
    existingService?.originalPrice ? formatPriceInput(String(existingService.originalPrice)) : ''
  );
  const [discountPercent, setDiscountPercent] = useState(
    existingService?.discountPercent ? String(existingService.discountPercent) : ''
  );
  const [depositAmount, setDepositAmount] = useState(
    existingService?.depositAmount ? formatPriceInput(String(existingService.depositAmount)) : ''
  );
  const [duration, setDuration] = useState(
    existingService?.duration ? String(existingService.duration) : '60'
  );
  const [renewalDays, setRenewalDays] = useState(
    existingService?.renewalDays ? String(existingService.renewalDays) : '0'
  );
  const [description, setDescription] = useState(existingService?.description || '');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // ═══ در حالت ویرایش، اگر سرویس در store نبود از API بگیر ═══
  useEffect(() => {
    if (serviceId && !existingService) {
      setLoading(true);
      fetchServices()
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    }
  }, [serviceId, existingService, fetchServices]);

  // ═══ محاسبات قیمت ═══
  const originalNum = parseNumber(originalPrice);
  const discountNum = Math.min(parseNumber(discountPercent), 100);
  const discountAmount = Math.round((originalNum * discountNum) / 100);
  const finalPrice = Math.max(0, originalNum - discountAmount);
  const depositNum = parseNumber(depositAmount);

  // ═══ اعتبارسنجی ═══
  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'نام خدمت الزامی است';
    else if (name.trim().length < 3) newErrors.name = 'نام باید حداقل ۳ کاراکتر باشد';
    if (!categoryId) newErrors.categoryId = 'دسته‌بندی را انتخاب کنید';
    if (!typeId) newErrors.typeId = 'نوع خدمت را انتخاب کنید';
    if (originalNum <= 0) newErrors.originalPrice = 'قیمت اصلی باید بیشتر از صفر باشد';
    else if (finalPrice < MIN_FINAL_PRICE) {
      newErrors.originalPrice = `قیمت نهایی باید حداقل ${toPersianDigit(MIN_FINAL_PRICE.toLocaleString())} تومان باشد`;
    }
    if (discountNum > 100) newErrors.discountPercent = 'درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد';
    if (depositNum <= 0) {
      newErrors.depositAmount = 'مبلغ بیعانه الزامی است';
    } else if (depositNum < MIN_DEPOSIT) {
      newErrors.depositAmount = `حداقل بیعانه ${toPersianDigit(MIN_DEPOSIT.toLocaleString())} تومان است`;
    } else if (depositNum > finalPrice) {
      newErrors.depositAmount = 'بیعانه نمی‌تواند بیشتر از قیمت نهایی باشد';
    }
    if (parseNumber(renewalDays) > 365) {
      newErrors.renewalDays = 'حداکثر ۳۶۵ روز مجاز است';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ═══ ذخیره ═══
  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const serviceData = {
        name: name.trim(),
        categoryId,
        typeId,
        originalPrice: originalNum,
        discountPercent: discountNum,
        finalPrice,
        hasDeposit: true,
        depositAmount: depositNum,
        duration: parseNumber(duration) || 60,
        renewalDays: parseNumber(renewalDays) || 0,
        description: description.trim(),
        isActive: true,
      };
      if (isEditMode) {
        await updateServiceApi(serviceId, serviceData);
        showToast('✓ خدمت با موفقیت ویرایش شد', 'success');
      } else {
        await createServiceApi(serviceData);
        showToast('✓ خدمت جدید اضافه شد', 'success');
      }
      setTimeout(() => router.push('/manage/services'), 800);
    } catch (error) {
      showToast(error.message || 'خطا در ذخیره خدمت', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <div className="flex justify-center py-20">
          <LoadingSpinner label="در حال بارگذاری..." />
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper padding={0}>
      <Header
        title={isEditMode ? 'ویرایش خدمت' : 'افزودن خدمت جدید'}
        onBackPress={() => router.back()}
      />
      <div className="overflow-y-auto pb-32 px-5 pt-3 space-y-5">
        {/* اطلاعات پایه */}
        <ServiceBasicInfoSection
          name={name}
          categoryId={categoryId}
          typeId={typeId}
          errors={errors}
          onNameChange={(t) => {
            setName(t);
            setErrors((p) => ({ ...p, name: '' }));
          }}
          onCategoryChange={(val) => {
            setCategoryId(val);
            setTypeId(null);
            setErrors((p) => ({ ...p, categoryId: '', typeId: '' }));
          }}
          onTypeChange={(val) => {
            setTypeId(val);
            setErrors((p) => ({ ...p, typeId: '' }));
          }}
        />

        {/* قیمت‌گذاری */}
        <ServicePricingSection
          originalPrice={originalPrice}
          discountPercent={discountPercent}
          finalPrice={finalPrice}
          errors={errors}
          onOriginalPriceChange={(t) => {
            setOriginalPrice(formatPriceInput(t));
            setErrors((p) => ({ ...p, originalPrice: '' }));
          }}
          onDiscountChange={(t) => {
            const cleaned = t.replace(/[^0-9]/g, '');
            if (parseNumber(cleaned) <= 100 || cleaned === '') {
              setDiscountPercent(cleaned);
              setErrors((p) => ({ ...p, discountPercent: '' }));
            }
          }}
        />

        {/* بیعانه */}
        <ServiceDepositSection
          depositAmount={depositAmount}
          errors={errors}
          onDepositChange={(t) => {
            setDepositAmount(formatPriceInput(t));
            setErrors((p) => ({ ...p, depositAmount: '' }));
          }}
        />

        {/* مدت، یادآوری و توضیحات */}
        <ServiceDurationSection
          duration={duration}
          renewalDays={renewalDays}
          description={description}
          errors={errors}
          onDurationChange={(t) => setDuration(t.replace(/[^0-9]/g, ''))}
          onRenewalDaysChange={(t) => {
            setRenewalDays(t.replace(/[^0-9]/g, ''));
            setErrors((p) => ({ ...p, renewalDays: '' }));
          }}
          onDescriptionChange={(t) => {
            if (t.length <= MAX_DESCRIPTION_LENGTH) setDescription(t);
          }}
        />

        {/* دکمه ذخیره */}
        <Button
          title={saving ? 'در حال ذخیره...' : isEditMode ? 'ذخیره تغییرات' : 'افزودن خدمت'}
          onPress={handleSave}
          loading={saving}
          disabled={saving}
          variant="primary"
          size="lg"
          fullWidth
          icon={<FiSave size={18} color="#fff" />}
          iconPosition="right"
        />
      </div>
    </ScreenWrapper>
  );
}

export default function EditServicePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-app">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <EditServicePageContent />
    </Suspense>
  );
}
