// src/app/manage/services/edit/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FiInfo,
  FiDollarSign,
  FiCheck,
  FiTag,
  FiShield,
  FiRefreshCw,
  FiChevronLeft,
  FiX, // ← اضافه شد
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Dropdown from '@/components/common/Dropdown';
import Divider from '@/components/common/Divider';
import SectionHeader from '@/components/common/SectionHeader';
import CharCounter from '@/components/common/CharCounter';
import PriceBreakdown from '@/components/common/PriceBreakdown';
import ServiceTypeIcon from '@/components/manageBusiness/services/ServiceTypeIcon';
import {
  SERVICE_CATEGORIES,
  RENEWAL_OPTIONS,
  getSubServicesByCategory,
  getServiceTypeInfo,
} from '@/constants/serviceTypes';
import {
  toPersianDigit,
  formatPrice,
  toEnglishDigits,
  parseNumber,
  formatPriceInput,
  calculateAppFee,
} from '@/utils/numberUtils';

import dynamic from 'next/dynamic';

// ✅ Lazy Load
const PriceGuideModal = dynamic(() => import('@/components/common/PriceGuideModal'), {
  ssr: false,
  loading: () => null,
});

const MIN_FINAL_PRICE = 100000;
const MIN_DEPOSIT = 100000;
const MAX_DESCRIPTION_LENGTH = 300;

