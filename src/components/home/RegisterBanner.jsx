// src/components/home/RegisterBanner.jsx
'use client';
import { FiZap, FiArrowLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function RegisterBanner({ onLogin }) {
  const { colors } = useTheme();

  return (
    <div
      className="mx-5 mt-3 p-4 rounded-2xl border relative overflow-hidden"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      <div
        className="absolute -top-3 -left-3 w-16 h-16 rounded-full"
        style={{ backgroundColor: colors.primary + '18' }}
      />
      <div
        className="absolute -bottom-4 -right-4 w-14 h-14 rounded-full"
        style={{ backgroundColor: '#FFC10720' }}
      />
      <div className="flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center border"
            style={{
              backgroundColor: colors.primary + '15',
              borderColor: colors.primary + '30',
            }}
          >
            <FiZap size={22} color={colors.primary} />
          </div>
          <div className="flex flex-col gap-0.5 flex-1">
            <span className="text-[13px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              امکانات بیشتری می‌خوای؟ ✨
            </span>
            <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
              رزرو آنلاین، ساخت آگهی، ذخیره و اشتراک پست‌ها و ...
            </span>
          </div>
        </div>
        <button
          onClick={onLogin}
          className="flex items-center gap-1 px-4 py-2.5 rounded-xl whitespace-nowrap"
          style={{ backgroundColor: colors.primary }}
        >
          <span className="text-white text-xs font-[Vazir-Bold]">ورود</span>
          <FiArrowLeft size={14} color="#fff" />
        </button>
      </div>
    </div>
  );
}