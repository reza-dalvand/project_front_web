// src/components/explore/post/PostFooterHint.jsx
'use client';
import { FiZap } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function PostFooterHint({ isMagazine }) {
  const { colors } = useTheme();

  return (
    <div
      className="flex items-center gap-2.5 p-3 mx-4 mt-4 mb-4
      rounded-xl border"
      style={{
        backgroundColor: isMagazine ? '#9C27B008' : colors.primary + '08',
        borderColor: isMagazine ? '#9C27B025' : colors.primary + '25',
      }}
    >
      <FiZap size={16} style={{ color: isMagazine ? '#9C27B0' : colors.primary }} />
      <span className="text-xs leading-5 flex-1" style={{ color: colors.textSecondary }}>
        {isMagazine
          ? 'این مقاله توسط تیم تحریریه مجله زیبانو تهیه شده است'
          : 'با رزرو نوبت از این کسب‌وکار، از تخفیف‌های ویژه بهره‌مند شوید'}
      </span>
    </div>
  );
}