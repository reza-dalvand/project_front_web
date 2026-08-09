'use client';

/**
 * Card - بدون useTheme → بدون re-render هنگام تغییر تم
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
  const getVariantClasses = () => {
    switch (variant) {
      case 'flat':
        return 'bg-card';
      case 'elevated':
        return 'bg-card shadow-[0_4px_12px_rgba(0,0,0,0.08)]';
      default:
        return 'bg-card border border-app';
    }
  };

  const Component = onPress ? 'button' : 'div';

  return (
    <Component
      onClick={onPress}
      className={`
        overflow-hidden ${getVariantClasses()}
        ${onPress ? 'cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]' : ''}
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