'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { useSafeBack } from '@/hooks/useSafeBack';
import { useBusinessCategories } from '@/hooks/useCategoryOptions';

/**
 * اگر ID دقیق دسته پیش‌فرض «چند منظوره» را می‌دانید، اینجا ست کنید.
 * مثال:
 * const DEFAULT_MULTI_PURPOSE_CATEGORY_ID = '12';
 *
 * اگر خالی باشد، کد سعی می‌کند از لیست دسته‌بندی‌ها بر اساس نام پیدایش کند.
 */
const DEFAULT_MULTI_PURPOSE_CATEGORY_ID = null;

/**
 * برچسب‌های دقیق مورد قبول برای دسته پیش‌فرض.
 * اگر در بک‌اند نام دیگری دارید، اینجا اصلاح کنید.
 */
const DEFAULT_MULTI_PURPOSE_EXACT_LABELS = [
  'خدمات چند منظوره',
  'چند منظوره',
];

/**
 * اگر exact match پیدا نشد، هر دسته‌ای که این کلمه را داشت انتخاب می‌شود.
 */
const DEFAULT_MULTI_PURPOSE_KEYWORD = 'چند منظوره';

/**
 * نرمال‌سازی برچسب برای مقایسه امن‌تر:
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

export default function BusinessSettingsPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();
  const safeGoBack = useSafeBack('/manage');

  const updateBusinessInfo = useBusinessStore((s) => s.updateBusinessInfo);
  const fetchBusinessDetail = useBusinessStore((s) => s.fetchBusinessDetail);
  const updateBusinessApi = useBusinessStore((s) => s.updateBusinessApi);
  const deleteBusinessApi = useBusinessStore((s) => s.deleteBusinessApi);

  const { categories: businessCategories } = useBusinessCategories();

  /**
   * پیدا کردن ID دسته پیش‌فرض چند منظوره.
   *
   * اولویت:
   * 1. DEFAULT_MULTI_PURPOSE_CATEGORY_ID اگر ست شده باشد
   * 2. تطابق دقیق با یکی از برچسب‌های DEFAULT_MULTI_PURPOSE_EXACT_LABELS
   * 3. شامل بودن کلمه «چند منظوره»
   */
  const defaultCategoryId = useMemo(() => {
    if (DEFAULT_MULTI_PURPOSE_CATEGORY_ID != null) {
      return String(DEFAULT_MULTI_PURPOSE_CATEGORY_ID);
    }

    if (!Array.isArray(businessCategories) || businessCategories.length === 0) {
      return null;
    }

    const exactNormalizedLabels = DEFAULT_MULTI_PURPOSE_EXACT_LABELS.map(normalizeLabel);

    const exactMatch = businessCategories.find((category) =>
      exactNormalizedLabels.includes(normalizeLabel(category?.label))
    );

    if (exactMatch?.id != null) {
      return String(exactMatch.id);
    }

    const keywordNormalized = normalizeLabel(DEFAULT_MULTI_PURPOSE_KEYWORD);

    const keywordMatch = businessCategories.find((category) =>
      normalizeLabel(category?.label).includes(keywordNormalized)
    );

    return keywordMatch?.id != null ? String(keywordMatch.id) : null;
  }, [businessCategories]);

  const [formData, setFormData] = useState({
    name: '',
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

  useEffect(() => {
    const loadBusinessData = async () => {
      setIsLoading(true);
      try {
        await fetchBusinessDetail();
        const data = useBusinessStore.getState().businessData;

        setFormData({
          name: data.name || '',
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

  const validate = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      newErrors.name = 'نام کسب‌وکار الزامی است (حداقل ۳ کاراکتر)';
    }

    if (!formData.address.trim() || formData.address.trim().length < 10) {
      newErrors.address = 'آدرس باید حداقل ۱۰ کاراکتر باشد';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSave = async () => {
    if (!validate()) return;

    /**
     * نوع کسب‌وکار در UI نمایش داده نمی‌شود،
     * اما هنگام ذخیره باید حتماً دسته پیش‌فرض چند منظوره ارسال شود.
     */
    if (!defaultCategoryId) {
      showToast(
        'نوع پیش‌فرض کسب‌وکار در سامانه یافت نشد. لطفاً بعداً تلاش کنید یا تنظیمات دسته‌بندی را بررسی کنید.',
        'error'
      );
      return;
    }

    setSaving(true);

    try {
      await updateBusinessApi({
        name: formData.name.trim(),
        category: defaultCategoryId,
        address: formData.address.trim(),
        phone: formData.phone,
        working_hours: formData.workingHours,
        about: formData.about,
      });

      updateBusinessInfo({
        name: formData.name.trim(),
        categoryId: defaultCategoryId,
        address: formData.address.trim(),
        phone: formData.phone,
        workingHours: formData.workingHours,
        about: formData.about,
      });

      showToast('✓ تغییرات با موفقیت ذخیره شد', 'success');
    } catch (error) {
      showToast(error.message || 'خطا در ذخیره تغییرات', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleteModalVisible(false);

    try {
      await deleteBusinessApi();
      showToast('کسب‌وکار حذف شد', 'info');
      router.replace('/create-business');
    } catch (error) {
      showToast(error.message || 'خطا در حذف کسب‌وکار', 'error');
    }
  };

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
        <Header title="تنظیمات کسب‌وکار" onBackPress={safeGoBack} />
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner label="در حال بارگذاری اطلاعات..." />
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper padding={0}>
      <Header title="تنظیمات کسب‌وکار" onBackPress={safeGoBack} />

      <div className="flex-1 overflow-y-auto p-5 pb-32 space-y-6">
        <BusinessImagesSection
          coverUrl={formData.coverUrl}
          ownerPhoto={formData.ownerPhoto}
          onCoverChange={(url) => updateField('coverUrl', url)}
          onOwnerPhotoChange={(url) => updateField('ownerPhoto', url)}
        />

        <BusinessBasicInfoSection
          name={formData.name}
          phone={formData.phone}
          workingHours={formData.workingHours}
          about={formData.about}
          errors={errors}
          onNameChange={(t) => updateField('name', t)}
          onPhoneChange={(t) => updateField('phone', t)}
          onWorkingHoursChange={(t) => updateField('workingHours', t)}
          onAboutChange={(t) => updateField('about', t)}
        />

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

        <BusinessDangerZone onDeletePress={() => setDeleteModalVisible(true)} />
      </div>

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