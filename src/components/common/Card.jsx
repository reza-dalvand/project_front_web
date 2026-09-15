'use client';

export default function Card({
  children,
  onPress,
  variant = 'default',
  padding = null,
  radius = null,
  className = '',
  style = {},
}) {
  const variantClasses = {
    default: 'bg-[var(--card)] border border-[var(--border)]',
    flat: 'bg-[var(--card)]',
    elevated: 'bg-[var(--card)] shadow-[0_4px_12px_rgba(0,0,0,0.08)]',
  };

  const Component = onPress ? 'button' : 'div';

  // Responsive defaults — اگر prop داده نشده
  const resolvedPadding = padding ?? 'p-3 sm:p-4 lg:p-5';
  const resolvedRadius = radius ?? 'rounded-xl sm:rounded-2xl';

  return (
    <Component
      onClick={onPress}
      className={`
        overflow-hidden
        ${variantClasses[variant]}
        ${typeof resolvedPadding === 'string' ? resolvedPadding : ''}
        ${typeof resolvedRadius === 'string' ? resolvedRadius : ''}
        ${
          onPress
            ? 'cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] w-full text-right'
            : ''
        }
        ${className}
      `}
      style={{
        ...(typeof resolvedPadding === 'number' ? { padding: `${resolvedPadding}px` } : {}),
        ...(typeof resolvedRadius === 'number' ? { borderRadius: `${resolvedRadius}px` } : {}),
        ...style,
      }}
    >
      {children}
    </Component>
  );
}