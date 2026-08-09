'use client';
import Card from './Card';

/**
 * کامپوننت StatsCard
 */
export default function StatsCard({
  icon,
  label,
  value,
  subtitle,
  color = '#2196F3',
  variant = 'default',
}) {
  if (variant === 'compact') {
    return (
      <div className="flex-1 flex flex-col items-center gap-1">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center mb-1 text-xl"
          style={{ backgroundColor: `${color}18`, color }}
        >
          {icon}
        </div>
        <span className="text-[17px] font-vazir-bold text-[var(--text-main)]">{value}</span>
        <span className="text-[10px] font-vazir text-center text-[var(--text-secondary)]">
          {label}
        </span>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Card variant="elevated" padding={12} radius={14} className="w-[48.3%]">
        <div className="flex flex-col items-start gap-1">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center mb-1 text-xl"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {icon}
          </div>
          <span className="text-[15px] font-vazir-bold mt-0.5 text-[var(--text-main)]">
            {value}
          </span>
          <span className="text-[11.5px] font-vazir-bold mt-0.5 text-[var(--text-main)]">
            {label}
          </span>
          {subtitle && (
            <span className="text-[9.5px] font-vazir mt-0.5 text-[var(--text-secondary)]">
              {subtitle}
            </span>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding={16} radius={16} className="flex flex-col items-center gap-2">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-1 text-2xl"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {icon}
      </div>
      <span className="text-[22px] font-vazir-bold text-[var(--text-main)]">{value}</span>
      <span className="text-[12px] font-vazir text-center text-[var(--text-secondary)]">
        {label}
      </span>
      {subtitle && (
        <span className="text-[10px] font-vazir text-center text-[var(--text-secondary)]">
          {subtitle}
        </span>
      )}
    </Card>
  );
}
