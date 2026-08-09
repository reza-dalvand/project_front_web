'use client';

/**
 * کامپوننت ردیف اطلاعات
 */
export default function InfoRow({
  icon,
  iconColor,
  label,
  value,
  valueColor,
  valueBold = false,
  monospace = false,
  onPress,
  showDivider = false,
  rightIcon = null,
  warn = false,
  highlight = false,
}) {
  const finalIconColor = warn ? '#E53935' : highlight ? '#2196F3' : iconColor || 'var(--text-secondary)';
  const finalValueColor = warn ? '#E53935' : highlight ? '#2196F3' : valueColor || 'var(--text-main)';

  const content = (
    <div
      className={`
        flex items-start gap-3 py-2.5
        ${showDivider ? 'border-b border-[var(--border)]/80' : ''}
      `}
    >
      {icon && <span className="flex-shrink-0 mt-0.5">{icon}</span>}
      <div className="flex-1 gap-1">
        {label && (
          <p className="text-xs font-vazir text-[var(--text-secondary)]">{label}</p>
        )}
        <div
          className={`
            text-sm break-words
            ${valueBold || monospace || highlight || warn ? 'font-vazir-bold' : 'font-vazir-medium'}
            ${monospace ? 'tracking-wider select-text' : ''}
          `}
          style={{ color: finalValueColor }}
        >
          {value}
        </div>
      </div>
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </div>
  );

  if (onPress) {
    return (
      <button onClick={onPress} className="w-full text-right transition-opacity hover:opacity-80">
        {content}
      </button>
    );
  }
  return content;
}