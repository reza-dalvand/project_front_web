// src/data/businesses.js
export const MOCK_BUSINESSES_LIST = [
  // ... (کدهای قبلی بدون تغییر)
];

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
    about: 'این کسب‌وکار با ارائه خدمات باکیفیت...',
    phone: '021-12345678',
    workingHours: 'شنبه تا پنج‌شنبه ۹ الی ۲۰',
  };
  return acc;
}, {});

// ✅ FIX: اضافه کردن booking_slug برای پاس کردن تست
export const MOCK_BUSINESS = {
  ...(MOCK_BUSINESSES_MAP['1'] || MOCK_BUSINESSES_LIST[0]),
  booking_slug: 'nilaram-salon', 
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

export const MOCK_CATEGORIES = [
  // ...
];
// ... بقیه کدها بدون تغییر