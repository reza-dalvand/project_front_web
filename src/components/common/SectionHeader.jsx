'use client';
/**
 * کامپوننت SectionHeader - هدر سکشن‌ها
 * @param {boolean} centered - اگر true باشد، عنوان کاملاً وسط و آیکون/المان‌ها absolute می‌شوند
 */
export default function SectionHeader({
  icon,
  iconColor,
  title,
  subtitle,
  rightElement,
  centered = false,
}) {
  const bgColor = iconColor || 'var(--primary)';

  // ═══ حالت وسط‌چین (برای ویترین و صفحات مشابه) ═══
  if (centered) {
    return (
      <div className="relative flex items-center justify-center mb-5 min-h-[44px]">
        {/* آیکون - سمت راست */}
        {icon && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${bgColor}15`, color: bgColor }}
            >
              {icon}
            </div>
          </div>
        )}

        {/* عنوان - کاملاً وسط */}
        <div className="flex flex-col items-center gap-0.5 px-12">
          <h3 className="text-base font-vazir-bold text-center text-[var(--text-main)]">{title}</h3>
          {subtitle && (
            <p className="text-xs font-vazir text-center text-[var(--text-secondary)]">
              {subtitle}
            </p>
          )}
        </div>

        {/* المان سمت چپ */}
        {rightElement && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
    );
  }

  // ═══ حالت پیش‌فرض (برای صفحه خانه و...) ═══
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
          <h3 className="text-base font-vazir-bold text-[var(--text-main)]">{title}</h3>
          {subtitle && (
            <p className="text-xs font-vazir text-[var(--text-secondary)]">{subtitle}</p>
          )}
        </div>
      </div>
      {rightElement}
    </div>
  );
}
