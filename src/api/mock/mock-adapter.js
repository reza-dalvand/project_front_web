// src/api/mock/mock-adapter.js
/**
 * 🎭 Mock Adapter
 *
 * در حالت USE_MOCK = true، این ماژول پاسخ‌های Mock برمی‌گرداند.
 * ساختار پاسخ‌ها دقیقاً مطابق فرمت بک‌اند است.
 *
 * فرمت پاسخ:
 * { success: true, data: {...}, message: '...', meta: {...} }
 */

// ═══════════════════════════════════════════════
//    Import داده‌های Mock از src/data
// ═══════════════════════════════════════════════
import {
  MOCK_BUSINESS,
  MOCK_BUSINESSES_LIST,
  MOCK_BUSINESSES_MAP,
  MOCK_CATEGORIES,
  MOCK_FAVORITE_BUSINESSES,
  MOCK_FAVORITE_POSTS,
} from '@/data/businesses';
import { MOCK_ALL_ADS, MOCK_ADS } from '@/data/ads';
import { MOCK_MODEL_REQUESTS } from '@/data/modelRequests';
import { MOCK_LINE_RENTALS } from '@/data/lineRentals';
import { MOCK_POSTS } from '@/data/posts';
import { MOCK_NOTIFICATIONS } from '@/data/notifications';
import { MOCK_PAYMENTS } from '@/data/payments';
import { MOCK_TRANSACTIONS } from '@/data/transactions';
import { MOCK_PROFILE_APPOINTMENTS, MOCK_DONE_APPOINTMENTS } from '@/data/appointments';
import { MOCK_REMINDER_CUSTOMERS } from '@/data/reminders';
import { MOCK_REVIEWS } from '@/data/reviews';
import { MOCK_DEVICES } from '@/data/devices';

// ═══════════════════════════════════════════════
//    Helper: ساخت Response موفق
// ═══════════════════════════════════════════════
const successResponse = (data, message = null, meta = null) => {
  const response = { success: true, data };
  if (message) response.message = message;
  if (meta) response.meta = meta;
  return response;
};

// ═══════════════════════════════════════════════
//    Helper: ساخت Response خطا
// ═══════════════════════════════════════════════
const errorResponse = (code, message, details = {}) => {
  return {
    success: false,
    error: { code, message, details },
  };
};

// ═══════════════════════════════════════════════
//    Helper: Pagination
// ═══════════════════════════════════════════════
const paginate = (items, page = 1, pageSize = 20) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedItems = items.slice(start, end);

  return {
    items: paginatedItems,
    meta: {
      count: items.length,
      total_pages: Math.ceil(items.length / pageSize),
      current_page: page,
      page_size: pageSize,
      next: end < items.length ? page + 1 : null,
      previous: page > 1 ? page - 1 : null,
    },
  };
};

