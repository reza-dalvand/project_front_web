'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiStore,
  FiMapPin,
  FiPhone,
  FiClock,
  FiCheck,
  FiAlertCircle,
  FiTrash2,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Input from '@/components/common/Input';
import Dropdown from '@/components/common/Dropdown';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import MapPicker from '@/components/common/MapPicker';
import ImageUploader from '@/components/common/ImageUploader';
import SectionHeader from '@/components/common/SectionHeader';
import { PROVINCES, CITIES } from '@/constants/exploreFilters';

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

export default function BusinessSettingsPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const businessData = useBusinessStore((s) => s.businessData);
  const updateBusinessInfo = useBusinessStore((s) => s.updateBusinessInfo);
  const deleteBusiness = useBusinessStore((s) => s.deleteBusiness);

  const [formData, setFormData] = useState({
    name: businessData.name || '',
    categoryId: businessData.categoryId || null,
    provinceId: null,
    cityId: null,
    address: businessData.address || '',
    phone: businessData.phone || '',
    workingHours: businessData.workingHours || '',
    coverUrl: businessData.coverUrl || null,
    location: businessData.location || null,
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }));
  };

  const handleSave = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'نام کسب‌وکار الزامی است';
    if (!formData.categoryId) newErrors.categoryId = 'دسته‌بندی را انتخاب کنید';
    if (!formData.address.trim()) newErrors.address = 'آدرس الزامی است';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSaving(true);
    setTimeout(() => {
      updateBusinessInfo({
        name: formData.name.trim(),
        categoryId: formData.categoryId,
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        workingHours: formData.workingHours.trim(),
        coverUrl: formData.coverUrl,
        location: formData.location,
      });
      setSaving(false);
      router.back();
    }, 800);
  };

  const handleDelete = () => {
    deleteBusiness();
    setDeleteModalVisible(false);
    router.push('/create-business');
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

  return (
    <ScreenWrapper padding={0}>
      <Header title="تنظیمات کسب‌وکار" onBackPress={() => router.back()} />

      <div className="flex-1 overflow-y-auto p-5 pb-32 space-y-6">
        {/* ═══════ کاور کسب‌وکار ═══════ */}
        <div className="space-y-3">
          <SectionHeader
            icon={<FiStore size={18} />}
            iconColor={colors.primary}
            title="تصویر کاور"
          />
          <ImageUploader
            value={formData.coverUrl}
            onChange={(url) => updateField('coverUrl', url)}
            variant="cover"
            hint="تصویر با کیفیت از محیط سالن"
          />
        </div>

        {/* ═══════ اطلاعات پایه ═══════ */}
        <div className="space-y-3">
          <SectionHeader
            icon={<FiStore size={18} />}
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
          </Card>
        </div>

        {/* ═══════ موقعیت مکانی ═══════ */}
        <div className="space-y-3">
          <SectionHeader
            icon={<FiMapPin size={18} />}
            iconColor="#E53935"
            title="موقعیت مکانی"
          />
          <Card variant="elevated" padding={16} radius={18}>
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
          title="ذخیره تغییرات"
          onPress={handleSave}
          loading={saving}
          variant="primary"
          size="lg"
          fullWidth
          icon={<FiCheck size={20} color="#fff" />}
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
                <p className="text-sm font-[Vazir-Bold]" style={{ color: '#E53935' }}>
                  حذف کسب و کار
                </p>
                <p className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
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

      {/* ═══════ مدال تایید حذف ═══════ */}
      {deleteModalVisible && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
          onClick={(e) => e.target === e.currentTarget && setDeleteModalVisible(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-6 flex flex-col items-center gap-4"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#E5393515' }}
            >
              <FiTrash2 size={40} color="#E53935" />
            </div>

            <h3
              className="text-xl font-[Vazir-Bold] text-center"
              style={{ color: colors.textMain }}
            >
              حذف کسب و کار
            </h3>

            <p
              className="text-sm text-center leading-6"
              style={{ color: colors.textSecondary }}
            >
              آیا مطمئن هستید که می‌خواهید کسب‌وکار خود را حذف کنید؟ این عمل قابل بازگشت نیست.
            </p>

            {/* لیست اتفاقات */}
            <div
              className="w-full p-4 rounded-xl space-y-2"
              style={{ backgroundColor: '#E5393508', border: '1px solid #E5393530' }}
            >
              {[
                'تمامی خدمات، نمونه‌کارها و نوبت‌ها حذف می‌شوند',
                'مشتریان دیگر نمی‌توانند از شما نوبت بگیرند',
                'این عمل غیرقابل بازگشت است',
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-xs mt-0.5" style={{ color: '#E53935' }}>
                    •
                  </span>
                  <span
                    className="text-xs font-[Vazir] leading-5 flex-1"
                    style={{ color: colors.textSecondary }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 w-full mt-2">
              <Button
                title="انصراف"
                onPress={() => setDeleteModalVisible(false)}
                variant="outline"
                size="lg"
                className="flex-1"
              />
              <Button
                title="تایید و حذف"
                onPress={handleDelete}
                variant="primary"
                size="lg"
                className="flex-1"
                style={{ backgroundColor: '#E53935' }}
              />
            </div>
          </div>
        </div>
      )}
    </ScreenWrapper>
  );
}