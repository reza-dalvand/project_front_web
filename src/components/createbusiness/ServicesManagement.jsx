'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiTag, FiTrendingUp, FiInfo, FiCheck, FiDollarSign, FiPercent } from 'react-icons/fi';
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

const SERVICE_TYPES = [
  { id: 'facial', label: 'فیشیال و پاکسازی پوست' },
  { id: 'nail', label: 'کاشت و طراحی ناخن' },
  { id: 'hair_color', label: 'رنگ و مش مو' },
  { id: 'keratin', label: 'کراتین و احیای مو' },
  { id: 'laser', label: 'لیزر موهای زائد' },
  { id: 'makeup', label: 'میکاپ و گریم' },
  { id: 'eyelash', label: 'کاشت مژه و ابرو' },
  { id: 'waxing', label: 'اپیلاسیون' },
  { id: 'massage', label: 'ماساژ' },
  { id: 'tattoo', label: 'تتو و هاشور' },
  { id: 'skincare', label: 'مراقبت پوست' },
  { id: 'hair_cut', label: 'کوتاهی و حالت مو' },
  { id: 'bridal', label: 'خدمات عروس' },
  { id: 'other', label: 'سایر خدمات' },
];

const MIN_FINAL_PRICE = 100000;
const MIN_DEPOSIT = 100000;
const MAX_DESCRIPTION_LENGTH = 300;

const parseNumberLocal = (str) => {
  const cleaned = toEnglishDigits(str).replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
};

/**
 * کامپوننت مدیریت خدمات
 * @param {array} services - لیست خدمات فعلی
 * @param {function} onChange - تابع تغییر لیست
 */
