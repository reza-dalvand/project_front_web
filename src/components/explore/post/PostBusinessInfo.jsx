// src/components/explore/post/PostBusinessInfo.jsx
'use client';
import Image from 'next/image';
import { FiCalendar } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';
import { useTheme } from '@/stores/useThemeStore';

export default function PostBusinessInfo({ post, onProfilePress, onBooking }) {
  const { colors } = useTheme();

  return (
    <div
      className="flex items-center gap-3 p-4 border-b"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      <button
        onClick={onProfilePress}
        className="flex items-center gap-3 flex-1 text-right"
      >
        <Image
          src={post.businessLogo}
          alt={post.businessName}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className="text-sm font-bold line-clamp-1"
              style={{ color: colors.textMain }}
            >
              {post.businessName}
            </span>
            <MdVerified size={14} color="#4FC3F7" />
          </div>
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            مشاهده پروفایل
          </span>
        </div>
      </button>
      {/* دکمه رزرو */}
      <button
        onClick={onBooking}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl
        shadow-md transition-all hover:shadow-lg"
        style={{ backgroundColor: '#43A047' }}
      >
        <FiCalendar size={14} color="#fff" />
        <span className="text-xs font-bold text-white">رزرو</span>
      </button>
    </div>
  );
}