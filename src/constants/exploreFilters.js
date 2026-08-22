// src/constants/exploreFilters.js

export const PROVINCES = [
  { id: 'tehran', label: 'تهران' },
  { id: 'alborz', label: 'البرز' },
  { id: 'isfahan', label: 'اصفهان' },
  { id: 'fars', label: 'فارس' },
  { id: 'khorasan', label: 'خراسان رضوی' },
];

export const CITIES = {
  tehran: [
    { id: 'tehran-city', label: 'تهران' },
    { id: 'shemiran', label: 'شمیرانات' },
    { id: 'rey', label: 'ری' },
  ],
  alborz: [
    { id: 'karaj', label: 'کرج' },
    { id: 'fardis', label: 'فردیس' },
  ],
  isfahan: [
    { id: 'isfahan-city', label: 'اصفهان' },
    { id: 'kashan', label: 'کاشان' },
  ],
  fars: [{ id: 'shiraz', label: 'شیراز' }],
  khorasan: [{ id: 'mashhad', label: 'مشهد' }],
};

export const BUSINESS_TYPES = [
  { id: 'salon', label: 'سالن زیبایی' },
  { id: 'clinic', label: 'کلینیک پوست و مو' },
  { id: 'nail', label: 'مرکز کاشت ناخن' },
  { id: 'laser', label: 'مرکز لیزر' },
  { id: 'keratin', label: 'مرکز کراتین و رنگ مو' },
  { id: 'makeup', label: 'میکاپ و گریم' },
];

// دسته‌بندی‌های کلی (Main Categories)
export const MAIN_CATEGORIES = [
  { id: 'all', label: 'همه دسته‌ها', icon: 'apps' },
  { id: 'nail', label: 'ناخن', icon: 'brush' },
  { id: 'hair', label: 'مو', icon: 'content-cut' },
  { id: 'skin', label: 'پوست', icon: 'face' },
  { id: 'makeup', label: 'میکاپ', icon: 'palette' },
  { id: 'laser', label: 'لیزر', icon: 'flash-on' },
  { id: 'massage', label: 'ماساژ', icon: 'self-improvement' },
  { id: 'eyelash', label: 'مژه و ابرو', icon: 'visibility' },
  { id: 'keratin', label: 'کراتین', icon: 'flare' },
];

// زیردسته‌ها بر اساس دسته اصلی
export const SUB_CATEGORIES = {
  nail: [
    { id: 'all_nail', label: 'همه خدمات ناخن' },
    { id: 'nail_extension', label: 'کاشت ناخن' },
    { id: 'nail_gelish', label: 'ژلیش ناخن' },
    { id: 'pedicure', label: 'پدیکور' },
    { id: 'manicure', label: 'مانیکور' },
    { id: 'nail_design', label: 'طراحی ناخن' },
    { id: 'nail_repair', label: 'ترمیم ناخن' },
  ],
  hair: [
    { id: 'all_hair', label: 'همه خدمات مو' },
    { id: 'hair_cut', label: 'کوتاهی مو' },
    { id: 'hair_color', label: 'رنگ مو' },
    { id: 'hair_highlight', label: 'لایت مو' },
    { id: 'hair_keratin', label: 'کراتین مو' },
    { id: 'hair_treatment', label: 'احیا مو' },
    { id: 'hair_styling', label: 'شینیون' },
    { id: 'hair_braiding', label: 'بافت مو' },
  ],
  skin: [
    { id: 'all_skin', label: 'همه خدمات پوست' },
    { id: 'facial', label: 'فیشیال' },
    { id: 'skin_cleansing', label: 'پاکسازی پوست' },
    { id: 'skin_rejuvenation', label: 'جوانسازی' },
    { id: 'acne_treatment', label: 'درمان آکنه' },
    { id: 'face_mask', label: 'ماسک صورت' },
    { id: 'hydrofacial', label: 'هیدروفیشیال' },
  ],
  makeup: [
    { id: 'all_makeup', label: 'همه خدمات میکاپ' },
    { id: 'bridal_makeup', label: 'میکاپ عروس' },
    { id: 'party_makeup', label: 'میکاپ مجلسی' },
    { id: 'grim', label: 'گریم' },
    { id: 'natural_makeup', label: 'میکاپ طبیعی' },
  ],
  laser: [
    { id: 'all_laser', label: 'همه خدمات لیزر' },
    { id: 'face_laser', label: 'لیزر صورت' },
    { id: 'body_laser', label: 'لیزر بدن' },
    { id: 'bikini_laser', label: 'لیزر بیکینی' },
    { id: 'alex_laser', label: 'لیزر الکس' },
    { id: 'diode_laser', label: 'لیزر دایود' },
  ],
  massage: [
    { id: 'all_massage', label: 'همه خدمات ماساژ' },
    { id: 'swedish_massage', label: 'ماساژ سوئدی' },
    { id: 'thai_massage', label: 'ماساژ تایلندی' },
    { id: 'hot_stone', label: 'ماساژ سنگ داغ' },
    { id: 'sports_massage', label: 'ماساژ ورزشی' },
  ],
  eyelash: [
    { id: 'all_eyelash', label: 'همه خدمات مژه' },
    { id: 'lash_extension', label: 'کاشت مژه' },
    { id: 'lash_lift', label: 'لیفت مژه' },
    { id: 'lash_tint', label: 'رنگ مژه' },
    { id: 'lash_repair', label: 'ترمیم مژه' },
  ],
  keratin: [
    { id: 'all_keratin', label: 'همه خدمات کراتین' },
    { id: 'brazilian_keratin', label: 'کراتین برزیلی' },
    { id: 'protein_therapy', label: 'پروتئین تراپی' },
    { id: 'hair_botox', label: 'بوتاکس مو' },
    { id: 'nanoplasty', label: 'نانوپلاستیا' },
  ],
};

// فیلتر منبع پست
export const SOURCE_FILTERS = [
  { id: 'all', label: 'همه', icon: 'apps' },
  { id: 'business', label: 'پست کسب‌وکارها', icon: 'store' },
  { id: 'magazine', label: 'مجله بیو کلاب', icon: 'auto-awesome' },
];

// تابع کمکی: یافتن label بر اساس id
export const findLabel = (arr, id) => arr.find((item) => item.id === id)?.label;
