// src/components/manageBusiness/modelRequest/ModelRequestForm.jsx
'use client';
import { useState } from 'react';
import { FiFileText, FiPhone, FiDollarSign, FiCheck } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Input from '@/components/common/Input';
import Dropdown from '@/components/common/Dropdown';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import SectionHeader from '@/components/common/SectionHeader';
import CostTypeBadge from '@/components/common/CostTypeBadge';
import { toPersianDigit } from '@/utils/numberUtils';
import { COST_TYPE_OPTIONS } from '@/constants/collabTypes';
import { useServiceCategories, useSubServices } from '@/hooks/useCategoryOptions';

const MAX_TITLE = 100;
const MAX_DESCRIPTION = 500;
const MAX_PHONE = 11;

export default function ModelRequestForm({ services, initialData, defaultPhone, onSave, onClose }) {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    categoryId: initialData?.categoryId || null,
    subServiceId: initialData?.subServiceId || null,
    description: initialData?.description || '',
    contactPhone: initialData?.contactPhone || '',
    costType: initialData?.costType || 'material_cost',
    discount: initialData?.discount || 0,
    isUrgent: initialData?.isUrgent || false,
  });
  const [errors, setErrors] = useState({});

  // ✅ دریافت دسته‌بندی خدمات از بک‌اند
  const { categories: serviceCategories } = useServiceCategories();
  // ✅ دریافت زیرخدمات بر اساس دسته انتخاب‌شده
  const { subServices: availableSubServices } = useSubServices(formData.categoryId);

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'عنوان درخواست الزامی است';
    } else if (formData.title.trim().length > MAX_TITLE) {
      newErrors.title = `عنوان نمی‌تواند بیشتر از ${toPersianDigit(MAX_TITLE)} کاراکتر باشد`;
    }
    if (!formData.categoryId) newErrors.categoryId = 'دسته‌بندی خدمات را انتخاب کنید';
    if (!formData.subServiceId) newErrors.subServiceId = 'نوع خدمت را انتخاب کنید';
    if (!formData.description.trim()) {
      newErrors.description = 'توضیحات الزامی است';
    } else if (formData.description.trim().length > MAX_DESCRIPTION) {
      newErrors.description = `توضیحات نمی‌تواند بیشتر از ${toPersianDigit(MAX_DESCRIPTION)} کاراکتر باشد`;
    }
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'شماره تماس الزامی است';
    } else if (formData.contactPhone.trim().length !== MAX_PHONE) {
      newErrors.contactPhone = `شماره تماس باید دقیقاً ${toPersianDigit(MAX_PHONE)} رقم باشد`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const subService = availableSubServices.find((s) => s.id === formData.subServiceId);
    const category = serviceCategories.find((c) => c.id === formData.categoryId);
    onSave({
      ...formData,
      categoryLabel: category?.label || '',
      subServiceLabel: subService?.label || '',
    });
  };

  return (
    <div className="p-5 space-y-6 pb-32">
      {/* بخش ۱: اطلاعات درخواست */}
      <div className="space-y-3">
        <SectionHeader icon={<FiFileText size={18} />} iconColor={colors.primary} title="اطلاعات درخواست" />
        <Card variant="elevated" padding={16} radius={18}>
          <Input
            label="عنوان درخواست *"
            placeholder="مثال: مدل برای فیشیال VIP عروس"
            value={formData.title}
            onChangeText={(t) => {
              if (t.length <= MAX_TITLE) updateField('title', t);
            }}
            error={errors.title}
            hint={`${toPersianDigit(formData.title.length)} از ${toPersianDigit(MAX_TITLE)} کاراکتر`}
          />
          <Dropdown
            label="دسته‌بندی خدمات *"
            placeholder="دسته‌بندی را انتخاب کنید"
            value={formData.categoryId}
            options={serviceCategories}
            onSelect={(val) => {
              updateField('categoryId', val);
              setFormData((prev) => ({ ...prev, categoryId: val, subServiceId: null }));
            }}
          />
          {errors.categoryId && (
            <p className="text-xs text-[#E53935] mt-[-8px] mb-3">{errors.categoryId}</p>
          )}
          <Dropdown
            label="نوع خدمت *"
            placeholder={formData.categoryId ? 'نوع خدمت را انتخاب کنید' : 'ابتدا دسته‌بندی را انتخاب کنید'}
            value={formData.subServiceId}
            options={availableSubServices}
            onSelect={(val) => updateField('subServiceId', val)}
            disabled={!formData.categoryId}
          />
          {errors.subServiceId && (
            <p className="text-xs text-[#E53935] mt-[-8px] mb-3">{errors.subServiceId}</p>
          )}
          <Input
            label="توضیحات *"
            placeholder="توضیحات کامل درباره نیاز به مدل..."
            value={formData.description}
            onChangeText={(t) => {
              if (t.length <= MAX_DESCRIPTION) updateField('description', t);
            }}
            multiline
            error={errors.description}
            hint={`${toPersianDigit(formData.description.length)} از ${toPersianDigit(MAX_DESCRIPTION)} کاراکتر`}
          />
          <Input
            label="شماره تماس برای مدل‌ها *"
            placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
            value={formData.contactPhone}
            onChangeText={(t) => {
              const cleaned = t.replace(/[^0-9]/g, '');
              if (cleaned.length <= MAX_PHONE) updateField('contactPhone', cleaned);
            }}
            type="tel"
            maxLength={MAX_PHONE}
            error={errors.contactPhone}
          />
        </Card>
      </div>

      {/* بخش ۲: نوع هزینه */}
      <div className="space-y-3">
        <SectionHeader icon={<FiDollarSign size={18} />} iconColor="#4CAF50" title="نوع هزینه" />
        <div className="space-y-2.5">
          {COST_TYPE_OPTIONS.map((option) => {
            const isSelected = formData.costType === option.id;
            return (
              <button
                key={option.id}
                onClick={() => updateField('costType', option.id)}
                className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-right transition-all"
                style={{
                  backgroundColor: isSelected ? colors.primary + '08' : colors.cardBackground,
                  borderColor: isSelected ? colors.primary : colors.border,
                }}
              >
                <CostTypeBadge type={option.id} variant="default" />
                <div className="flex-1">
                  <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>{option.label}</p>
                  <p className="text-xs font-[Vazir] mt-0.5" style={{ color: colors.textSecondary }}>
                    {option.subtitle}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                    <FiCheck size={14} color="#fff" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* دکمه‌ها */}
      <div className="flex gap-3 pt-4">
        <Button title="انصراف" onPress={onClose} variant="outline" size="lg" className="flex-1" />
        <Button
          title={initialData ? 'ذخیره تغییرات' : 'ایجاد درخواست'}
          onPress={handleSave}
          variant="primary"
          size="lg"
          className="flex-[2]"
          iconPosition="right"
        />
      </div>
    </div>
  );
}