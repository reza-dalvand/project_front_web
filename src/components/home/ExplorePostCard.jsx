'use client';
import Image from 'next/image';
import { FiBookmark } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuth } from '@/stores/useAuth';
import { toPersianDigit } from '@/utils/numberUtils';

export default function ExplorePostCard({ post, onPress, onSave }) {
  const { colors } = useTheme();
  const { requireAuth } = useAuth();

  const handleSave = (e) => {
    e.stopPropagation();
    requireAuth(() => {
      onSave?.(post.id);
    });
  };

  const firstImage = post.gallery?.[0] || post.images?.[0] || '';

  return (
    <button
      onClick={() => onPress?.(post)}
      className="w-full rounded-2xl border overflow-hidden transition-all hover:shadow-md active:scale-[0.98] text-right"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      {/* تصویر */}
      <div className="relative w-full aspect-square">
        <Image
          src={firstImage}
          alt={post.caption || 'پست'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 300px"
        />
        {/* Badge تعداد تصاویر */}
        {post.gallery && post.gallery.length > 1 && (
          <div
            className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          >
            <span className="text-[10px] text-white">📷</span>
            <span className="text-[10px] font-[Vazir-Bold] text-white">
              {toPersianDigit(post.gallery.length)}
            </span>
          </div>
        )}
      </div>

      {/* اطلاعات */}
      <div className="p-3 gap-2">
        {/* کسب‌وکار */}
        <div className="flex items-center gap-2">
          {post.businessLogo && (
            <Image
              src={post.businessLogo}
              alt={post.businessName}
              width={24}
              height={24}
              className="rounded-full object-cover"
            />
          )}
          <p
            className="text-[11px] font-[Vazir-Bold] truncate flex-1"
            style={{ color: colors.textMain }}
          >
            {post.businessName}
          </p>
        </div>

        {/* کپشن */}
        <p
          className="text-[11px] font-[Vazir] leading-4 line-clamp-2"
          style={{ color: colors.textSecondary }}
        >
          {post.caption}
        </p>

        {/* دکمه ذخیره */}
        <div className="flex justify-end mt-1">
          <button
            onClick={handleSave}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <FiBookmark
              size={16}
              color={post.saved ? '#E91E63' : colors.textSecondary}
              fill={post.saved ? '#E91E63' : 'transparent'}
            />
          </button>
        </div>
      </div>
    </button>
  );
}
