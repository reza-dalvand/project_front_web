// src/components/explore/post/PostMagazineInfo.jsx
'use client';
import { MdAutoAwesome } from 'react-icons/md';
import { useTheme } from '@/stores/useThemeStore';

export default function PostMagazineInfo({ post }) {
  const { colors } = useTheme();

  return (
    <div
      className="flex items-center gap-3 p-4 border-b"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: '#9C27B020' }}
      >
        <MdAutoAwesome size={22} color="#9C27B0" />
      </div>
      <div className="flex-1">
        <span className="text-sm font-bold line-clamp-1" style={{ color: colors.textMain }}>
          {post.businessName}
        </span>
        <span className="text-xs" style={{ color: '#9C27B0' }}>
          مقاله و محتوای آموزشی
        </span>
      </div>
    </div>
  );
}
