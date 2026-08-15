// src/app/profile/edit/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import ProfileAvatarSection from '@/components/profile/edit/ProfileAvatarSection';
import ProfileFormSection from '@/components/profile/edit/ProfileFormSection';
import PhoneSection from '@/components/profile/edit/PhoneSection';
import DangerZone from '@/components/profile/edit/DangerZone';
import DeleteConfirmModal from '@/components/profile/edit/DeleteConfirmModal';
import DeleteOtpModal from '@/components/profile/edit/DeleteOtpModal';
import { profileService, authService } from '@/api';
import { USE_MOCK } from '@/api/config';
import { OTP_CONFIG } from '@/api/config';

const OTP_LENGTH = OTP_CONFIG.CODE_LENGTH;
const RESEND_SECONDS = OTP_CONFIG.RESEND_COOLDOWN_SECONDS;

export default function EditProfilePage() {
  const router = useRouter();
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const updateUser = useAuthStore((s) => s.updateUser);
  const completeProfile = useAuthStore((s) => s.completeProfile);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ─── State حذف حساب با OTP ───
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteOtp, setShowDeleteOtp] = useState(false);
  const [deleteOtp, setDeleteOtp] = useState(['', '', '', '', '']);
  const [deleteOtpError, setDeleteOtpError] = useState('');
  const [deleteOtpLoading, setDeleteOtpLoading] = useState(false);
  const [deleteTimer, setDeleteTimer] = useState(RESEND_SECONDS);
  const [deleteCanResend, setDeleteCanResend] = useState(false);

  // تایمر حذف
  useEffect(() => {
    if (!showDeleteOtp || deleteTimer <= 0) {
      if (showDeleteOtp) setDeleteCanResend(true);
      return;
    }
    const interval = setInterval(() => setDeleteTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [showDeleteOtp, deleteTimer]);

  // ─── ذخیره پروفایل ───
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
        await profileService.updateProfile({
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
        });
      }
      updateUser({
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      });
      completeProfile();
      setLoading(false);
      showToast('اطلاعات پروفایل با موفقیت ذخیره شد', 'success');
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('welcome') === '1') {
          router.replace('/');
          return;
        }
      }
      router.back();
    } catch (err) {
      setLoading(false);
      showToast(err.message || 'خطا در ذخیره اطلاعات', 'error');
    }
  };

  // ─── شروع فرآیند حذف ───
  const handleStartDelete = async () => {
    setShowDeleteConfirm(false);
    setDeleteOtp(['', '', '', '', '']);
    setDeleteOtpError('');
    setDeleteOtpLoading(false);
    setDeleteTimer(RESEND_SECONDS);
    setDeleteCanResend(false);
    try {
      if (!USE_MOCK) {
        await authService.sendDeleteAccountOTP();
      }
      setShowDeleteOtp(true);
      showToast('کد تایید حذف حساب ارسال شد', 'success');
    } catch (err) {
      showToast(err.message || 'خطا در ارسال کد تایید', 'error');
    }
  };

  // ─── تایید حذف ───
  const handleConfirmDelete = async () => {
    const code = deleteOtp.join('');
    if (code.length < OTP_LENGTH) {
      setDeleteOtpError(`کد ${OTP_LENGTH} رقمی را کامل وارد کنید`);
      return;
    }
    setDeleteOtpLoading(true);
    setDeleteOtpError('');
    try {
      if (!USE_MOCK) {
        await authService.deleteAccount(code);
      }
      setDeleteOtpLoading(false);
      setShowDeleteOtp(false);
      showToast('حساب کاربری با موفقیت حذف شد', 'success');
      await logout();
      router.push('/');
    } catch (err) {
      setDeleteOtpLoading(false);
      setDeleteOtpError(err.message || 'کد وارد شده صحیح نیست');
      setDeleteOtp(['', '', '', '', '']);
    }
  };

  // ─── ارسال مجدد OTP حذف ───
  const handleResendDeleteOtp = async () => {
    try {
      if (!USE_MOCK) {
        await authService.sendDeleteAccountOTP();
      }
      setDeleteTimer(RESEND_SECONDS);
      setDeleteCanResend(false);
      setDeleteOtp(['', '', '', '', '']);
      showToast('کد جدید ارسال شد', 'success');
    } catch (err) {
      showToast(err.message || 'خطا در ارسال مجدد', 'error');
    }
  };

  return (
    <ScreenWrapper padding={0}>
      <Header title="ویرایش پروفایل" onBackPress={() => router.back()} />
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-10 space-y-6">
        {/* لوگو */}
        <ProfileAvatarSection userName={user?.name} />

        {/* فرم اطلاعات شخصی */}
        <ProfileFormSection
          firstName={formData.firstName}
          lastName={formData.lastName}
          errors={errors}
          onFirstNameChange={(t) => {
            setFormData((prev) => ({ ...prev, firstName: t }));
            if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: '' }));
          }}
          onLastNameChange={(t) => {
            setFormData((prev) => ({ ...prev, lastName: t }));
            if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: '' }));
          }}
        />

        {/* شماره موبایل */}
        <PhoneSection
          phone={user?.phone}
          onChangePhonePress={() => router.push('/profile/change-phone')}
        />

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
        <DangerZone onDeletePress={() => setShowDeleteConfirm(true)} />
      </div>

      {/* مدال تایید حذف */}
      <DeleteConfirmModal
        visible={showDeleteConfirm}
        onConfirm={handleStartDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* مدال OTP حذف */}
      <DeleteOtpModal
        visible={showDeleteOtp}
        otp={deleteOtp}
        onOtpChange={(newOtp) => {
          setDeleteOtp(newOtp);
          if (deleteOtpError) setDeleteOtpError('');
        }}
        error={deleteOtpError}
        loading={deleteOtpLoading}
        timer={deleteTimer}
        canResend={deleteCanResend}
        phone={user?.phone}
        otpLength={OTP_LENGTH}
        onConfirm={handleConfirmDelete}
        onResend={handleResendDeleteOtp}
        onClose={() => setShowDeleteOtp(false)}
      />
    </ScreenWrapper>
  );
}