// ═══════════════════════════════════════════════
//    Route Handlers
// ═══════════════════════════════════════════════
const routeHandlers = {
  // ─── Auth ───
  'GET /accounts/profile': () => {
    return successResponse({
      id: 1,
      phone: '09121234567',
      phone_display: '۰۹۱۲***۴۵۶۷',
      first_name: 'مریم',
      last_name: 'حسینی',
      full_name: 'مریم حسینی',
      avatar: null,
      is_verified: true,
      is_national_id_verified: true,
      verified_name: 'مریم حسینی',
      date_joined: '2024-01-15T10:00:00Z',
    });
  },

  'POST /accounts/auth/otp/send': () => {
    return successResponse(
      {
        expires_in: 300,
        resend_after: 60,
        is_registered: true, // ✅ جدید
      },
      'کد تایید به شماره شما ارسال شد'
    );
  },

  'POST /accounts/auth/otp/verify': () => {
    return successResponse(
      {
        is_new_user: false,
        needs_profile_completion: false, // ✅ جدید
        access_token: 'mock_access_token_' + Date.now(),
        refresh_token: 'mock_refresh_token_' + Date.now(),
        token_type: 'Bearer',
        expires_in: 3600,
        user: {
          id: 1,
          phone: '09121234567',
          phone_display: '۰۹۱۲***۴۵۶۷',
          first_name: 'مریم',
          last_name: 'حسینی',
          full_name: 'مریم حسینی',
          avatar: null,
          is_verified: true,
          is_national_id_verified: false,
          verified_name: '',
          date_joined: '2024-01-15T10:00:00Z',
        },
      },
      'ورود موفقیت‌آمیز'
    );
  },

  // ✅ جدید: اضافه کردن این handler
  'POST /accounts/account/delete/send-otp': () => {
    return successResponse({ expires_in: 300, resend_after: 60 }, 'کد تایید حذف حساب ارسال شد');
  },

  'POST /accounts/auth/token/refresh': () => {
    return successResponse({
      access: 'mock_new_access_token_' + Date.now(),
      refresh: 'mock_new_refresh_token_' + Date.now(),
    });
  },

  'POST /accounts/auth/logout': () => {
    return successResponse(null, 'با موفقیت خارج شدید');
  },

  'POST /accounts/auth/national-id/verify': () => {
    return successResponse(
      {
        verified_name: 'مریم حسینی',
        national_id: '0012345679',
        phone_display: '۰۹۱۲***۴۵۶۷',
      },
      'هویت شما با موفقیت تایید شد'
    );
  },

  'GET /accounts/devices': () => {
    return successResponse(MOCK_DEVICES, null, { count: MOCK_DEVICES.length });
  },

  'POST /accounts/devices/:id/revoke': () => {
    return successResponse(null, 'نشست دستگاه بسته شد');
  },

  'POST /accounts/account/delete': () => {
    return successResponse(null, 'حساب کاربری شما با موفقیت حذف شد');
  },

  'POST /accounts/profile/change-phone': () => {
    return successResponse(
      {
        new_phone: '09129876543',
        new_phone_display: '۰۹۱۲***۶۵۴۳',
        expires_in: 300,
      },
      'کد تایید به شماره جدید ارسال شد'
    );
  },

  'POST /accounts/profile/change-phone/confirm': () => {
    return successResponse(
      {
        id: 1,
        phone: '09129876543',
        first_name: 'مریم',
        last_name: 'حسینی',
        full_name: 'مریم حسینی',
      },
      'شماره موبایل با موفقیت تغییر یافت'
    );
  },

  // ─── Categories ───
  'GET /categories/service-categories': () => {
    return successResponse(MOCK_CATEGORIES, null, { count: MOCK_CATEGORIES.length });
  },

  'GET /categories/business-categories': () => {
    return successResponse(
      [
        { id: 1, name: 'سالن زیبایی', slug: 'salon' },
        { id: 2, name: 'کلینیک پوست و مو', slug: 'clinic' },
        { id: 3, name: 'مرکز لیزر', slug: 'laser-center' },
        { id: 4, name: 'مرکز کاشت ناخن', slug: 'nail-center' },
        { id: 5, name: 'مرکز کراتین و رنگ مو', slug: 'keratin-center' },
        { id: 6, name: 'میکاپ و گریم', slug: 'makeup-studio' },
      ],
      null,
      { count: 6 }
    );
  },

  // ─── Locations ───
  'GET /locations/provinces': () => {
    return successResponse(
      [
        { id: 1, name: 'تهران', slug: 'tehran' },
        { id: 2, name: 'البرز', slug: 'alborz' },
        { id: 3, name: 'اصفهان', slug: 'isfahan' },
        { id: 4, name: 'فارس', slug: 'fars' },
        { id: 5, name: 'خراسان رضوی', slug: 'khorasan' },
      ],
      null,
      { count: 5 }
    );
  },

  'GET /locations/provinces/:id/cities': () => {
    return successResponse(
      [
        { id: 1, name: 'تهران', slug: 'tehran', province: 1 },
        { id: 2, name: 'شمیرانات', slug: 'shemiranat', province: 1 },
        { id: 3, name: 'ری', slug: 'rey', province: 1 },
      ],
      null,
      { count: 3 }
    );
  },

  // ─── Businesses ───
  'POST /businesses/create': () => {
    return successResponse(
      {
        id: 'biz_' + Date.now(),
        name: 'سالن زیبایی جدید',
        status: 'pending',
        booking_slug: 'new-salon-' + Date.now(),
      },
      'کسب‌وکار شما با موفقیت ثبت شد و در انتظار تایید است'
    );
  },

  'GET /businesses/status': () => {
    return successResponse({
      has_business: true,
      business_id: 'biz_1',
      status: 'approved',
      status_display: 'تایید شده',
      rejection_reason: null,
      created_at: '2024-01-15T10:00:00Z',
    });
  },

  'GET /businesses/detail': () => {
    return successResponse(MOCK_BUSINESS);
  },

  'PUT /businesses/bank-info': () => {
    return successResponse(
      {
        bank_owner_name: 'مریم حسینی',
        bank_national_id: '0012345679',
        bank_name: 'بانک ملی',
        bank_sheba: 'IR123456789012345678901234',
        bank_card_number: '6037991812345678',
        bank_info_registered: true,
        bank_info_verified: false,
      },
      'اطلاعات بانکی با موفقیت ثبت شد'
    );
  },

  'DELETE /businesses/delete': () => {
    return successResponse(null, 'کسب‌وکار با موفقیت حذف شد');
  },

  'GET /businesses/public/:slug': () => {
    return successResponse(MOCK_BUSINESS);
  },

  // ─── Services ───
  'GET /services': () => {
    const services = MOCK_BUSINESS.services || [];
    return successResponse(services, null, { count: services.length });
  },

  'GET /services/:id': () => {
    const services = MOCK_BUSINESS.services || [];
    return successResponse(services[0] || null);
  },

  'POST /services/:id/toggle-active': () => {
    return successResponse(null, 'وضعیت خدمت تغییر کرد');
  },

  // ─── Schedules ───
  'GET /schedules': () => {
    return successResponse([], null, { count: 0 });
  },

  'GET /schedules/by-date': () => {
    return successResponse([], null, { count: 0 });
  },

  // ─── Appointments ───
  'POST /appointments/create': () => {
    return successResponse(
      {
        id: 'apt_' + Date.now(),
        status: 'reserved',
        verification_code: '1234',
        date_key: '1405/04/22',
        time_slot: '10:00',
        total_price: 675000,
        deposit_amount: 200000,
        remaining_amount: 475000,
      },
      'نوبت با موفقیت رزرو شد'
    );
  },

  'GET /appointments/my-appointments': () => {
    return successResponse(MOCK_PROFILE_APPOINTMENTS, null, {
      count: MOCK_PROFILE_APPOINTMENTS.length,
    });
  },

  'GET /appointments/business-appointments': () => {
    const appointments = MOCK_BUSINESS.appointments || [];
    return successResponse(appointments, null, { count: appointments.length });
  },

  'GET /appointments/business-stats': () => {
    const appointments = MOCK_BUSINESS.appointments || [];
    return successResponse({
      total: appointments.length,
      reserved: appointments.filter((a) => a.status === 'reserved').length,
      done: appointments.filter((a) => a.status === 'done').length,
      cancelled: appointments.filter((a) => a.status.includes('cancelled')).length,
      today: appointments.filter((a) => a.date_key === '1405/04/22').length,
    });
  },

  'GET /appointments/:id': () => {
    const appointments = MOCK_BUSINESS.appointments || [];
    return successResponse(appointments[0] || null);
  },

  'POST /appointments/:id/cancel': () => {
    return successResponse(null, 'نوبت با موفقیت لغو شد');
  },

  'POST /appointments/:id/regenerate-code': () => {
    return successResponse({ verification_code: '5678' }, 'کد تایید جدید تولید شد');
  },

  'POST /appointments/:id/cancel-by-business': () => {
    return successResponse(null, 'نوبت لغو شد. بیعانه به مشتری مسترد می‌شود.');
  },

  'POST /appointments/:id/verify-code': () => {
    return successResponse(
      {
        appointment_id: 'apt_1',
        status: 'done',
        verified_at: new Date().toISOString(),
      },
      'خدمت تایید شد. بیعانه به حساب شما واریز می‌شود.'
    );
  },

  // ─── Payments ───
  'POST /payments/initiate': () => {
    return successResponse(
      {
        payment_url: 'https://gateway.zibal.ir/start/mock_track_id',
        track_id: 'mock_track_id_' + Date.now(),
        tracking_code: 'TRK-' + Date.now(),
        transaction_id: 'tx_' + Date.now(),
        amount: 200000,
      },
      'لطفاً پرداخت را در درگاه بانکی تکمیل کنید'
    );
  },

  'GET /payments/history': () => {
    return successResponse(MOCK_PAYMENTS, null, { count: MOCK_PAYMENTS.length });
  },

  'GET /payments/history/:id': () => {
    return successResponse(MOCK_PAYMENTS[0] || null);
  },

  'GET /payments/business/stats': () => {
    return successResponse({
      blocked: 500000,
      settling: 300000,
      settled: 1200000,
      refunded: 200000,
      total: 2200000,
    });
  },

  'GET /payments/business/transactions': () => {
    return successResponse(MOCK_TRANSACTIONS, null, { count: MOCK_TRANSACTIONS.length });
  },

  'POST /payments/business/settlement/request': () => {
    return successResponse(
      {
        id: 'stl_' + Date.now(),
        amount: 500000,
        status: 'pending',
        bank_sheba: 'IR123456789012345678901234',
        bank_name: 'بانک ملی',
      },
      'درخواست تسویه ثبت شد'
    );
  },

  'GET /payments/business/settlements': () => {
    return successResponse([], null, { count: 0 });
  },

  // ─── Reviews ───
  'POST /reviews/create': () => {
    return successResponse(
      {
        id: 'rev_' + Date.now(),
        rating: 5,
        comment: 'عالی بود',
        tags: ['clean', 'punctual'],
        created_at: new Date().toISOString(),
      },
      'نظر شما با موفقیت ثبت شد'
    );
  },

  'GET /reviews/business/:id': () => {
    return successResponse(MOCK_REVIEWS, null, { count: MOCK_REVIEWS.length });
  },

  'GET /reviews/my-reviews': () => {
    return successResponse([], null, { count: 0 });
  },

  'GET /reviews/can-review/:id': () => {
    return successResponse({ can_review: true });
  },

  'POST /reviews/reply': () => {
    return successResponse(
      {
        id: 'rev_1',
        reply: 'ممنون از نظر شما',
        replied_at: new Date().toISOString(),
      },
      'پاسخ شما با موفقیت ثبت شد'
    );
  },

  // ─── Favorites ───
  'GET /favorites': () => {
    return successResponse({
      businesses: MOCK_FAVORITE_BUSINESSES,
      posts: MOCK_FAVORITE_POSTS,
    });
  },

  'POST /favorites/toggle': () => {
    return successResponse({ is_favorited: true }, 'به علاقه‌مندی‌ها اضافه شد');
  },

  'GET /favorites/count': () => {
    return successResponse({
      business: MOCK_FAVORITE_BUSINESSES.length,
      post: MOCK_FAVORITE_POSTS.length,
      total: MOCK_FAVORITE_BUSINESSES.length + MOCK_FAVORITE_POSTS.length,
    });
  },

  // ─── Notifications ───
  'GET /notifications': () => {
    return successResponse(MOCK_NOTIFICATIONS, null, { count: MOCK_NOTIFICATIONS.length });
  },

  'GET /notifications/count': () => {
    const unread = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;
    return successResponse({
      total: MOCK_NOTIFICATIONS.length,
      unread,
      by_type: { booking: 2, discount: 1, reminder: 1 },
    });
  },

  'POST /notifications/mark-read': () => {
    return successResponse({ marked_count: 3 }, 'اعلان‌ها خوانده شدند');
  },

  'DELETE /notifications/delete-all': () => {
    return successResponse({ deleted_count: 5 }, 'اعلان‌ها حذف شدند');
  },

  'DELETE /notifications/:id': () => {
    return successResponse(null, 'اعلان حذف شد');
  },

  // ─── Search ───
  'GET /search': () => {
    return successResponse({
      businesses: MOCK_BUSINESSES_LIST,
      services: [],
      posts: MOCK_POSTS,
      model_requests: MOCK_MODEL_REQUESTS,
      line_rentals: MOCK_LINE_RENTALS,
      total: MOCK_BUSINESSES_LIST.length + MOCK_POSTS.length,
    });
  },

  'GET /search/suggestions': () => {
    return successResponse(['فیشیال', 'کاشت ناخن', 'لیزر', 'میکاپ عروس']);
  },

  // ─── Explore ───
  'GET /explore/posts': () => {
    const { items, meta } = paginate(MOCK_POSTS, 1, 20);
    return successResponse(items, null, meta);
  },

  'GET /explore/posts/:id': () => {
    return successResponse(MOCK_POSTS[0] || null);
  },

  'GET /explore/my-posts': () => {
    return successResponse([], null, { count: 0 });
  },

  'POST /explore/my-posts/create': () => {
    return successResponse(
      { id: 'post_' + Date.now(), caption: 'پست جدید', created_at: new Date().toISOString() },
      'پست با موفقیت ایجاد شد'
    );
  },

  'DELETE /explore/my-posts/:id/delete': () => {
    return successResponse(null, 'پست حذف شد');
  },

  // ─── Portfolios ───
  'GET /portfolios': () => {
    const portfolios = MOCK_BUSINESS.portfolios || [];
    return successResponse(portfolios, null, { count: portfolios.length });
  },

  'GET /portfolios/:id': () => {
    const portfolios = MOCK_BUSINESS.portfolios || [];
    return successResponse(portfolios[0] || null);
  },

  'GET /portfolios/my-portfolios': () => {
    const portfolios = MOCK_BUSINESS.portfolios || [];
    return successResponse(portfolios, null, { count: portfolios.length });
  },

  'POST /portfolios/my-portfolios/create': () => {
    return successResponse(
      { id: 'pf_' + Date.now(), title: 'نمونه‌کار جدید' },
      'نمونه‌کار با موفقیت ایجاد شد'
    );
  },

  'DELETE /portfolios/my-portfolios/:id/delete': () => {
    return successResponse(null, 'نمونه‌کار حذف شد');
  },

  // ─── Ads: Model Requests ───
  'GET /ads/model-requests': () => {
    return successResponse(MOCK_MODEL_REQUESTS, null, { count: MOCK_MODEL_REQUESTS.length });
  },

  'GET /ads/model-requests/:id': () => {
    return successResponse(MOCK_MODEL_REQUESTS[0] || null);
  },

  'GET /ads/my-model-requests': () => {
    return successResponse(MOCK_MODEL_REQUESTS, null, { count: MOCK_MODEL_REQUESTS.length });
  },

  'POST /ads/my-model-requests/create': () => {
    return successResponse(
      { id: 'mr_' + Date.now(), title: 'درخواست مدل جدید' },
      'درخواست مدل ایجاد شد'
    );
  },

  'DELETE /ads/my-model-requests/:id/delete': () => {
    return successResponse(null, 'درخواست مدل حذف شد');
  },

  // ─── Ads: Line Rentals ───
  'GET /ads/line-rentals': () => {
    return successResponse(MOCK_LINE_RENTALS, null, { count: MOCK_LINE_RENTALS.length });
  },

  'GET /ads/line-rentals/:id': () => {
    return successResponse(MOCK_LINE_RENTALS[0] || null);
  },

  'GET /ads/my-line-rentals': () => {
    return successResponse(MOCK_LINE_RENTALS, null, { count: MOCK_LINE_RENTALS.length });
  },

  'POST /ads/my-line-rentals/create': () => {
    return successResponse(
      { id: 'lr_' + Date.now(), title: 'آگهی لاین جدید' },
      'آگهی اجاره لاین ایجاد شد'
    );
  },

  'DELETE /ads/my-line-rentals/:id/delete': () => {
    return successResponse(null, 'آگهی حذف شد');
  },

  // ─── Reminders ───
  'GET /reminders': () => {
    return successResponse(MOCK_REMINDER_CUSTOMERS, null, {
      count: MOCK_REMINDER_CUSTOMERS.length,
    });
  },

  'GET /reminders/my-reminders': () => {
    return successResponse(MOCK_REMINDER_CUSTOMERS, null, {
      count: MOCK_REMINDER_CUSTOMERS.length,
    });
  },

  // ─── Support ───
  'GET /support/faq': () => {
    return successResponse(
      [
        {
          id: 1,
          question: 'چگونه نوبت رزرو کنم؟',
          answer: 'از طریق اپلیکیشن...',
          category: 'booking',
        },
        {
          id: 2,
          question: 'آیا امکان لغو نوبت وجود دارد؟',
          answer: 'بله، تا ۲ ساعت قبل...',
          category: 'booking',
        },
        {
          id: 3,
          question: 'بیعانه چیست؟',
          answer: 'مبلغی برای تایید رزرو...',
          category: 'payment',
        },
      ],
      null,
      { count: 3 }
    );
  },

  'GET /support/tickets': () => {
    return successResponse([], null, { count: 0 });
  },

  'POST /support/tickets/create': () => {
    return successResponse(
      { id: 'ticket_' + Date.now(), subject: 'تیکت جدید', status: 'open' },
      'تیکت پشتیبانی ایجاد شد'
    );
  },

  'GET /support/tickets/:id': () => {
    return successResponse(null);
  },
};

// ═══════════════════════════════════════════════
//    Matcher: پیدا کردن handler مناسب
// ═══════════════════════════════════════════════
const normalizeUrl = (url) => {
  let normalized = url.startsWith('/') ? url.slice(1) : url;

  // ✅ FIX: حذف trailing slash
  normalized = normalized.replace(/\/+$/, '');

  normalized = normalized.replace(/\/\d+\//g, '/:id/');
  normalized = normalized.replace(/\/\d+$/g, '/:id');
  normalized = normalized.replace(/\/public\/[^/]+/, '/public/:slug');
  return normalized;
};

export const getMockHandler = (method, url, params = null) => {
  const normalizedUrl = normalizeUrl(url);
  const key = `${method} /${normalizedUrl}`;

  const handler = routeHandlers[key];

  if (handler) {
    const result = handler(params);
    if (result.success === false) {
      throw new Error(result.error.message);
    }
    return result;
  }

  // اگر handler پیدا نشد، خطا برگردان
  console.warn(`⚠️ Mock handler not found for: ${key}`);
  return successResponse(null, 'Mock data not found');
};
