// src/data/businesses.js

/**
 * 🏪 لیست کسب‌وکارها (Mock Data)
 */
export const MOCK_BUSINESSES_LIST = [
  {
    id: '1',
    name: 'سالن زیبایی نیلارام',
    category: 'کلینیک پوست و مو',
    categoryId: '2',
    subServiceId: 'facial_vip',
    serviceType: 'فیشیال تخصصی پوست',
    city: 'تهران، سعادت‌آباد',
    address: 'تهران، سعادت‌آباد، خیابان سرو غربی',
    latitude: 35.7898,
    longitude: 51.3768,
    rating: 4.9,
    reviewsCount: 142,
    discount: 10,
    logo: 'https://picsum.photos/150?random=1',
    coverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    is_vip: true,
    bookingSlug: 'nilaram-salon',
  },
  {
    id: '2',
    name: 'ناخن گالری پریا',
    category: 'مرکز تخصصی ناخن',
    categoryId: '4',
    subServiceId: 'nail_gelish',
    serviceType: 'کاشت و طراحی ناخن',
    city: 'کرج، فردیس',
    address: 'کرج، فردیس، بلوار طالقانی',
    latitude: 35.7236,
    longitude: 50.9486,
    rating: 4.6,
    reviewsCount: 89,
    discount: 0,
    logo: 'https://picsum.photos/150?random=2',
    coverImage: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800',
    is_vip: false,
    bookingSlug: 'nail-gallery-parya',
  },
  {
    id: '3',
    name: 'مرکز لیزر رویال',
    category: 'مرکز لیزر',
    categoryId: '3',
    subServiceId: 'laser_fullbody',
    serviceType: 'لیزر موهای زائد',
    city: 'تهران، شهرک غرب',
    address: 'تهران، شهرک غرب، خیابان ایران زمین',
    latitude: 35.7622,
    longitude: 51.3642,
    rating: 4.8,
    reviewsCount: 210,
    discount: 15,
    logo: 'https://picsum.photos/150?random=3',
    coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    is_vip: true,
    bookingSlug: 'royal-laser-center',
  },
  {
    id: '4',
    name: 'استودیو میکاپ لاویا',
    category: 'میکاپ و گریم',
    categoryId: '6',
    subServiceId: 'makeup_bride',
    serviceType: 'میکاپ عروس اروپایی',
    city: 'تهران، نیاوران',
    address: 'تهران، نیاوران، خیابان باهنر',
    latitude: 35.8069,
    longitude: 51.4744,
    rating: 4.7,
    reviewsCount: 65,
    discount: 0,
    logo: 'https://picsum.photos/150?random=4',
    coverImage: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800',
    is_vip: false,
    bookingSlug: 'lavia-makeup-studio',
  },
  {
    id: '5',
    name: 'سالن زیبایی افرا',
    category: 'مرکز کراتین و رنگ مو',
    categoryId: '5',
    subServiceId: 'hair_balayage',
    serviceType: 'رنگ و لایت مو',
    city: 'تهران، شهرک غرب',
    address: 'تهران، شهرک غرب، فاز ۲',
    latitude: 35.7650,
    longitude: 51.3680,
    rating: 4.5,
    reviewsCount: 112,
    discount: 20,
    logo: 'https://picsum.photos/150?random=5',
    coverImage: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800',
    is_vip: false,
    bookingSlug: 'afra-hair-salon',
  },
];

/**
 * 🗺️ نگاشت کسب‌وکارها بر اساس ID (برای صفحات جزئیات)
 */
