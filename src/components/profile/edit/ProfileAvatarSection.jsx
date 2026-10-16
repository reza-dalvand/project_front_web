// src/components/profile/edit/ProfileAvatarSection.jsx
'use client';
import { useTheme } from '@/stores/useThemeStore';

export default function ProfileAvatarSection({ userName }) {
  const { colors } = useTheme();
  const displayName = userName?.trim() || 'کاربر بیو کلاب';

  return (
    <div className="relative flex flex-col items-center gap-4 py-3">
      <div
        className="absolute top-0 h-32 w-32 rounded-full blur-3xl opacity-30"
        style={{ backgroundColor: colors.primary }}
        aria-hidden="true"
      />

      <div
        className="relative w-[116px] h-[116px] rounded-full p-[3px] shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
        }}
      >
        <div
          className="w-full h-full rounded-full flex items-center justify-center border"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <span className="text-[54px] leading-none">🌸</span>
        </div>
      </div>

      <div className="relative text-center space-y-1.5">
        <h2
          className="text-lg font-[Vazir-Bold]"
          style={{ color: colors.textMain }}
        >
          {displayName}
        </h2>
        <p
          className="text-xs font-[Vazir]"
          style={{ color: colors.textSecondary }}
        >
          مشخصات هویتی حساب شما
        </p>
      </div>
    </div>
  );
}