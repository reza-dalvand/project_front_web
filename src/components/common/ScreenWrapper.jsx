'use client';

export default function ScreenWrapper({
  children,
  scrollable = false,
  padding = 0,
  className = '',
  contentClassName = '',
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
        className="
          flex-1 flex flex-col
          max-w-7xl mx-auto w-full
          overflow-hidden
        "
      >
        {children}
      </div>
    </div>
  );
}