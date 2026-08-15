// src/components/createbusiness/BasicInfoStep.jsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  FiBriefcase,
  FiMapPin,
  FiPhone,
  FiClock,
  FiCamera,
  FiSave,
  FiAlertCircle,
  FiCheckCircle,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import Dropdown from '@/components/common/Dropdown';
import ImageUploader from '@/components/common/ImageUploader';
import MapPicker from '@/components/common/MapPicker';
import { locationsService, categoriesService } from '@/api';
import { USE_MOCK } from '@/api/config';
import { PROVINCES, CITIES } from '@/constants/exploreFilters';
import { toPersianDigit } from '@/utils/numberUtils';

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

// ─── کامپوننت فیلد اجباری ───
function RequiredLabel({ children }) {
  const { colors } = useTheme();
  return (
    <label
      className="block text-sm font-[Vazir-Medium] mb-2"
      style={{ color: colors.textMain }}
    >
      {children} <span style={{ color: '#E53935' }}>*</span>
    </label>
  );
}

// ─── کامپوننت خطای فیلد ───
function FieldError({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1.5">
      <FiAlertCircle size={12} color="#E53935" />
      <span className="text-xs" style={{ color: '#E53935' }}>
        {message}
      </span>
    </div>
  );
}

export default function BasicInfoStep({
  formData,
  onUpdate,
  onValidationChange,
  onSubmit,
  submitting = false,
  isFinalStep = false,
}) {
  const { colors } = useTheme();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [categories, setCategories] = useState(BUSINESS_CATEGORIES);
  const [provinces, setProvinces] = useState(PROVINCES);
  const [cities, setCities] = useState([]);

  // ─── دریافت داده‌ها از API ───
  useEffect(() => {
    const fetchData = async () => {
      if (USE_MOCK) return;
      try {
        const [catRes, provRes] = await Promise.all([
          categoriesService.getBusinessCategories(),
          locationsService.getProvinces(),
        ]);
        if (catRes.data?.length) {
          setCategories(catRes.data.map((c) => ({ id: String(c.id), label: c.name })));
        }
        if (provRes.data?.length) {
          setProvinces(provRes.data.map((p) => ({ id: String(p.id), label: p.name })));
        }
      } catch (e) {
        console.error('Failed to fetch:', e);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (!formData.provinceId) {
        setCities([]);
        return;
      }
      if (USE_MOCK) {
        setCities(CITIES[formData.provinceId] || []);
        return;
      }
      try {
        const res = await locationsService.getCities(formData.provinceId);
        setCities((res.data || []).map((c) => ({ id: String(c.id), label: c.name })));
      } catch (e) {
        setCities(CITIES[formData.provinceId] || []);
      }
    };
    fetchCities();
  }, [formData.provinceId]);

  // ─── اعتبارسنجی ───
  const validateField = useCallback((field, value) => {
    switch (field) {
      case 'name':
        if (!value?.trim()) return 'نام کسب‌وکار الزامی است';
        if (value.trim().length < 3) return 'حداقل ۳ کاراکتر';
        return '';
      case 'categoryId':
        return !value ? 'نوع کسب‌وکار را انتخاب کنید' : '';
      case 'provinceId':
        return !value ? 'استان را انتخاب کنید' : '';
      case 'cityId':
        return !value ? 'شهر را انتخاب کنید' : '';
      case 'address':
        if (!value?.trim()) return 'آدرس الزامی است';
        if (value.trim().length < 10) return 'حداقل ۱۰ کاراکتر';
        return '';
      case 'phone':
        return !value?.trim() ? 'شماره تماس الزامی است' : '';
      case 'workingHours':
        return !value?.trim() ? 'ساعات کاری الزامی است' : '';
      case 'about':
        if (!value?.trim()) return 'توضیحات الزامی است';
        if (value.trim().length < 20) return 'حداقل ۲۰ کاراکتر';
        return '';
      case 'coverUrl':
        return !value ? 'تصویر کاور الزامی است' : '';
      case 'ownerPhoto':
        return !value ? 'تصویر صاحب کسب‌وکار الزامی است' : '';
      case 'location':
        return !value ? 'موقعیت روی نقشه الزامی است' : '';
      default:
        return '';
    }
  }, []);

  const validateAll = useCallback(() => {
    const fields = [
      'name', 'categoryId', 'provinceId', 'cityId', 'address',
      'phone', 'workingHours', 'about', 'coverUrl', 'ownerPhoto', 'location',
    ];
    const newErrors = {};
    let hasError = false;
    fields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        hasError = true;
      }
    });
    return { newErrors, isValid: !hasError };
  }, [formData, validateField]);

  useEffect(() => {
    const { newErrors, isValid } = validateAll();
    const filtered = {};
    Object.keys(newErrors).forEach((f) => {
      if (touched[f]) filtered[f] = newErrors[f];
    });
    setErrors(filtered);
    onValidationChange?.(isValid);
  }, [formData, touched, validateAll, onValidationChange]);

  const handleFieldChange = (key, value) => {
    onUpdate(key, value);
    if (errors[key]) {
      const error = validateField(key, value);
      if (!error) setErrors((p) => { const n = { ...p }; delete n[key]; return n; });
    }
  };

  const markTouched = (field) => setTouched((p) => ({ ...p, [field]: true }));

  const handleProvinceChange = (provinceId) => {
    handleFieldChange('provinceId', provinceId);
    onUpdate('cityId', null);
    onUpdate('location', null);
    onUpdate('mapAddress', '');
    markTouched('provinceId');
  };

  // ─── ساخت FormData ───
  const buildFormData = () => {
    const fd = new FormData();
    fd.append('name', formData.name.trim());
    fd.append('category', formData.categoryId);
    fd.append('province', formData.provinceId);
    fd.append('city', formData.cityId);
    fd.append('address', formData.address.trim());
    fd.append('phone', formData.phone);
    fd.append('working_hours', formData.workingHours);
    fd.append('about', formData.about);
    if (formData.location) {
      fd.append('latitude', String(formData.location.latitude));
      fd.append('longitude', String(formData.location.longitude));
    }
    if (formData.coverUrl instanceof File) fd.append('cover_image', formData.coverUrl);
    if (formData.ownerPhoto instanceof File) fd.append('owner_photo', formData.ownerPhoto);
    if (formData.logo instanceof File) fd.append('logo', formData.logo);
    return fd;
  };

  const handleSave = () => {
    const { newErrors, isValid } = validateAll();
    setErrors(newErrors);
    setTouched({
      name: true, categoryId: true, provinceId: true, cityId: true,
      address: true, phone: true, workingHours: true, about: true,
      coverUrl: true, ownerPhoto: true, location: true,
    });
    if (!isValid) return;
    onSubmit?.(buildFormData());
  };

  // ─── شمارنده فیلدهای پرشده ───
  const filledCount = [
    formData.name, formData.categoryId, formData.provinceId, formData.cityId,
    formData.address, formData.phone, formData.workingHours, formData.about,
    formData.coverUrl, formData.ownerPhoto, formData.location,
  ].filter(Boolean).length;
  const totalCount = 11;

  return (
    <div className="px-5 pt-4 pb-6 space-y-5">
      {/* ─── نوار پیشرفت فیلدها ─── */}
      <div
        className="rounded-2xl border p-4"
        style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-[Vazir-Medium]" style={{ color: colors.textSecondary }}>
            تکمیل اطلاعات
          </span>
          <span className="text-xs font-[Vazir-Bold]" style={{ color: colors.primary }}>
            {toPersianDigit(filledCount)} از {toPersianDigit(totalCount)}
          </span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: colors.border }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(filledCount / totalCount) * 100}%`,
              backgroundColor: filledCount === totalCount ? '#4CAF50' : colors.primary,
            }}
          />
        </div>
      </div>

      {/* ═══ بخش ۱: تصاویر ═══ */}
      <div className="space-y-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#E91E6315' }}
          >
            <FiCamera size={18} color="#E91E63" />
          </div>
          <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            تصاویر کسب‌وکار
          </span>
        </div>

        {/* تصویر کاور */}
        <div
          className="rounded-2xl border p-4"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: errors.coverUrl ? '#E5393540' : colors.border,
          }}
        >
          <RequiredLabel>تصویر کاور سالن</RequiredLabel>
          <ImageUploader
            value={formData.coverUrl}
            onChange={(url) => { handleFieldChange('coverUrl', url); markTouched('coverUrl'); }}
            variant="cover"
            hint="تصویر با کیفیت از محیط سالن (۱۲۰۰×۴۰۰)"
          />
          <FieldError message={errors.coverUrl} />
        </div>

        {/* تصویر صاحب کسب‌وکار */}
        <div
          className="rounded-2xl border p-4"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: errors.ownerPhoto ? '#E5393540' : colors.border,
          }}
        >
          <RequiredLabel>تصویر صاحب کسب‌وکار</RequiredLabel>
          <div className="flex flex-col items-center gap-3">
            <ImageUploader
              value={formData.ownerPhoto}
              onChange={(url) => { handleFieldChange('ownerPhoto', url); markTouched('ownerPhoto'); }}
              variant="avatar"
            />
            <div
              className="flex items-start gap-2 p-3 rounded-xl w-full"
              style={{ backgroundColor: colors.primary + '08' }}
            >
              <FiCheckCircle size={14} style={{ color: colors.primary, flexShrink: 0, marginTop: 2 }} />
              <span className="text-xs leading-5" style={{ color: colors.textSecondary }}>
                عکس واقعی مدیر، اعتماد مشتریان را افزایش می‌دهد
              </span>
            </div>
          </div>
          <FieldError message={errors.ownerPhoto} />
        </div>
      </div>

      {/* ═══ بخش ۲: مشخصات ═══ */}
      <div className="space-y-3">
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

        <div
          className="rounded-2xl border p-4 space-y-4"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          {/* نام */}
          <div>
            <RequiredLabel>نام کسب‌وکار</RequiredLabel>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              onBlur={() => markTouched('name')}
              placeholder="مثال: سالن زیبایی نیلارام"
              className="w-full px-4 h-12 rounded-xl border-2 outline-none text-sm font-[Vazir] transition-colors"
              style={{
                backgroundColor: colors.background,
                borderColor: errors.name ? '#E53935' : colors.border,
                color: colors.textMain,
              }}
            />
            <FieldError message={errors.name} />
          </div>

          {/* نوع کسب‌وکار */}
          <div>
            <RequiredLabel>نوع کسب‌وکار</RequiredLabel>
            <Dropdown
              placeholder="انتخاب کنید"
              value={formData.categoryId}
              options={categories}
              onSelect={(val) => { handleFieldChange('categoryId', val); markTouched('categoryId'); }}
            />
            <FieldError message={errors.categoryId} />
          </div>

          {/* شماره تماس */}
          <div>
            <RequiredLabel>شماره تماس سالن</RequiredLabel>
            <div className="relative">
              <FiPhone
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: colors.textSecondary }}
              />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                onBlur={() => markTouched('phone')}
                placeholder="مثال: ۰۲۱-۲۲۳۳۴۴۵۵"
                className="w-full pr-12 pl-4 h-12 rounded-xl border-2 outline-none text-sm font-[Vazir] transition-colors"
                style={{
                  backgroundColor: colors.background,
                  borderColor: errors.phone ? '#E53935' : colors.border,
                  color: colors.textMain,
                }}
              />
            </div>
            <FieldError message={errors.phone} />
          </div>

          {/* ساعات کاری */}
          <div>
            <RequiredLabel>ساعات کاری</RequiredLabel>
            <div className="relative">
              <FiClock
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: colors.textSecondary }}
              />
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) => handleFieldChange('workingHours', e.target.value)}
                onBlur={() => markTouched('workingHours')}
                placeholder="مثال: شنبه تا پنج‌شنبه ۹ الی ۲۰"
                className="w-full pr-12 pl-4 h-12 rounded-xl border-2 outline-none text-sm font-[Vazir] transition-colors"
                style={{
                  backgroundColor: colors.background,
                  borderColor: errors.workingHours ? '#E53935' : colors.border,
                  color: colors.textMain,
                }}
              />
            </div>
            <FieldError message={errors.workingHours} />
          </div>

          {/* درباره کسب‌وکار */}
          <div>
            <RequiredLabel>درباره کسب‌وکار</RequiredLabel>
            <textarea
              value={formData.about}
              onChange={(e) => handleFieldChange('about', e.target.value)}
              onBlur={() => markTouched('about')}
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
              <FieldError message={errors.about} />
              <span className="text-xs" style={{ color: colors.textSecondary }}>
                {toPersianDigit((formData.about || '').length)} کاراکتر
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ بخش ۳: موقعیت مکانی ═══ */}
      <div className="space-y-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#E5393515' }}
          >
            <FiMapPin size={18} color="#E53935" />
          </div>
          <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            موقعیت مکانی
          </span>
        </div>

        <div
          className="rounded-2xl border p-4 space-y-4"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          {/* استان و شهر */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <RequiredLabel>استان</RequiredLabel>
              <Dropdown
                placeholder="انتخاب"
                value={formData.provinceId}
                options={provinces}
                onSelect={handleProvinceChange}
              />
              <FieldError message={errors.provinceId} />
            </div>
            <div>
              <RequiredLabel>شهر</RequiredLabel>
              <Dropdown
                placeholder={formData.provinceId ? 'انتخاب' : 'ابتدا استان'}
                value={formData.cityId}
                options={cities}
                onSelect={(val) => { handleFieldChange('cityId', val); markTouched('cityId'); }}
              />
              <FieldError message={errors.cityId} />
            </div>
          </div>

          {/* آدرس */}
          <div>
            <RequiredLabel>آدرس دقیق سالن</RequiredLabel>
            <textarea
              value={formData.address}
              onChange={(e) => handleFieldChange('address', e.target.value)}
              onBlur={() => markTouched('address')}
              placeholder="خیابان، کوچه، پلاک، واحد..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl border-2 outline-none text-sm font-[Vazir] resize-none transition-colors"
              style={{
                backgroundColor: colors.background,
                borderColor: errors.address ? '#E53935' : colors.border,
                color: colors.textMain,
              }}
            />
            <FieldError message={errors.address} />
          </div>

          {/* نقشه */}
          <div>
            <RequiredLabel>موقعیت روی نقشه</RequiredLabel>
            <MapPicker
              initialLocation={formData.location}
              onLocationSelect={(location, address) => {
                handleFieldChange('location', location);
                onUpdate('mapAddress', address || '');
                markTouched('location');
              }}
            />
            <FieldError message={errors.location} />
          </div>
        </div>
      </div>

      {/* ─── دکمه ثبت نهایی ─── */}
      {isFinalStep && (
        <div className="pt-2 pb-4">
          <Button
            title={submitting ? 'در حال ثبت...' : 'ثبت نهایی کسب‌وکار'}
            onPress={handleSave}
            loading={submitting}
            disabled={submitting}
            variant="primary"
            size="lg"
            fullWidth
            icon={<FiSave size={18} color="#fff" />}
            iconPosition="right"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            }}
          />
        </div>
      )}
    </div>
  );
}