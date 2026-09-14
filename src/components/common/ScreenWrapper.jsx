'use client';

/**
 * کامپوننت ScreenWrapper
 *
 * کانتینر اصلی صفحات اپلیکیشن — مدیریت ارتفاع و اسکرول
 * در دسکتاپ محتوا را در یک کانتینر مرکزی (max-w-6xl) محدود می‌کند.
 */
export default function ScreenWrapper({
  children,
  scrollable = false,
  padding = 0,
  className = '',
  contentClassName = '',
}) {
  const paddingStyle = padding > 0 ? { padding: `${padding}px` } : undefined;

  // ─── حالت اسکرول‌پذیر ───
  if (scrollable) {
    return (
      <div className={`min-h-screen min-h-dvh bg-[var(--bg)] ${className}`} style={paddingStyle}>
        <div className={`max-w-6xl mx-auto w-full ${contentClassName}`}>
          {children}
        </div>
      </div>
    );
  }

  // ─── حالت ثابت (بدون اسکرول صفحه) ───
  return (
    <div
      className={`h-screen h-dvh flex flex-col overflow-hidden bg-[var(--bg)] ${className}`}
      style={paddingStyle}
    >
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}