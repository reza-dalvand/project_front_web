'use client';

import { FiSpa } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function ProfileHeader({ user }) {
  const { colors } = useTheme();

  return (
    <div
      className="rounded-b-3xl pb-8 px-5 pt-8"
      style={{ backgroundColor: colors.primary }}
    >
      <h2
        className="text-xl text-center mb-5 font-[Vazir-Bold]"
        style={{ color: '#ffffff' }}
      >
        پروفایل من
      </h2>

      <div className="flex items-center gap-4">
        {/* لوگوی گل زیبانو */}
        <div
          className="rounded-full flex items-center justify-center border-[3px]"
          style={{ borderColor: 'rgba(255,255,255,0.3)', width: '88px', height: '88px' }}
        >
          <div
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <FiSpa size={40} color="#fff" />
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <span
            className="text-xl font-[Vazir-Bold]"
            style={{ color: '#ffffff' }}
          >
            {user?.name || 'کاربر زیبانو'}
          </span>
          <span
            className="text-sm"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            {user?.phone || '۰۹۱۲***۶۷۸۹'}
          </span>
          <div
            className="flex items-center gap-1 self-start mt-1 px-2.5 py-1 rounded-xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <span className="text-yellow-300">✓</span>
            <span
              className="text-[11px] font-[Vazir-Medium]"
              style={{ color: '#ffffff' }}
            >
              {user?.memberSince || 'عضو جدید'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}