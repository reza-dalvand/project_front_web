// src/components/createbusiness/BasicInfoStep.jsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  FiBriefcase,
  FiCamera,
  FiMapPin,
  FiInfo,
  FiCheckCircle,
  FiAlertCircle,
  FiSave,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';
import Dropdown from '@/components/common/Dropdown';
import Button from '@/components/common/Button';
import ImageUploader from '@/components/common/ImageUploader';
import SectionHeader from '@/components/common/SectionHeader';
import MapPicker from '@/components/common/MapPicker';
import { locationsService, categoriesService } from '@/api';
import { USE_MOCK } from '@/api/config';
import { PROVINCES, CITIES } from '@/constants/exploreFilters';

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
  const [isValid, setIsValid] = useState(false);

  // دریافت دسته‌بندی‌ها و استان‌ها از API
  const [categories, setCategories] = useState(BUSINESS_CATEGORIES);
  const [provinces, setProvinces] = useState(PROVINCES);
  const [cities, setCities] = useState([]);

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
        console.error('Failed to fetch categories/provinces:', e);
      }
    };
    fetchData();
  }, []);

  // دریافت شهرها بر اساس استان
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

  const validateField = useCallback((field, value) => {
    switch (field) {
      case 'name':
        if (!value || !value.trim()) return 'نام کسب‌وکار الزامی است';
        if (value.trim().length < 3) return 'نام باید حداقل ۳ کاراکتر باشد';
        if (value.trim().length > 100) return 'نام نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد';
        return '';
      case 'categoryId':
        if (!value) return 'نوع کسب‌وکار را انتخاب کنید';
        return '';
      case 'provinceId':
        if (!value) return 'استان را انتخاب کنید';
        return '';
      case 'cityId':
        if (!value) return 'شهر را انتخاب کنید';
        return '';
      case 'address':
        if (!value || !value.trim()) return 'آدرس دقیق الزامی است';
        if (value.trim().length < 10) return 'آدرس باید حداقل ۱۰ کاراکتر باشد';
        return '';
      default:
        return '';
    }
  }, []);

  const validateAll = useCallback(() => {
    const fields = ['name', 'categoryId', 'provinceId', 'cityId', 'address'];
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
      if (touched[field]) filteredErrors[field] = newErrors[field];
    });
    setErrors(filteredErrors);
    onValidationChange?.(currentValid);
  }, [
    formData.name,
    formData.categoryId,
    formData.provinceId,
    formData.cityId,
    formData.address,
    touched,
    validateAll,
    onValidationChange,
  ]);

  const handleFieldChange = (key, value) => {
    onUpdate(key, value);
    const error = validateField(key, value);
    if (!error) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    } else if (touched[key]) {
      setErrors((prev) => ({ ...prev, [key]: error }));
    }
  };

  const markTouched = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleProvinceChange = (provinceId) => {
    handleFieldChange('provinceId', provinceId);
    onUpdate('cityId', null);
    onUpdate('location', null);
    onUpdate('mapAddress', '');
    markTouched('provinceId');
  };

  return (
    <div className="px-5 pt-4 pb-6 space-y-6">
      {/* تصاویر */}
      <div className="space-y-3">
        <SectionHeader icon={<FiCamera size={18} />} iconColor="#E91E63" title="تصاویر" />
        <Card variant="default" padding={16} radius={20}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              تصویر کاور سالن
            </span>
          </div>
          <ImageUploader
            value={formData.coverUrl}
            onChange={(url) => handleFieldChange('coverUrl', url)}
            variant="cover"
            hint="تصویر با کیفیت از محیط سالن آپلود کنید"
          />
        </Card>
        <Card variant="default" padding={16} radius={20}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              تصویر صاحب کسب‌وکار <span style={{ color: '#E53935' }}>*</span>
            </span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <ImageUploader
              value={formData.ownerPhoto}
              onChange={(url) => handleFieldChange('ownerPhoto', url)}
              variant="avatar"
            />
            <div
              className="flex items-start gap-2 p-3 rounded-xl border w-full"
              style={{
                backgroundColor: colors.primary + '08',
                borderColor: colors.primary + '25',
              }}
            >
              <FiInfo size={16} style={{ color: colors.primary, flexShrink: 0 }} />
              <p
                className="text-xs font-[Vazir] leading-5 flex-1"
                style={{ color: colors.textSecondary }}
              >
                قرار دادن عکس واقعی مدیر،{' '}
                <span className="font-[Vazir-Bold]" style={{ color: colors.primary }}>
                  اعتماد مشتریان را افزایش می‌دهد
                </span>
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* مشخصات */}
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
          onChangeText={(t) => handleFieldChange('name', t)}
          onBlur={() => markTouched('name')}
          error={errors.name}
          rightIcon={<FiBriefcase size={18} style={{ color: colors.textSecondary }} />}
        />
        <Dropdown
          label="نوع کسب‌وکار *"
          placeholder="نوع کسب‌وکار خود را انتخاب کنید"
          value={formData.categoryId}
          options={categories}
          onSelect={(val) => {
            handleFieldChange('categoryId', val);
            markTouched('categoryId');
          }}
        />
        {errors.categoryId && (
          <p className="text-xs text-[#E53935] mt-[-8px] mb-2">{errors.categoryId}</p>
        )}
      </div>

      {/* موقعیت مکانی */}
      <div className="space-y-3">
        <SectionHeader icon={<FiMapPin size={18} />} iconColor="#E53935" title="موقعیت مکانی" />
        <Dropdown
          label="استان *"
          placeholder="انتخاب استان"
          value={formData.provinceId}
          options={provinces}
          onSelect={handleProvinceChange}
        />
        {errors.provinceId && (
          <p className="text-xs text-[#E53935] mt-[-8px] mb-2">{errors.provinceId}</p>
        )}
        <Dropdown
          label="شهر *"
          placeholder={formData.provinceId ? 'انتخاب شهر' : 'ابتدا استان را انتخاب کنید'}
          value={formData.cityId}
          options={cities}
          onSelect={(val) => {
            handleFieldChange('cityId', val);
            markTouched('cityId');
          }}
        />
        {errors.cityId && <p className="text-xs text-[#E53935] mt-[-8px] mb-2">{errors.cityId}</p>}
        <Input
          label="آدرس دقیق سالن *"
          placeholder="خیابان، کوچه، پلاک، واحد..."
          value={formData.address}
          onChangeText={(t) => handleFieldChange('address', t)}
          onBlur={() => markTouched('address')}
          error={errors.address}
          multiline
          rightIcon={<FiMapPin size={18} style={{ color: '#E53935' }} />}
        />
        <Card variant="default" padding={0} radius={16}>
          <div className="p-4">
            <MapPicker
              initialLocation={formData.location}
              onLocationSelect={(location, address) => {
                handleFieldChange('location', location);
                onUpdate('mapAddress', address || '');
              }}
            />
          </div>
        </Card>
      </div>

      {/* فیلدهای اختیاری */}
      <div className="space-y-3">
        <SectionHeader
          icon={<FiInfo size={18} />}
          iconColor="#2196F3"
          title="اطلاعات تکمیلی (اختیاری)"
        />
        <Input
          label="شماره تماس سالن"
          placeholder="مثال: ۰۲۱-۲۲۳۳۴۴۵۵"
          value={formData.phone}
          onChangeText={(t) => onUpdate('phone', t)}
        />
        <Input
          label="ساعات کاری"
          placeholder="مثال: شنبه تا پنج‌شنبه ۹ الی ۲۰"
          value={formData.workingHours}
          onChangeText={(t) => onUpdate('workingHours', t)}
        />
        <Input
          label="درباره کسب‌وکار"
          placeholder="توضیحاتی درباره خدمات و تجربه سالن..."
          value={formData.about}
          onChangeText={(t) => onUpdate('about', t)}
          multiline
        />
      </div>

      {/* دکمه ثبت نهایی */}
      {isFinalStep && (
        <Button
          title={submitting ? 'در حال ثبت...' : 'ثبت نهایی کسب‌وکار'}
          onPress={onSubmit}
          loading={submitting}
          disabled={!isValid || submitting}
          variant="primary"
          size="lg"
          fullWidth
          icon={<FiSave size={18} color="#fff" />}
          iconPosition="right"
        />
      )}
    </div>
  );
}
