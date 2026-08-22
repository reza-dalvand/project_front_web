// src/components/createbusiness/basicinfo/BusinessInfoSection.jsx
'use client';
import { FiBriefcase, FiPhone, FiClock } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Dropdown from '@/components/common/Dropdown';
import { toPersianDigit } from '@/utils/numberUtils';
import { useBusinessCategories } from '@/hooks/useCategoryOptions';

export default function BusinessInfoSection({
  name,
  categoryId,
  phone,
  workingHours,
  about,
  errors,
  onNameChange,
  onCategoryChange,
  onPhoneChange,
  onWorkingHoursChange,
  onAboutChange,
  onNameTouched,
  onCategoryTouched,
  onPhoneTouched,
  onWorkingHoursTouched,
  onAboutTouched,
}) {
  const { colors } = useTheme();
  // ✅ دریافت دسته‌بندی‌ها از بک‌اند
  const { categories: businessCategories } = useBusinessCategories();

  return (
    <div className="space-y-3">
      {/* هدر بخش */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: colors.primary + '15' }}
        >
          <FiBriefcase size={18} style={{ color: colors.primary }} />
        </div>
        <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
          مشخصات کسب‌وکار
        </span>
      </div>

      <Card variant="elevated" padding={16} radius={18}>
        {/* نام */}
        <div>
          <label
            className="block text-sm font-[Vazir-Medium] mb-2"
            style={{ color: colors.textMain }}
          >
            نام کسب‌وکار <span style={{ color: '#E53935' }}>*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={onNameTouched}
            placeholder="مثال: سالن زیبایی نیلارام"
            className="w-full px-4 h-12 rounded-xl border-2 outline-none text-sm font-[Vazir] transition-colors"
            style={{
              backgroundColor: colors.background,
              borderColor: errors.name ? '#E53935' : colors.border,
              color: colors.textMain,
            }}
          />
          {errors.name && <p className="text-xs text-[#E53935] mt-1.5">{errors.name}</p>}
        </div>

        {/* نوع کسب‌وکار — ✅ از بک‌اند */}
        <Dropdown
          label="نوع کسب‌وکار *"
          placeholder="انتخاب کنید"
          value={categoryId}
          options={businessCategories}
          onSelect={(val) => {
            onCategoryChange(val);
            onCategoryTouched();
          }}
        />
        {errors.categoryId && (
          <div className="flex items-center gap-1 mt-[-8px] mb-2 px-1">
            <span className="text-xs font-[Vazir]" style={{ color: '#E53935' }}>
              {errors.categoryId}
            </span>
          </div>
        )}

        {/* شماره تماس */}
        <div>
          <label
            className="block text-sm font-[Vazir-Medium] mb-2"
            style={{ color: colors.textMain }}
          >
            شماره تماس سالن <span style={{ color: '#E53935' }}>*</span>
          </label>
          <div className="relative">
            <FiPhone
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: colors.textSecondary }}
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              onBlur={onPhoneTouched}
              placeholder="مثال: ۰۲۱-۲۲۳۳۴۴۵۵"
              className="w-full pr-12 pl-4 h-12 rounded-xl border-2 outline-none text-sm font-[Vazir] transition-colors"
              style={{
                backgroundColor: colors.background,
                borderColor: errors.phone ? '#E53935' : colors.border,
                color: colors.textMain,
              }}
            />
          </div>
          {errors.phone && <p className="text-xs text-[#E53935] mt-1.5">{errors.phone}</p>}
        </div>

        {/* ساعات کاری */}
        <div>
          <label
            className="block text-sm font-[Vazir-Medium] mb-2"
            style={{ color: colors.textMain }}
          >
            ساعات کاری <span style={{ color: '#E53935' }}>*</span>
          </label>
          <div className="relative">
            <FiClock
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: colors.textSecondary }}
            />
            <input
              type="text"
              value={workingHours}
              onChange={(e) => onWorkingHoursChange(e.target.value)}
              onBlur={onWorkingHoursTouched}
              placeholder="مثال: شنبه تا پنج‌شنبه ۹ الی ۲۰"
              className="w-full pr-12 pl-4 h-12 rounded-xl border-2 outline-none text-sm font-[Vazir] transition-colors"
              style={{
                backgroundColor: colors.background,
                borderColor: errors.workingHours ? '#E53935' : colors.border,
                color: colors.textMain,
              }}
            />
          </div>
          {errors.workingHours && (
            <p className="text-xs text-[#E53935] mt-1.5">{errors.workingHours}</p>
          )}
        </div>

        {/* درباره کسب‌وکار */}
        <div>
          <label
            className="block text-sm font-[Vazir-Medium] mb-2"
            style={{ color: colors.textMain }}
          >
            درباره کسب‌وکار <span style={{ color: '#E53935' }}>*</span>
          </label>
          <textarea
            value={about}
            onChange={(e) => onAboutChange(e.target.value)}
            onBlur={onAboutTouched}
            placeholder="توضیحاتی درباره خدمات، تجربه و ویژگی‌های سالن..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border-2 outline-none text-sm font-[Vazir] resize-none transition-colors"
            style={{
              backgroundColor: colors.background,
              borderColor: errors.about ? '#E53935' : colors.border,
              color: colors.textMain,
            }}
          />
          <div className="flex justify-between mt-1">
            {errors.about ? (
              <span className="text-xs text-[#E53935]">{errors.about}</span>
            ) : (
              <span />
            )}
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              {toPersianDigit((about || '').length)} کاراکتر
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}