// src/components/home/RegisterBanner.jsx
'use client';

import { FiZap, FiArrowLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function RegisterBanner({ onLogin }) {
  const { colors, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';
  const accent = colors?.primary || '#A88B7D';
  const textColor = colors?.textMain || '#111827';
  const subTextColor = colors?.textSecondary || '#6B7280';
  const cardBg = colors?.cardBackground || '#FFFFFF';
  const borderColor = colors?.border || '#E5E7EB';

  return (
    <div className="mx-3 sm:mx-5 mt-3 w-full">
      <button
        type="button"
        onClick={() => onLogin?.()}
        aria-label="ورود یا ثبت‌نام در بیو کلاب"
        className="
          group
          relative
          block
          w-full
          overflow-hidden
          rounded-[24px]
          sm:rounded-[28px]
          border
          text-right
          transition-all
          duration-300
          ease-out
          hover:-translate-y-0.5
          active:scale-[0.99]
          focus:outline-none
          focus-visible:outline-2
          focus-visible:outline-offset-2
        "
        style={{
          backgroundColor: cardBg,
          borderColor,
          outlineColor: accent,
          boxShadow: isDark
            ? '0 18px 40px rgba(0,0,0,0.28)'
            : '0 14px 34px rgba(15,23,42,0.08)',
        }}
      >
        {/* لایه نورهای پس‌زمینه */}
        <span
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background: `
              radial-gradient(circle at 12% 18%, ${accent}1F, transparent 32%),
              radial-gradient(circle at 88% 82%, ${accent}2E, transparent 28%)
            `,
          }}
        />

        {/* دایره‌های تزئینی محو */}
        <span
          className="pointer-events-none absolute -top-10 -left-10 h-28 w-28 rounded-full blur-2xl"
          style={{ backgroundColor: `${accent}22` }}
        />
        <span
          className="pointer-events-none absolute -bottom-12 right-10 h-24 w-24 rounded-full blur-2xl"
          style={{ backgroundColor: `${accent}18` }}
        />

        {/* خط نازک بالای بنر */}
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(to left, transparent, ${accent}66, transparent)`,
          }}
        />

        {/* محتوای اصلی */}
        <div className="relative z-10 flex items-center gap-3 sm:gap-4 p-4 sm:p-5 md:p-6">
          {/* آیکون */}
          <div
            className="
              shrink-0
              w-12
              h-12
              sm:w-14
              sm:h-14
              md:w-16
              md:h-16
              rounded-2xl
              flex
              items-center
              justify-center
              border
              transition-transform
              duration-300
              group-hover:scale-105
            "
            style={{
              backgroundColor: `${accent}14`,
              borderColor: `${accent}2A`,
              boxShadow: isDark
                ? 'inset 0 1px 0 rgba(255,255,255,0.06)'
                : 'inset 0 1px 0 rgba(255,255,255,0.35)',
            }}
          >
            <FiZap
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
              style={{ color: accent }}
            />
          </div>

          {/* متن‌ها */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className="
                  text-sm
                  sm:text-base
                  md:text-lg
                  font-[Vazir-Bold]
                  truncate
                "
                style={{ color: textColor }}
              >
                ورود / ثبت‌نام
              </h3>

              <span
                className="
                  hidden
                  sm:inline-flex
                  items-center
                  rounded-full
                  px-2
                  py-0.5
                  text-[10px]
                  sm:text-[11px]
                  font-[Vazir-Bold]
                  border
                "
                style={{
                  color: accent,
                  borderColor: `${accent}35`,
                  backgroundColor: `${accent}10`,
                }}
              >
                رایگان
              </span>
            </div>

            <p
              className="
                text-[11px]
                sm:text-xs
                md:text-sm
                leading-5
                md:leading-6
                line-clamp-2
              "
              style={{ color: subTextColor }}
            >
              برای دسترسی به نوبت‌ها، علاقه‌مندی‌ها و رزرو سریع‌تر وارد شوید.
            </p>
          </div>

          {/* دکمه فلش */}
          <div
            className="
              shrink-0
              flex
              items-center
              justify-center
              w-10
              h-10
              sm:w-11
              sm:h-11
              rounded-full
              border
              transition-transform
              duration-300
              group-hover:-translate-x-1
            "
            style={{
              backgroundColor: accent,
              borderColor: accent,
              boxShadow: isDark
                ? '0 8px 18px rgba(0,0,0,0.22)'
                : '0 8px 18px rgba(15,23,42,0.12)',
            }}
          >
            <FiArrowLeft
              className="w-4 h-4 sm:w-5 sm:h-5"
              color="#fff"
            />
          </div>
        </div>

        {/* حلقه داخلی ظریف */}
        <span
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            boxShadow: isDark
              ? 'inset 0 0 0 1px rgba(255,255,255,0.04)'
              : 'inset 0 0 0 1px rgba(255,255,255,0.35)',
          }}
        />
      </button>
    </div>
  );
}