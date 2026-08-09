'use client';

/**
 * کامپوننت کارت مشترک
 */
export default function Card({
  children,
  onPress,
  variant = 'default',
  padding = 16,
  radius = 16,
  className = '',
  style = {},
}) {
  const variantClasses = {
    default: 'bg-[var(--card)] border border-[var(--border)]',
    flat: 'bg-[var(--card)]',
    elevated: 'bg-[var(--card)] shadow-[0_4px_12px_rgba(0,0,0,0.08)]',
  };

  const Component = onPress ? 'button' : 'div';

  return (
    <Component
      onClick={onPress}
      className={`
        overflow-hidden
        ${variantClasses[variant]}
        ${
          onPress
            ? 'cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]'
            : ''
        }
        ${className}
      `}
      style={{
        padding: `${padding}px`,
        borderRadius: `${radius}px`,
        ...style,
      }}
    >
      {children}
    </Component>
  );
}
