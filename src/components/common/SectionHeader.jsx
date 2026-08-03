'use client';

import { useTheme } from '@/stores/useThemeStore';

/**
 * کامپوننت SectionHeader - هدر سکشن‌ها
 *
 * @param {React.ReactNode} icon - آیکون (react-icon)
 * @param {string} iconColor - رنگ آیکون
 * @param {string} title - عنوان
 * @param {string} subtitle - زیرعنوان
 * @param {React.ReactNode} rightElement - المان سمت چپ (در RTL)
 */
export default function SectionHeader({
  icon,
  iconColor,
  title,
  subtitle,
  rightElement,
}) {
  const { colors } = useTheme();
  const bgColor = iconColor || colors.primary;

  return (
    <div className="flex items-center justify-between gap-3 mb-5">
      <div className="flex items-center gap-3 flex-1">
        {/* آیکون */}
        {icon && (
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: bgColor + '15' }}
          >
            <span style={{ color: bgColor }}>{icon}</span>
          </div>
        )}

        {/* متن‌ها */}
        <div className="flex flex-col gap-0.5 flex-1">
          <h3
            className="text-base font-[Vazir-Bold] text-right"
            style={{ color: colors.textMain }}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              className="text-xs font-[Vazir] text-right"
              style={{ color: colors.textSecondary }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* المان سمت چپ */}
      {rightElement}
    </div>
  );
}