'use client';

/**
 * SectionHeader - بدون useTheme
 *
 * @param {React.ReactNode} icon - آیکون
 * @param {string} iconColor - رنگ آیکون (hex یا CSS variable)
 * @param {string} title - عنوان
 * @param {string} subtitle - زیرعنوان
 * @param {React.ReactNode} rightElement - المان سمت چپ
 */
export default function SectionHeader({ icon, iconColor, title, subtitle, rightElement }) {
  const bgColor = iconColor || 'var(--color-primary)';

  return (
    <div className="flex items-center justify-between gap-3 mb-5">
      <div className="flex items-center gap-3 flex-1">
        {icon && (
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `color-mix(in srgb, ${bgColor} 12%, transparent)` }}
          >
            <span style={{ color: bgColor }}>{icon}</span>
          </div>
        )}
        <div className="flex flex-col gap-0.5 flex-1">
          <h3 className="text-base font-vazir-bold text-center text-app">{title}</h3>
          {subtitle && (
            <p className="text-xs font-vazir text-center text-muted">{subtitle}</p>
          )}
        </div>
      </div>
      {rightElement}
    </div>
  );
}