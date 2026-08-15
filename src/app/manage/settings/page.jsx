// src/app/manage/settings/page.jsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiBriefcase,
  FiMapPin,
  FiPhone,
  FiClock,
  FiCheck,
  FiAlertCircle,
  FiTrash2,
  FiUser,
  FiSave,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Input from '@/components/common/Input';
import Dropdown from '@/components/common/Dropdown';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import ImageUploader from '@/components/common/ImageUploader';
import SectionHeader from '@/components/common/SectionHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { PROVINCES, CITIES } from '@/constants/exploreFilters';
import MapPicker from '@/components/common/MapPicker';
import { USE_MOCK } from '@/api/config';

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
        // پر کردن فرم از store
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

      // آپدیت store محلی
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
        {/* ═══════ تصاویر ═══════ */}
        <div className="space-y-3">
          <SectionHeader
            icon={<FiBriefcase size={18} />}
            iconColor={colors.primary}
            title="تصاویر کسب‌وکار"
          />

          {/* کاور */}
          <Card variant="elevated" padding={16} radius={18}>
            <label
              className="block text-sm mb-2 text-right font-[Vazir-Medium]"
              style={{ color: colors.textSecondary }}
            >
              تصویر کاور سالن
            </label>
            <ImageUploader
              value={formData.coverUrl}
              onChange={(url) => updateField('coverUrl', url)}
              variant="cover"
              hint="تصویر با کیفیت از محیط سالن (۱۲۰۰×۴۰۰)"
            />
          </Card>

          {/* عکس صاحب کسب‌وکار */}
          <Card variant="elevated" padding={16} radius={18}>
            <label
              className="block text-sm mb-2 text-right font-[Vazir-Medium]"
              style={{ color: colors.textSecondary }}
            >
              تصویر صاحب کسب‌وکار <span style={{ color: '#E53935' }}>*</span>
            </label>
            <div className="flex flex-col items-center gap-3">
              <ImageUploader
                value={formData.ownerPhoto}
                onChange={(url) => updateField('ownerPhoto', url)}
                variant="avatar"
                error={errors.ownerPhoto}
              />
              <p
                className="text-xs font-[Vazir] text-center"
                style={{ color: colors.textSecondary }}
              >
                عکس واقعی مدیر کسب‌وکار (جهت احراز هویت و اعتماد مشتریان)
              </p>
            </div>
          </Card>
        </div>

        {/* ═══════ اطلاعات پایه ═══════ */}
        <div className="space-y-3">
          <SectionHeader
            icon={<FiBriefcase size={18} />}
            iconColor={colors.primary}
            title="اطلاعات پایه"
          />

          <Card variant="elevated" padding={16} radius={18}>
            <Input
              label="نام کسب‌وکار *"
              placeholder="مثال: سالن زیبایی نیلارام"
              value={formData.name}
              onChangeText={(t) => updateField('name', t)}
              error={errors.name}
            />

            <Dropdown
              label="نوع کسب‌وکار *"
              placeholder="انتخاب نوع کسب‌وکار"
              value={formData.categoryId}
              options={BUSINESS_CATEGORIES}
              onSelect={(val) => updateField('categoryId', val)}
            />
            {errors.categoryId && (
              <div className="flex items-center gap-1 mt-[-8px] mb-2 px-1">
                <FiAlertCircle size={14} color="#E53935" />
                <span className="text-xs font-[Vazir]" style={{ color: '#E53935' }}>
                  {errors.categoryId}
                </span>
              </div>
            )}

            <Input
              label="شماره تماس"
              placeholder="مثال: ۰۲۱-۲۲۳۳۴۴۵۵"
              value={formData.phone}
              onChangeText={(t) => updateField('phone', t)}
              rightIcon={<FiPhone size={18} color={colors.textSecondary} />}
            />

            <Input
              label="ساعات کاری"
              placeholder="مثال: شنبه تا پنج‌شنبه ۱۰ الی ۲۰"
              value={formData.workingHours}
              onChangeText={(t) => updateField('workingHours', t)}
              rightIcon={<FiClock size={18} color={colors.textSecondary} />}
            />

            <Input
              label="درباره کسب‌وکار"
              placeholder="توضیحاتی درباره خدمات و تجربه سالن..."
              value={formData.about}
              onChangeText={(t) => updateField('about', t)}
              multiline
            />
          </Card>
        </div>

        {/* ═══════ موقعیت مکانی ═══════ */}
        <div className="space-y-3">
          <SectionHeader icon={<FiMapPin size={18} />} iconColor="#E53935" title="موقعیت مکانی" />

          <Card variant="elevated" padding={16} radius={18}>
            <Dropdown
              label="استان *"
              placeholder="انتخاب استان"
              value={formData.provinceId}
              options={PROVINCES}
              onSelect={handleProvinceChange}
            />

            <Dropdown
              label="شهر *"
              placeholder={formData.provinceId ? 'انتخاب شهر' : 'ابتدا استان را انتخاب کنید'}
              value={formData.cityId}
              options={formData.provinceId ? CITIES[formData.provinceId] || [] : []}
              onSelect={(val) => updateField('cityId', val)}
              disabled={!formData.provinceId}
            />

            <Input
              label="آدرس دقیق *"
              placeholder="خیابان، کوچه، پلاک، واحد..."
              value={formData.address}
              onChangeText={(t) => updateField('address', t)}
              error={errors.address}
              multiline
            />

            <MapPicker
              initialLocation={formData.location}
              onLocationSelect={(location) => updateField('location', location)}
            />
          </Card>
        </div>

        {/* ═══════ دکمه ذخیره ═══════ */}
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

        {/* ═══════ ناحیه خطرناک ═══════ */}
        <div className="pt-6">
          <Card
            variant="default"
            padding={0}
            radius={16}
            className="border-2 overflow-hidden"
            style={{ borderColor: '#E5393540', backgroundColor: '#E5393508' }}
          >
            <div className="p-4 flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#E5393520' }}
              >
                <FiTrash2 size={22} color="#E53935" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-[Vazir-Bold] block" style={{ color: '#E53935' }}>
                  حذف کسب و کار
                </p>
                <p
                  className="text-[11px] font-[Vazir] leading-4"
                  style={{ color: colors.textSecondary }}
                >
                  حذف دائمی کسب‌وکار و تمام اطلاعات مرتبط
                </p>
              </div>
            </div>
            <button
              onClick={() => setDeleteModalVisible(true)}
              className="w-full py-3.5 border-t transition-colors hover:bg-[#E5393508]"
              style={{ borderColor: '#E5393540' }}
            >
              <span className="text-sm font-[Vazir-Bold]" style={{ color: '#E53935' }}>
                حذف کسب و کار
              </span>
            </button>
          </Card>
        </div>
      </div>

      {/* ═══════ ConfirmDialog حذف ═══════ */}
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
