// src/stores/business/initialData.js
/**
 * 📦 داده‌های اولیه کسب‌وکار
 *
 * ✅ فاز ۵: تمام داده‌های هاردکد حذف شدند.
 * State اولیه کاملاً خالی است و فقط از API پر می‌شود.
 *
 * ⚠️ توجه: اگر کاربر لاگین نباشد یا کسب‌وکاری نداشته باشد،
 * تمام فیلدها null/خالی خواهند بود. کامپوننت‌ها باید
 * حالت خالی را به درستی مدیریت کنند.
 */

export const STORAGE_VERSION = 5; // ✅ افزایش نسخه به دلیل حذف داده‌های هاردکد

/**
 * ساختار خالی اولیه کسب‌وکار
 * هیچ داده‌ی پیش‌فرضی وجود ندارد — همه چیز از API می‌آید
 */
export const INITIAL_BUSINESS_DATA = {
  // ─── شناسه و وضعیت ───
  id: null,
  isActive: false,
  status: null, // 'pending' | 'approved' | 'rejected'

  // ─── اطلاعات پایه ───
  name: '',
  category: '',
  categoryId: null,
  address: '',
  city: '',
  cityId: null,
  provinceId: null,
  phone: '',
  workingHours: '',
  about: '',

  // ─── آمار و رتبه ───
  rating: 0,
  reviewsCount: 0,
  VIP: false,

  // ─── تصاویر ───
  logo: null,
  coverUrl: null,
  ownerPhoto: null,

  // ─── مالک ───
  ownerName: '',
  verifiedName: '',
  nationalId: '',

  // ─── حساب بانکی ───
  bankInfo: {
    isRegistered: false,
    isVerified: false,
  },

  // ─── لینک رزرو ───
  bookingSlug: '',

  // ─── موقعیت مکانی ───
  latitude: null,
  longitude: null,

  // ─── داده‌های رابطه‌ای (همیشه از API پر می‌شوند) ───
  services: [],
  team: [],
  schedules: {},
  portfolios: [],
  appointments: [],
  gallery: [],
};