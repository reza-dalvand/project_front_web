// src/components/createbusiness/BasicInfoStep.jsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { FiSave } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import ProgressCard from './basicinfo/ProgressCard';
import ImageUploadSection from './basicinfo/ImageUploadSection';
import BusinessInfoSection from './basicinfo/BusinessInfoSection';
import LocationSection from './basicinfo/LocationSection';
import { locationsService, categoriesService } from '@/api';
import { PROVINCES, CITIES } from '@/constants/exploreFilters';

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
  const [categories, setCategories] = useState([]);
  const [provinces, setProvinces] = useState(PROVINCES);
  const [cities, setCities] = useState([]);

  // ─── دریافت داده‌ها از API ───
  useEffect(() => {
    const fetchData = async () => {
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
      'name',
      'categoryId',
      'provinceId',
      'cityId',
      'address',
      'phone',
      'workingHours',
      'about',
      'coverUrl',
      'ownerPhoto',
      'location',
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
      if (!error)
        setErrors((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
    }
  };

  const markTouched = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

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
      name: true,
      categoryId: true,
      provinceId: true,
      cityId: true,
      address: true,
      phone: true,
      workingHours: true,
      about: true,
      coverUrl: true,
      ownerPhoto: true,
      location: true,
    });
    if (!isValid) return;
    onSubmit?.(buildFormData());
  };

  // ─── شمارنده فیلدهای پرشده ───
  const filledCount = [
    formData.name,
    formData.categoryId,
    formData.provinceId,
    formData.cityId,
    formData.address,
    formData.phone,
    formData.workingHours,
    formData.about,
    formData.coverUrl,
    formData.ownerPhoto,
    formData.location,
  ].filter(Boolean).length;
  const totalCount = 11;

  return (
    <div className="px-5 pt-4 pb-6 space-y-5">
      {/* نوار پیشرفت */}
      <ProgressCard filledCount={filledCount} totalCount={totalCount} />

      {/* بخش تصاویر */}
      <ImageUploadSection
        coverUrl={formData.coverUrl}
        ownerPhoto={formData.ownerPhoto}
        errors={errors}
        onCoverChange={(url) => handleFieldChange('coverUrl', url)}
        onOwnerPhotoChange={(url) => handleFieldChange('ownerPhoto', url)}
        onCoverTouched={() => markTouched('coverUrl')}
        onOwnerPhotoTouched={() => markTouched('ownerPhoto')}
      />

      {/* بخش مشخصات */}
      <BusinessInfoSection
        name={formData.name}
        categoryId={formData.categoryId}
        phone={formData.phone}
        workingHours={formData.workingHours}
        about={formData.about}
        errors={errors}
        onNameChange={(t) => handleFieldChange('name', t)}
        onCategoryChange={(val) => handleFieldChange('categoryId', val)}
        onPhoneChange={(t) => handleFieldChange('phone', t)}
        onWorkingHoursChange={(t) => handleFieldChange('workingHours', t)}
        onAboutChange={(t) => handleFieldChange('about', t)}
        onNameTouched={() => markTouched('name')}
        onCategoryTouched={() => markTouched('categoryId')}
        onPhoneTouched={() => markTouched('phone')}
        onWorkingHoursTouched={() => markTouched('workingHours')}
        onAboutTouched={() => markTouched('about')}
      />

      {/* بخش موقعیت مکانی */}
      <LocationSection
        provinceId={formData.provinceId}
        cityId={formData.cityId}
        address={formData.address}
        location={formData.location}
        errors={errors}
        onProvinceChange={handleProvinceChange}
        onCityChange={(val) => {
          handleFieldChange('cityId', val);
          markTouched('cityId');
        }}
        onAddressChange={(t) => handleFieldChange('address', t)}
        onLocationSelect={(location, address) => {
          handleFieldChange('location', location);
          onUpdate('mapAddress', address || '');
          markTouched('location');
        }}
        onAddressTouched={() => markTouched('address')}
      />

      {/* دکمه ثبت نهایی */}
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
