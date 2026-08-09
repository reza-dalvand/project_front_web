'use client';

/**
 * کامپوننت ScreenWrapper
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
      <div className={`min-h-screen bg-[var(--bg)] ${className}`}>
        <div className={`flex flex-col ${contentClassName}`} style={{ padding: `${padding}px` }}>
          {children}
        </div>
      </div>
    );
  }
  return (
    <div
      className={`min-h-screen flex flex-col bg-[var(--bg)] ${className}`}
      style={{ padding: `${padding}px` }}
    >
      {children}
    </div>
  );
}