export const MOCK_BUSINESSES_MAP = MOCK_BUSINESSES_LIST.reduce((acc, biz) => {
  acc[biz.id] = {
    ...biz,
    gallery: [
      biz.coverImage,
      `https://picsum.photos/800/600?random=${biz.id}1`,
      `https://picsum.photos/800/600?random=${biz.id}2`,
    ],
    location: {
      latitude: biz.latitude,
      longitude: biz.longitude,
    },
    about: `${biz.name} یکی از بهترین مراکز ارائه‌دهنده خدمات ${biz.serviceType} در ${biz.city} است. ما با استفاده از جدیدترین تجهیزات و مواد اولیه اورجینال، تجربه‌ای منحصربه‌فرد را برای شما فراهم می‌کنیم.`,
    phone: '021-12345678',
    workingHours: 'شنبه تا پنج‌شنبه ۹ الی ۲۰',
    ownerName: 'مدیریت سالن',
    ownerVerified: true,
    memberSince: '۲ سال',
    servicesCount: 8,
  };
  return acc;
}, {});

/**
 * 🏢 داده‌های کسب‌وکار پیش‌فرض (برای Store)
 */
export const MOCK_BUSINESS = {
  ...(MOCK_BUSINESSES_MAP['1'] || MOCK_BUSINESSES_LIST[0]),
  booking_slug: 'nilaram-salon',
  services: [
    {
      id: 's1',
      name: 'فیشیال تخصصی پوست VIP',
      typeName: 'پاکسازی پوست',
      typeId: 'facial_vip',
      price: 850000,
      originalPrice: 950000,
      discountPercent: 10,
      duration: 60,
      hasDeposit: true,
      depositAmount: 200000,
      depositPercent: 30,
      isActive: true,
    },
    {
      id: 's2',
      name: 'میکاپ عروس اروپایی',
      typeName: 'میکاپ',
      typeId: 'makeup_bride',
      price: 2500000,
      originalPrice: 2500000,
      discountPercent: 0,
      duration: 120,
      hasDeposit: true,
      depositAmount: 500000,
      depositPercent: 20,
      isActive: true,
    },
    {
      id: 's3',
      name: 'کاشت ناخن ژلیش',
      typeName: 'ناخن',
      typeId: 'nail_gelish',
      price: 450000,
      originalPrice: 450000,
      discountPercent: 0,
      duration: 90,
      hasDeposit: false,
      depositAmount: 0,
      isActive: true,
    },
  ],
  portfolios: [
    {
      id: 'pf1',
      title: 'نمونه کار میکاپ عروس',
      coverImage: 'https://picsum.photos/400/400?random=201',
      images: [
        'https://picsum.photos/800/800?random=201',
        'https://picsum.photos/800/800?random=202',
      ],
      serviceName: 'میکاپ عروس',
    },
    {
      id: 'pf2',
      title: 'فیشیال و پاکسازی عمیق',
      coverImage: 'https://picsum.photos/400/400?random=203',
      images: ['https://picsum.photos/800/800?random=203'],
      serviceName: 'فیشیال',
    },
  ],
  appointments: [],
};

/**
 * 📂 دسته‌بندی‌های اصلی خدمات (برای صفحه Home و CategoryGrid)
 */
export const MOCK_CATEGORIES = [
  { id: '1', name: 'میکاپ و گریم', icon: 'palette', count: 45 },
  { id: '2', name: 'پوست و فیشیال', icon: 'face', count: 32 },
  { id: '3', name: 'لیزر موهای زائد', icon: 'flash-on', count: 28 },
  { id: '4', name: 'کاشت و طراحی ناخن', icon: 'brush', count: 56 },
  { id: '5', name: 'رنگ و احیای مو', icon: 'content-cut', count: 41 },
  { id: '6', name: 'مژه و ابرو', icon: 'visibility', count: 38 },
  { id: '7', name: 'ماساژ و اسپا', icon: 'self-improvement', count: 19 },
  { id: '8', name: 'خدمات عروس', icon: 'star', count: 24 },
];

/**
 * 🏷️ نگاشت نام دسته‌بندی‌ها (برای هدر صفحات)
 */
export const CATEGORY_NAMES = MOCK_CATEGORIES.reduce((acc, cat) => {
  acc[cat.id] = cat.name;
  return acc;
}, {});