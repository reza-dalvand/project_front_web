// src/constants/serviceTypes.js
/**
 * ✅ فاز ۴: ثابت‌های هاردکد حذف شدند
 *
 * به جای ثابت‌های هاردکد، از هوک‌های داینامیک استفاده کنید:
 * - useServiceCategories() از '@/hooks/useCategoryOptions'
 * - useSubServices(categoryId) از '@/hooks/useCategoryOptions'
 *
 * برای دسترسی همگام (سینکرون) در فایل‌های غیرکامپوننت،
 * از useServiceCategories در کامپوننت استفاده کنید.
 */
import {
  FiHeart,
  FiEdit3,
  FiStar,
  FiSun,
  FiZap,
  FiFeather,
  FiEye,
  FiDroplet,
  FiScissors,
  FiMoreHorizontal,
} from 'react-icons/fi';

// ═══════════════════════════════════════
//    تنظیمات آیکون و رنگ هر نوع خدمت
//    اینها ثابت‌های ظاهری هستند و نیازی به بک‌اند ندارند
// ═══════════════════════════════════════
export const SERVICE_TYPE_CONFIG = {
  facial: { icon: FiHeart, color: '#C2185B', gradient: ['#F8BBD9', '#F48FB1'], bg: '#F8BBD9' },
  nail: { icon: FiEdit3, color: '#7B1FA2', gradient: ['#E1BEE7', '#BA68C8'], bg: '#E1BEE7' },
  hair_color: { icon: FiStar, color: '#0277BD', gradient: ['#B3E5FC', '#4FC3F7'], bg: '#B3E5FC' },
  keratin: { icon: FiSun, color: '#E65100', gradient: ['#FFE082', '#FFB74D'], bg: '#FFE082' },
  laser: { icon: FiZap, color: '#00838F', gradient: ['#B2EBF2', '#26C6DA'], bg: '#B2EBF2' },
  makeup: { icon: FiFeather, color: '#AD1457', gradient: ['#F8BBD0', '#EC407A'], bg: '#F8BBD0' },
  eyelash: { icon: FiEye, color: '#4527A0', gradient: ['#D1C4E9', '#7E57C2'], bg: '#D1C4E9' },
  waxing: { icon: FiDroplet, color: '#2E7D32', gradient: ['#C8E6C9', '#66BB6A'], bg: '#C8E6C9' },
  massage: { icon: FiHeart, color: '#558B2F', gradient: ['#DCEDC8', '#AED581'], bg: '#DCEDC8' },
  tattoo: { icon: FiEdit3, color: '#D84315', gradient: ['#FFCCBC', '#FF8A65'], bg: '#FFCCBC' },
  skincare: { icon: FiDroplet, color: '#00695C', gradient: ['#B2DFDB', '#4DB6AC'], bg: '#B2DFDB' },
  hair_cut: { icon: FiScissors, color: '#5D4037', gradient: ['#D7CCC8', '#A1887F'], bg: '#D7CCC8' },
  bridal: { icon: FiStar, color: '#880E4F', gradient: ['#F8BBD0', '#F06292'], bg: '#F8BBD0' },
  hair_extensions: {
    icon: FiEdit3,
    color: '#4E342E',
    gradient: ['#BCAAA4', '#8D6E63'],
    bg: '#BCAAA4',
  },
  other: {
    icon: FiMoreHorizontal,
    color: '#455A64',
    gradient: ['#CFD8DC', '#90A4AE'],
    bg: '#CFD8DC',
  },
  default: {
    icon: FiMoreHorizontal,
    color: '#455A64',
    gradient: ['#CFD8DC', '#90A4AE'],
    bg: '#CFD8DC',
  },
};

// ═══════════════════════════════════════
//    توابع کمکی
// ═══════════════════════════════════════
export const getServiceTypeConfig = (typeId) =>
  SERVICE_TYPE_CONFIG[typeId] || SERVICE_TYPE_CONFIG.other;