export default function EditServicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('id');
  const { colors } = useTheme();
  const { showToast } = useToast();
  const businessData = useBusinessStore((s) => s.businessData);
  const addService = useBusinessStore((s) => s.addService);
  const updateService = useBusinessStore((s) => s.updateService);
  const existingService = serviceId
    ? businessData?.services?.find((s) => s.id === serviceId)
    : null;
  const isEditMode = !!existingService;

  // استخراج categoryId از typeId سرویس موجود
  const existingTypeInfo = existingService ? getServiceTypeInfo(existingService.typeId) : null;

  // State فرم
  const [name, setName] = useState(existingService?.name || '');
  const [categoryId, setCategoryId] = useState(existingTypeInfo?.categoryId || null);
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
  const [isActive, setIsActive] = useState(existingService?.isActive !== false);
  const [description, setDescription] = useState(existingService?.description || '');
  const [renewalDays, setRenewalDays] = useState(existingService?.renewalDays || 0);
  const handleRenewalChange = (text) => {
    const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
    const num = parseInt(cleaned, 10) || 0;
    if (num <= 365) {
      setRenewalDays(num);
      if (errors.renewalDays) setErrors((p) => ({ ...p, renewalDays: '' }));
    }
  };
  const [errors, setErrors] = useState({});
  const [priceGuideVisible, setPriceGuideVisible] = useState(false);

  // محاسبات
  const originalNum = parseNumber(originalPrice);
  const discountNum = Math.min(parseNumber(discountPercent), 100);
  const discountAmount = Math.round((originalNum * discountNum) / 100);
  const finalPrice = Math.max(0, originalNum - discountAmount);
  const appFee = calculateAppFee(finalPrice);

  // لیست زیرخدمات بر اساس دسته‌بندی انتخاب شده
  const availableSubServices = categoryId ? getSubServicesByCategory(categoryId) : [];

  const handleCategoryChange = (val) => {
    setCategoryId(val);
    setTypeId(null); // ریست نوع خدمت وقتی دسته عوض شد
    if (errors.categoryId) setErrors((p) => ({ ...p, categoryId: '' }));
    if (errors.typeId) setErrors((p) => ({ ...p, typeId: '' }));
  };

  const handleSave = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'نام خدمت الزامی است';
    if (!categoryId) newErrors.categoryId = 'دسته‌بندی را انتخاب کنید';
    if (!typeId) newErrors.typeId = 'نوع خدمت را انتخاب کنید';
    if (originalNum <= 0) newErrors.originalPrice = 'قیمت اصلی باید بیشتر از صفر باشد';
    if (discountNum > 100) newErrors.discountPercent = 'درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد';
    if (finalPrice > 0 && finalPrice < MIN_FINAL_PRICE)
      newErrors.originalPrice = `قیمت نهایی باید حداقل ${formatPrice(MIN_FINAL_PRICE)} باشد`;
    const depositNum = parseNumber(depositAmount);
    if (depositNum > 0 && depositNum < MIN_DEPOSIT)
      newErrors.depositAmount = `حداقل بیعانه ${formatPrice(MIN_DEPOSIT)} است`;
    if (depositNum > finalPrice)
      newErrors.depositAmount = 'بیعانه نمی‌تواند بیشتر از قیمت نهایی باشد';
    if (renewalDays > 365) {
      newErrors.renewalDays = 'حداکثر ۳۶۵ روز مجاز است';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const typeInfo = getServiceTypeInfo(typeId);
    const serviceData = {
      name: name.trim(),
      categoryId,
      typeId,
      typeName: typeInfo.typeLabel,
      categoryLabel: typeInfo.categoryLabel,
      originalPrice: originalNum,
      discountPercent: discountNum,
      discountAmount,
      finalPrice,
      hasDeposit: depositNum > 0,
      depositAmount: depositNum,
      appFee,
      isActive,
      description: description.trim(),
      duration: 60,
      renewalDays,
    };

    if (isEditMode) {
      updateService(serviceId, serviceData);
      showToast('✓ خدمت با موفقیت ویرایش شد', 'success');
    } else {
      addService(serviceData);
      showToast('✓ خدمت جدید اضافه شد', 'success');
    }
    router.push('/manage/services');
  };

  return (
    <ScreenWrapper padding={0}>
      <Header
        title={isEditMode ? 'ویرایش خدمت' : 'افزودن خدمت جدید'}
        onBackPress={() => router.back()}
      />
      <div className="overflow-y-auto pb-32 px-5 pt-3 space-y-5">
        {/* هدر با آیکون */}
        <div className="flex flex-col items-center gap-2 py-3">
          <ServiceTypeIcon typeId={typeId || 'custom_service'} size={80} />
          <h3 className="text-lg font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            {isEditMode ? 'ویرایش اطلاعات خدمت' : 'تعریف خدمت جدید'}
          </h3>
        </div>

        {/* اطلاعات پایه - Dropdown دو سطحی */}
        <SectionHeader
          icon={<FiInfo size={18} />}
          iconColor={colors.primary}
          title="اطلاعات پایه"
        />
        <Card variant="elevated" padding={16} radius={18}>
          <Input
            label="نام خدمت *"
            placeholder="مثال: پدیکور تخصصی پا"
            value={name}
            onChangeText={(t) => {
              setName(t);
              setErrors((p) => ({ ...p, name: '' }));
            }}
            error={errors.name}
          />
          {/* Dropdown سطح ۱: دسته‌بندی */}
          <Dropdown
            label="دسته‌بندی خدمت *"
            placeholder="دسته‌بندی را انتخاب کنید"
            value={categoryId}
            options={SERVICE_CATEGORIES.map((c) => ({ id: c.id, label: c.label }))}
            onSelect={handleCategoryChange}
          />
          {errors.categoryId && (
            <p className="text-xs mt-1 mb-3" style={{ color: '#E53935' }}>
              {errors.categoryId}
            </p>
          )}
          {/* Dropdown سطح ۲: نوع خدمت */}
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
          {errors.typeId && (
            <p className="text-xs mt-1" style={{ color: '#E53935' }}>
              {errors.typeId}
            </p>
          )}
        </Card>

        {/* قیمت‌گذاری */}
        <SectionHeader icon={<FiDollarSign size={18} />} iconColor="#43A047" title="قیمت‌گذاری" />
        {/* ✅ دکمه راهنمای قیمت‌گذاری - طراحی جدید (شبیه دکمه واقعی) */}
        <button
          onClick={() => setPriceGuideVisible(true)}
          className="w-full flex items-center gap-3 py-3.5 px-4 rounded-2xl border-2 mb-4 transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] shadow-sm"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: '#4CAF5060',
          }}
        >
          {/* آیکون در باکس رنگی */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#4CAF5018' }}
          >
            <FiDollarSign size={22} color="#4CAF50" />
          </div>

          {/* متن‌ها */}
          <div className="flex-1 text-right">
            <p className="text-sm font-[Vazir-Bold]" style={{ color: '#4CAF50' }}>
              قیمت‌گذاری و کمیسیون
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: colors.textSecondary }}>
              هزینه خدمات‌رسانی زیبانو چقدر است؟
            </p>
          </div>

          {/* فلش کلیک */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#4CAF5018' }}
          >
            <FiChevronLeft size={18} color="#4CAF50" />
          </div>
        </button>
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
              const cleaned = toEnglishDigits(t).replace(/[^0-9]/g, '');
              if (parseNumber(cleaned) <= 100 || cleaned === '') {
                setDiscountPercent(cleaned);
                setErrors((p) => ({ ...p, discountPercent: '' }));
              }
            }}
            error={errors.discountPercent}
          />
          {/* خلاصه قیمت */}
          {originalNum > 0 && (
            <div className="mt-3">
              <PriceBreakdown
                originalPrice={originalNum}
                discountPercent={discountNum}
                finalPrice={finalPrice}
                hasDeposit={false}
                showRemaining={false}
                variant="detailed"
              />
              {finalPrice < MIN_FINAL_PRICE && (
                <p className="text-[11px] mt-2 leading-5 text-[#E53935]">
                  ⚠️ قیمت نهایی باید حداقل {formatPrice(MIN_FINAL_PRICE)} باشد
                </p>
              )}
            </div>
          )}
        </Card>

        {/* بیعانه */}
        <SectionHeader icon={<FiShield size={18} />} iconColor="#FF9800" title="بیعانه رزرو" />
        <Card variant="elevated" padding={16} radius={18}>
          <Input
            label="مبلغ بیعانه (تومان)"
            placeholder="مثال: ۲۰۰,۰۰۰"
            value={depositAmount}
            onChangeText={(t) => {
              setDepositAmount(formatPriceInput(t));
              setErrors((p) => ({ ...p, depositAmount: '' }));
            }}
            error={errors.depositAmount}
            hint={`حداقل: ${formatPrice(MIN_DEPOSIT)}`}
          />
        </Card>

        {/* ═══════ یادآوری تمدید مجدد ═══════ */}
        <SectionHeader
          icon={<FiRefreshCw size={18} />}
          iconColor="#FF9800"
          title="یادآوری تمدید مجدد"
        />
        <Card variant="elevated" padding={16} radius={18}>
          {/* راهنما */}
          <div
            className="flex items-start gap-2.5 mb-4 p-3 rounded-xl border"
            style={{
              backgroundColor: '#FF980008',
              borderColor: '#FF980025',
            }}
          >
            <FiInfo size={16} color="#FF9800" className="flex-shrink-0 mt-0.5" />
            <p
              className="text-xs font-[Vazir] leading-5 flex-1"
              style={{ color: colors.textSecondary }}
            >
              پس از انجام این خدمت، بعد از تعداد روزهای مشخص‌شده در بخش، يادآوری رزرو می‌توانید به
              مشتری پیام یادآوری تمدید رزرو خدمت ارسال کنید. اگر نیازی به یادآوری نیست، صفر وارد
              کنید.
            </p>
          </div>

          {/* فیلد ورودی دستی */}
          <label
            className="block text-sm mb-2 text-right font-[Vazir-Medium]"
            style={{ color: colors.textMain }}
          >
            تعداد روز تا تمدید (اختیاری)
          </label>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 flex-1 py-2.5 px-4 rounded-xl border-2"
              style={{
                borderColor: errors.renewalDays
                  ? '#E53935'
                  : renewalDays > 0
                    ? colors.primary
                    : colors.border,
                backgroundColor: colors.background,
              }}
            >
              <span className="text-base flex-shrink-0">📅</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="مثلاً ۳۰"
                value={renewalDays > 0 ? toPersianDigit(String(renewalDays)) : ''}
                onChange={(e) => handleRenewalChange(e.target.value)}
                className="flex-1 bg-transparent outline-none text-lg font-[Vazir-Bold] text-center"
                style={{ color: colors.textMain, direction: 'ltr' }}
              />
              <span
                className="text-xs font-[Vazir-Medium] flex-shrink-0"
                style={{ color: colors.textSecondary }}
              >
                روز
              </span>
            </div>
            {/* دکمه پاک کردن */}
            {renewalDays > 0 && (
              <button
                onClick={() => {
                  setRenewalDays(0);
                  if (errors.renewalDays) setErrors((p) => ({ ...p, renewalDays: '' }));
                }}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#E5393515' }}
              >
                <FiX size={18} color="#E53935" />
              </button>
            )}
          </div>

          {/* خطا */}
          {errors.renewalDays && (
            <p className="text-xs mt-2 font-[Vazir]" style={{ color: '#E53935' }}>
              {errors.renewalDays}
            </p>
          )}

          {/* پیش‌نمایش زنده */}
          {renewalDays > 0 && (
            <div
              className="flex items-center gap-2 mt-4 py-2.5 px-3 rounded-lg border"
              style={{ backgroundColor: '#43A04710', borderColor: '#43A04740' }}
            >
              <FiCheck size={14} color="#43A047" />
              <span
                className="text-[11px] font-[Vazir-Bold] leading-5"
                style={{ color: '#43A047' }}
              >
                {renewalDays >= 30
                  ? `${toPersianDigit(Math.floor(renewalDays / 30))} ماه${renewalDays % 30 > 0 ? ` و ${toPersianDigit(renewalDays % 30)} روز` : ''} بعد از انجام خدمت`
                  : `${toPersianDigit(renewalDays)} روز بعد از انجام خدمت`}
                ، پیام یادآوری تمدید برای مشتری ارسال می‌شود
              </span>
            </div>
          )}
        </Card>

        {/* تنظیمات */}
        <SectionHeader icon={<FiInfo size={18} />} iconColor="#2196F3" title="تنظیمات" />
        <Card variant="elevated" padding={16} radius={18}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex-1">
              <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                وضعیت فعال
              </p>
              <p className="text-[11px] mt-1 leading-4" style={{ color: colors.textSecondary }}>
                در صورت غیرفعال بودن، مشتریان نمی‌توانند رزرو کنند
              </p>
            </div>
            <button
              onClick={() => setIsActive(!isActive)}
              className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
              style={{ backgroundColor: isActive ? colors.primary + '55' : colors.border }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full shadow-md transition-all"
                style={{
                  backgroundColor: isActive ? colors.primary : '#ccc',
                  [isActive ? 'right' : 'left']: '2px',
                }}
              />
            </button>
          </div>
          <Divider spacing={12} />
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
          title={isEditMode ? 'ذخیره تغییرات' : 'افزودن خدمت'}
          onPress={handleSave}
          variant="primary"
          size="lg"
          fullWidth
          iconPosition="right"
        />
      </div>
      {/* مدال راهنمای قیمت‌گذاری */}
      <PriceGuideModal
        visible={priceGuideVisible}
        onClose={() => setPriceGuideVisible(false)}
        currentPrice={finalPrice}
      />
    </ScreenWrapper>
  );
}
