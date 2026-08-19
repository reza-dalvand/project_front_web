// src/components/profile/edit/ProfileAvatarSection.jsx
'use client';
import { useTheme } from '@/stores/useThemeStore';

export default function ProfileAvatarSection({ userName }) {
  const { colors } = useTheme();

  return (
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
        {userName || 'کاربر بیو کلاب'}
      </span>
    </div>
  );
}
