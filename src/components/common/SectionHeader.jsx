'use client';

/**
 * کامپوننت SectionHeader - هدر سکشن‌ها
 */
export default function SectionHeader({ icon, iconColor, title, subtitle, rightElement }) {
  const bgColor = iconColor || 'var(--primary)';

  return (
    <div className="flex items-center justify-between gap-3 mb-5">
      <div className="flex items-center gap-3 flex-1">
        {icon && (
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${bgColor}15`, color: bgColor }}
          >
            {icon}
          </div>
        )}
        <div className="flex flex-col gap-0.5 flex-1">
          <h3 className="text-base font-vazir-bold text-center text-[var(--text-main)]">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs font-vazir text-center text-[var(--text-secondary)]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {rightElement}
    </div>
  );
}