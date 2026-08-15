// src/components/manageBusiness/services/edit/ServiceBasicInfoSection.jsx
'use client';
import { FiInfo } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Dropdown from '@/components/common/Dropdown';
import SectionHeader from '@/components/common/SectionHeader';
import { SERVICE_CATEGORIES, getSubServicesByCategory } from '@/constants/serviceTypes';

export default function ServiceBasicInfoSection({
  name,
  categoryId,
  typeId,
  errors,
  onNameChange,
  onCategoryChange,
  onTypeChange,
}) {
  const { colors } = useTheme();
  const availableSubServices = categoryId ? getSubServicesByCategory(categoryId) : [];

  return (
    <div className="space-y-3">
      <SectionHeader icon={<FiInfo size={18} />} iconColor={colors.primary} title="اطلاعات پایه" />
      <Card variant="elevated" padding={16} radius={18}>
        <Input
          label="نام خدمت *"
          placeholder="مثال: فیشیال تخصصی پوست"
          value={name}
          onChangeText={onNameChange}
          error={errors.name}
        />
        <Dropdown
          label="دسته‌بندی خدمت *"
          placeholder="دسته‌بندی را انتخاب کنید"
          value={categoryId}
          options={SERVICE_CATEGORIES.map((c) => ({ id: c.id, label: c.label }))}
          onSelect={onCategoryChange}
        />
        {errors.categoryId && (
          <p className="text-xs text-[#E53935] mt-1 mb-3">{errors.categoryId}</p>
        )}
        <Dropdown
          label="نوع خدمت *"
          placeholder={categoryId ? 'نوع خدمت را انتخاب کنید' : 'ابتدا دسته‌بندی را انتخاب کنید'}
          value={typeId}
          options={availableSubServices}
          onSelect={onTypeChange}
          disabled={!categoryId}
        />
        {errors.typeId && <p className="text-xs text-[#E53935] mt-1">{errors.typeId}</p>}
      </Card>
    </div>
  );
}
