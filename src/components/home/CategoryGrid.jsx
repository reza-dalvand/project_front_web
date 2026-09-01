'use client';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';
import {
  FiEdit3,
  FiHeart,
  FiScissors,
  FiFeather,
  FiZap,
  FiEye,
  FiDroplet,
  FiMoreHorizontal,
  FiStar,
  FiSun,
} from 'react-icons/fi';

// ═══ نگاشت آیکون بر اساس مقادیر بک‌اند ═══
// مقادیر باید دقیقاً با icon_name در ServiceCategory بک‌اند مطابقت داشته باشند
const ICON_MAP = {
  // مقادیر اصلی بک‌اند
  nail: FiEdit3,
  skin: FiHeart,
  skin_face: FiHeart,
  hair: FiScissors,
  makeup: FiFeather,
  laser: FiZap,
  eyelash: FiEye,
  brow_lash: FiEye,
  massage: FiDroplet,
  waxing: FiDroplet,
  bridal: FiStar,
  tattoo: FiEdit3,
  skincare: FiDroplet,
  keratin: FiSun,
  facial: FiDroplet,
  // مقادیر قدیمی (سازگاری)
  face: FiFeather,
  brush: FiEdit3,
  'flash-on': FiZap,
  spa: FiHeart,
  palette: FiFeather,
  'auto-awesome': FiStar,
  visibility: FiEye,
  'self-improvement': FiDroplet,
  // پیش‌فرض
  other: FiMoreHorizontal,
  default: FiStar,
};

// ═══ نگاشت رنگ بر اساس آیکون ═══
const COLOR_MAP = {
  nail: '#7B1FA2',
  skin: '#C2185B',
  skin_face: '#C2185B',
  hair: '#0277BD',
  makeup: '#AD1457',
  laser: '#00838F',
  eyelash: '#4527A0',
  brow_lash: '#4527A0',
  massage: '#2E7D32',
  waxing: '#558B2F',
  bridal: '#880E4F',
  tattoo: '#D84315',
  skincare: '#00695C',
  keratin: '#E65100',
  facial: '#00695C',
  face: '#AD1457',
  brush: '#7B1FA2',
  spa: '#C2185B',
  other: '#455A64',
  default: '#455A64',
};

export default function CategoryGrid({ categories = [], onSelect, selectedId }) {
  const { colors } = useTheme();

  if (!categories || categories.length === 0) return null;

  return (
    <div className="grid grid-cols-4 gap-3 px-3">
      {categories.map((item) => {
        const isSelected = item.id === selectedId;
        const hasCount = (item.count || 0) > 0;
        console.log(item.count, 'has');

        // دریافت آیکون و رنگ
        const iconKey = (item.icon || 'default').toLowerCase().replace(/\s+/g, '_');
        const IconComponent = ICON_MAP[iconKey] || ICON_MAP.default;
        const iconColor = COLOR_MAP[iconKey] || COLOR_MAP.default;
        const gradientStart = item.gradientStart || iconColor;
        const gradientEnd = item.gradientEnd || iconColor + 'CC';

        return (
          <div key={item.id} className="flex flex-col items-center relative">
            <button
              onClick={() => onSelect?.(item)}
              className="w-full aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: isSelected
                  ? `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`
                  : colors.cardBackground,
                borderColor: isSelected ? gradientStart : colors.border,
                background: isSelected
                  ? `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`
                  : colors.cardBackground,
              }}
            >
              {/* آیکون */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : `${iconColor}15`,
                }}
              >
                <IconComponent
                  size={20}
                  style={{
                    color: isSelected ? '#fff' : iconColor,
                  }}
                />
              </div>
              {/* نام */}
              <span
                className="text-[11px] font-[Vazir-Medium] text-center line-clamp-1 px-1 w-full"
                style={{
                  color: isSelected ? '#fff' : colors.textMain,
                }}
              >
                {item.name}
              </span>
            </button>
            {/* Badge تعداد */}
            {hasCount && (
              <div
                className="absolute -top-2 -left-2 min-w-[20px] h-5 rounded-full flex items-center justify-center px-1.5 border-2"
                style={{
                  backgroundColor: '#E53935',
                  borderColor: colors.background,
                }}
              >
                <span className="text-[10px] font-[Vazir-Bold] text-white">
                  {toPersianDigit(item.count > 99 ? '99+' : item.count)}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
