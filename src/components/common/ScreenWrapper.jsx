'use client';

/**
 * ScreenWrapper - بدون نیاز به useTheme
 * از CSS Variables استفاده می‌کند → بدون re-render اضافی
 */
export default function ScreenWrapper({
  children,
  scrollable = false,
  padding = 0,
  className = '',
  contentClassName = '',
}) {
  if (scrollable) {
    return (
      <div className={`min-h-screen bg-app ${className}`}>
        <div
          className={`flex flex-col ${contentClassName}`}
          style={padding ? { padding: `${padding}px` } : undefined}
        >
          {children}
        </div>
      </div>
    );
  }
  return (
    <div
      className={`min-h-screen flex flex-col bg-app ${className}`}
      style={padding ? { padding: `${padding}px` } : undefined}
    >
      {children}
    </div>
  );
}