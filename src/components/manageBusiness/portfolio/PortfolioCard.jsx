'use client';

import Image from 'next/image';
import { FiEdit2, FiTrash2, FiImage } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

export default function PortfolioCard({ portfolio, onPress, onEdit, onDelete }) {
  const { colors } = useTheme();
  const imageCount = portfolio.images?.length || 1;

  return (
    <div
      className="w-[48%] rounded-[18px] border overflow-hidden shadow-sm cursor-pointer
        transition-transform hover:scale-[1.02] active:scale-[0.98]"
      style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
      onClick={() => onPress?.(portfolio)}
    >
      {/* تصویر */}
      <div className="relative w-full aspect-square">
        <Image
          src={portfolio.coverImage || portfolio.images?.[0]}
          alt={portfolio.title || 'portfolio'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 48vw, 300px"
        />
        {/* Badge تعداد تصاویر */}
        {imageCount > 1 && (
          <div
            className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          >
            <FiImage size={10} color="#fff" />
            <span className="text-[10px] font-[Vazir-Bold] text-white">
              {toPersianDigit(imageCount)}
            </span>
          </div>
        )}
        {/* عنوان روی تصویر */}
        {portfolio.title && (
          <div className="absolute bottom-0 left-0 right-0 px-2.5 py-2 bg-black/40">
            <p className="text-xs font-[Vazir-Bold] text-white line-clamp-1">{portfolio.title}</p>
          </div>
        )}
      </div>

      {/* اطلاعات و دکمه‌ها */}
      <div className="p-2.5 flex items-center justify-between gap-2">
        <span
          className="text-[11px] font-[Vazir-Medium] truncate flex-1"
          style={{ color: colors.textSecondary }}
        >
          {portfolio.serviceName || 'بدون خدمت'}
        </span>
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(portfolio);
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <FiEdit2 size={13} style={{ color: colors.primary }} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(portfolio);
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#E5393515]"
          >
            <FiTrash2 size={13} color="#E53935" />
          </button>
        </div>
      </div>
    </div>
  );
}
