// src/data/businesses.js

export const MOCK_BUSINESSES_LIST = [
  {
    id: '1',
    name: 'کلینیک زیبایی صدف',
    serviceType: 'فیشیال VIP عروس',
    subServiceId: 'facial_vip',
    address: 'تهران، سعادت آباد، خیابان سرو غربی',
    rating: 5.0,
    reviewsCount: 142,
    discount: 20,
    category: 'کلینیک پوست و مو',
    provinceId: 'tehran',
    cityId: 'tehran-city',
    VIP: true,
    logo: 'https://picsum.photos/150?random=21',
    servicesCount: 24,
    isNew: false,
    latitude: 35.7898,
    longitude: 51.3768,
  },
  {
    id: '2',
    name: 'سالن زیبایی ماهرو',
    serviceType: 'میکاپ عروس اروپایی',
    subServiceId: 'makeup_bride',
    address: 'تهران، نیاوران',
    rating: 4.7,
    reviewsCount: 89,
    discount: 15,
    category: 'سالن زیبایی',
    provinceId: 'tehran',
    cityId: 'shemiran',
    VIP: false,
    logo: 'https://picsum.photos/150?random=22',
    servicesCount: 18,
    isNew: true,
    latitude: 35.8069,
    longitude: 51.4744,
  },
  {
    id: '3',
    name: 'کلینیک رویال لیزر',
    serviceType: 'لیزر الکساندرایت فول بادی',
    subServiceId: 'laser_alex',
    address: 'اصفهان، خیابان چهارباغ',
    rating: 4.9,
    reviewsCount: 215,
    discount: 30,
    category: 'مرکز لیزر',
    provinceId: 'isfahan',
    cityId: 'isfahan-city',
    VIP: true,
    logo: 'https://picsum.photos/150?random=23',
    servicesCount: 32,
    isNew: false,
    latitude: 32.6546,
    longitude: 51.668,
  },
  {
    id: '4',
    name: 'ناخن گالری پریا',
    serviceType: 'کاشت ناخن ژله‌ای طرح‌دار',
    subServiceId: 'nail_gel',
    address: 'کرج، میدان کرج',
    rating: 4.6,
    reviewsCount: 67,
    discount: 0,
    category: 'مرکز کاشت ناخن',
    provinceId: 'alborz',
    cityId: 'karaj',
    VIP: false,
    logo: 'https://picsum.photos/150?random=24',
    servicesCount: 15,
    isNew: false,
    latitude: 35.8355,
    longitude: 50.9782,
  },
  {
    id: '5',
    name: 'سالن افرا',
    serviceType: 'رنگ و لایت مو',
    subServiceId: 'hair_color',
    address: 'تهران، ونک',
    rating: 4.9,
    reviewsCount: 124,
    discount: 10,
    category: 'سالن زیبایی',
    provinceId: 'tehran',
    cityId: 'tehran-city',
    VIP: true,
    logo: 'https://picsum.photos/150?random=27',
    servicesCount: 20,
    isNew: false,
    latitude: 35.7807,
    longitude: 51.3735,
  },
];

// ═══════ مپ کسب‌وکارها (برای نقشه و صفحات جزئیات) ═══════
export const MOCK_BUSINESSES_MAP = MOCK_BUSINESSES_LIST.reduce((acc, biz) => {
  acc[biz.id] = {
    ...biz,
    gallery: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800',
    ],
    location: {
      latitude: biz.latitude,
      longitude: biz.longitude,
    },
    about:
      'این کسب‌وکار با ارائه خدمات باکیفیت و استفاده از جدیدترین متدهای روز دنیا، تجربه‌ای بی‌نظیر برای شما فراهم می‌کند. تیم متخصص ما آماده پذیرایی از شماست.',
    phone: '021-12345678',
    workingHours: 'شنبه تا پنج‌شنبه ۹ الی ۲۰',
  };
  return acc;
}, {});

// ═══════ یک کسب‌وکار پیش‌فرض برای صفحه جزئیات ═══════
export const MOCK_BUSINESS = {
  ...(MOCK_BUSINESSES_MAP['1'] || MOCK_BUSINESSES_LIST[0]),
  services: [
    {
      id: 's1',
      name: 'فیشیال تخصصی پوست VIP',
      typeName: 'پاکسازی پوست',
      price: 850000,
      originalPrice: 950000,
      discountPercent: 10,
      duration: 60,
      hasDeposit: true,
      depositAmount: 200000,
      depositPercent: 30,
    },
    {
      id: 's2',
      name: 'میکاپ عروس اروپایی',
      typeName: 'میکاپ',
      price: 2500000,
      originalPrice: 2500000,
      discountPercent: 0,
      duration: 120,
      hasDeposit: true,
      depositAmount: 500000,
      depositPercent: 20,
    },
    {
      id: 's3',
      name: 'کاشت ناخن ژلیش',
      typeName: 'ناخن',
      price: 450000,
      originalPrice: 450000,
      discountPercent: 0,
      duration: 90,
      hasDeposit: false,
      depositAmount: 0,
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
      title: 'فیشیال و پاکسازی',
      coverImage: 'https://picsum.photos/400/400?random=203',
      images: ['https://picsum.photos/800/800?random=203'],
      serviceName: 'فیشیال',
    },
  ],
  appointments: [],
};

// ═══════ دسته‌بندی‌ها ═══════
export const MOCK_CATEGORIES = [
  { id: '1', name: 'میکاپ و گریم', icon: '💄', count: 120 },
  { id: '2', name: 'کاشت ناخن', icon: '💅', count: 85 },
  { id: '3', name: 'لیزر مو', icon: '⚡', count: 45 },
  { id: '4', name: 'پاکسازی پوست', icon: '✨', count: 92 },
  { id: '5', name: 'رنگ و لایت مو', icon: '🎨', count: 110 },
  { id: '6', name: 'کراتین و احیا', icon: '💆‍♀️', count: 60 },
  { id: '7', name: 'مژه و ابرو', icon: '👁️', count: 75 },
  { id: '8', name: 'ماساژ و اسپا', icon: '💆‍♂️', count: 30 },
];

export const CATEGORY_NAMES = MOCK_CATEGORIES.reduce((acc, cat) => {
  acc[cat.id] = cat.name;
  return acc;
}, {});

// ═══════ علاقه‌مندی‌ها ═══════
export const MOCK_FAVORITE_BUSINESSES = MOCK_BUSINESSES_LIST.slice(0, 2);

export const MOCK_FAVORITE_POSTS = [
  {
    id: 'fav_p1',
    businessName: 'کلینیک زیبایی صدف',
    businessLogo: 'https://picsum.photos/100/100?random=1',
    businessId: 'b1',
    caption: 'فیشیال تخصصی VIP ✨',
    image: 'https://picsum.photos/400/300?random=101',
    gallery: ['https://picsum.photos/800/800?random=101'],
    rating: 4.8,
    source: 'business',
  },
];
