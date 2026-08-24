// src/constants/exploreFilters.js
/**
 * ✅ فاز ۴: ثابت‌های هاردکد حذف شدند
 *
 * به جای ثابت‌های هاردکد، از هوک‌های داینامیک استفاده کنید:
 * - useProvinces() از '@/hooks/useLocationOptions'
 * - useCities(provinceId) از '@/hooks/useLocationOptions'
 * - useBusinessCategories() از '@/hooks/useCategoryOptions'
 * - useServiceCategories() از '@/hooks/useCategoryOptions'
 * - useSubServices(categoryId) از '@/hooks/useCategoryOptions'
 */

// فیلتر منبع پست — اینها ثابت هستند و نیاز به بک‌اند ندارند
export const SOURCE_FILTERS = [
  { id: 'all', label: 'همه', icon: 'apps' },
  { id: 'business', label: 'پست کسب‌وکارها', icon: 'store' },
  { id: 'magazine', label: 'مجله بیو کلاب', icon: 'auto-awesome' },
];

// تابع کمکی: یافتن label بر اساس id
export const findLabel = (arr, id) => arr.find((item) => item.id === id)?.label;
