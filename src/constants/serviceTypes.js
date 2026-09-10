// src/constants/serviceTypes.js
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

// نگاشت آیکون بر اساس نام آیکون بک‌اند
const ICON_MAP = {
  nail: FiEdit3,
  skin: FiHeart,
  hair: FiScissors,
  makeup: FiFeather,
  laser: FiZap,
  eyelash: FiEye,
  massage: FiDroplet,
  waxing: FiDroplet,
  bridal: FiStar,
  tattoo: FiEdit3,
  skincare: FiDroplet,
  keratin: FiSun,
  other: FiMoreHorizontal,
  default: FiStar,
};

// نگاشت رنگ بر اساس نام آیکون بک‌اند
const COLOR_MAP = {
  nail: '#7B1FA2',
  skin: '#C2185B',
  hair: '#0277BD',
  makeup: '#AD1457',
  laser: '#00838F',
  eyelash: '#4527A0',
  massage: '#2E7D32',
  waxing: '#558B2F',
  bridal: '#880E4F',
  tattoo: '#D84315',
  skincare: '#00695C',
  keratin: '#E65100',
  other: '#455A64',
  default: '#455A64',
};

// نگاشت گرادیان بر اساس نام آیکون بک‌اند
const GRADIENT_MAP = {
  nail: ['#E1BEE7', '#BA68C8'],
  skin: ['#F8BBD9', '#F48FB1'],
  hair: ['#B3E5FC', '#4FC3F7'],
  makeup: ['#F8BBD0', '#EC407A'],
  laser: ['#B2EBF2', '#26C6DA'],
  eyelash: ['#D1C4E9', '#7E57C2'],
  massage: ['#C8E6C9', '#66BB6A'],
  waxing: ['#DCEDC8', '#AED581'],
  bridal: ['#F8BBD0', '#F06292'],
  tattoo: ['#FFCCBC', '#FF8A65'],
  skincare: ['#B2DFDB', '#4DB6AC'],
  keratin: ['#FFE082', '#FFB74D'],
  other: ['#CFD8DC', '#90A4AE'],
  default: ['#CFD8DC', '#90A4AE'],
};

/**
 * دریافت تنظیمات آیکون، رنگ و گرادیان بر اساس شناسه نوع خدمت
 * @param {string} typeId - شناسه نوع خدمت (مثلاً 'nail', 'skin', 'hair')
 * @returns {{ icon: any, color: string, gradient: string[] }}
 */
export const getServiceTypeConfig = (typeId) => {
  return {
    icon: ICON_MAP[typeId] || ICON_MAP.default,
    color: COLOR_MAP[typeId] || COLOR_MAP.default,
    gradient: GRADIENT_MAP[typeId] || GRADIENT_MAP.default,
  };
};

// Alias برای سازگاری با کدهای قدیمی‌تر
export const getServiceTypeInfo = getServiceTypeConfig;
