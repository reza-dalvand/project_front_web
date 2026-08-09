'use client';

/**
 * کامپوننت نشان (Badge) مشترک
 */
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
    sm: 'py-0.5 px-2 rounded-md text-[11px]',
    md: 'py-1 px-3 rounded-lg text-xs',
  };

  if (dot) {
    return <div className={`w-2 h-2 rounded-full ${className}`} />;
  }

  return (
    <div
      className={`
        inline-flex items-center justify-center self-start
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {label}
    </div>
  );
}