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
      {/* پروفایل کسب‌وکار */}
      <button
        onClick={onProfilePress}
        className="flex items-center gap-3 flex-1 text-right min-w-0"
      >
        <Image
          src={post.businessLogo || 'https://picsum.photos/100/100?random=1'}
          alt={post.businessName}
          width={48}
          height={48}
          className="rounded-full flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className="text-sm font-[Vazir-Bold] line-clamp-1"
              style={{ color: colors.textMain }}
            >
              {post.businessName}
            </span>
            <MdVerified size={14} color="#4FC3F7" className="flex-shrink-0" />
          </div>
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            مشاهده پروفایل
          </span>
        </div>
      </button>

      {/* ✅ FIX: دکمه رزرو — stopPropagation اضافه شد */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // ✅ جلوگیری از بسته شدن مدال
          onBooking?.();
        }}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl
        shadow-md transition-all hover:shadow-lg hover:scale-[1.03]
        active:scale-[0.97] flex-shrink-0"
        style={{ backgroundColor: '#43A047' }}
      >
        <FiCalendar size={14} color="#fff" />
        <span className="text-xs font-[Vazir-Bold] text-white">رزرو</span>
      </button>
    </div>
  );
}
