// src/components/createbusiness/ServicesManagement.jsx
'use client';
import { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiTag,
  FiTrendingUp,
  FiInfo,
  FiCheck,
  FiDollarSign,
  FiClock,
  FiRefreshCw,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Dropdown from '@/components/common/Dropdown';
import Divider from '@/components/common/Divider';
import EmptyStateVariants from '@/components/common/EmptyStateVariants';
import SectionHeader from '@/components/common/SectionHeader';
import CharCounter from '@/components/common/CharCounter';
import PriceBreakdown from '@/components/common/PriceBreakdown';
import BottomSheet from '@/components/common/BottomSheet';
import PriceGuideModal from '@/components/common/PriceGuideModal';
import ServiceTypeIcon from '@/components/manageBusiness/services/ServiceTypeIcon';
import {
  toPersianDigit,
  formatPrice,
  toEnglishDigits,
  parseNumber,
  formatPriceInput,
  calculateAppFee,
} from '@/utils/numberUtils';
import {
  SERVICE_CATEGORIES,
  RENEWAL_OPTIONS,
  getSubServicesByCategory,
  getServiceTypeInfo,
} from '@/constants/serviceTypes';

const MIN_FINAL_PRICE = 100000;
const MIN_DEPOSIT = 100000;
const MAX_DESCRIPTION_LENGTH = 300;

export default function ServicesManagement({ services = [], onChange }) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [priceGuideVisible, setPriceGuideVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // فرم
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [typeId, setTypeId] = useState(null);
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [description, setDescription] = useState('');
  const [renewalDays, setRenewalDays] = useState(0);
  const [errors, setErrors] = useState({});

  // محاسبات
  const originalNum = parseNumber(originalPrice);
  const discountNum = Math.min(parseNumber(discountPercent), 100);
  const discountAmountVal = Math.round((originalNum * discountNum) / 100);
  const finalPrice = Math.max(0, originalNum - discountAmountVal);
  const appFee = calculateAppFee(finalPrice);

  // لیست زیرخدمات بر اساس دسته‌بندی انتخاب شده
  const availableSubServices = categoryId ? getSubServicesByCategory(categoryId) : [];

  const resetForm = () => {
    setName('');
    setCategoryId(null);
    setTypeId(null);
    setOriginalPrice('');
    setDiscountPercent('');
    setDepositAmount('');
    setIsActive(true);
    setDescription('');
    setRenewalDays(0);
    setErrors({});
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (service) => {
    const info = getServiceTypeInfo(service.typeId);
    setName(service.name);
    setCategoryId(info.categoryId);
    setTypeId(service.typeId);
    setOriginalPrice(formatPriceInput(String(service.originalPrice || '')));
    setDiscountPercent(String(service.discountPercent || ''));
    setDepositAmount(formatPriceInput(String(service.depositAmount || '')));
    setIsActive(service.isActive !== false);
    setDescription(service.description || '');
    setRenewalDays(service.renewalDays || 0);
    setErrors({});
    setEditingId(service.id);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const handleCategoryChange = (val) => {
    setCategoryId(val);
    setTypeId(null); // ریست کردن نوع خدمت وقتی دسته عوض شد
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
    if (finalPrice > 0 && finalPrice < MIN_FINAL_PRICE) {
      newErrors.originalPrice = `قیمت نهایی باید حداقل ${formatPrice(MIN_FINAL_PRICE)} باشد`;
    }
    const depositNum = parseNumber(depositAmount);
    if (depositNum > 0 && depositNum < MIN_DEPOSIT) {
      newErrors.depositAmount = `حداقل بیعانه ${formatPrice(MIN_DEPOSIT)} است`;
    }
    if (depositNum > finalPrice) {
      newErrors.depositAmount = 'بیعانه نمی‌تواند بیشتر از قیمت نهایی باشد';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const typeInfo = getServiceTypeInfo(typeId);
    const serviceData = {
      id: editingId || `svc_${Date.now()}`,
      name: name.trim(),
      categoryId,
      typeId,
      typeName: typeInfo.typeLabel,
      categoryLabel: typeInfo.categoryLabel,
      originalPrice: originalNum,
      discountPercent: discountNum,
      discountAmount: discountAmountVal,
      finalPrice,
      hasDeposit: depositNum > 0,
      depositAmount: depositNum,
      appFee,
      isActive,
      description: description.trim(),
      duration: 60,
      renewalDays,
    };

    const updatedServices = editingId
      ? services.map((s) => (s.id === editingId ? serviceData : s))
      : [...services, serviceData];

    onChange?.(updatedServices);
    closeModal();
  };

  const handleDelete = (serviceId) => {
    if (confirm('آیا از حذف این خدمت مطمئن هستید؟')) {
      onChange?.(services.filter((s) => s.id !== serviceId));
    }
  };

  const toggleActive = (serviceId) => {
    onChange?.(services.map((s) => (s.id === serviceId ? { ...s, isActive: !s.isActive } : s)));
  };

  const descLength = description.length;

  return (
    <div className="px-5 py-4 space-y-4">
      {/* هدر */}
      <SectionHeader
        icon={<FiTag size={18} />}
        iconColor={colors.primary}
        title="خدمات سالن"
        subtitle={`خدماتی که ارائه می‌دهید (${toPersianDigit(services.length)} خدمت)`}
      />

      {/* لیست خدمات */}
      {services.length > 0 ? (
        <div className="space-y-3">
          {services.map((service) => {
            const active = service.isActive !== false;
            const hasDiscount = service.discountPercent > 0;
            return (
              <Card
                key={service.id}
                variant="default"
                padding={14}
                radius={18}
                className={`transition-opacity ${!active ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <ServiceTypeIcon typeId={service.typeId} size={56} />
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-sm font-[Vazir-Bold] line-clamp-1"
                      style={{ color: colors.textMain }}
                    >
                      {service.name}
                    </h4>
                    <p
                      className="text-xs font-[Vazir-Medium] mt-0.5"
                      style={{ color: colors.primary }}
                    >
                      {service.typeName || service.categoryLabel}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {hasDiscount && (
                        <span
                          className="text-[11px] line-through"
                          style={{ color: colors.textSecondary }}
                        >
                          {formatPrice(service.originalPrice)}
                        </span>
                      )}
                      <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.primary }}>
                        {formatPrice(hasDiscount ? service.finalPrice : service.originalPrice)}
                      </span>
                      {hasDiscount && (
                        <span className="text-[10px] font-[Vazir-Bold] px-2 py-0.5 rounded-md bg-[#4CAF5020] text-[#4CAF50]">
                          {toPersianDigit(service.discountPercent)}٪
                        </span>
                      )}
                    </div>
                    {/* نمایش زمان تمدید */}
                    {service.renewalDays > 0 && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <FiRefreshCw size={11} color="#FF9800" />
                        <span className="text-[10px] font-[Vazir]" style={{ color: '#FF9800' }}>
                          یادآوری تمدید: {toPersianDigit(service.renewalDays)} روز بعد
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => toggleActive(service.id)}
                      className="relative w-11 h-6 rounded-full transition-colors"
                      style={{ backgroundColor: active ? colors.primary + '55' : colors.border }}
                    >
                      <div
                        className="absolute top-0.5 w-5 h-5 rounded-full shadow-md transition-all"
                        style={{
                          backgroundColor: active ? colors.primary : '#ccc',
                          [active ? 'right' : 'left']: '2px',
                        }}
                      />
                    </button>
                    <button
                      onClick={() => openEditModal(service)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: colors.primary + '15' }}
                    >
                      <FiEdit2 size={16} style={{ color: colors.primary }} />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#E5393515]"
                    >
                      <FiTrash2 size={16} color="#E53935" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card variant="default" padding={6} radius={16}>
          <EmptyStateVariants variant="service" onAction={openAddModal} />
        </Card>
      )}

      <Button
        title="افزودن خدمت جدید"
        onPress={openAddModal}
        variant="outline"
        size="lg"
        fullWidth
        icon={<FiPlus size={20} style={{ color: colors.primary }} />}
        iconPosition="right"
      />

      {/* BottomSheet افزودن/ویرایش */}
      <BottomSheet
        visible={modalVisible}
        onClose={closeModal}
        title={editingId ? 'ویرایش خدمت' : 'افزودن خدمت جدید'}
        snapPoint={0.92}
        footer={
          <Button
            title={editingId ? 'ذخیره تغییرات' : 'افزودن خدمت'}
            onPress={handleSave}
            variant="primary"
            size="lg"
            fullWidth
            icon={<FiCheck size={20} color="#fff" />}
            iconPosition="right"
          />
        }
      >
        <div className="p-4 space-y-5 pb-24">
          {/* آیکون پیش‌نمایش */}
          <div className="flex flex-col items-center gap-2 py-2">
            <ServiceTypeIcon typeId={typeId || 'custom_service'} size={80} />
            <h3 className="text-lg font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              {editingId ? 'ویرایش اطلاعات' : 'تعریف خدمت جدید'}
            </h3>
          </div>

          {/* اطلاعات پایه با Dropdown دو سطحی */}
          <div className="space-y-3">
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
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                error={errors.name}
              />

              {/* Dropdown سطح ۱: دسته‌بندی */}
              <Dropdown
                label="دسته‌بندی خدمات *"
                placeholder="دسته‌بندی را انتخاب کنید"
                value={categoryId}
                options={SERVICE_CATEGORIES.map((c) => ({ id: c.id, label: c.label }))}
                onSelect={handleCategoryChange}
              />
              {errors.categoryId && (
                <p className="text-xs text-[#E53935] mt-1">{errors.categoryId}</p>
              )}

              {/* Dropdown سطح ۲: نوع خدمت */}
              <Dropdown
                label="نوع خدمت *"
                placeholder={
                  categoryId ? 'نوع خدمت را انتخاب کنید' : 'ابتدا دسته‌بندی را انتخاب کنید'
                }
                value={typeId}
                options={availableSubServices}
                onSelect={(val) => {
                  setTypeId(val);
                  if (errors.typeId) setErrors({ ...errors, typeId: '' });
                }}
                disabled={!categoryId}
              />
              {errors.typeId && <p className="text-xs text-[#E53935] mt-1">{errors.typeId}</p>}
            </Card>
          </div>

          {/* قیمت‌گذاری */}
          <div className="space-y-3">
            <SectionHeader
              icon={<FiTrendingUp size={18} />}
              iconColor="#4CAF50"
              title="قیمت‌گذاری"
            />
            <button
              onClick={() => setPriceGuideVisible(true)}
              className="w-full flex items-center gap-3 py-3 px-4 rounded-2xl border"
              style={{ backgroundColor: '#4CAF5010', borderColor: '#4CAF5040' }}
            >
              <FiDollarSign size={18} color="#4CAF50" />
              <div className="flex-1 text-right">
                <p className="text-sm font-[Vazir-Bold] text-[#4CAF50]">راهنمای قیمت‌گذاری</p>
                <p className="text-[11px] mt-0.5" style={{ color: colors.textSecondary }}>
                  مشاهده هزینه خدمات‌رسانی زیبانو
                </p>
              </div>
            </button>
            <Card variant="elevated" padding={16} radius={18}>
              <Input
                label="قیمت اصلی (تومان) *"
                placeholder="مثال: ۷۵۰,۰۰۰"
                value={originalPrice}
                onChangeText={(t) => {
                  setOriginalPrice(formatPriceInput(t));
                  if (errors.originalPrice) setErrors({ ...errors, originalPrice: '' });
                }}
                error={errors.originalPrice}
              />
              <Input
                label="درصد تخفیف (اختیاری)"
                placeholder="مثال: ۲۰"
                value={discountPercent}
                onChangeText={(t) => {
                  const c = toEnglishDigits(t).replace(/[^0-9]/g, '');
                  if (parseNumber(c) <= 100 || c === '') {
                    setDiscountPercent(c);
                    if (errors.discountPercent) setErrors({ ...errors, discountPercent: '' });
                  }
                }}
                error={errors.discountPercent}
              />
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
                    <p className="text-[11px] mt-2 text-[#E53935]">
                      ⚠️ قیمت نهایی باید حداقل {formatPrice(MIN_FINAL_PRICE)} باشد
                    </p>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* بیعانه */}
          <div className="space-y-3">
            <SectionHeader
              icon={<FiDollarSign size={18} />}
              iconColor="#FF9800"
              title="بیعانه رزرو"
            />
            <Card variant="elevated" padding={16} radius={18}>
              <Input
                label="مبلغ بیعانه (تومان)"
                placeholder="مثال: ۲۰۰,۰۰۰"
                value={depositAmount}
                onChangeText={(t) => {
                  setDepositAmount(formatPriceInput(t));
                  if (errors.depositAmount) setErrors({ ...errors, depositAmount: '' });
                }}
                error={errors.depositAmount}
                hint={`حداقل: ${formatPrice(MIN_DEPOSIT)}`}
              />
            </Card>
          </div>

          {/* ⏰ زمان تمدید مجدد */}
          <div className="space-y-3">
            <SectionHeader
              icon={<FiRefreshCw size={18} />}
              iconColor="#FF9800"
              title="یادآوری تمدید مجدد"
            />
            <Card variant="elevated" padding={16} radius={18}>
              <div
                className="flex items-start gap-2 mb-3 p-3 rounded-xl border"
                style={{ backgroundColor: '#FF980008', borderColor: '#FF980025' }}
              >
                <FiInfo size={16} color="#FF9800" className="flex-shrink-0 mt-0.5" />
                <p className="text-xs leading-5 flex-1" style={{ color: colors.textSecondary }}>
                  پس از انجام این خدمت، سیستم به صورت خودکار پس از تعداد روزهای مشخص شده به مشتری
                  پیام یادآوری ارسال می‌کند.
                </p>
              </div>
              <Dropdown
                label="زمان یادآوری مجدد"
                placeholder="انتخاب کنید"
                value={renewalDays}
                options={RENEWAL_OPTIONS}
                onSelect={(val) => setRenewalDays(val)}
              />
            </Card>
          </div>

          {/* تنظیمات */}
          <div className="space-y-3">
            <SectionHeader icon={<FiInfo size={18} />} iconColor="#2196F3" title="تنظیمات" />
            <Card variant="elevated" padding={16} radius={18}>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex-1">
                  <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                    وضعیت فعال
                  </p>
                  <p className="text-[11px] mt-1" style={{ color: colors.textSecondary }}>
                    غیرفعال = عدم امکان رزرو توسط مشتری
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
                placeholder="توضیحات درباره این خدمت..."
                value={description}
                onChangeText={(t) => {
                  if (t.length <= MAX_DESCRIPTION_LENGTH) setDescription(t);
                }}
                multiline
              />
              <CharCounter current={descLength} max={MAX_DESCRIPTION_LENGTH} />
            </Card>
          </div>
        </div>
      </BottomSheet>

      <PriceGuideModal
        visible={priceGuideVisible}
        onClose={() => setPriceGuideVisible(false)}
        currentPrice={finalPrice}
      />
    </div>
  );
}
