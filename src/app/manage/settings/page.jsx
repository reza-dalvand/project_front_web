// src/app/manage/settings/page.jsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import BusinessImagesSection from '@/components/manageBusiness/settings/BusinessImagesSection';
import BusinessBasicInfoSection from '@/components/manageBusiness/settings/BusinessBasicInfoSection';
import BusinessLocationSection from '@/components/manageBusiness/settings/BusinessLocationSection';
import BusinessDangerZone from '@/components/manageBusiness/settings/BusinessDangerZone';
import { USE_MOCK } from '@/api/config';

export default function BusinessSettingsPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();

  // Store
  const businessData = useBusinessStore((s) => s.businessData);
  const updateBusinessInfo = useBusinessStore((s) => s.updateBusinessInfo);
  const deleteBusiness = useBusinessStore((s) => s.deleteBusiness);
  const fetchBusinessDetail = useBusinessStore((s) => s.fetchBusinessDetail);
  const updateBusinessApi = useBusinessStore((s) => s.updateBusinessApi);
  const deleteBusinessApi = useBusinessStore((s) => s.deleteBusinessApi);

  // State فرم
  const [formData, setFormData] = useState({
    name: '',
    categoryId: null,
    provinceId: null,
    cityId: null,
    address: '',
    phone: '',
    workingHours: '',
    about: '',
    coverUrl: null,
    ownerPhoto: null,
    location: null,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // ═══════ بارگذاری اولیه داده‌ها ═══════
  useEffect(() => {
    const loadBusinessData = async () => {
      setIsLoading(true);
      try {
        if (!USE_MOCK) {
          await fetchBusinessDetail();
        }
        const data = useBusinessStore.getState().businessData;
        setFormData({
          name: data.name || '',
          categoryId: data.categoryId || null,
          provinceId: data.provinceId || null,
          cityId: data.cityId || null,
          address: data.address || '',
          phone: data.phone || '',
          workingHours: data.workingHours || '',
          about: data.about || '',
          coverUrl: data.coverUrl || null,
          ownerPhoto: data.ownerPhoto || null,
          location: data.location || null,
        });
      } catch (error) {
        console.error('Failed to load business data:', error);
        showToast('خطا در بارگذاری اطلاعات کسب‌وکار', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    loadBusinessData();
  }, [fetchBusinessDetail, showToast]);

  // ═══════ آپدیت فیلد ═══════
  const updateField = useCallback((key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  }, []);

  const handleProvinceChange = (provinceId) => {
    updateField('provinceId', provinceId);
    updateField('cityId', null);
    updateField('location', null);
  };

  // ═══════ اعتبارسنجی ═══════
  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 3) {
      newErrors.name = 'نام کسب‌وکار الزامی است (حداقل ۳ کاراکتر)';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'نوع کسب‌وکار را انتخاب کنید';
    }
    if (!formData.address.trim() || formData.address.trim().length < 10) {
      newErrors.address = 'آدرس باید حداقل ۱۰ کاراکتر باشد';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // ═══════ ذخیره تغییرات ═══════
  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (!USE_MOCK) {
        await updateBusinessApi({
          name: formData.name.trim(),
          category: formData.categoryId,
          address: formData.address.trim(),
          phone: formData.phone,
          working_hours: formData.workingHours,
          about: formData.about,
        });
      }
      updateBusinessInfo({
        name: formData.name.trim(),
        categoryId: formData.categoryId,
        address: formData.address.trim(),
        phone: formData.phone,
        workingHours: formData.workingHours,
        about: formData.about,
      });
      setSaving(false);
      showToast('✓ تغییرات با موفقیت ذخیره شد', 'success');
    } catch (error) {
      setSaving(false);
      showToast(error.message || 'خطا در ذخیره تغییرات', 'error');
    }
  };

  // ═══════ حذف کسب‌وکار ═══════
  const handleDeleteConfirm = async () => {
    setDeleteModalVisible(false);
    try {
      if (!USE_MOCK) {
        await deleteBusinessApi();
      } else {
        deleteBusiness();
      }
      showToast('کسب‌وکار حذف شد', 'info');
      router.push('/create-business');
    } catch (error) {
      showToast(error.message || 'خطا در حذف کسب‌وکار', 'error');
    }
  };

  // ═══════ رندر ═══════
  if (!isAuthenticated) {
    return (
      <ScreenWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <p style={{ color: colors.textMain }}>در حال بارگذاری...</p>
        </div>
      </ScreenWrapper>
    );
  }

  if (isLoading) {
    return (
      <ScreenWrapper padding={0}>
        <Header title="تنظیمات کسب‌وکار" onBackPress={() => router.push('/manage')} />
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner label="در حال بارگذاری اطلاعات..." />
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper padding={0}>
      <Header title="تنظیمات کسب‌وکار" onBackPress={() => router.push('/manage')} />
      <div className="flex-1 overflow-y-auto p-5 pb-32 space-y-6">
        {/* تصاویر */}
        <BusinessImagesSection
          coverUrl={formData.coverUrl}
          ownerPhoto={formData.ownerPhoto}
          onCoverChange={(url) => updateField('coverUrl', url)}
          onOwnerPhotoChange={(url) => updateField('ownerPhoto', url)}
        />

        {/* اطلاعات پایه */}
        <BusinessBasicInfoSection
          name={formData.name}
          categoryId={formData.categoryId}
          phone={formData.phone}
          workingHours={formData.workingHours}
          about={formData.about}
          errors={errors}
          onNameChange={(t) => updateField('name', t)}
          onCategoryChange={(val) => updateField('categoryId', val)}
          onPhoneChange={(t) => updateField('phone', t)}
          onWorkingHoursChange={(t) => updateField('workingHours', t)}
          onAboutChange={(t) => updateField('about', t)}
        />

        {/* موقعیت مکانی */}
        <BusinessLocationSection
          provinceId={formData.provinceId}
          cityId={formData.cityId}
          address={formData.address}
          location={formData.location}
          errors={errors}
          onProvinceChange={handleProvinceChange}
          onCityChange={(val) => updateField('cityId', val)}
          onAddressChange={(t) => updateField('address', t)}
          onLocationSelect={(location) => updateField('location', location)}
        />

        {/* دکمه ذخیره */}
        <Button
          title={saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          onPress={handleSave}
          loading={saving}
          disabled={saving}
          variant="primary"
          size="lg"
          fullWidth
          icon={<FiSave size={18} color="#fff" />}
          iconPosition="right"
        />

        {/* ناحیه خطرناک */}
        <BusinessDangerZone onDeletePress={() => setDeleteModalVisible(true)} />
      </div>

      {/* ConfirmDialog حذف */}
      <ConfirmDialog
        visible={deleteModalVisible}
        title="حذف کسب و کار"
        message="آیا مطمئن هستید که می‌خواهید کسب‌وکار خود را حذف کنید؟ این عمل قابل بازگشت نیست و تمام اطلاعات مرتبط حذف خواهد شد."
        confirmText="حذف دائمی"
        cancelText="انصراف"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </ScreenWrapper>
  );
}