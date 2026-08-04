'use client';
import { useState } from 'react';
import {
  FiImage,
  FiTag,
  FiFileText,
  FiPhone,
  FiDollarSign,
  FiCheck,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Input from '@/components/common/Input';
import Dropdown from '@/components/common/Dropdown';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import SectionHeader from '@/components/common/SectionHeader';
import ImageUploader from '@/components/common/ImageUploader';
import CostTypeBadge from '@/components/common/CostTypeBadge';
import { toPersianDigit } from '@/utils/numberUtils';

// گزینه‌های نوع هزینه
const COST_TYPE_OPTIONS = [
  {
    id: 'paid',
    label: 'با هزینه',
    description: 'مدل بخشی از هزینه خدمت را پرداخت می‌کند',
  },
  {
    id: 'material_cost',
    label: 'با هزینه مواد',
    description: 'فقط هزینه مواد مصرفی دریافت می‌شود',
  },
  {
    id: 'free',
    label: 'کاملاً رایگان',
    description: 'هیچ هزینه‌ای از مدل دریافت نمی‌شود',
  },
];

export default function ModelRequestForm({
  services,
  initialData,
  defaultPhone,
  onSave,
  onClose,
}) {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    serviceId: initialData?.serviceId || null,
    title: initialData?.title || '',
    description: initialData?.description || '',
    contactPhone: initialData?.contactPhone || defaultPhone || '',
    serviceImage: initialData?.serviceImage || null,
    costType: initialData?.costType || 'material_cost',
  });
  const [errors, setErrors] = useState({});

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleSave = () => {
    const newErrors = {};
    if (!formData.serviceId) newErrors.serviceId = 'خدمت را انتخاب کنید';
    if (!formData.title.trim()) newErrors.title = 'عنوان الزامی است';
    if (!formData.description.trim())
      newErrors.description = 'توضیحات الزامی است';
    if (!formData.serviceImage)
      newErrors.serviceImage = 'تصویر خدمت الزامی است';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSave(formData);
  };

  const serviceOptions = (services || []).map((s) => ({
    id: s.id,
    label: s.name,
  }));

  return (
    <div className="p-5 space-y-6 pb-32">
      {/* ═══════ بخش ۱: تصویر خدمت ═══════ */}
      <div className="space-y-3">
        <SectionHeader
          icon={<FiImage size={18} />}
          iconColor="#FF9800"
          title="تصویر خدمت"
        />
        <ImageUploader
          value={formData.serviceImage}
          onChange={(url) => updateField('serviceImage', url)}
          variant="square"
          hint="تصویری با کیفیت از نمونه کار آپلود کنید"
          error={errors.serviceImage}
        />
      </div>

      {/* ═══════ بخش ۲: اطلاعات درخواست ═══════ */}
      <div className="space-y-3">
        <SectionHeader
          icon={<FiFileText size={18} />}
          iconColor={colors.primary}
          title="اطلاعات درخواست"
        />
        <Card variant="elevated" padding={16} radius={18}>
          <Dropdown
            label="خدمت موردنظر *"
            placeholder="خدمت را انتخاب کنید"
            value={formData.serviceId}
            options={serviceOptions}
            onSelect={(val) => updateField('serviceId', val)}
          />
          {errors.serviceId && (
            <p className="text-xs text-[#E53935] mt-1">{errors.serviceId}</p>
          )}

          <Input
            label="عنوان درخواست *"
            placeholder="مثال: مدل برای فیشیال VIP عروس"
            value={formData.title}
            onChangeText={(t) => updateField('title', t)}
            error={errors.title}
          />

          <Input
            label="توضیحات *"
            placeholder="توضیحات کامل درباره نیاز به مدل..."
            value={formData.description}
            onChangeText={(t) => updateField('description', t)}
            multiline
            error={errors.description}
          />

          <Input
            label="شماره تماس برای مدل‌ها *"
            placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
            value={toPersianDigit(formData.contactPhone)}
            onChangeText={(t) =>
              updateField('contactPhone', t.replace(/[^0-9]/g, ''))
            }
            type="tel"
            maxLength={11}
          />
        </Card>
      </div>

      {/* ═══════ بخش ۳: نوع هزینه ═══════ */}
      <div className="space-y-3">
        <SectionHeader
          icon={<FiDollarSign size={18} />}
          iconColor="#4CAF50"
          title="نوع هزینه"
        />
        <div className="space-y-2.5">
          {COST_TYPE_OPTIONS.map((option) => {
            const isSelected = formData.costType === option.id;
            return (
              <button
                key={option.id}
                onClick={() => updateField('costType', option.id)}
                className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-right
                  transition-all"
                style={{
                  backgroundColor: isSelected
                    ? colors.primary + '08'
                    : colors.cardBackground,
                  borderColor: isSelected ? colors.primary : colors.border,
                }}
              >
                <CostTypeBadge type={option.id} variant="default" />
                <div className="flex-1">
                  <p
                    className="text-sm font-[Vazir-Bold]"
                    style={{ color: colors.textMain }}
                  >
                    {option.label}
                  </p>
                  <p
                    className="text-xs font-[Vazir] mt-0.5"
                    style={{ color: colors.textSecondary }}
                  >
                    {option.description}
                  </p>
                </div>
                {isSelected && (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <FiCheck size={14} color="#fff" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════ دکمه‌ها ═══════ */}
      <div className="flex gap-3 pt-4">
        <Button
          title="انصراف"
          onPress={onClose}
          variant="outline"
          size="lg"
          className="flex-1"
        />
        <Button
          title={initialData ? 'ذخیره تغییرات' : 'ایجاد درخواست'}
          onPress={handleSave}
          variant="primary"
          size="lg"
          className="flex-[2]"
          icon={<FiCheck size={18} color="#fff" />}
          iconPosition="right"
        />
      </div>
    </div>
  );
}