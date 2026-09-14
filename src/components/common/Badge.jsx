'use client';

export default function Badge({
  label,
  variant = 'primary',
  size = 'md',
  dot = false,
  className = '',
}) {
  const variantClasses = {
    primary: 'bg-[var(--primary)]/20 text-[var(--primary)]',
    secondary: 'bg-[var(--secondary)]/20 text-[var(--secondary)]',
    success: 'bg-green-500/20 text-green-500',
    warning: 'bg-orange-500/20 text-orange-500',
    error: 'bg-red-400/20 text-red-400',
    neutral: 'bg-[var(--border)] text-[var(--text-secondary)]',
  };

  const sizeClasses = {
    xs: 'py-0 px-1.5 rounded text-[9px] sm:text-[10px]',
    sm: 'py-0.5 px-2 rounded-md text-[10px] sm:text-[11px]',
    md: 'py-1 px-2.5 sm:px-3 rounded-lg text-[11px] sm:text-xs',
    lg: 'py-1.5 px-3 sm:px-4 rounded-lg text-xs sm:text-sm',
  };

  if (dot) {
    return (
      <div
        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`
        inline-flex items-center justify-center self-start
        whitespace-nowrap flex-shrink-0
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {label}
    </div>
  );
}