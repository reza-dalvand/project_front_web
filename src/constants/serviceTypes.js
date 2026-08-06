// src/constants/serviceTypes.js

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
  FiClock,
} from 'react-icons/fi';

// ═══════════════════════════════════════
//    ساختار سلسله‌مراتبی خدمات
// ═══════════════════════════════════════
export const SERVICE_CATEGORIES = [
  {
    id: 'nail',
    label: 'کاشت و طراحی ناخن',
    icon: FiEdit3,
    color: '#7B1FA2',
    gradient: ['#E1BEE7', '#BA68C8'],
    subServices: [
      { id: 'nail_extension', label: 'کاشت ناخن' },
      { id: 'nail_gelish', label: 'ژلیش ناخن' },
      { id: 'nail_design', label: 'طراحی ناخن' },
      { id: 'pedicure', label: 'پدیکور' },
      { id: 'manicure', label: 'مانیکور' },
      { id: 'nail_repair', label: 'ترمیم ناخن' },
    ],
  },
  {
    id: 'skin',
    label: 'فیشیال و مراقبت پوست',
    icon: FiHeart,
    color: '#C2185B',
    gradient: ['#F8BBD9', '#F48FB1'],
    subServices: [
      { id: 'facial_basic', label: 'پاکسازی پایه' },
      { id: 'facial_vip', label: 'فیشیال VIP' },
      { id: 'hydrofacial', label: 'هیدروفیشیال' },
      { id: 'acne_treatment', label: 'درمان آکنه' },
      { id: 'skin_rejuvenation', label: 'جوانسازی' },
    ],
  },
  {
    id: 'hair',
    label: 'رنگ، کوتاهی و احیای مو',
    icon: FiScissors,
    color: '#0277BD',
    gradient: ['#B3E5FC', '#4FC3F7'],
    subServices: [
      { id: 'hair_color', label: 'رنگ و مش مو' },
      { id: 'hair_cut', label: 'کوتاهی و حالت مو' },
      { id: 'keratin', label: 'کراتین و احیا' },
      { id: 'hair_highlight', label: 'لایت و بالیاژ' },
      { id: 'bridal_hair', label: 'شینیون عروس' },
    ],
  },
  {
    id: 'makeup',
    label: 'میکاپ و گریم',
    icon: FiFeather,
    color: '#AD1457',
    gradient: ['#F8BBD0', '#EC407A'],
    subServices: [
      { id: 'makeup_bride', label: 'میکاپ عروس' },
      { id: 'makeup_party', label: 'میکاپ مجلسی' },
      { id: 'grim', label: 'گریم صورت' },
    ],
  },
  {
    id: 'laser',
    label: 'لیزر موهای زائد',
    icon: FiZap,
    color: '#00838F',
    gradient: ['#B2EBF2', '#26C6DA'],
    subServices: [
      { id: 'laser_fullbody', label: 'لیزر فول بادی' },
      { id: 'laser_face', label: 'لیزر صورت' },
      { id: 'laser_bikini', label: 'لیزر بیکینی' },
    ],
  },
  {
    id: 'eyelash',
    label: 'مژه و ابرو',
    icon: FiEye,
    color: '#4527A0',
    gradient: ['#D1C4E9', '#7E57C2'],
    subServices: [
      { id: 'lash_extension', label: 'کاشت مژه' },
      { id: 'lash_lift', label: 'لیفت مژه و ابرو' },
      { id: 'lash_tint', label: 'رنگ مژه' },
    ],
  },
  {
    id: 'massage',
    label: 'ماساژ و اسپا',
    icon: FiDroplet,
    color: '#2E7D32',
    gradient: ['#C8E6C9', '#66BB6A'],
    subServices: [
      { id: 'massage_body', label: 'ماساژ بدن' },
      { id: 'massage_face', label: 'ماساژ صورت' },
      { id: 'hot_stone', label: 'ماساژ سنگ داغ' },
    ],
  },
  {
    id: 'other',
    label: 'سایر خدمات',
    icon: FiMoreHorizontal,
    color: '#455A64',
    gradient: ['#CFD8DC', '#90A4AE'],
    subServices: [
      { id: 'tattoo', label: 'تتو و هاشور' },
      { id: 'waxing', label: 'اپیلاسیون' },
      { id: 'custom_service', label: 'خدمت سفارشی' },
    ],
  },
];

// ═══════════════════════════════════════
//    گزینه‌های زمان تمدید مجدد
// ═══════════════════════════════════════
export const RENEWAL_OPTIONS = [
  { id: 0, label: 'نیاز به یادآوری ندارد' },
  { id: 7, label: '۷ روز بعد' },
  { id: 14, label: '۲ هفته بعد' },
  { id: 21, label: '۳ هفته بعد' },
  { id: 30, label: '۱ ماه بعد' },
  { id: 45, label: '۴۵ روز بعد' },
  { id: 60, label: '۲ ماه بعد' },
  { id: 90, label: '۳ ماه بعد' },
];

// ═══════════════════════════════════════
//    توابع کمکی
// ═══════════════════════════════════════
export const getCategoryById = (catId) => SERVICE_CATEGORIES.find((c) => c.id === catId);

export const getSubServicesByCategory = (catId) => {
  const cat = getCategoryById(catId);
  return cat ? cat.subServices : [];
};

/**
 * پیدا کردن اطلاعات کامل سرویس بر اساس typeId
 * برای نمایش آیکون و رنگ در کارت‌ها
 */
export const getServiceTypeInfo = (typeId) => {
  for (const cat of SERVICE_CATEGORIES) {
    if (cat.subServices.some((s) => s.id === typeId)) {
      return {
        categoryId: cat.id,
        categoryLabel: cat.label,
        typeId,
        typeLabel: cat.subServices.find((s) => s.id === typeId)?.label || typeId,
        icon: cat.icon,
        color: cat.color,
        gradient: cat.gradient,
      };
    }
  }
  // Fallback
  return {
    categoryId: 'other',
    categoryLabel: 'سایر',
    typeId,
    typeLabel: typeId,
    icon: FiMoreHorizontal,
    color: '#455A64',
    gradient: ['#CFD8DC', '#90A4AE'],
  };
};
