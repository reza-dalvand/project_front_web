'use client';

import { useTheme } from '@/stores/useThemeStore';

/**
 * کامپوننت کارت مشترک
 *
 * @param {React.ReactNode} children - محتوای کارت
 * @param {function} onPress - عملکرد هنگام کلیک (اختیاری)
 * @param {'default'|'flat'|'elevated'} variant - نوع کارت
 * @param {number} padding - فاصله داخلی
 * @param {number} radius - گردی گوشه‌ها
 * @param {string} className - کلاس‌های اضافی
 */
export default function Card({
  children,
  onPress,
  variant = 'default',
  padding = 16,
  radius = 16,
  className = '',
}) {
  const { colors } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'default':
        return {
          backgroundColor: colors.cardBackground,
          borderWidth: 1,
          borderColor: colors.border,
          boxShadow: 'none',
        };
      case 'flat':
        return {
          backgroundColor: colors.cardBackground,
          borderWidth: 0,
          boxShadow: 'none',
        };
      case 'elevated':
        return {
          backgroundColor: colors.cardBackground,
          borderWidth: 0,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        };
      default:
        return {
          backgroundColor: colors.cardBackground,
          borderWidth: 1,
          borderColor: colors.border,
        };
    }
  };

  const styles = getVariantStyles();
  const Component = onPress ? 'button' : 'div';

  return (
    <Component
      onClick={onPress}
      className={`
        overflow-hidden
        ${onPress ? 'cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]' : ''}
        ${className}
      `}
      style={{
        ...styles,
        padding: `${padding}px`,
        borderRadius: `${radius}px`,
      }}
    >
      {children}
    </Component>
  );
}
