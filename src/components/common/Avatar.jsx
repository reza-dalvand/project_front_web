// src/components/common/Avatar.jsx
'use client';
import Image from 'next/image';

export default function Avatar({ uri, name, size = 'md', showBorder = false, className = '' }) {
  const sizes = {
    xs: { dim: 28, icon: 16, font: 14 },
    sm: { dim: 36, icon: 20, font: 18 },
    md: { dim: 48, icon: 28, font: 24 },
    lg: { dim: 64, icon: 36, font: 32 },
    xl: { dim: 88, icon: 50, font: 44 },
  };
  const { dim, font } = sizes[size] || sizes.md;

  return (
    <div
      className={`
relative flex items-center justify-center
rounded-full overflow-hidden
${className}
`}
      style={{
        width: `${dim}px`,
        height: `${dim}px`,
        border: showBorder ? '2px solid var(--primary)' : '1px solid var(--border)',
        backgroundColor: uri ? 'transparent' : 'var(--primary)',
      }}
    >
      {uri ? (
        <Image
          src={uri}
          alt={name || 'avatar'}
          width={dim}
          height={dim}
          className="object-cover w-full h-full"
        />
      ) : (
        /* ✅ آیکون گل — یکسان با صفحه لودینگ و لاگین */
        <span
          style={{ fontSize: `${font}px`, lineHeight: 1 }}
          role="img"
          aria-label={name || 'avatar'}
        >
          🌸
        </span>
      )}
    </div>
  );
}
