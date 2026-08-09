'use client';

/**
 * کامپوننت Divider - خط جداکننده
 */
export default function Divider({
  label,
  orientation = 'horizontal',
  thickness = 1,
  spacing = 16,
}) {
  if (orientation === 'vertical') {
    return (
      <div
        className="self-stretch bg-[var(--border)]"
        style={{ width: `${thickness}px`, margin: `0 ${spacing}px` }}
      />
    );
  }

  if (label) {
    return (
      <div className="flex items-center" style={{ margin: `${spacing}px 0` }}>
        <div className="flex-1 bg-[var(--border)]" style={{ height: `${thickness}px` }} />
        <span className="px-3 text-xs font-vazir text-[var(--text-secondary)]">{label}</span>
        <div className="flex-1 bg-[var(--border)]" style={{ height: `${thickness}px` }} />
      </div>
    );
  }

  return (
    <div
      className="w-full bg-[var(--border)]"
      style={{ height: `${thickness}px`, margin: `${spacing}px 0` }}
    />
  );
}