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
} from 'react-icons/fi';

// ═══════════════════════════════════════
//    لیست تخت انواع خدمات (برای Dropdown ساده)
//    استفاده شده در: EditServiceScreen, CreateLineRentalAdSheet, ServicesManagement
// ═══════════════════════════════════════
export const SERVICE_TYPES = [
  { id: 'facial', label: 'فیشیال و پاکسازی پوست' },
  { id: 'nail', label: 'کاشت و طراحی ناخن' },
  { id: 'hair_color', label: 'رنگ و مش مو' },
  { id: 'keratin', label: 'کراتین و احیای مو' },
  { id: 'laser', label: 'لیزر موهای زائد' },
  { id: 'makeup', label: 'میکاپ و گریم' },
  { id: 'eyelash', label: 'کاشت مژه و ابرو' },
  { id: 'waxing', label: 'اپیلاسیون' },
  { id: 'massage', label: 'ماساژ' },
  { id: 'tattoo', label: 'تتو و هاشور' },
  { id: 'skincare', label: 'مراقبت پوست' },
  { id: 'hair_cut', label: 'کوتاهی و حالت مو' },
  { id: 'bridal', label: 'خدمات عروس' },
  { id: 'hair_extensions', label: 'اکستنشن مو' },
  { id: 'other', label: 'سایر خدمات' },
];

// ═══════════════════════════════════════
//    ساختار سلسله‌مراتبی دسته‌بندی خدمات
//    استفاده شده در: PortfolioFormSheet, ServicesManagement (جدید)
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
//    تنظیمات آیکون و رنگ هر نوع خدمت
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
export const getServiceTypeById = (typeId) =>
  SERVICE_TYPES.find((t) => t.id === typeId) || SERVICE_TYPES[SERVICE_TYPES.length - 1];

export const getServiceTypeConfig = (typeId) =>
  SERVICE_TYPE_CONFIG[typeId] || SERVICE_TYPE_CONFIG.other;

export const getServiceTypeOptions = () => SERVICE_TYPES.map((t) => ({ id: t.id, label: t.label }));

export const getCategoryById = (catId) => SERVICE_CATEGORIES.find((c) => c.id === catId);

export const getSubServicesByCategory = (catId) => {
  const cat = getCategoryById(catId);
  return cat ? cat.subServices : [];
};

export const getSubServiceLabel = (catId, subId) => {
  const cat = getCategoryById(catId);
  if (!cat) return '';
  return cat.subServices.find((s) => s.id === subId)?.label || '';
};

/**
 * پیدا کردن اطلاعات کامل سرویس بر اساس typeId
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
