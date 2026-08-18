'use client';

/**
 * کامپوننت ScreenWrapper
 *
 * کانتینر اصلی صفحات اپلیکیشن — مدیریت ارتفاع و اسکرول
 *
 * @param {React.ReactNode} children - محتوای داخلی
 * @param {boolean} scrollable - true: اسکرول در سطح window | false: اسکرول توسط فرزندان
 * @param {number} padding - پدینگ داخلی به پیکسل (0 = بدون پدینگ)
 * @param {string} className - کلاس‌های اضافی برای کانتینر
 * @param {string} contentClassName - کلاس‌های محتوای داخلی (فقط scrollable=true)
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
  // کل صفحه از طریق window/body اسکرول می‌شود
  if (scrollable) {
    return (
      <div
        className={`min-h-screen min-h-dvh bg-[var(--bg)] ${className}`}
        style={paddingStyle}
      >
        {contentClassName ? (
          <div className={contentClassName}>{children}</div>
        ) : (
          children
        )}
      </div>
    );
  }

  // ─── حالت ثابت (بدون اسکرول صفحه) ───
  // ارتفاع دقیق viewport — فرزندان باید خودشان اسکرول را مدیریت کنند
  // الگوی رایج: <div className="flex-1 overflow-y-auto pb-32">
  return (
    <div
      className={`h-screen h-dvh flex flex-col overflow-hidden bg-[var(--bg)] ${className}`}
      style={paddingStyle}
    >
      {children}
    </div>
  );
}