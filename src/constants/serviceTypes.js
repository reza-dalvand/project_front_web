// src/constants/serviceTypes.js
/**
* 📦 لیست کامل انواع خدمات و تنظیمات آیکون/رنگ هر کدام
*
* استفاده شده در:
* - ServicesManagement (createbusiness)
* - EditServiceScreen (manageBusiness)
* - ServiceTypeIcon (manageBusiness/services)
* - ServiceBookingCard (home)
* - CreateLineRentalAdSheet (manageBusiness/lineRental)
* - ScheduleModal (manageBusiness/schedule)
*/

// ═══════════════════════════════════════
//    لیست انواع خدمات (برای Dropdown)
// ═══════════════════════════════════════
export const SERVICE_TYPES = [
  { id: 'facial',           label: 'فیشیال و پاکسازی پوست' },
  { id: 'nail',             label: 'کاشت و طراحی ناخن' },
  { id: 'hair_color',       label: 'رنگ و مش مو' },
  { id: 'keratin',          label: 'کراتین و احیای مو' },
  { id: 'laser',            label: 'لیزر موهای زائد' },
  { id: 'makeup',           label: 'میکاپ و گریم' },
  { id: 'eyelash',          label: 'کاشت مژه و ابرو' },
  { id: 'waxing',           label: 'اپیلاسیون' },
  { id: 'massage',          label: 'ماساژ' },
  { id: 'tattoo',           label: 'تتو و هاشور' },
  { id: 'skincare',         label: 'مراقبت پوست' },
  { id: 'hair_cut',         label: 'کوتاهی و حالت مو' },
  { id: 'bridal',           label: 'خدمات عروس' },
  { id: 'hair_extensions',  label: 'اکستنشن مو' },
  { id: 'other',            label: 'سایر خدمات' },
];

// ═══════════════════════════════════════
//    تنظیمات آیکون و رنگ هر نوع خدمت
//    (برای ServiceTypeIcon و ServiceBookingCard)
// ═══════════════════════════════════════
export const SERVICE_TYPE_CONFIG = {
  facial:          { icon: 'face-retouching-natural', color: '#C2185B', gradient: ['#F8BBD9', '#F48FB1'], bg: '#F8BBD9' },
  nail:            { icon: 'brush',                   color: '#7B1FA2', gradient: ['#E1BEE7', '#BA68C8'], bg: '#E1BEE7' },
  hair_color:      { icon: 'auto-awesome',            color: '#0277BD', gradient: ['#B3E5FC', '#4FC3F7'], bg: '#B3E5FC' },
  keratin:         { icon: 'flare',                   color: '#E65100', gradient: ['#FFE082', '#FFB74D'], bg: '#FFE082' },
  laser:           { icon: 'flash-on',                color: '#00838F', gradient: ['#B2EBF2', '#26C6DA'], bg: '#B2EBF2' },
  makeup:          { icon: 'palette',                 color: '#AD1457', gradient: ['#F8BBD0', '#EC407A'], bg: '#F8BBD0' },
  eyelash:         { icon: 'visibility',              color: '#4527A0', gradient: ['#D1C4E9', '#7E57C2'], bg: '#D1C4E9' },
  waxing:          { icon: 'spa',                     color: '#2E7D32', gradient: ['#C8E6C9', '#66BB6A'], bg: '#C8E6C9' },
  massage:         { icon: 'self-improvement',        color: '#558B2F', gradient: ['#DCEDC8', '#AED581'], bg: '#DCEDC8' },
  tattoo:          { icon: 'edit',                    color: '#D84315', gradient: ['#FFCCBC', '#FF8A65'], bg: '#FFCCBC' },
  skincare:        { icon: 'water-drop',              color: '#00695C', gradient: ['#B2DFDB', '#4DB6AC'], bg: '#B2DFDB' },
  hair_cut:        { icon: 'content-cut',             color: '#5D4037', gradient: ['#D7CCC8', '#A1887F'], bg: '#D7CCC8' },
  bridal:          { icon: 'diamond',                 color: '#880E4F', gradient: ['#F8BBD0', '#F06292'], bg: '#F8BBD0' },
  hair_extensions: { icon: 'extension',               color: '#4E342E', gradient: ['#BCAAA4', '#8D6E63'], bg: '#BCAAA4' },
  other:           { icon: 'more-horiz',              color: '#455A64', gradient: ['#CFD8DC', '#90A4AE'], bg: '#CFD8DC' },
  default:         { icon: 'spa',                     color: '#455A64', gradient: ['#CFD8DC', '#90A4AE'], bg: '#CFD8DC' },
};

// ═══════════════════════════════════════
//    توابع کمکی
// ═══════════════════════════════════════

/**
* گرفتن اطلاعات کامل یک نوع خدمت بر اساس ID
*/
export const getServiceTypeById = (typeId) => {
  return SERVICE_TYPES.find((t) => t.id === typeId) || SERVICE_TYPES[SERVICE_TYPES.length - 1];
};

/**
* گرفتن کانفیگ آیکون/رنگ یک نوع خدمت
*/
export const getServiceTypeConfig = (typeId) => {
  return SERVICE_TYPE_CONFIG[typeId] || SERVICE_TYPE_CONFIG.other;
};

/**
* گرفتن لیست گزینه‌ها برای Dropdown (فقط id و label)
*/
export const getServiceTypeOptions = () => {
  return SERVICE_TYPES.map((t) => ({ id: t.id, label: t.label }));
};