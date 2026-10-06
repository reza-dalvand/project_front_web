// src/stores/business/initialData.js
/**
 * 📦 داده‌های اولیه کسب‌وکار
 * ✅ State اولیه کاملاً خالی — فقط از API پر می‌شود
 */

export const STORAGE_VERSION = 5;

export const INITIAL_BUSINESS_DATA = {
  // ─── شناسه و وضعیت ───
  id: null,
  isActive: false,
  status: null,

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
  isNationalIdVerified: false,

  // ─── حساب بانکی ───
  bankInfo: {
    isRegistered: false,
    isVerified: false,
    bankName: '',
    bankId: '',
    sheba: '',
    cardNumber: '',
    ownerName: '',
    accountNumber: '',
    nationalId: '',
  },

  // ─── لینک رزرو ───
  bookingSlug: '',

  // ─── موقعیت مکانی ───
  latitude: null,
  longitude: null,

  // ─── ✅ FIX باگ ۱۳: فیلدهای تعلیق ───
  isSuspended: false,
  suspensionReason: '',

  // ─── آمار لینک رزرو ───
  bookingLinkClicks: 0,
  bookingLinkBookings: 0,

  // ─── داده‌های رابطه‌ای ───
  services: [],
  team: [],
  schedules: {},
  portfolios: [],
  appointments: [],
  gallery: [],
};