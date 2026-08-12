// src/components/home/search/searchData.js
// ═══════════════════════════════════════════════════════
//    داده‌های جستجو — یکپارچه با src/data/
//    فقط توابع جستجو و فیلتر اینجا باقی می‌مانند
// ═══════════════════════════════════════════════════════
import { MOCK_BUSINESSES_LIST } from '@/data/businesses';
import { MOCK_MODEL_REQUESTS as _MODEL_REQUESTS } from '@/data/modelRequests';
import { MOCK_LINE_RENTALS as _LINE_RENTALS } from '@/data/lineRentals';
import { MOCK_POSTS } from '@/data/posts';
import { calculateDistance, formatDistance } from '@/utils/geo-utils';

// ═══════ تبدیل داده‌ها به فرمت جستجو ═══════
// کسب‌وکارها: اضافه کردن فیلد logo اگر ندارد
export const SEARCH_BUSINESSES = MOCK_BUSINESSES_LIST.map((b) => ({
  ...b,
  logo: b.logo || `https://picsum.photos/150?random=${b.id}`,
  ratingNum: b.rating,
  // ✅ افزودن مختصات برای فیلتر فاصله (در production از API می‌آید)
  latitude: b.latitude || null,
  longitude: b.longitude || null,
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
    (b) => matches(b.name) || matches(b.serviceType) || matches(b.category) || matches(b.address)
  );
  const posts = SEARCH_POSTS.filter((p) => matches(p.businessName) || matches(p.caption));
  const modelRequests = SEARCH_MODEL_REQUESTS.filter(
    (m) => matches(m.title) || matches(m.serviceName) || matches(m.businessName) || matches(m.city)
  );
  const lineRentals = SEARCH_LINE_RENTALS.filter(
    (l) =>
      matches(l.title) || matches(l.serviceTypeName) || matches(l.businessName) || matches(l.city)
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

// ═══════════ 📍 جستجو با فیلتر فاصله ═══════════
/**
 * جستجوی کسب‌وکارها با فیلتر فاصله
 * @param {string} query - عبارت جستجو
 * @param {object} userLocation - { latitude, longitude }
 * @param {number} maxDistanceKm - حداکثر فاصله (کیلومتر)
 * @returns {Array} - لیست کسب‌وکارها با فاصله محاسبه‌شده
 */
export const searchBusinessesWithDistance = (query, userLocation, maxDistanceKm = null) => {
  const { calculateDistance, formatDistance } = require('@/utils/geo-utils');
  const results = searchAll(query);
  let businesses = results.businesses || [];

  if (!userLocation) return businesses;

  // محاسبه فاصله
  businesses = businesses.map((business) => {
    const businessLat = business.latitude || business.location?.latitude;
    const businessLng = business.longitude || business.location?.longitude;

    if (businessLat && businessLng) {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        businessLat,
        businessLng
      );
      return { ...business, distance, distanceText: formatDistance(distance) };
    }
    return { ...business, distance: null, distanceText: null };
  });

  // مرتب‌سازی بر اساس فاصله
  businesses = [...businesses].sort((a, b) => {
    if (a.distance === null && b.distance === null) return 0;
    if (a.distance === null) return 1;
    if (b.distance === null) return -1;
    return a.distance - b.distance;
  });

  // اعمال فیلتر فاصله
  if (maxDistanceKm) {
    businesses = businesses.filter((b) => b.distance !== null && b.distance <= maxDistanceKm);
  }

  return businesses;
};
