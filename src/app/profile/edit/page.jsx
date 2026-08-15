// src/app/profile/edit/page.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  FiUser,
  FiTag,
  FiSmartphone,
  FiShield,
  FiTrash2,
  FiX,
  FiAlertTriangle,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import OTPInput from '@/components/common/OTPInput';
import { toPersianDigit, toEnglishDigits } from '@/utils/numberUtils';
import { maskPhone } from '@/utils/phoneUtils';
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
  const [deleteOtpCurrentBox, setDeleteOtpCurrentBox] = useState(0);
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

      // اگر از صفحه خوشامدگویی آمده
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
    setDeleteOtpCurrentBox(0);
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
      setDeleteOtpError(`کد ${toPersianDigit(OTP_LENGTH)} رقمی را کامل وارد کنید`);
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
      setDeleteOtpCurrentBox(0);
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
      setDeleteOtpCurrentBox(0);
      showToast('کد جدید ارسال شد', 'success');
    } catch (err) {
      showToast(err.message || 'خطا در ارسال مجدد', 'error');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return toPersianDigit(`${m}:${s.toString().padStart(2, '0')}`);
  };

  return (
    <ScreenWrapper padding={0}>
      <Header title="ویرایش پروفایل" onBackPress={() => router.back()} />

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-10 space-y-6">
        {/* لوگو */}
        <div className="flex flex-col items-center gap-3 mb-4">
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
            {user?.name || 'کاربر زیبانو'}
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

      {/* ═══ مدال تایید حذف ═══ */}
      {showDeleteConfirm &&
        createPortal(
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
              <div
                className="w-full flex items-start gap-2 p-3 rounded-xl border"
                style={{
                  backgroundColor: '#E5393508',
                  borderColor: '#E5393530',
                }}
              >
                <FiAlertTriangle size={14} color="#E53935" className="flex-shrink-0 mt-0.5" />
                <span
                  className="text-xs font-[Vazir] leading-5 flex-1"
                  style={{ color: '#E53935' }}
                >
                  برای تایید حذف، کد OTP به شماره شما ارسال می‌شود
                </span>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <Button
                  title="انصراف"
                  onPress={() => setShowDeleteConfirm(false)}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                />
                <Button
                  title="ارسال کد تایید"
                  onPress={handleStartDelete}
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  style={{ backgroundColor: '#E53935' }}
                />
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ═══ مدال OTP حذف ═══ */}
      {showDeleteOtp &&
        createPortal(
          <div
            className="fixed inset-0 z-[10001] flex items-center justify-center p-6"
            style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
            onClick={(e) => e.target === e.currentTarget && setShowDeleteOtp(false)}
          >
            <div
              className="w-full max-w-sm rounded-3xl p-6 flex flex-col gap-4"
              style={{ backgroundColor: colors.cardBackground }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* هدر */}
              <div className="flex items-center justify-between">
                <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                  کد تایید حذف حساب
                </h3>
                <button
                  onClick={() => setShowDeleteOtp(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.background }}
                >
                  <FiX size={16} style={{ color: colors.textMain }} />
                </button>
              </div>

              <p className="text-xs text-center" style={{ color: colors.textSecondary }}>
                کد ارسال‌شده به{' '}
                <span className="font-[Vazir-Bold]" style={{ color: colors.primary }}>
                  {toPersianDigit(maskPhone(user?.phone || '09123456789'))}
                </span>{' '}
                را وارد کنید
              </p>

              {/* OTP Inputs */}
              <OTPInput
                value={deleteOtp}
                onChange={(newOtp) => {
                  setDeleteOtp(newOtp);
                  if (deleteOtpError) setDeleteOtpError('');
                }}
                length={OTP_LENGTH}
                error={deleteOtpError}
                currentBox={deleteOtpCurrentBox}
                onCurrentBoxChange={setDeleteOtpCurrentBox}
              />

              {deleteOtpError && (
                <p className="text-center text-sm" style={{ color: '#E57373' }}>
                  {deleteOtpError}
                </p>
              )}

              {/* ارسال مجدد */}
              <div className="flex justify-center">
                {deleteCanResend ? (
                  <button onClick={handleResendDeleteOtp} type="button">
                    <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.primary }}>
                      ارسال مجدد کد
                    </span>
                  </button>
                ) : (
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    ارسال مجدد تا {formatTime(deleteTimer)}
                  </span>
                )}
              </div>

              <Button
                title={deleteOtpLoading ? 'در حال حذف...' : 'تایید و حذف حساب'}
                onPress={handleConfirmDelete}
                loading={deleteOtpLoading}
                disabled={deleteOtp.join('').length < OTP_LENGTH || deleteOtpLoading}
                variant="primary"
                size="lg"
                fullWidth
                style={{ backgroundColor: '#E53935' }}
              />
            </div>
          </div>,
          document.body
        )}
    </ScreenWrapper>
  );
}
