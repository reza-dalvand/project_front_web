// src/components/manageBusiness/settings/BusinessBasicInfoSection.jsx
'use client';
import { FiBriefcase, FiPhone, FiClock } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Dropdown from '@/components/common/Dropdown';
import SectionHeader from '@/components/common/SectionHeader';

const BUSINESS_CATEGORIES = [
  { id: '1', label: 'سالن زیبایی (چند منظوره)' },
  { id: '2', label: 'کلینیک پوست و مو' },
  { id: '3', label: 'مرکز لیزر' },
  { id: '4', label: 'مرکز تخصصی ناخن' },
  { id: '5', label: 'مرکز کراتین و رنگ مو' },
  { id: '6', label: 'استودیو میکاپ و گریم' },
  { id: '7', label: 'آرایشگاه مردانه' },
  { id: '8', label: 'اسپا و ماساژ' },
  { id: '9', label: 'مرکز تخصصی مژه و ابرو' },
  { id: '10', label: 'استودیو تتو و هاشور' },
];

export default function BusinessBasicInfoSection({
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
}) {
  const { colors } = useTheme();

  return (
    <div className="space-y-3">
      <SectionHeader icon={<FiBriefcase size={18} />} iconColor={colors.primary} title="اطلاعات پایه" />
      <Card variant="elevated" padding={16} radius={18}>
        {/* نام */}
        <div>
          <label className="block text-sm font-[Vazir-Medium] mb-2" style={{ color: colors.textMain }}>
            نام کسب‌وکار <span style={{ color: '#E53935' }}>*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="مثال: سالن زیبایی نیلارام"
            className="w-full px-4 h-12 rounded-xl border-2 outline-none text-sm font-[Vazir] transition-colors"
            style={{
              backgroundColor: colors.background,
              borderColor: errors.name ? '#E53935' : colors.border,
              color: colors.textMain,
            }}
          />
          {errors.name && (
            <p className="text-xs text-[#E53935] mt-1.5">{errors.name}</p>
          )}
        </div>

        {/* نوع کسب‌وکار */}
        <Dropdown
          label="نوع کسب‌وکار *"
          placeholder="انتخاب کنید"
          value={categoryId}
          options={BUSINESS_CATEGORIES}
          onSelect={onCategoryChange}
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
          <label className="block text-sm font-[Vazir-Medium] mb-2" style={{ color: colors.textMain }}>
            شماره تماس
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
              placeholder="مثال: ۰۲۱-۲۲۳۳۴۴۵۵"
              className="w-full pr-12 pl-4 h-12 rounded-xl border-2 outline-none text-sm font-[Vazir] transition-colors"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.textMain,
              }}
            />
          </div>
        </div>

        {/* ساعات کاری */}
        <div>
          <label className="block text-sm font-[Vazir-Medium] mb-2" style={{ color: colors.textMain }}>
            ساعات کاری
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
              placeholder="مثال: شنبه تا پنج‌شنبه ۹ الی ۲۰"
              className="w-full pr-12 pl-4 h-12 rounded-xl border-2 outline-none text-sm font-[Vazir] transition-colors"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.textMain,
              }}
            />
          </div>
        </div>

        {/* درباره کسب‌وکار */}
        <div>
          <label className="block text-sm font-[Vazir-Medium] mb-2" style={{ color: colors.textMain }}>
            درباره کسب‌وکار
          </label>
          <textarea
            value={about}
            onChange={(e) => onAboutChange(e.target.value)}
            placeholder="توضیحاتی درباره خدمات، تجربه و ویژگی‌های سالن..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border-2 outline-none text-sm font-[Vazir] resize-none transition-colors"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border,
              color: colors.textMain,
            }}
          />
        </div>
      </Card>
    </div>
  );
}