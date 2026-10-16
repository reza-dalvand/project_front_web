// src/api/services/favorites.service.js
/**
 * ❤️ Favorites Service — هماهنگ با بک‌اند
 *
 * Endpoints:
 *   GET  /favorites/        → لیست علاقه‌مندی‌ها
 *   POST /favorites/toggle/ → افزودن/حذف علاقه‌مندی
 *   GET  /favorites/count/  → تعداد علاقه‌مندی‌ها
 *
 * ✅ اصلاح: پذیرش چند شکل پاسخ (data.businesses/posts، results، pagination، آرایه مستقیم)
 * تا شمارش پروفایل با لیست علاقه‌مندی‌ها هم‌خوان شود.
 */
import apiClient from '../api-client';

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const pick = (...values) =>
  values.find(
    (value) =>
      value !== undefined &&
      value !== null &&
      value !== '' &&
      value !== false
  );

const toStringOrEmpty = (value) => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (isPlainObject(value)) {
    return String(value.name ?? value.title ?? value.label ?? '');
  }
  return '';
};

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  if (typeof value !== 'object') return [];

  if (
    value.id !== undefined ||
    value.business !== undefined ||
    value.post !== undefined ||
    value.businessId !== undefined ||
    value.postId !== undefined ||
    value.businessName !== undefined ||
    value.caption !== undefined ||
    value.name !== undefined ||
    value.slug !== undefined ||
    value.title !== undefined
  ) {
    return [value];
  }

  return Object.values(value);
};

const normalizeBusinessItem = (item) => {
  if (!isPlainObject(item)) return null;

  const bizObj =
    isPlainObject(item.business)
      ? item.business
      : isPlainObject(item.businessDetail)
        ? item.businessDetail
        : null;

  const hasBusinessRef =
    item.business !== undefined ||
    item.businessId !== undefined ||
    Boolean(bizObj);

  const id = pick(
    typeof item.business === 'number' || typeof item.business === 'string'
      ? item.business
      : undefined,
    item.businessId,
    bizObj?.id,
    hasBusinessRef ? undefined : item.id,
    item.pk
  );

  if (id === undefined || id === null) return null;

  const name = pick(
    item.businessName,
    bizObj?.name,
    item.name,
    bizObj?.title,
    item.title
  );

  const logo = pick(item.businessLogo, bizObj?.logo, item.logo);
  const cover = pick(
    item.businessCover,
    bizObj?.coverImage,
    bizObj?.cover,
    item.coverImage,
    item.cover
  );
  const slug = pick(item.businessSlug, bizObj?.slug, item.slug);

  const categoryValue = pick(
    item.businessCategory,
    bizObj?.categoryName,
    bizObj?.category?.name,
    item.categoryName,
    isPlainObject(item.category) ? item.category.name : item.category,
    bizObj?.category
  );

  const cityValue = pick(
    item.businessCity,
    bizObj?.cityName,
    bizObj?.city?.name,
    item.cityName,
    isPlainObject(item.city) ? item.city.name : item.city,
    bizObj?.city
  );

  return {
    business: id,
    businessName: toStringOrEmpty(name),
    businessLogo: logo ?? null,
    businessCover: cover ?? null,
    businessSlug: slug ?? null,
    businessCategory: toStringOrEmpty(categoryValue),
    businessCity: toStringOrEmpty(cityValue),
  };
};

const normalizePostItem = (item) => {
  if (!isPlainObject(item)) return null;

  const postObj =
    isPlainObject(item.post)
      ? item.post
      : isPlainObject(item.postDetail)
        ? item.postDetail
        : null;

  const hasPostRef =
    item.post !== undefined ||
    item.postId !== undefined ||
    Boolean(postObj);

  const id = pick(
    typeof item.post === 'number' || typeof item.post === 'string'
      ? item.post
      : undefined,
    item.postId,
    postObj?.id,
    hasPostRef ? undefined : item.id,
    item.pk
  );

  if (id === undefined || id === null) return null;

  const caption = pick(
    item.caption,
    postObj?.caption,
    item.description,
    postObj?.description
  );

  const businessObj =
    isPlainObject(item.business)
      ? item.business
      : isPlainObject(postObj?.business)
        ? postObj.business
        : null;

  const businessName = pick(
    item.businessName,
    businessObj?.name,
    postObj?.businessName,
    item.title
  );

  const businessLogo = pick(
    item.businessLogo,
    businessObj?.logo,
    postObj?.businessLogo
  );

  const businessBookingSlug = pick(
    item.businessBookingSlug,
    businessObj?.bookingSlug,
    postObj?.businessBookingSlug,
    item.businessSlug,
    businessObj?.slug,
    postObj?.businessSlug
  );

  let images = pick(item.images, postObj?.images);

  if (!Array.isArray(images)) {
    const singleImage = pick(item.image, postObj?.image);
    images = singleImage ? [singleImage] : [];
  } else {
    images = images.filter(Boolean);
  }

  const image = pick(item.image, postObj?.image, images[0]) || null;

  return {
    id,
    caption: toStringOrEmpty(caption),
    businessName: toStringOrEmpty(businessName),
    businessLogo: businessLogo ?? null,
    businessBookingSlug: businessBookingSlug ?? null,
    images,
    image,
  };
};

