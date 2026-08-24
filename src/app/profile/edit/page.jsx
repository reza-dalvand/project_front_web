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
import { OTP_CONFIG } from '@/api/config';

const OTP_LENGTH = OTP_CONFIG.CODE_LENGTH;
const RESEND_SECONDS = OTP_CONFIG.RESEND_COOLDOWN_SECONDS;

/**
 * ✅ FIX فاز ۲: ناوبری ایمن به صفحه قبلی
 * اگر تاریخچه خالی باشد (کاربر مستقیم وارد شده)، به خانه برود
 */
const safeNavigateBack = (router) => {
  if (typeof window !== 'undefined' && window.history.length > 1) {
    router.back();
  } else {
    router.replace('/');
  }
};

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteOtp, setShowDeleteOtp] = useState(false);
  const [deleteOtp, setDeleteOtp] = useState(['', '', '', '', '']);
  const [deleteOtpError, setDeleteOtpError] = useState('');
  const [deleteOtpLoading, setDeleteOtpLoading] = useState(false);
  const [deleteTimer, setDeleteTimer] = useState(RESEND_SECONDS);
  const [deleteCanResend, setDeleteCanResend] = useState(false);

  useEffect(() => {
    if (!showDeleteOtp || deleteTimer <= 0) {
      if (showDeleteOtp) setDeleteCanResend(true);
      return;
    }
    const interval = setInterval(() => setDeleteTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [showDeleteOtp, deleteTimer]);

  // ═══ ذخیره پروفایل ═══
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
      await profileService.updateProfile({
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
      });
      updateUser({
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      });
      completeProfile();
      setLoading(false);
      showToast('اطلاعات پروفایل با موفقیت ذخیره شد', 'success');

      // ✅ FIX فاز ۲: بررسی پارامتر خوشامدگویی
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('welcome') === '1') {
          router.replace('/');
          return;
        }
      }

      // ✅ FIX فاز ۲: ناوبری ایمن
      safeNavigateBack(router);
    } catch (err) {
      setLoading(false);
      showToast(err.message || 'خطا در ذخیره اطلاعات', 'error');
    }
  };

  // ═══ شروع حذف حساب ═══
  const handleStartDelete = async () => {
    setShowDeleteConfirm(false);
    setDeleteOtp(['', '', '', '', '']);
    setDeleteOtpError('');
    setDeleteOtpLoading(false);
    setDeleteTimer(RESEND_SECONDS);
    setDeleteCanResend(false);
    try {
      await authService.sendDeleteAccountOTP();
      setShowDeleteOtp(true);
      showToast('کد تایید حذف حساب ارسال شد', 'success');
    } catch (err) {
      showToast(err.message || 'خطا در ارسال کد تایید', 'error');
    }
  };

  // ═══ تایید حذف حساب ═══
  const handleConfirmDelete = async () => {
    const code = deleteOtp.join('');
    if (code.length < OTP_LENGTH) {
      setDeleteOtpError(`کد ${OTP_LENGTH} رقمی را کامل وارد کنید`);
      return;
    }
    setDeleteOtpLoading(true);
    setDeleteOtpError('');
    try {
      await authService.deleteAccount(code);
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

  const handleResendDeleteOtp = async () => {
    try {
      await authService.sendDeleteAccountOTP();
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
      {/* ✅ FIX فاز ۲: دکمه بازگشت هم ایمن شد */}
      <Header title="ویرایش پروفایل" onBackPress={() => safeNavigateBack(router)} />
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-10 space-y-6">
        <ProfileAvatarSection userName={user?.name} />
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
        <PhoneSection
          phone={user?.phone}
          onChangePhonePress={() => router.push('/profile/change-phone')}
        />
        <Button
          title="ذخیره تغییرات"
          onPress={handleSave}
          loading={loading}
          disabled={loading}
          variant="primary"
          size="lg"
          fullWidth
        />
        <DangerZone onDeletePress={() => setShowDeleteConfirm(true)} />
      </div>
      <DeleteConfirmModal
        visible={showDeleteConfirm}
        onConfirm={handleStartDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
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
