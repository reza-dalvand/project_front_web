// src/components/manageBusiness/lineRental/LineRentalBasicFields.jsx
'use client';
import Input from '@/components/common/Input';
import Dropdown from '@/components/common/Dropdown';
import CharCounter from '@/components/common/CharCounter';
import { toPersianDigit } from '@/utils/numberUtils';

const MAX_TITLE = 100;
const MAX_DESCRIPTION = 500;
const MAX_PHONE = 11;

/**
 * ✅ فاز ۴: به جای وارد کردن ثابت‌های هاردکد،
 * دسته‌بندی‌ها و زیرخدمات به صورت پروپ دریافت می‌شوند
 */
export default function LineRentalBasicFields({
  title,
  categoryId,
  subServiceId,
  description,
  contactPhone,
  errors,
  serviceCategories = [],
  availableSubServices = [],
  onTitleChange,
  onCategoryChange,
  onSubServiceChange,
  onDescriptionChange,
  onContactPhoneChange,
}) {
  return (
    <>
      {/* عنوان */}
      <Input
        label="عنوان آگهی *"
        placeholder="مثال: لاین ناخن با تجهیزات کامل"
        value={title}
        onChangeText={onTitleChange}
        error={errors.title}
        hint={`${toPersianDigit(title.length)} از ${toPersianDigit(MAX_TITLE)} کاراکتر`}
      />

      {/* دسته‌بندی خدمات — از بک‌اند */}
      <Dropdown
        label="دسته‌بندی خدمات *"
        placeholder="دسته‌بندی را انتخاب کنید"
        value={categoryId}
        options={serviceCategories}
        onSelect={onCategoryChange}
      />
      {errors.categoryId && (
        <p className="text-xs text-[#E53935] mt-[-8px] mb-3">{errors.categoryId}</p>
      )}

      {/* نوع خدمت — از بک‌اند */}
      <Dropdown
        label="نوع خدمت لاین *"
        placeholder={categoryId ? 'نوع خدمت را انتخاب کنید' : 'ابتدا دسته‌بندی را انتخاب کنید'}
        value={subServiceId}
        options={availableSubServices}
        onSelect={onSubServiceChange}
        disabled={!categoryId}
      />
      {errors.subServiceId && (
        <p className="text-xs text-[#E53935] mt-[-8px] mb-3">{errors.subServiceId}</p>
      )}

      {/* توضیحات */}
      <Input
        label="توضیحات *"
        placeholder="درباره لاین، تجهیزات، شرایط همکاری و مزایا بنویسید..."
        value={description}
        onChangeText={onDescriptionChange}
        multiline
        error={errors.description}
      />
      <CharCounter current={description.length} max={MAX_DESCRIPTION} />

      {/* شماره تماس */}
      <Input
        label="شماره تماس *"
        placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
        value={contactPhone}
        onChangeText={onContactPhoneChange}
        type="tel"
        maxLength={MAX_PHONE}
        error={errors.contactPhone}
      />
    </>
  );
}
