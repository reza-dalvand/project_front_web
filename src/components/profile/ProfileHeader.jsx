'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/stores/useThemeStore';
import { formatMembershipSince } from '@/utils/dateUtils';

export default function ProfileHeader({ user }) {
  const { colors } = useTheme();

  const [memberSinceText, setMemberSinceText] = useState('عضو جدید');

  useEffect(() => {
    setMemberSinceText(formatMembershipSince(user?.memberSince));
  }, [user?.memberSince]);

  return (
    <div
      dir="rtl"
      className="relative overflow-hidden rounded-b-[32px] px-5 pt-7 pb-7"
      style={{ backgroundColor: colors.primary }}
    >
      {/* تزئینات مینیمال و ملایم */}
      <div
        className="pointer-events-none absolute -top-16 -left-10 h-48 w-48 rounded-full opacity-20"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-20 -right-8 h-56 w-56 rounded-full opacity-10"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 70%)',
        }}
      />

      <div className="relative">
        <span
          className="mb-3 block text-[11px] font-[Vazir-Medium]"
          style={{ color: 'rgba(255,255,255,0.68)' }}
        >
          {/* پروفایل من */}
        </span>

        <div className="flex items-center gap-4">
          {/* آواتار مینیمال */}
          <div
            className="flex items-center justify-center rounded-full border-[2px]"
            style={{
              width: '76px',
              height: '76px',
              borderColor: 'rgba(255,255,255,0.28)',
              backgroundColor: 'rgba(255,255,255,0.12)',
              boxShadow: '0 10px 28px rgba(0,0,0,0.12)',
            }}
          >
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: '62px',
                height: '62px',
                backgroundColor: 'rgba(255,255,255,0.18)',
              }}
            >
              <span style={{ fontSize: '30px', lineHeight: 1 }}>🌸</span>
            </div>
          </div>

          {/* اطلاعات کاربر */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-1.5">
              <span
                className="truncate text-lg font-[Vazir-Bold]"
                style={{ color: '#ffffff' }}
              >
                {user?.name || 'کاربر بیو کلاب'}
              </span>

              <span
                className="truncate text-[13px] font-[Vazir]"
                style={{ color: 'rgba(255,255,255,0.72)' }}
              >
                {user?.phone || '۰۹۱۲***۶۷۸۹'}
              </span>

              <div
                className="inline-flex items-center gap-1.5 self-start rounded-full border px-3 py-1"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.14)',
                  borderColor: 'rgba(255,255,255,0.22)',
                }}
              >
                <span
                  className="text-[11px] leading-none"
                  style={{ color: '#FFE082' }}
                >
                  ✓
                </span>
                <span
                  className="text-[11px] font-[Vazir-Medium] leading-none"
                  style={{ color: 'rgba(255,255,255,0.92)' }}
                >
                  {memberSinceText}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}