'use client';
import Image from 'next/image';
import { FiBookmark, FiImage, FiStar } from 'react-icons/fi';
import { MdAutoAwesome } from 'react-icons/md';
import { useTheme } from '@/stores/useThemeStore';
import { useAuth } from '@/stores/useAuthStore';

export default function PostThumbnail({ post, onPress }) {
  const { colors } = useTheme();
  const { isAuthenticated } = useAuth();

  if (!post) return null;

  const isMagazine = post.source === 'magazine';
  const hasDiscount = post.discount > 0;
  const media = post.gallery || post.images || [];
  const firstImage = media[0] || 'https://picsum.photos/400/400?random=0';

  const handleSaveClick = (e) => {
    e.stopPropagation();
    console.log('Toggle save for post:', post.id);
  };

  return (
    <div
      onClick={() => onPress?.(post)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPress?.(post);
        }
      }}
      role="button"
      tabIndex={0}
      className="relative block w-full aspect-square rounded-lg overflow-hidden group cursor-pointer"
      style={{
        backgroundColor: colors.cardBackground,
      }}
    >
      <Image
        src={firstImage}
        alt={post.businessName}
        fill
        sizes="(max-width: 768px) 33vw, 200px"
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />

      {/* تگ مجله */}
      {isMagazine && (
        <div
          className="absolute top-2 left-2 flex items-center gap-1
            px-2 py-1 rounded-md shadow-lg"
          style={{ backgroundColor: 'rgba(156, 39, 176, 0.85)' }}
        >
          <MdAutoAwesome size={10} color="#fff" />
          <span className="text-[9px] font-bold text-white">مجله</span>
        </div>
      )}

      {/* تگ تخفیف */}
      {hasDiscount && !isMagazine && (
        <div
          className="absolute top-2 left-2 px-2 py-1 rounded-md shadow-lg"
          style={{ backgroundColor: '#E53935' }}
        >
          <span className="text-[10px] font-bold text-white">{post.discount}٪</span>
        </div>
      )}

      {/* آیکون چندتصویری */}
      {media.length > 1 && (
        <div
          className="absolute top-2 right-2 p-1 rounded shadow-lg"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <FiImage size={14} color="#fff" />
        </div>
      )}

      {/* ✅ دکمه ذخیره - فقط برای کاربران لاگین‌شده */}
      {isAuthenticated && (
        <button
          onClick={handleSaveClick}
          className="absolute bottom-2 left-2 w-8 h-8 rounded-full
            flex items-center justify-center shadow-lg
            transition-all duration-200 hover:scale-110"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          aria-label={post.saved ? 'حذف از علاقه‌مندی' : 'افزودن به علاقه‌مندی'}
        >
          <FiBookmark
            size={16}
            color={post.saved ? '#FFD700' : '#fff'}
            fill={post.saved ? '#FFD700' : 'transparent'}
          />
        </button>
      )}

      {/* امتیاز - برای پست‌های کسب‌وکار */}
      {!isMagazine && post.rating > 0 && (
        <div
          className="absolute bottom-2 right-2 flex items-center gap-1
            px-2 py-1 rounded-md shadow-lg"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
          <FiStar size={10} color="#FFD700" fill="#FFD700" />
          <span className="text-[10px] font-bold text-white">{post.rating.toFixed(1)}</span>
        </div>
      )}
    </div>
  );
}
