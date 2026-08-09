// src/components/booking/BookingNameStep.jsx
'use client';
import { FiUser, FiAlertTriangle, FiCheck } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Input from '@/components/common/Input';

/**
 * استپ مشخصات کاربر
 * فقط وقتی نمایش داده می‌شود که نام و نام خانوادگی ثبت نشده باشد
 *
 * @param {string}  firstName
 * @param {string}  lastName
 * @param {boolean} nameConfirmed
 * @param {object}  nameErrors - { firstName, lastName, confirm }
 * @param {function} onFirstNameChange
 * @param {function} onLastNameChange
 * @param {function} onNameConfirmedChange
 */
export default function BookingNameStep({
  firstName,
  lastName,
  nameConfirmed,
  nameErrors,
  onFirstNameChange,
  onLastNameChange,
  onNameConfirmedChange,
}) {
  const { colors } = useTheme();

  return (
    <div className="flex flex-col gap-4">
      {/* هدر بخش */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-[11px] flex items-center justify-center"
          style={{ backgroundColor: colors.primary + '15' }}
        >
          <FiUser size={18} style={{ color: colors.primary }} />
        </div>
        <div className="flex flex-col gap-0.5">
          <span
            className="text-[15px] font-[Vazir-Bold]"
            style={{ color: colors.textMain }}
          >
            مشخصات خود را وارد کنید
          </span>
          <span
            className="text-[11px] font-[Vazir]"
            style={{ color: colors.textSecondary }}
          >
            برای رزرو نوبت، نام و نام خانوادگی الزامی است
          </span>
        </div>
      </div>

      {/* ═══ باکس هشدار مهم ═══ */}
      <div
        className="rounded-2xl border-2 p-4 space-y-3"
        style={{
          backgroundColor: '#E5393508',
          borderColor: '#E5393540',
        }}
      >
        <div className="flex items-center gap-2">
          <FiAlertTriangle size={20} color="#E53935" />
          <span
            className="text-[14px] font-[Vazir-Bold]"
            style={{ color: '#E53935' }}
          >
            هشدار مهم
          </span>
        </div>
        <p
          className="text-[12px] font-[Vazir] leading-[22px] text-justify"
          style={{ color: colors.textMain }}
        >
          لطفاً نام و نام خانوادگی خود را{' '}
          <span className="font-[Vazir-Bold]" style={{ color: '#E53935' }}>
            دقیقاً مطابق با کارت بانکی
          </span>{' '}
          وارد کنید.
        </p>
        <p
          className="text-[12px] font-[Vazir] leading-[22px] text-justify"
          style={{ color: colors.textMain }}
        >
          در صورت مغایرت اطلاعات، در فرآیند{' '}
          <span className="font-[Vazir-Bold]">استرداد وجه</span> و{' '}
          <span className="font-[Vazir-Bold]">تسویه مالی</span> با مشکل مواجه
          خواهید شد.
        </p>
      </div>

      {/* ═══ فیلد نام ═══ */}
      <Input
        label="نام *"
        placeholder="مثال: مریم"
        value={firstName}
        onChangeText={(t) => {
          onFirstNameChange(t);
        }}
        error={nameErrors.firstName}
        rightIcon={<FiUser size={18} style={{ color: colors.textSecondary }} />}
      />

      {/* ═══ فیلد نام خانوادگی ═══ */}
      <Input
        label="نام خانوادگی *"
        placeholder="مثال: حسینی"
        value={lastName}
        onChangeText={(t) => {
          onLastNameChange(t);
        }}
        error={nameErrors.lastName}
        rightIcon={<FiUser size={18} style={{ color: colors.textSecondary }} />}
      />

      {/* ═══ چک‌باکس تایید مسئولیت ═══ */}
      <label className="flex items-start gap-3 cursor-pointer py-2">
        <button
          onClick={() => onNameConfirmedChange(!nameConfirmed)}
          className="mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors"
          style={{
            backgroundColor: nameConfirmed ? '#E53935' : 'transparent',
            borderColor: nameConfirmed ? '#E53935' : colors.border,
          }}
          type="button"
        >
          {nameConfirmed && <FiCheck size={14} style={{ color: '#fff' }} />}
        </button>
        <span
          className="text-[12px] leading-5 flex-1"
          style={{ color: colors.textMain }}
        >
          نام و نام خانوادگی خود را مطابق با کارت بانکی وارد کرده‌ام و{' '}
          <span className="font-[Vazir-Bold]" style={{ color: '#E53935' }}>
            مسئولیت صحت اطلاعات و عواقب ناشی از مغایرت آن را می‌پذیرم.
          </span>
        </span>
      </label>

      {/* خطای چک‌باکس */}
      {nameErrors.confirm && (
        <p className="text-center text-xs" style={{ color: '#E53935' }}>
          {nameErrors.confirm}
        </p>
      )}
    </div>
  );
}