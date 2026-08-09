// src/components/home/search/searchData.js
// ═══════════════════════════════════════════════════════
//    داده‌های جستجو — یکپارچه با src/data/
//    فقط توابع جستجو و فیلتر اینجا باقی می‌مانند
// ═══════════════════════════════════════════════════════
import {
  MOCK_BUSINESSES_LIST,
  MOCK_MODEL_REQUESTS as _MODEL_REQUESTS,
  MOCK_LINE_RENTALS as _LINE_RENTALS,
} from '@/data/businesses';
import { MOCK_POSTS } from '@/data/posts';

// ═══════ تبدیل داده‌ها به فرمت جستجو ═══════
// کسب‌وکارها: اضافه کردن فیلد logo اگر ندارد
export const SEARCH_BUSINESSES = MOCK_BUSINESSES_LIST.map((b) => ({
  ...b,
  logo: b.logo || `https://picsum.photos/150?random=${b.id}`,
  ratingNum: b.rating,
}));

// مدلینگ: تبدیل به فرمت جستجو
export const SEARCH_MODEL_REQUESTS = _MODEL_REQUESTS.map((m) => ({
  ...m,
  city: m.city || '',
  provinceId: m.provinceId || 'tehran',
  cityId: m.cityId || 'tehran-city',
  createdAtTimestamp: Date.now(),
}));

// لاین: تبدیل به فرمت جستجو
export const SEARCH_LINE_RENTALS = _LINE_RENTALS.map((l) => ({
  ...l,
  serviceTypeIcon: 'brush',
  serviceTypeColor: '#7B1FA2',
  createdAtTimestamp: Date.now(),
}));

// پست‌ها: مستقیم از data/
export const SEARCH_POSTS = MOCK_POSTS;

// ═══════════ 🎯 توابع جستجو ═══════════
export const searchAll = (query) => {
  if (!query || !query.trim()) {
    return {
      businesses: [],
      posts: [],
      modelRequests: [],
      lineRentals: [],
    };
  }
  const q = query.trim().toLowerCase();
  const matches = (text) => text && text.toLowerCase().includes(q);

  const businesses = SEARCH_BUSINESSES.filter(
    (b) =>
      matches(b.name) ||
      matches(b.serviceType) ||
      matches(b.category) ||
      matches(b.address)
  );

  const posts = SEARCH_POSTS.filter(
    (p) => matches(p.businessName) || matches(p.caption)
  );

  const modelRequests = SEARCH_MODEL_REQUESTS.filter(
    (m) =>
      matches(m.title) ||
      matches(m.serviceName) ||
      matches(m.businessName) ||
      matches(m.city)
  );

  const lineRentals = SEARCH_LINE_RENTALS.filter(
    (l) =>
      matches(l.title) ||
      matches(l.serviceTypeName) ||
      matches(l.businessName) ||
      matches(l.city)
  );

  return { businesses, posts, modelRequests, lineRentals };
};

// ═══════════ 📊 محاسبه تعداد نتایج ═══════════
export const getResultCounts = (results) => ({
  all:
    results.businesses.length +
    results.posts.length +
    results.modelRequests.length +
    results.lineRentals.length,
  businesses: results.businesses.length,
  posts: results.posts.length,
  modelRequests: results.modelRequests.length,
  lineRentals: results.lineRentals.length,
});