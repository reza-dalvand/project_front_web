// src/components/explore/post/PostModalHeader.jsx
'use client';
import { FiX, FiShare2, FiBookmark } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function PostModalHeader({ isSaved, onShare, onSave, onClose }) {
  const { colors } = useTheme();

  return (
    <div
      className="flex items-center gap-2 px-4 py-3 border-b"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      <button
        onClick={onClose}
        className="w-10 h-10 rounded-full flex items-center justify-center
        border transition-colors hover:opacity-80"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border,
        }}
      >
        <FiX size={20} style={{ color: colors.textMain }} />
      </button>
      <div className="flex-1" />
      <button
        onClick={onShare}
        className="w-10 h-10 rounded-full flex items-center justify-center
        border transition-colors hover:opacity-80"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border,
        }}
      >
        <FiShare2 size={18} style={{ color: colors.textMain }} />
      </button>
      <button
        onClick={onSave}
        className="w-10 h-10 rounded-full flex items-center justify-center
        border transition-colors hover:opacity-80"
        style={{
          backgroundColor: isSaved ? colors.primary + '20' : colors.background,
          borderColor: isSaved ? colors.primary : colors.border,
        }}
      >
        <FiBookmark
          size={18}
          style={{ color: isSaved ? colors.primary : colors.textMain }}
          fill={isSaved ? colors.primary : 'transparent'}
        />
      </button>
    </div>
  );
}
