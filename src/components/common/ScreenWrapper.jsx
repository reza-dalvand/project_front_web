'use client';

export default function ScreenWrapper({
  children,
  scrollable = false,
  padding = 0,
  className = '',
  contentClassName = '',
  hasBottomTab = false
}) {
  const paddingStyle = padding > 0 ? { padding: `${padding}px` } : undefined;

  if (scrollable) {
    return (
      <div
        className={`
          min-h-screen min-h-dvh bg-[var(--bg)]
          ${className}
        `}
        style={paddingStyle}
      >
        <div
          className={`
            max-w-7xl mx-auto w-full
            px-0 sm:px-4 lg:px-6
            ${contentClassName}
          `}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        h-screen h-dvh flex flex-col overflow-hidden bg-[var(--bg)]
        ${className}
      `}
      style={paddingStyle}
    >
      <div
        className={`flex-1 ${scrollable ? 'overflow-y-auto' : 'overflow-hidden'}`}
        style={{
          padding: padding ? `${padding * 4}px` : '0',
          paddingBottom: safeBottom,
        }}
      >
        {children}
      </div>
    </div>
  );
}