export default function ServicesManagement({ services = [], onChange }) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [priceGuideVisible, setPriceGuideVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // فرم
  const [name, setName] = useState('');
  const [typeId, setTypeId] = useState(null);
  const [customTypeName, setCustomTypeName] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  // محاسبات
  const originalNum = parseNumberLocal(originalPrice);
  const discountNum = Math.min(parseNumberLocal(discountPercent), 100);
  const discountAmount = Math.round((originalNum * discountNum) / 100);
  const finalPrice = Math.max(0, originalNum - discountAmount);
  const appFee = calculateAppFee(finalPrice);

  const resetForm = () => {
    setName('');
    setTypeId(null);
    setCustomTypeName('');
    setOriginalPrice('');
    setDiscountPercent('');
    setDepositAmount('');
    setIsActive(true);
    setDescription('');
    setErrors({});
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (service) => {
    setName(service.name);
    setTypeId(service.typeId);
    setCustomTypeName(service.customTypeName || '');
    setOriginalPrice(formatPriceInput(String(service.originalPrice || '')));
    setDiscountPercent(String(service.discountPercent || ''));
    setDepositAmount(formatPriceInput(String(service.depositAmount || '')));
    setIsActive(service.isActive !== false);
    setDescription(service.description || '');
    setErrors({});
    setEditingId(service.id);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const handleSave = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'نام خدمت الزامی است';
    if (!typeId) newErrors.typeId = 'نوع خدمت را انتخاب کنید';
    if (typeId === 'other' && !customTypeName.trim())
      newErrors.customTypeName = 'نام نوع خدمت را وارد کنید';
    if (originalNum <= 0)
      newErrors.originalPrice = 'قیمت اصلی باید بیشتر از صفر باشد';
    if (discountNum > 100)
      newErrors.discountPercent = 'درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد';
    if (finalPrice > 0 && finalPrice < MIN_FINAL_PRICE) {
      newErrors.originalPrice = `قیمت نهایی خدمت باید حداقل ${formatPrice(MIN_FINAL_PRICE)} تومان باشد`;
    }
    const depositNum = parseNumberLocal(depositAmount);
    if (!depositNum || depositNum < MIN_DEPOSIT) {
      newErrors.depositAmount = `حداقل مبلغ بیعانه ${formatPrice(MIN_DEPOSIT)} تومان است`;
    }
    if (depositNum > finalPrice) {
      newErrors.depositAmount = 'مبلغ بیعانه نمی‌تواند بیشتر از قیمت نهایی باشد';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const serviceType = SERVICE_TYPES.find((t) => t.id === typeId);
    const serviceData = {
      id: editingId || `svc_${Date.now()}`,
      name: name.trim(),
      typeId,
      typeName: typeId === 'other' ? customTypeName.trim() : serviceType.label,
      customTypeName: typeId === 'other' ? customTypeName.trim() : '',
      originalPrice: originalNum,
      discountPercent: discountNum,
      discountAmount,
      finalPrice,
      hasDeposit: true,
      depositAmount: depositNum,
      appFee,
      isActive,
      description: description.trim(),
      duration: 60,
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
    onChange?.(
      services.map((s) =>
        s.id === serviceId ? { ...s, isActive: !s.isActive } : s
      )
    );
  };

  const descLength = description.length;

  return (
    <div className="px-5 py-4 space-y-4">
      {/* هدر */}
      <SectionHeader
        icon={<FiTag size={18} />}
        iconColor={colors.primary}
        title="خدمات سالن"
        subtitle={`خدماتی که ارائه می‌دهید را اضافه کنید (${toPersianDigit(services.length)} خدمت)`}
      />

      {/* لیست خدمات یا Empty State */}
      {services.length > 0 ? (
        <div className="space-y-3">
          {services.map((service) => {
            const isActive = service.isActive !== false;
            const hasDiscount = service.discountPercent > 0;

            return (
              <Card
                key={service.id}
                variant="default"
                padding={14}
                radius={18}
                className={`transition-opacity ${!isActive ? 'opacity-60' : ''}`}
              >
                {/* ردیف بالا */}
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
                      className="text-xs font-[Vazir] mt-1"
                      style={{ color: colors.textSecondary }}
                    >
                      {service.typeName}
                    </p>

                    {/* قیمت */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {hasDiscount && (
                        <span
                          className="text-[11px] font-[Vazir] line-through"
                          style={{ color: colors.textSecondary }}
                        >
                          {formatPrice(service.originalPrice)}
                        </span>
                      )}
                      <span
                        className="text-sm font-[Vazir-Bold]"
                        style={{ color: colors.primary }}
                      >
                        {formatPrice(hasDiscount ? service.finalPrice : service.originalPrice)}
                      </span>
                      {hasDiscount && (
                        <span
                          className="text-[10px] font-[Vazir-Bold] px-2 py-0.5 rounded-md bg-[#4CAF5020] text-[#4CAF50]"
                        >
                          {toPersianDigit(service.discountPercent)}٪
                        </span>
                      )}
                    </div>
                  </div>

                  {/* دکمه‌ها */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => toggleActive(service.id)}
                      className="relative w-11 h-6 rounded-full transition-colors"
                      style={{
                        backgroundColor: isActive ? colors.primary + '55' : colors.border,
                      }}
                    >
                      <div
                        className="absolute top-0.5 w-5 h-5 rounded-full shadow-md transition-all"
                        style={{
                          backgroundColor: isActive ? colors.primary : '#ccc',
                          [isActive ? 'right' : 'left']: '2px',
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

                {/* بیعانه */}
                {service.hasDeposit && service.depositAmount > 0 && (
                  <div
                    className="flex items-center gap-2 mt-3 pt-3 border-t"
                    style={{ borderColor: colors.border }}
                  >
                    <FiDollarSign size={14} color="#FF9800" />
                    <span
                      className="text-[11px] font-[Vazir]"
                      style={{ color: colors.textSecondary }}
                    >
                      بیعانه رزرو:
                    </span>
                    <span
                      className="text-xs font-[Vazir-Bold] text-[#1ba609] mr-auto"
                    >
                      {formatPrice(service.depositAmount)}
                    </span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card variant="default" padding={6} radius={16}>
          <EmptyStateVariants
            variant="service"
            onAction={openAddModal}
          />
        </Card>
      )}

      {/* دکمه افزودن خدمت جدید */}
      <Button
        title="افزودن خدمت جدید"
        onPress={openAddModal}
        variant="outline"
        size="lg"
        fullWidth
        icon={<FiPlus size={20} style={{ color: colors.primary }} />}
        iconPosition="right"
      />

      {/* BottomSheet افزودن/ویرایش خدمت */}
      <BottomSheet
        visible={modalVisible}
        onClose={closeModal}
        title={editingId ? 'ویرایش خدمت' : 'افزودن خدمت جدید'}
        snapPoint={0.9}
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
          {/* هدر با آیکون */}
          <div className="flex flex-col items-center gap-2 py-4">
            <ServiceTypeIcon typeId={typeId || 'other'} size={80} />
            <h3
              className="text-lg font-[Vazir-Bold]"
              style={{ color: colors.textMain }}
            >
              {editingId ? 'ویرایش اطلاعات خدمت' : 'تعریف خدمت جدید'}
            </h3>
            <p
              className="text-xs font-[Vazir] text-center"
              style={{ color: colors.textSecondary }}
            >
              {editingId
                ? 'تغییرات موردنظر خود را اعمال کنید'
                : 'اطلاعات خدمت را به دقت وارد نمایید'}
            </p>
          </div>

          {/* اطلاعات پایه */}
          <div className="space-y-3">
            <SectionHeader
              icon={<FiInfo size={18} />}
              iconColor={colors.primary}
              title="اطلاعات پایه"
            />
            <Card variant="elevated" padding={16} radius={18}>
              <Input
                label="نام خدمت *"
                placeholder="مثال: فیشیال VIP پوست صورت"
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                error={errors.name}
              />
              <Dropdown
                label="نوع خدمت *"
                placeholder="نوع خدمت را انتخاب کنید"
                value={typeId}
                options={SERVICE_TYPES}
                onSelect={(val) => {
                  setTypeId(val);
                  if (errors.typeId) setErrors({ ...errors, typeId: '' });
                }}
              />
              {typeId === 'other' && (
                <Input
                  label="نام نوع خدمت *"
                  placeholder="نام نوع خدمت خود را وارد کنید"
                  value={customTypeName}
                  onChangeText={(t) => {
                    setCustomTypeName(t);
                    if (errors.customTypeName)
                      setErrors({ ...errors, customTypeName: '' });
                  }}
                  error={errors.customTypeName}
                />
              )}
            </Card>
          </div>

          {/* قیمت‌گذاری */}
          <div className="space-y-3">
            <SectionHeader
              icon={<FiTrendingUp size={18} />}
              iconColor="#4CAF50"
              title="قیمت‌گذاری"
            />

            {/* دکمه راهنمای قیمت‌گذاری */}
            <button
              onClick={() => setPriceGuideVisible(true)}
              className="w-full flex items-center gap-3 py-3 px-4 rounded-2xl border transition-colors"
              style={{
                backgroundColor: '#4CAF5010',
                borderColor: '#4CAF5040',
              }}
            >
              <FiTrendingUp size={18} color="#4CAF50" />
              <div className="flex-1 text-right">
                <p className="text-sm font-[Vazir-Bold] text-[#4CAF50]">
                  راهنمای قیمت‌گذاری
                </p>
                <p
                  className="text-[11px] font-[Vazir] mt-0.5"
                  style={{ color: colors.textSecondary }}
                >
                  مشاهده هزینه خدمات‌رسانی زیبانو
                </p>
              </div>
              <FiInfo size={20} color="#4CAF50" />
            </button>

            <Card variant="elevated" padding={16} radius={18}>
              <Input
                label="قیمت اصلی (تومان) *"
                placeholder="مثال: ۷۵۰,۰۰۰"
                value={originalPrice}
                onChangeText={(t) => {
                  setOriginalPrice(formatPriceInput(t));
                  if (errors.originalPrice)
                    setErrors({ ...errors, originalPrice: '' });
                }}
                error={errors.originalPrice}
              />
              <Input
                label="درصد تخفیف (اختیاری)"
                placeholder="مثال: ۲۰"
                value={discountPercent}
                onChangeText={(t) => {
                  const cleaned = toEnglishDigits(t).replace(/[^0-9]/g, '');
                  if (parseNumberLocal(cleaned) <= 100 || cleaned === '') {
                    setDiscountPercent(cleaned);
                    if (errors.discountPercent)
                      setErrors({ ...errors, discountPercent: '' });
                  }
                }}
                error={errors.discountPercent}
              />

              {/* خلاصه قیمت */}
              {originalNum > 0 && (
                <Card
                  variant="default"
                  padding={14}
                  radius={14}
                  className="mt-3 border-2"
                  style={{
                    backgroundColor:
                      finalPrice >= MIN_FINAL_PRICE ? '#4CAF5010' : '#E5393515',
                    borderColor:
                      finalPrice >= MIN_FINAL_PRICE ? '#4CAF5040' : '#E5393550',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    {finalPrice >= MIN_FINAL_PRICE ? (
                      <FiCheck size={18} color="#4CAF50" />
                    ) : (
                      <FiInfo size={18} color="#E53935" />
                    )}
                    <span
                      className="text-sm font-[Vazir-Bold]"
                      style={{
                        color:
                          finalPrice >= MIN_FINAL_PRICE ? '#4CAF50' : '#E53935',
                      }}
                    >
                      {finalPrice >= MIN_FINAL_PRICE
                        ? 'قیمت معتبر ✓'
                        : 'قیمت نهایی کمتر از حد مجاز'}
                    </span>
                  </div>

                  <PriceBreakdown
                    originalPrice={originalNum}
                    discountPercent={discountNum}
                    finalPrice={finalPrice}
                    hasDeposit={false}
                    showRemaining={false}
                    variant="detailed"
                  />

                  {finalPrice < MIN_FINAL_PRICE && (
                    <p
                      className="text-[11px] font-[Vazir] mt-3 leading-5"
                      style={{ color: '#E53935' }}
                    >
                      ⚠️ قیمت نهایی باید حداقل {formatPrice(MIN_FINAL_PRICE)}{' '}
                      تومان باشد. لطفاً قیمت اصلی را افزایش دهید یا تخفیف را کاهش دهید.
                    </p>
                  )}
                </Card>
              )}
            </Card>
          </div>

          {/* بیعانه رزرو */}
          <div className="space-y-3">
            <SectionHeader
              icon={<FiDollarSign size={18} />}
              iconColor="#FF9800"
              title="بیعانه رزرو"
            />
            <Card variant="elevated" padding={16} radius={18}>
              <Input
                label="مبلغ بیعانه (تومان) *"
                placeholder="مثال: ۲۰۰,۰۰۰"
                value={depositAmount}
                onChangeText={(t) => {
                  setDepositAmount(formatPriceInput(t));
                  if (errors.depositAmount)
                    setErrors({ ...errors, depositAmount: '' });
                }}
                error={errors.depositAmount}
                hint={`حداقل: ${formatPrice(MIN_DEPOSIT)}`}
              />
            </Card>
          </div>

          {/* تنظیمات */}
          <div className="space-y-3">
            <SectionHeader
              icon={<FiInfo size={18} />}
              iconColor="#2196F3"
              title="تنظیمات"
            />
            <Card variant="elevated" padding={16} radius={18}>
              {/* Switch فعال/غیرفعال */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex-1">
                  <p
                    className="text-sm font-[Vazir-Bold]"
                    style={{ color: colors.textMain }}
                  >
                    وضعیت فعال
                  </p>
                  <p
                    className="text-[11px] font-[Vazir] leading-5 mt-1"
                    style={{ color: colors.textSecondary }}
                  >
                    در صورت غیرفعال بودن، مشتریان نمی‌توانند این خدمت را رزرو کنند
                  </p>
                </div>
                <button
                  onClick={() => setIsActive(!isActive)}
                  className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
                  style={{
                    backgroundColor: isActive ? colors.primary + '55' : colors.border,
                  }}
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

              {/* توضیحات */}
              <Input
                label="توضیحات (اختیاری)"
                placeholder="توضیحاتی درباره این خدمت... (حداکثر ۳۰۰ کاراکتر)"
                value={description}
                onChangeText={(t) => {
                  if (t.length <= MAX_DESCRIPTION_LENGTH) {
                    setDescription(t);
                  }
                }}
                multiline
                maxLength={MAX_DESCRIPTION_LENGTH}
              />
              <CharCounter current={descLength} max={MAX_DESCRIPTION_LENGTH} />
            </Card>
          </div>
        </div>
      </BottomSheet>

      {/* مدال راهنمای قیمت‌گذاری */}
      <PriceGuideModal
        visible={priceGuideVisible}
        onClose={() => setPriceGuideVisible(false)}
        currentPrice={finalPrice}
      />
    </div>
  );
}