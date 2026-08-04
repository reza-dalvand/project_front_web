// src/constants/serviceTypes.js
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

export const getServiceTypeById = (typeId) =>
  SERVICE_TYPES.find((t) => t.id === typeId) || SERVICE_TYPES[SERVICE_TYPES.length - 1];