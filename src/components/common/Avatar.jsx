'use client';
import Image from 'next/image';
import defaultAvatar from '@/assets/images/avatar.png';

export default function Avatar({ uri, name, size = 'md', showBorder = false, className = '' }) {
  const sizes = {
    xs: { dim: 28, icon: 16, font: 11 },
    sm: { dim: 36, icon: 20, font: 13 },
    md: { dim: 48, icon: 28, font: 17 },
    lg: { dim: 64, icon: 36, font: 22 },
    xl: { dim: 88, icon: 50, font: 30 },
  };
  const { dim, icon, font } = sizes[size] || sizes.md;

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
        <Image
          src={defaultAvatar}
          alt={name || 'avatar'}
          width={dim}
          height={dim}
          className="object-cover w-full h-full"
        />
      )}
    </div>
  );
}
