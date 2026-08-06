'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiBriefcase, FiCamera, FiMapPin, FiInfo, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';
import Dropdown from '@/components/common/Dropdown';
import dynamic from 'next/dynamic';
import ImageUploader from '@/components/common/ImageUploader';
import SectionHeader from '@/components/common/SectionHeader';
import { PROVINCES, CITIES } from '@/constants/exploreFilters';
const MapPicker = dynamic(
  () => import('@/components/common/MapPicker'),
  { ssr: false }  // ← کلید اصلی: نه SSR، نه Turbopack problem
);
const BUSINESS_CATEGORIES = [
  { id: 'salon', label: 'سالن زیبایی (چند منظوره)' },
  { id: 'clinic', label: 'کلینیک پوست و مو' },
  { id: 'laser', label: 'مرکز لیزر' },
  { id: 'nail', label: 'مرکز تخصصی ناخن' },
  { id: 'keratin', label: 'مرکز کراتین و رنگ مو' },
  { id: 'makeup', label: 'استودیو میکاپ و گریم' },
  { id: 'barbershop', label: 'آرایشگاه مردانه' },
  { id: 'spa', label: 'اسپا و ماساژ' },
  { id: 'eyelash', label: 'مرکز تخصصی مژه و ابرو' },
  { id: 'tattoo', label: 'استودیو تتو و هاشور' },
];

