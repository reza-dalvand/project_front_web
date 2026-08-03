'use client';

import { 
  FiHeart, FiScissors, FiStar, FiSun, 
  FiZap, FiDroplet, FiEye, FiEdit3,
  FiMoreHorizontal, FiFeather
} from 'react-icons/fi';

// 🎨 مپ رنگ و آیکون برای هر نوع خدمت
const TYPE_CONFIG = {
  facial:     { icon: FiHeart,             gradient: ['#F8BBD9', '#F48FB1'], color: '#C2185B' },
  nail:       { icon: FiEdit3,             gradient: ['#E1BEE7', '#BA68C8'], color: '#7B1FA2' },
  hair_color: { icon: FiStar,              gradient: ['#B3E5FC', '#4FC3F7'], color: '#0277BD' },
  keratin:    { icon: FiSun,               gradient: ['#FFE082', '#FFB74D'], color: '#E65100' },
  laser:      { icon: FiZap,               gradient: ['#B2EBF2', '#26C6DA'], color: '#00838F' },
  makeup:     { icon: FiFeather,           gradient: ['#F8BBD0', '#EC407A'], color: '#AD1457' },
  eyelash:    { icon: FiEye,               gradient: ['#D1C4E9', '#7E57C2'], color: '#4527A0' },
  waxing:     { icon: FiDroplet,           gradient: ['#C8E6C9', '#66BB6A'], color: '#2E7D32' },
  massage:    { icon: FiHeart,             gradient: ['#DCEDC8', '#AED581'], color: '#558B2F' },
  tattoo:     { icon: FiEdit3,             gradient: ['#FFCCBC', '#FF8A65'], color: '#D84315' },
  skincare:   { icon: FiDroplet,           gradient: ['#B2DFDB', '#4DB6AC'], color: '#00695C' },
  hair_cut:   { icon: FiScissors,          gradient: ['#D7CCC8', '#A1887F'], color: '#5D4037' },
  bridal:     { icon: FiStar,              gradient: ['#F8BBD0', '#F06292'], color: '#880E4F' },
  other:      { icon: FiMoreHorizontal,    gradient: ['#CFD8DC', '#90A4AE'], color: '#455A64' },
};

/**
 * کامپوننت آیکون نوع خدمت
 * @param {string} typeId - شناسه نوع خدمت
 * @param {number} size - اندازه آیکون (پیش‌فرض: 56)
 */
export default function ServiceTypeIcon({ typeId, size = 56 }) {
  const config = TYPE_CONFIG[typeId] || TYPE_CONFIG.other;
  const Icon = config.icon;
  const iconSize = size * 0.5;
  const innerSize = size * 0.78;

  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.32,
        backgroundColor: config.gradient[0] + '60',
      }}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: innerSize,
          height: innerSize,
          backgroundColor: config.gradient[1] + '40',
        }}
      >
        <Icon size={iconSize} style={{ color: config.color }} />
      </div>
    </div>
  );
}

// Export برای استفاده در جاهای دیگر
export { TYPE_CONFIG };