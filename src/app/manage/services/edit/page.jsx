// src/app/manage/services/edit/page.jsx
'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiInfo, FiDollarSign, FiTag, FiShield, FiSave, FiClock } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Dropdown from '@/components/common/Dropdown';
import SectionHeader from '@/components/common/SectionHeader';
import CharCounter from '@/components/common/CharCounter';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { toPersianDigit, formatPriceInput, parseNumber } from '@/utils/numberUtils';
import {
  SERVICE_CATEGORIES,
  getSubServicesByCategory,
  getServiceTypeInfo,
} from '@/constants/serviceTypes';
import { USE_MOCK } from '@/api/config';

const MAX_DESCRIPTION_LENGTH = 300;
const MIN_FINAL_PRICE = 50000;
const MIN_DEPOSIT = 50000;

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
  const [hasDeposit, setHasDeposit] = useState(existingService?.hasDeposit || false);
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
    if (serviceId && !existingService && !USE_MOCK) {
      setLoading(true);
      fetchServices()
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    }
  }, [serviceId]);

  const availableSubServices = categoryId ? getSubServicesByCategory(categoryId) : [];

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

    if (hasDeposit && depositNum > 0 && depositNum < MIN_DEPOSIT) {
      newErrors.depositAmount = `حداقل بیعانه ${toPersianDigit(MIN_DEPOSIT.toLocaleString())} تومان است`;
    }
    if (hasDeposit && depositNum > finalPrice) {
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
        typeName: availableSubServices.find((s) => s.id === typeId)?.label || '',
        categoryLabel: SERVICE_CATEGORIES.find((c) => c.id === categoryId)?.label || '',
        originalPrice: originalNum,
        discountPercent: discountNum,
        finalPrice,
        hasDeposit,
        depositAmount: hasDeposit ? depositNum : 0,
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
        <SectionHeader
          icon={<FiInfo size={18} />}
          iconColor={colors.primary}
          title="اطلاعات پایه"
        />
        <Card variant="elevated" padding={16} radius={18}>
          <Input
            label="نام خدمت *"
            placeholder="مثال: فیشیال تخصصی پوست"
            value={name}
            onChangeText={(t) => {
              setName(t);
              setErrors((p) => ({ ...p, name: '' }));
            }}
            error={errors.name}
          />

          <Dropdown
            label="دسته‌بندی خدمت *"
            placeholder="دسته‌بندی را انتخاب کنید"
            value={categoryId}
            options={SERVICE_CATEGORIES.map((c) => ({ id: c.id, label: c.label }))}
            onSelect={(val) => {
              setCategoryId(val);
              setTypeId(null);
              setErrors((p) => ({ ...p, categoryId: '', typeId: '' }));
            }}
          />
          {errors.categoryId && (
            <p className="text-xs text-[#E53935] mt-1 mb-3">{errors.categoryId}</p>
          )}

          <Dropdown
            label="نوع خدمت *"
            placeholder={categoryId ? 'نوع خدمت را انتخاب کنید' : 'ابتدا دسته‌بندی را انتخاب کنید'}
            value={typeId}
            options={availableSubServices}
            onSelect={(val) => {
              setTypeId(val);
              setErrors((p) => ({ ...p, typeId: '' }));
            }}
            disabled={!categoryId}
          />
          {errors.typeId && <p className="text-xs text-[#E53935] mt-1">{errors.typeId}</p>}
        </Card>

        {/* قیمت‌گذاری */}
        <SectionHeader icon={<FiDollarSign size={18} />} iconColor="#43A047" title="قیمت‌گذاری" />
        <Card variant="elevated" padding={16} radius={18}>
          <Input
            label="قیمت اصلی (تومان) *"
            placeholder="مثال: ۷۵۰,۰۰۰"
            value={originalPrice}
            onChangeText={(t) => {
              setOriginalPrice(formatPriceInput(t));
              setErrors((p) => ({ ...p, originalPrice: '' }));
            }}
            error={errors.originalPrice}
          />

          <Input
            label="درصد تخفیف (اختیاری)"
            placeholder="مثال: ۲۰"
            value={discountPercent}
            onChangeText={(t) => {
              const cleaned = t.replace(/[^0-9]/g, '');
              if (parseNumber(cleaned) <= 100 || cleaned === '') {
                setDiscountPercent(cleaned);
                setErrors((p) => ({ ...p, discountPercent: '' }));
              }
            }}
            error={errors.discountPercent}
          />

          {/* پیش‌نمایش قیمت */}
          {originalNum > 0 && (
            <div
              className="mt-3 p-3 rounded-xl border"
              style={{ backgroundColor: colors.background, borderColor: colors.border }}
            >
              <div className="flex justify-between mb-1">
                <span className="text-xs" style={{ color: colors.textSecondary }}>
                  قیمت نهایی:
                </span>
                <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.primary }}>
                  {toPersianDigit(finalPrice.toLocaleString())} تومان
                </span>
              </div>
              {discountNum > 0 && (
                <div className="flex justify-between">
                  <span className="text-xs" style={{ color: colors.textSecondary }}>
                    مبلغ تخفیف:
                  </span>
                  <span className="text-xs" style={{ color: '#4CAF50' }}>
                    - {toPersianDigit(discountAmount.toLocaleString())} تومان
                  </span>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* بیعانه */}
        <SectionHeader icon={<FiShield size={18} />} iconColor="#FF9800" title="بیعانه رزرو" />
        <Card variant="elevated" padding={16} radius={18}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-[Vazir-Medium]" style={{ color: colors.textMain }}>
              نیاز به بیعانه
            </span>
            <button
              onClick={() => setHasDeposit(!hasDeposit)}
              className="relative w-11 h-6 rounded-full transition-colors"
              style={{ backgroundColor: hasDeposit ? colors.primary + '55' : colors.border }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full shadow-md transition-all"
                style={{
                  backgroundColor: hasDeposit ? colors.primary : '#ccc',
                  [hasDeposit ? 'right' : 'left']: '2px',
                }}
              />
            </button>
          </div>

          {hasDeposit && (
            <Input
              label="مبلغ بیعانه (تومان)"
              placeholder="مثال: ۲۰۰,۰۰۰"
              value={depositAmount}
              onChangeText={(t) => {
                setDepositAmount(formatPriceInput(t));
                setErrors((p) => ({ ...p, depositAmount: '' }));
              }}
              error={errors.depositAmount}
              hint={`حداقل: ${toPersianDigit(MIN_DEPOSIT.toLocaleString())} تومان`}
            />
          )}
        </Card>

        {/* مدت و یادآوری */}
        <SectionHeader icon={<FiClock size={18} />} iconColor="#2196F3" title="مدت و یادآوری" />
        <Card variant="elevated" padding={16} radius={18}>
          <Input
            label="مدت هر نوبت (دقیقه)"
            placeholder="مثال: ۶۰"
            value={duration}
            onChangeText={(t) => setDuration(t.replace(/[^0-9]/g, ''))}
          />
          <Input
            label="یادآوری تمدید (روز)"
            placeholder="۰ = بدون یادآوری"
            value={renewalDays}
            onChangeText={(t) => {
              setRenewalDays(t.replace(/[^0-9]/g, ''));
              setErrors((p) => ({ ...p, renewalDays: '' }));
            }}
            error={errors.renewalDays}
            hint="پس از انجام خدمت، بعد از این تعداد روز یادآوری ارسال می‌شود"
          />
        </Card>

        {/* توضیحات */}
        <SectionHeader icon={<FiTag size={18} />} iconColor="#9C27B0" title="توضیحات" />
        <Card variant="elevated" padding={16} radius={18}>
          <Input
            label="توضیحات (اختیاری)"
            placeholder="توضیحاتی درباره این خدمت..."
            value={description}
            onChangeText={(t) => {
              if (t.length <= MAX_DESCRIPTION_LENGTH) setDescription(t);
            }}
            multiline
          />
          <CharCounter current={description.length} max={MAX_DESCRIPTION_LENGTH} />
        </Card>

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
