// src/components/explore/post/PostCaptionCard.jsx
'use client';
import { FiInfo } from 'react-icons/fi';
import { MdAutoAwesome } from 'react-icons/md';
import { useTheme } from '@/stores/useThemeStore';

export default function PostCaptionCard({ caption, isMagazine }) {
  const { colors } = useTheme();

  return (
    <div
      className="p-4 mx-4 mt-4 rounded-2xl border"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: isMagazine ? '#9C27B015' : colors.primary + '15',
          }}
        >
          {isMagazine ? (
            <MdAutoAwesome size={14} color="#9C27B0" />
          ) : (
            <FiInfo size={14} style={{ color: colors.primary }} />
          )}
        </div>
        <span className="text-xs font-bold" style={{ color: colors.textSecondary }}>
          {isMagazine ? 'متن مقاله' : 'توضیحات'}
        </span>
      </div>
      <p className="text-sm leading-7 text-justify" style={{ color: colors.textMain }}>
        {caption}
      </p>
    </div>
  );
}
