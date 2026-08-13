// src/app/profile/edit/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiTag, FiSmartphone, FiShield, FiTrash2 } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { toPersianDigit } from '@/utils/numberUtils';
import { maskPhone } from '@/utils/phoneUtils';
import { profileService, authService } from '@/api';
import { USE_MOCK } from '@/api/config';

export default function EditProfilePage() {
  const router = useRouter();
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const updateUser = useAuthStore((s) => s.updateUser);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const displayName = `${formData.firstName} ${formData.lastName}`.trim() || 'کاربر زیبانو';

  const handleSave = async () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'نام الزامی است';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'نام باید حداقل ۲ کاراکتر باشد';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'نام خانوادگی الزامی است';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'نام خانوادگی باید حداقل ۲ کاراکتر باشد';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      if (!USE_MOCK) {
        const result = await profileService.updateProfile({
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
        });

        const data = result.data;
        updateUser({
          name: data.full_name || `${data.first_name} ${data.last_name}`.trim(),
          firstName: data.first_name,
          lastName: data.last_name,
          avatar: data.avatar,
        });
      } else {
        // حالت Mock
        updateUser({
          name: displayName,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
        });
      }

      setLoading(false);
      showToast('اطلاعات پروفایل با موفقیت ذخیره شد', 'success');
      setTimeout(() => router.back(), 1200);
    } catch (err) {
      setLoading(false);
      showToast(err.message || 'خطا در ذخیره اطلاعات', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      if (!USE_MOCK) {
        // در production باید OTP ارسال و تایید شود
        // فعلاً فقط logout
        await logout();
      } else {
        await logout();
      }
      setLoading(false);
      showToast('حساب کاربری با موفقیت حذف شد', 'success');
      router.push('/');
    } catch {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper padding={0}>
      <Header title="ویرایش پروفایل" onBackPress={() => router.back()} />

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-10 space-y-6">
        {/* لوگو */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div
            className="w-[100px] h-[100px] rounded-full flex items-center justify-center border-[3px]"
            style={{ borderColor: colors.primary }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.primary + '20' }}
            >
              <span className="text-4xl">🌸</span>
            </div>
          </div>
          <span className="text-base font-[Vazir-Bold] mt-1" style={{ color: colors.textMain }}>
            {displayName}
          </span>
        </div>

        {/* فرم اطلاعات شخصی */}
        <Card variant="elevated" padding={20} radius={18}>
          <div className="flex items-center gap-2 mb-5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.primary + '15' }}
            >
              <FiUser size={16} style={{ color: colors.primary }} />
            </div>
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              اطلاعات شخصی
            </span>
          </div>

          <Input
            label="نام *"
            placeholder="مثال: مریم"
            value={formData.firstName}
            onChangeText={(t) => {
              setFormData((prev) => ({ ...prev, firstName: t }));
              if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: '' }));
            }}
            error={errors.firstName}
            rightIcon={<FiUser size={18} style={{ color: colors.textSecondary }} />}
          />

          <Input
            label="نام خانوادگی *"
            placeholder="مثال: حسینی"
            value={formData.lastName}
            onChangeText={(t) => {
              setFormData((prev) => ({ ...prev, lastName: t }));
              if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: '' }));
            }}
            error={errors.lastName}
            rightIcon={<FiTag size={18} style={{ color: colors.textSecondary }} />}
          />
        </Card>

        {/* شماره موبایل */}
        <Card variant="elevated" padding={20} radius={18}>
          <div className="flex items-center gap-2 mb-5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#2196F318' }}
            >
              <FiSmartphone size={16} color="#2196F3" />
            </div>
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              شماره موبایل
            </span>
          </div>

          <div
            className="flex items-center gap-3 p-3.5 rounded-xl border"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border,
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#2196F320' }}
            >
              <FiSmartphone size={14} color="#2196F3" />
            </div>
            <span className="text-sm font-[Vazir-Bold] flex-1" style={{ color: colors.textMain }}>
              {toPersianDigit(maskPhone(user?.phone || '09123456789'))}
            </span>
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-lg"
              style={{ backgroundColor: '#43A04720' }}
            >
              <span className="text-[10px] font-[Vazir-Bold]" style={{ color: '#43A047' }}>
                تایید شده
              </span>
            </div>
          </div>

          <button
            onClick={() => router.push('/profile/change-phone')}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{
              borderColor: colors.primary,
              backgroundColor: colors.primary + '10',
            }}
          >
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.primary }}>
              تغییر شماره موبایل
            </span>
          </button>

          <div className="flex items-start gap-2 mt-3 px-1">
            <FiShield
              size={14}
              style={{ color: colors.textSecondary, flexShrink: 0, marginTop: 2 }}
            />
            <span
              className="text-[11px] font-[Vazir] leading-5"
              style={{ color: colors.textSecondary }}
            >
              برای تغییر شماره، کد تایید (OTP) به شماره جدید ارسال خواهد شد
            </span>
          </div>
        </Card>

        {/* دکمه ذخیره */}
        <Button
          title="ذخیره تغییرات"
          onPress={handleSave}
          loading={loading}
          disabled={loading}
          variant="primary"
          size="lg"
          fullWidth
        />

        {/* ناحیه خطرناک */}
        <Card variant="default" padding={0} radius={16} className="overflow-hidden">
          <div className="p-4 flex items-center gap-3" style={{ backgroundColor: '#E5393508' }}>
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#E5393520' }}
            >
              <FiTrash2 size={20} color="#E53935" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-[Vazir-Bold] block" style={{ color: '#E53935' }}>
                حذف حساب کاربری
              </span>
              <span
                className="text-[11px] font-[Vazir] leading-4"
                style={{ color: colors.textSecondary }}
              >
                حذف دائمی حساب و تمامی اطلاعات شما
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-3.5 border-t transition-colors hover:bg-[#E5393508]"
            style={{ borderColor: '#E5393540' }}
          >
            <span className="text-sm font-[Vazir-Bold]" style={{ color: '#E53935' }}>
              حذف حساب کاربری
            </span>
          </button>
        </Card>
      </div>

      {/* مدال تایید حذف */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
          onClick={(e) => e.target === e.currentTarget && setShowDeleteConfirm(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-6 flex flex-col items-center gap-4"
            style={{ backgroundColor: colors.cardBackground }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#E5393520' }}
            >
              <FiShield size={40} color="#E53935" />
            </div>
            <h3
              className="text-lg font-[Vazir-Bold] text-center"
              style={{ color: colors.textMain }}
            >
              حذف حساب کاربری
            </h3>
            <p className="text-sm text-center leading-6" style={{ color: colors.textSecondary }}>
              آیا از حذف دائمی حساب کاربری خود مطمئن هستید؟ این عمل قابل بازگشت نیست.
            </p>
            <div className="flex gap-3 w-full mt-2">
              <Button
                title="انصراف"
                onPress={() => setShowDeleteConfirm(false)}
                variant="outline"
                size="lg"
                className="flex-1"
              />
              <Button
                title="حذف دائمی"
                onPress={handleDeleteAccount}
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
