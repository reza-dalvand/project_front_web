// src/components/createbusiness/basicinfo/BusinessInfoSection.jsx
'use client';
import { useEffect, useMemo, useRef } from 'react';
import { FiBriefcase, FiPhone, FiClock } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Dropdown from '@/components/common/Dropdown';
import { toPersianDigit } from '@/utils/numberUtils';
import { useBusinessCategories } from '@/hooks/useCategoryOptions';

/**
 * نرمال‌سازی برچسب دسته‌بندی برای مقایسه امن‌تر
 * - حذف نیم‌فاصله
 * - یکسان‌سازی ی/ي و ک/ك
 * - حذف فاصله‌های اضافی
 */
const normalizeLabel = (value) =>
  String(value ?? '')
    .replace(/[\u200c\u200d]/g, '')
    .replace(/[\u064A\u06CC]/g, '\u06CC')
    .replace(/[\u0643\u06A9]/g, '\u06A9')
    .replace(/\s+/g, '')
    .trim();

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
  hideCategorySelect = false,
  defaultCategoryLabel = null,
}) {
  const { colors } = useTheme();

  // ✅ دریافت دسته‌بندی‌ها از بک‌اند
  const { categories: businessCategories } = useBusinessCategories();

  /**
   * اگر حالت hidden فعال باشد، دسته پیش‌فرض را از لیست بک‌اند پیدا می‌کنیم.
   */
  const defaultCategoryId = useMemo(() => {
    if (!hideCategorySelect || !defaultCategoryLabel) return null;
    if (!Array.isArray(businessCategories) || businessCategories.length === 0) return null;

    const target = normalizeLabel(defaultCategoryLabel);
    const found = businessCategories.find(
      (category) => normalizeLabel(category?.label) === target
    );

    return found?.id ?? null;
  }, [hideCategorySelect, defaultCategoryLabel, businessCategories]);

  /**
   * برای جلوگیری از re-renderهای اضافی، callback را در ref نگه می‌داریم.
   */
  const onCategoryChangeRef = useRef(onCategoryChange);

  useEffect(() => {
    onCategoryChangeRef.current = onCategoryChange;
  }, [onCategoryChange]);

  /**
   * ✅ ست کردن خودکار نوع پیش‌فرض کسب‌وکار
   * فقط وقتی که dropdown مخفی است و هنوز categoryId انتخاب نشده.
   */
  useEffect(() => {
    if (!hideCategorySelect || !defaultCategoryLabel || !defaultCategoryId) return;
    if (categoryId) return;

    onCategoryChangeRef.current?.(defaultCategoryId);
  }, [
    hideCategorySelect,
    defaultCategoryLabel,
    defaultCategoryId,
    categoryId,
  ]);

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

        {/* نوع کسب‌وکار — فقط در حالت عادی نمایش داده می‌شود */}
        {!hideCategorySelect && (
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
        )}

        {errors.categoryId && (
          <div
            className={`flex items-center gap-1 ${
              hideCategorySelect ? 'mb-2 px-1' : 'mt-[-8px] mb-2 px-1'
            }`}
          >
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