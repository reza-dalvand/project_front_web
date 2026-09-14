'use client';
import Image from 'next/image';

export default function Avatar({ uri, name, size = 'md', showBorder = false, className = '' }) {
  const sizes = {
    xs: { dim: 24, smDim: 28, icon: 14, smIcon: 16, font: 12, smFont: 14 },
    sm: { dim: 32, smDim: 36, icon: 18, smIcon: 20, font: 16, smFont: 18 },
    md: { dim: 42, smDim: 48, icon: 24, smIcon: 28, font: 20, smFont: 24 },
    lg: { dim: 56, smDim: 64, icon: 32, smIcon: 36, font: 28, smFont: 32 },
    xl: { dim: 76, smDim: 88, icon: 44, smIcon: 50, font: 38, smFont: 44 },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div
      className={`
        relative flex items-center justify-center
        rounded-full overflow-hidden flex-shrink-0
        ${className}
      `}
      style={{
        width: `${s.dim}px`,
        height: `${s.dim}px`,
        border: showBorder ? '2px solid var(--primary)' : '1px solid var(--border)',
        backgroundColor: uri ? 'transparent' : 'var(--primary)',
      }}
    >
      {/* نسخه responsive با CSS برای سایز sm+ */}
      <style jsx>{`
        @media (min-width: 640px) {
          .avatar-responsive {
            width: ${s.smDim}px !important;
            height: ${s.smDim}px !important;
          }
        }
      `}</style>

      <div
        className="avatar-responsive w-full h-full flex items-center justify-center rounded-full overflow-hidden"
        style={{
          width: `${s.dim}px`,
          height: `${s.dim}px`,
        }}
      >
        {uri ? (
          <Image
            src={uri}
            alt={name || 'avatar'}
            width={s.smDim}
            height={s.smDim}
            className="object-cover w-full h-full"
          />
        ) : (
          <span
            style={{
              fontSize: `${s.font}px`,
              lineHeight: 1,
            }}
            className="sm:hidden"
            role="img"
            aria-label={name || 'avatar'}
          >
            🌸
          </span>
        )}
        {!uri && (
          <span
            style={{
              fontSize: `${s.smFont}px`,
              lineHeight: 1,
            }}
            className="hidden sm:inline"
            role="img"
            aria-label={name || 'avatar'}
          >
            🌸
          </span>
        )}
      </div>
    </div>
  );
}