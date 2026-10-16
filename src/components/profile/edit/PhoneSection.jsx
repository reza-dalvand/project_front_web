// src/components/profile/edit/PhoneSection.jsx
'use client';
import { FiSmartphone } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import { toPersianDigit } from '@/utils/numberUtils';
import { maskPhone } from '@/utils/phoneUtils';

export default function PhoneSection({ phone, onChangePhonePress }) {
  const { colors } = useTheme();
  const displayPhone = toPersianDigit(maskPhone(phone || '09123456789'));

  return (
    <Card
      variant="elevated"
      padding={0}
      radius={22}
      className="relative overflow-hidden"
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background: 'linear-gradient(135deg, #2196F3, #4FC3F7)',
        }}
        aria-hidden="true"
      />

      <div className="p-5">
        <div className="flex items-start gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#2196F318' }}
          >
            <FiSmartphone size={18} color="#2196F3" />
          </div>

          <div className="flex-1 min-w-0">
            <span
              className="block text-sm font-[Vazir-Bold]"
              style={{ color: colors.textMain }}
            >
              شماره موبایل
            </span>
            <span
              className="block text-[11px] font-[Vazir] mt-0.5"
              style={{ color: colors.textSecondary }}
            >
              شماره اصلی حساب شما
            </span>
          </div>
        </div>

        <div
          className="rounded-2xl border p-4"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.border,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#2196F318' }}
            >
              <FiSmartphone size={18} color="#2196F3" />
            </div>

            <div className="flex-1 min-w-0">
              <span
                className="block text-[11px] font-[Vazir] mb-0.5"
                style={{ color: colors.textSecondary }}
              >
                شماره ثبت‌شده
              </span>
              <span
                className="block text-base font-[Vazir-Bold] tracking-wide"
                style={{ color: colors.textMain }}
              >
                {displayPhone}
              </span>
            </div>

            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: '#43A04718' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: '#43A047' }}
              />
              <span
                className="text-[10px] font-[Vazir-Bold]"
                style={{ color: '#43A047' }}
              >
                تایید شده
              </span>
            </div>
          </div>

          <p
            className="mt-3 text-[11px] font-[Vazir] leading-5"
            style={{ color: colors.textSecondary }}
          >
            برای امنیت بیشتر، تغییر شماره نیازمند تایید کد پیامکی است.
          </p>
        </div>

        <button
          type="button"
          onClick={onChangePhonePress}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{
            borderColor: '#2196F350',
            backgroundColor: '#2196F310',
          }}
        >
          <FiSmartphone size={16} color="#2196F3" />
          <span
            className="text-sm font-[Vazir-Bold]"
            style={{ color: '#2196F3' }}
          >
            تغییر شماره موبایل
          </span>
        </button>
      </div>
    </Card>
  );
}