const extractFromResults = (items) => {
  const businesses = [];
  const posts = [];

  for (const item of items) {
    if (!isPlainObject(item)) continue;

    const type = String(
      pick(
        item.favoriteType,
        item.favorite_type,
        item.contentType,
        item.content_type,
        item.type
      ) || ''
    ).toLowerCase();

    if (type.includes('business')) {
      const normalized = normalizeBusinessItem(item);
      if (normalized) businesses.push(normalized);
      continue;
    }

    if (type.includes('post')) {
      const normalized = normalizePostItem(item);
      if (normalized) posts.push(normalized);
      continue;
    }

    const strongPost =
      item.post !== undefined ||
      item.postId !== undefined ||
      item.caption !== undefined ||
      item.images !== undefined ||
      item.image !== undefined;

    const strongBusiness =
      item.business !== undefined ||
      item.businessId !== undefined ||
      item.businessName !== undefined ||
      item.businessSlug !== undefined ||
      item.businessLogo !== undefined ||
      item.businessCover !== undefined ||
      item.name !== undefined ||
      item.slug !== undefined ||
      item.title !== undefined ||
      item.logo !== undefined ||
      item.coverImage !== undefined ||
      item.cover !== undefined;

    if (strongPost) {
      const normalized = normalizePostItem(item);
      if (normalized) posts.push(normalized);
      continue;
    }

    if (strongBusiness) {
      const normalized = normalizeBusinessItem(item);
      if (normalized) businesses.push(normalized);
    }
  }

  return { businesses, posts };
};

const getFavoritesPayload = (response) => {
  let payload = response?.data;

  if (isPlainObject(payload) && isPlainObject(payload.data)) {
    payload = payload.data;
  }

  return payload ?? {};
};

const normalizeFavoritesResponse = (response) => {
  const res = response || {};
  const payload = getFavoritesPayload(res);

  const businessesSource = pick(
    payload.businesses,
    payload.business,
    payload.favoriteBusinesses,
    payload.favorite_businesses
  );

  const postsSource = pick(
    payload.posts,
    payload.post,
    payload.favoritePosts,
    payload.favorite_posts
  );

  let businesses = toArray(businessesSource)
    .map(normalizeBusinessItem)
    .filter(Boolean);

  let posts = toArray(postsSource)
    .map(normalizePostItem)
    .filter(Boolean);

  if (businesses.length === 0 && posts.length === 0) {
    const resultsSource = pick(payload.results, payload.items);
    const arraySource = Array.isArray(payload) ? payload : null;
    const source = resultsSource ?? arraySource;

    if (source) {
      const extracted = extractFromResults(toArray(source));
      businesses = extracted.businesses;
      posts = extracted.posts;
    }
  }

  return {
    data: {
      businesses,
      posts,
    },
    meta: res.meta ?? null,
    message: res.message ?? null,
  };
};

const normalizeFavoritesCountResponse = (response) => {
  const res = response || {};
  const payload = getFavoritesPayload(res);

  const business =
    Number(
      pick(
        payload.business,
        payload.businessCount,
        payload.business_count,
        payload.count,
        0
      )
    ) || 0;

  const post =
    Number(
      pick(
        payload.post,
        payload.postCount,
        payload.post_count,
        0
      )
    ) || 0;

  const totalSource = pick(
    payload.total,
    payload.totalCount,
    payload.total_count
  );

  const total =
    totalSource !== undefined
      ? Number(totalSource) || 0
      : business + post;

  return {
    data: {
      business,
      post,
      total,
    },
    meta: res.meta ?? null,
    message: res.message ?? null,
  };
};

export const favoritesService = {
  /**
   * لیست علاقه‌مندی‌ها
   * GET /favorites/?type=business|post
   *
   * Response نهایی برای فرانت:
   * { data: { businesses: [...], posts: [...] }, meta, message }
   */
  getFavorites: (type = null) => {
    const params = type ? { type } : {};
    return apiClient.get('/favorites/', { params }).then(normalizeFavoritesResponse);
  },

  /**
   * افزودن/حذف علاقه‌مندی (Toggle)
   * POST /favorites/toggle/
   *
   * Payload: { favorite_type: 'business'|'post', object_id: number }
   * Response: { is_favorited: boolean, message: string }
   */
  toggleFavorite: (favoriteType, objectId) => {
    return apiClient.post('/favorites/toggle/', {
      favorite_type: favoriteType,
      object_id: objectId,
    });
  },

  /**
   * تعداد علاقه‌مندی‌ها
   * GET /favorites/count/
   *
   * Response نهایی برای فرانت:
   * { data: { business: number, post: number, total: number }, meta, message }
   */
  getFavoritesCount: () => {
    return apiClient.get('/favorites/count/').then(normalizeFavoritesCountResponse);
  },
};