export default function BasicInfoStep({ formData, onUpdate, onValidationChange }) {
  const { colors } = useTheme();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isValid, setIsValid] = useState(false);

  // اعتبارسنجی فیلد
  const validateField = useCallback((field, value) => {
    switch (field) {
      case 'name':
        if (!value || !value.trim()) return 'نام کسب‌وکار الزامی است';
        if (value.trim().length < 3) return 'نام باید حداقل ۳ کاراکتر باشد';
        if (value.trim().length > 50) return 'نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد';
        return '';
      case 'coverUrl':
        if (!value) return 'آپلود تصویر کاور الزامی است';
        return '';
      case 'ownerPhoto':
        if (!value) return 'آپلود تصویر صاحب کسب‌وکار الزامی است';
        return '';
      case 'categoryId':
        if (!value) return 'انتخاب نوع کسب‌وکار الزامی است';
        return '';
      case 'provinceId':
        if (!value) return 'انتخاب استان الزامی است';
        return '';
      case 'cityId':
        if (!value) return 'انتخاب شهر الزامی است';
        return '';
      case 'address':
        if (!value || !value.trim()) return 'آدرس دقیق الزامی است';
        if (value.trim().length < 10) return 'آدرس باید حداقل ۱۰ کاراکتر باشد';
        return '';
      case 'location':
        if (!value || !value.latitude) return 'تعیین موقعیت روی نقشه الزامی است';
        return '';
      default:
        return '';
    }
  }, []);

  // اعتبارسنجی همه فیلدها
  const validateAll = useCallback(() => {
    const fields = ['name', 'coverUrl', 'ownerPhoto', 'categoryId', 'provinceId', 'cityId', 'address', 'location'];
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
    const { newErrors, isValid: currentValid } = validateAll();
    setIsValid(currentValid);
    const filteredErrors = {};
    Object.keys(newErrors).forEach((field) => {
      if (touched[field]) {
        filteredErrors[field] = newErrors[field];
      }
    });
    setErrors(filteredErrors);
    if (onValidationChange) {
      onValidationChange(currentValid);
    }
  }, [formData.name, formData.coverUrl, formData.ownerPhoto, formData.categoryId,
      formData.provinceId, formData.cityId, formData.address, formData.location,
      touched, validateAll, onValidationChange]);

  const handleFieldChange = (field, value) => {
    onUpdate(field, value);
    const error = validateField(field, value);
    if (!error) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    } else if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const markTouched = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const showError = (field) => touched[field] && errors[field];

  const handleProvinceChange = (provinceId) => {
    handleFieldChange('provinceId', provinceId);
    onUpdate('cityId', null);
    onUpdate('location', null);
    onUpdate('mapAddress', '');
    markTouched('provinceId');
  };

  const handleLocationSelect = (location, mapAddress) => {
    handleFieldChange('location', location);
    onUpdate('mapAddress', mapAddress);
    markTouched('location');
  };

  return (
    <div className="px-5 pt-4 pb-6 space-y-6">
      {/* ═══════ بخش ۱: تصاویر ═══════ */}
      <div className="space-y-3">
        <SectionHeader
          icon={<FiCamera size={18} />}
          iconColor="#E91E63"
          title="تصاویر"
        />

        {/* کاور کسب‌وکار */}
        <Card variant="default" padding={16} radius={20}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              تصویر کاور سالن<span style={{ color: '#E53935' }}> *</span>
            </span>
            <span className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
              ۱۲۰۰×۴۰۰ پیکسل
            </span>
          </div>
          <ImageUploader
            value={formData.coverUrl}
            onChange={(url) => handleFieldChange('coverUrl', url)}
            variant="cover"
            hint="تصویر با کیفیت از محیط سالن آپلود کنید"
            error={showError('coverUrl') ? errors.coverUrl : ''}
          />
        </Card>

        {/* تصویر صاحب کسب‌وکار */}
        <Card variant="default" padding={16} radius={20}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              تصویر صاحب کسب‌وکار<span style={{ color: '#E53935' }}> *</span>
            </span>
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-lg"
              style={{ backgroundColor: '#4CAF5015' }}
            >
              <FiCheckCircle size={10} color="#4CAF50" />
              <span className="text-[10px] font-[Vazir-Bold]" style={{ color: '#4CAF50' }}>
                احراز هویت
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <ImageUploader
              value={formData.ownerPhoto}
              onChange={(url) => handleFieldChange('ownerPhoto', url)}
              variant="avatar"
              error={showError('ownerPhoto') ? errors.ownerPhoto : ''}
            />

            <p className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
              {formData.ownerPhoto ? 'برای تغییر عکس، روی آن ضربه بزنید' : 'عکس واقعی خود را آپلود کنید'}
            </p>

            <div
              className="flex items-start gap-2 p-3 rounded-xl border w-full"
              style={{
                backgroundColor: colors.primary + '08',
                borderColor: colors.primary + '25',
              }}
            >
              <FiInfo size={16} style={{ color: colors.primary, flexShrink: 0 }} />
              <p className="text-xs font-[Vazir] leading-5 flex-1" style={{ color: colors.textSecondary }}>
                قرار دادن عکس واقعی مدیر،{' '}
                <span className="font-[Vazir-Bold]" style={{ color: colors.primary }}>
                  اعتماد مشتریان را افزایش می‌دهد
                </span>
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* ═══════ بخش ۲: مشخصات کسب‌وکار ═══════ */}
      <div className="space-y-3">
        <SectionHeader
          icon={<FiInfo size={18} />}
          iconColor={colors.primary}
          title="مشخصات کسب‌وکار"
        />

        <Input
          label="نام کسب‌وکار *"
          placeholder="مثال: سالن زیبایی نیلارام"
          value={formData.name}
          onChangeText={(txt) => handleFieldChange('name', txt)}
          onBlur={() => markTouched('name')}
          error={showError('name') ? errors.name : ''}
          rightIcon={<FiBriefcase size={18} style={{ color: colors.textSecondary }} />}
        />

        <Dropdown
          label="نوع کسب‌وکار *"
          placeholder="نوع کسب‌وکار خود را انتخاب کنید"
          value={formData.categoryId}
          options={BUSINESS_CATEGORIES}
          onSelect={(val) => {
            handleFieldChange('categoryId', val);
            markTouched('categoryId');
          }}
        />

        {showError('categoryId') && (
          <div className="flex items-center gap-1 mt-[-8px] mb-2 px-1">
            <FiAlertCircle size={14} color="#E53935" />
            <span className="text-xs font-[Vazir]" style={{ color: '#E53935' }}>
              {errors.categoryId}
            </span>
          </div>
        )}
      </div>

      {/* ═══════ بخش ۳: موقعیت مکانی ═══════ */}
      <div className="space-y-3">
        <SectionHeader
          icon={<FiMapPin size={18} />}
          iconColor="#E53935"
          title="موقعیت مکانی"
        />

        <Dropdown
          label="استان *"
          placeholder="انتخاب استان"
          value={formData.provinceId}
          options={PROVINCES}
          onSelect={handleProvinceChange}
        />

        {showError('provinceId') && (
          <div className="flex items-center gap-1 mt-[-8px] mb-2 px-1">
            <FiAlertCircle size={14} color="#E53935" />
            <span className="text-xs font-[Vazir]" style={{ color: '#E53935' }}>
              {errors.provinceId}
            </span>
          </div>
        )}

        <Dropdown
          label="شهر *"
          placeholder={formData.provinceId ? 'انتخاب شهر' : 'ابتدا استان را انتخاب کنید'}
          value={formData.cityId}
          options={formData.provinceId ? CITIES[formData.provinceId] || [] : []}
          onSelect={(val) => {
            handleFieldChange('cityId', val);
            markTouched('cityId');
          }}
        />

        {showError('cityId') && (
          <div className="flex items-center gap-1 mt-[-8px] mb-2 px-1">
            <FiAlertCircle size={14} color="#E53935" />
            <span className="text-xs font-[Vazir]" style={{ color: '#E53935' }}>
              {errors.cityId}
            </span>
          </div>
        )}

        <Input
          label="آدرس دقیق سالن *"
          placeholder="خیابان، کوچه، پلاک، واحد..."
          value={formData.address}
          onChangeText={(txt) => handleFieldChange('address', txt)}
          onBlur={() => markTouched('address')}
          error={showError('address') ? errors.address : ''}
          multiline
          rightIcon={<FiMapPin size={18} style={{ color: '#E53935' }} />}
        />

        {/* نقشه */}
        <Card variant="default" padding={0} radius={16}>
          <div
            className="flex items-center gap-3 p-4 border-b"
            style={{ borderColor: colors.border }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: colors.primary + '20' }}
            >
              <FiMapPin size={20} style={{ color: colors.primary }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                موقعیت روی نقشه <span style={{ color: '#E53935' }}>*</span>
              </p>
              <p className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
                با کلیک روی نقشه، مکان دقیق را مشخص کنید
              </p>
            </div>
          </div>
          <div className="p-4">
            <MapPicker
              initialLocation={formData.location}
              onLocationSelect={handleLocationSelect}
            />
          </div>
        </Card>

        {showError('location') && (
          <div className="flex items-center gap-1 mt-2 px-1">
            <FiAlertCircle size={14} color="#E53935" />
            <span className="text-xs font-[Vazir]" style={{ color: '#E53935' }}>
              {errors.location}
            </span>
          </div>
        )}

        {formData.location && !showError('location') && (
          <div
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl border"
            style={{
              backgroundColor: colors.primary + '10',
              borderColor: colors.primary + '30',
            }}
          >
            <FiMapPin size={14} style={{ color: colors.primary }} />
            <span className="text-xs font-[Vazir-Medium] flex-1" style={{ color: colors.primary }}>
              مختصات: {formData.location.latitude.toFixed(6)}, {formData.location.longitude.toFixed(6)}
            </span>
            <FiCheckCircle size={16} color="#4CAF50" />
          </div>
        )}
      </div>

      {/* راهنمای تکمیل */}
      <Card variant="default" padding={14} radius={14}>
        <div className="flex items-center gap-2 mb-2">
          <FiInfo size={18} style={{ color: colors.primary }} />
          <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            راهنمای تکمیل
          </span>
        </div>
        <p className="text-xs font-[Vazir] leading-5" style={{ color: colors.textSecondary }}>
          فیلدهای ستاره‌دار (<span style={{ color: '#E53935' }}>*</span>) الزامی هستند.
          پس از تکمیل همه فیلدها، دکمه «مرحله بعد» فعال می‌شود.
        </p>
      </Card>
    </div>
  );
}