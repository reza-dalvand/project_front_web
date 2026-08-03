'use client';

import { useTheme } from '@/stores/useThemeStore';

/**
 * کامپوننت ردیف اطلاعات (آیکون + لیبل + مقدار)
 *
 * @param {React.ReactNode} icon - آیکون (React Icon)
 * @param {string} iconColor - رنگ آیکون
 * @param {string} label - برچسب (مثلاً "نام مشتری")
 * @param {string|React.ReactNode} value - مقدار
 * @param {string} valueColor - رنگ مقدار
 * @param {boolean} valueBold - بولد بودن مقدار
 * @param {boolean} monospace - فونت monospace برای کدها
 * @param {function} onPress - کلیک‌پذیر بودن
 * @param {boolean} showDivider - خط پایین
 * @param {React.ReactNode} rightIcon - آیکون سمت چپ (مثلاً کپی)
 * @param {boolean} warn - حالت هشدار (قرمز)
 * @param {boolean} highlight - حالت هایلایت (آبی)
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
  const { colors } = useTheme();

  const finalIconColor = warn
    ? '#E53935'
    : highlight
    ? '#2196F3'
    : iconColor || colors.textSecondary;

  const finalValueColor = warn
    ? '#E53935'
    : highlight
    ? '#2196F3'
    : valueColor || colors.textMain;

  const content = (
    <div
      className="flex items-start gap-3 py-2.5"
      style={{
        borderBottom: showDivider
          ? `1px solid ${colors.border}80`
          : 'none',
      }}
    >
      {icon && (
        <span className="flex-shrink-0 mt-0.5">{icon}</span>
      )}

      <div className="flex-1 gap-1">
        {label && (
          <p
            className="text-xs font-[Vazir]"
            style={{ color: colors.textSecondary }}
          >
            {label}
          </p>
        )}
        <div
          className="text-sm break-words"
          style={{
            color: finalValueColor,
            fontFamily:
              valueBold || monospace || highlight || warn
                ? 'Vazir-Bold'
                : 'Vazir-Medium',
            letterSpacing: monospace ? '1px' : 'normal',
            userSelect: 'text',
          }}
        >
          {value}
        </div>
      </div>

      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </div>
  );

  if (onPress) {
    return (
      <button
        onClick={onPress}
        className="w-full text-right transition-opacity hover:opacity-80"
      >
        {content}
      </button>
    );
  }

  return content;
}