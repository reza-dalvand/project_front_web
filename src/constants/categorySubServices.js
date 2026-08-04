// src/constants/categorySubServices.js
/**
* 📦 زیرخدمات هر دسته‌بندی اصلی
* استفاده شده در CategoryFilterModal و CategoryBusinessesScreen
*/
export const CATEGORY_SUB_SERVICES = {
  1: [ // میکاپ
    { id: 'makeup_bride',     label: 'میکاپ عروس' },
    { id: 'makeup_party',     label: 'میکاپ مجلسی' },
    { id: 'makeup_natural',   label: 'میکاپ طبیعی' },
    { id: 'makeup_european',  label: 'میکاپ اروپایی' },
    { id: 'makeup_grim',      label: 'گریم صورت' },
    { id: 'shinyon',          label: 'شینیون مو' },
  ],
  2: [ // کاشت ناخن
    { id: 'nail_gel',     label: 'کاشت ژله‌ای' },
    { id: 'nail_powder',  label: 'کاشت پودری' },
    { id: 'nail_design',  label: 'طراحی ناخن' },
    { id: 'nail_gelish',  label: 'ژلیش ناخن' },
    { id: 'nail_repair',  label: 'ترمیم ناخن' },
    { id: 'pedicure',     label: 'پدیکور' },
  ],
  3: [ // لیزر مو
    { id: 'laser_alex',      label: 'لیزر الکساندرایت' },
    { id: 'laser_diode',     label: 'لیزر دایود' },
    { id: 'laser_fullbody',  label: 'لیزر فول بادی' },
    { id: 'laser_face',      label: 'لیزر صورت' },
    { id: 'laser_bikini',    label: 'لیزر بیکینی' },
  ],
  4: [ // پاکسازی
    { id: 'facial_basic',    label: 'پاکسازی پایه' },
    { id: 'facial_vip',      label: 'فیشیال VIP' },
    { id: 'facial_gold',     label: 'ماسک طلا' },
    { id: 'facial_hydro',    label: 'هیدروفیشیال' },
    { id: 'facial_acne',     label: 'درمان آکنه' },
    { id: 'facial_antiage',  label: 'جوانسازی' },
  ],
  5: [ // رنگ مو
    { id: 'hair_color_full',  label: 'رنگ کامل مو' },
    { id: 'hair_highlight',   label: 'هایلایت' },
    { id: 'hair_balayage',    label: 'بالیاژ' },
    { id: 'hair_ombre',       label: 'آمبره' },
    { id: 'hair_bleach',      label: 'دکلره' },
    { id: 'hair_root',        label: 'ریشه‌گیری' },
  ],
  6: [ // کراتین
    { id: 'keratin_brazilian',   label: 'کراتین برزیلی' },
    { id: 'keratin_protein',     label: 'پروتئین تراپی' },
    { id: 'keratin_botox',       label: 'بوتاکس مو' },
    { id: 'keratin_nanoplasty',  label: 'نانوپلاستیا' },
    { id: 'hair_straighten',     label: 'صافی دائمی' },
  ],
  7: [ // مژه
    { id: 'lash_classic',   label: 'کاشت کلاسیک' },
    { id: 'lash_hollywood', label: 'کاشت هالیوودی' },
    { id: 'lash_volume',    label: 'کاشت والیوم' },
    { id: 'lash_lift',      label: 'لیفت مژه' },
    { id: 'lash_tint',      label: 'رنگ مژه' },
    { id: 'lash_removal',   label: 'ریموو مژه' },
  ],
  8: [ // ماساژ
    { id: 'massage_swedish',  label: 'ماساژ سوئدی' },
    { id: 'massage_thai',     label: 'ماساژ تایلندی' },
    { id: 'massage_sports',   label: 'ماساژ ورزشی' },
    { id: 'massage_stone',    label: 'ماساژ سنگ داغ' },
    { id: 'massage_aroma',    label: 'آروماتراپی' },
  ],
};

/**
* پیدا کردن زیرخدمات یک دسته بر اساس ID
*/
export const getSubServicesForCategory = (categoryId) => {
  return CATEGORY_SUB_SERVICES[categoryId] || [];
};