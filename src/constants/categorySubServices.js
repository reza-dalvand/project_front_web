// src/constants/categorySubServices.js
/**
 * ✅ فاز ۴: CATEGORY_SUB_SERVICES حذف شد
 *
 * به جای این ثابت، از هوک داینامیک استفاده کنید:
 * - useSubServices(categoryId) از '@/hooks/useCategoryOptions'
 */

// گزینه‌های مرتب‌سازی — ثابت است و نیازی به بک‌اند ندارد
export const SORT_OPTIONS = [
  { id: 'all', label: 'همه', icon: 'apps' },
  { id: 'top_rated', label: 'بیشترین امتیاز', icon: 'star' },
  { id: 'most_booked', label: 'بیشترین رزرو', icon: 'trending-up' },
  { id: 'highest_discount', label: 'بیشترین تخفیف', icon: 'local-offer' },
];
