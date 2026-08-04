'use client';

import { useTheme } from '@/stores/useThemeStore';

/**
 * کامپوننت دکمه مشترک
 *
 * @param {string} title - متن دکمه
 * @param {function} onPress - عملکرد هنگام کلیک
 * @param {'primary'|'secondary'|'outline'|'ghost'} variant - نوع دکمه
 * @param {'sm'|'md'|'lg'} size - اندازه دکمه
 * @param {boolean} loading - حالت بارگذاری
 * @param {boolean} disabled - غیرفعال بودن
 * @param {React.ReactNode} icon - آیکون (چپ یا راست)
 * @param {'left'|'right'} iconPosition - موقعیت آیکون
 * @param {boolean} fullWidth - عرض کامل
 * @param {string} className - کلاس‌های اضافی
 */
export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  type = 'button',
  style = {}, // ✅ اضافه شد
}) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  // استایل‌های بر اساس اندازه
  const sizeClasses = {
    sm: 'py-2 px-4 rounded-xl text-sm',
    md: 'py-3 px-5 rounded-2xl text-base',
    lg: 'py-4 px-6 rounded-2xl text-lg',
  };

  // استایل‌های بر اساس نوع
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return `text-white`;
      case 'secondary':
        return `text-white`;
      case 'outline':
        return `border-2 bg-transparent`;
      case 'ghost':
        return `bg-transparent`;
      default:
        return `text-white`;
    }
  };

  // رنگ‌های متن بر اساس نوع
  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return '#ffffff';
      case 'outline':
      case 'ghost':
        return colors.primary;
      default:
        return '#ffffff';
    }
  };

  // رنگ پس‌زمینه بر اساس نوع
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return colors.primary;
    }
  };

  // رنگ حاشیه برای outline
  const getBorderColor = () => {
    if (variant === 'outline') {
      return colors.primary;
    }
    return 'transparent';
  };

  return (
    <button
      type={type}
      onClick={onPress}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2
        font-bold transition-all duration-200
        hover:scale-[1.02] active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${sizeClasses[size]}
        ${getVariantClasses()}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={{
        backgroundColor: getBackgroundColor(),
        borderColor: getBorderColor(),
        color: getTextColor(),
        fontFamily: 'Vazir-Bold',
        ...style,
      }}
    >
      {loading ? (
        <div
          className="w-5 h-5 border-2 rounded-full animate-spin"
          style={{
            borderColor: getTextColor(),
            borderTopColor: 'transparent',
          }}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="flex items-center">{icon}</span>
          )}
          <span className="text-center flex-1">{title}</span>
          {icon && iconPosition === 'right' && (
            <span className="flex items-center">{icon}</span>
          )}
        </>
      )}
    </button>
  );
}