'use client';

/**
 * Button - بدون useTheme
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
  style = {},
}) {
  const isDisabled = disabled || loading;

  const sizeClasses = {
    sm: 'py-2 px-4 rounded-xl text-sm',
    md: 'py-3 px-5 rounded-2xl text-base',
    lg: 'py-4 px-6 rounded-2xl text-lg',
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary text-white';
      case 'secondary':
        return 'bg-[var(--color-secondary)] text-white';
      case 'outline':
        return 'border-2 border-primary bg-transparent text-primary';
      case 'ghost':
        return 'bg-transparent text-primary';
      default:
        return 'bg-primary text-white';
    }
  };

  return (
    <button
      type={type}
      onClick={onPress}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2
        font-vazir-bold transition-all duration-200
        hover:scale-[1.02] active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${sizeClasses[size]}
        ${getVariantClasses()}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={style}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="flex items-center">{icon}</span>}
          <span className="text-center flex-1">{title}</span>
          {icon && iconPosition === 'right' && <span className="flex items-center">{icon}</span>}
        </>
      )}
    </button>
  );
}