'use client';

/**
 * کامپوننت نشانگر وضعیت
 *
 * @param {object} meta - آبجکت متادیتا { label, color, icon, bg }
 * @param {'sm'|'md'|'lg'} size - اندازه
 * @param {boolean} showIcon - نمایش آیکون
 */
export default function StatusBadge({ meta, size = 'md', showIcon = true }) {
  if (!meta) return null;

  const sizes = {
    sm: {
      container: 'px-2 py-1 rounded-lg gap-1',
      icon: 'text-[10px]',
      text: 'text-[9px]',
    },
    md: {
      container: 'px-2.5 py-1.5 rounded-xl gap-1',
      icon: 'text-xs',
      text: 'text-[11px]',
    },
    lg: {
      container: 'px-3.5 py-2 rounded-xl gap-1.5',
      icon: 'text-sm',
      text: 'text-[13px]',
    },
  };

  const currentSize = sizes[size];
  const bgColor = meta.bg || meta.color + '20';
  const IconComponent = meta.icon;

  return (
    <div
      className={`
        inline-flex items-center self-start
        ${currentSize.container}
      `}
      style={{ backgroundColor: bgColor }}
    >
      {showIcon && meta.icon && (
        <IconComponent
          size={12}
          style={{ color: meta.color }}
          className={currentSize.icon}
        />
      )}
      <span
        className={`font-[Vazir-Bold] ${currentSize.text}`}
        style={{ color: meta.color }}
      >
        {meta.label}
      </span>
    </div>
  );
}