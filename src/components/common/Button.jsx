'use client';

/**
 * کامپوننت دکمه مشترک
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

  const variantClasses = {
    primary: 'bg-[var(--primary)] text-white border-transparent',
    secondary: 'bg-[var(--secondary)] text-white border-transparent',
    outline: 'border-2 bg-transparent text-[var(--primary)] border-[var(--primary)]',
    ghost: 'bg-transparent text-[var(--primary)] border-transparent',
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
        ${variantClasses[variant]}
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
