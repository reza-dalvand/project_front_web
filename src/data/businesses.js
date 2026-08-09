// src/data/businesses.js
/**
 * 🏪 داده‌های کسب‌وکارها
 * استفاده شده در: صفحه اصلی، دسته‌بندی، جستجو، جزئیات، نقشه
 */

// ═══════ کسب‌وکار اصلی (صفحه جزئیات) ═══════
export const MOCK_BUSINESS = {
  id: '1',
  name: 'مجموعه زیبایی و سلامت نیلارام',
  ownerName: 'مریم حسینی',
  ownerVerified: true,
  memberSince: '۲ سال',
  category: 'کلینیک پوست و مو',
  city: 'تهران، سعادت‌آباد',
  address: 'سعادت‌آباد، خیابان سرو غربی، ساختمان پزشکان نگین، طبقه ۳',
  phone: '۰۲۱-۲۲۳۳۴۴۵۵',
  workingHours: 'شنبه تا پنج‌شنبه: ۱۰:۰۰ الی ۲۰:۰۰',
  location: {
    latitude: 35.7898,
    longitude: 51.3768,
  },
  rating: 4.9,
  reviewsCount: 142,
  servicesCount: 24,
  VIP: true,
  logo: 'https://picsum.photos/150?random=21',
  gallery: [
    'https://picsum.photos/800/600?random=45',
    'https://picsum.photos/800/600?random=46',
    'https://picsum.photos/800/600?random=47',
    'https://picsum.photos/800/600?random=48',
  ],
  about:
    'مجموعه نیلارام با بیش از ۱۰ سال سابقه درخشان در زمینه خدمات تخصصی پوست، فیشیال، مژه و ناخن، با کادری مجرب و محیطی کاملاً بهداشتی و آرامش‌بخش میزبان شما بانوان عزیز است.',
  services: [
    {
      id: 's1',
      name: 'فیشیال تخصصی و پاکسازی پوست',
      typeId: 'facial',
      price: 750000,
      originalPrice: 850000,
      discount: 12,
      duration: 60,
    },
    {
      id: 's2',
      name: 'کاشت مژه هالیوودی (تار به تار)',
      typeId: 'eyelash',
      price: 580000,
      originalPrice: 580000,
      discount: 0,
      duration: 90,
    },
    {
      id: 's3',
      name: 'ژلیش و پدیکور VIP پا',
      typeId: 'nail',
      price: 320000,
      originalPrice: 380000,
      discount: 15,
      duration: 45,
    },
    {
      id: 's4',
      name: 'کراتینه و احیای موهای آسیب‌دیده',
      typeId: 'keratin',
      price: 1800000,
      originalPrice: 1900000,
      discount: 5,
      duration: 120,
    },
  ],
  portfolios: [
    {
      id: 'pf1',
      title: 'فیشیال VIP عروس',
      coverImage: 'https://picsum.photos/400/400?random=60',
      images: [
        'https://picsum.photos/800/800?random=60',
        'https://picsum.photos/800/800?random=160',
        'https://picsum.photos/800/800?random=260',
      ],
      description: 'فیشیال تخصصی عروس با استفاده از بهترین محصولات روز دنیا.',
    },
    {
      id: 'pf2',
      title: 'کاشت ناخن ژلیش',
      coverImage: 'https://picsum.photos/400/400?random=61',
      images: [
        'https://picsum.photos/800/800?random=61',
        'https://picsum.photos/800/800?random=161',
      ],
      description: 'کاشت ناخن با طراحی مینیمال و ژلیش ماندگار تا ۳ هفته.',
    },
    {
      id: 'pf3',
      title: 'میکاپ و شینیون عروس',
      coverImage: 'https://picsum.photos/400/400?random=62',
      images: [
        'https://picsum.photos/800/800?random=62',
        'https://picsum.photos/800/800?random=162',
        'https://picsum.photos/800/800?random=262',
        'https://picsum.photos/800/800?random=362',
      ],
      description: 'میکاپ حرفه‌ای عروس با سبک اروپایی و شینیون مدرن.',
    },
    {
      id: 'pf4',
      title: 'لیزر موهای زائد',
      coverImage: 'https://picsum.photos/400/400?random=63',
      images: ['https://picsum.photos/800/800?random=63'],
      description: 'لیزر با دستگاه الکساندرایت ۲۰۲۴ - بدون درد و ماندگار.',
    },
  ],
};

// ═══════ لیست کسب‌وکارها (دسته‌بندی + جستجو) ═══════
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
  },
];

// ═══════ کسب‌وکارها برای نقشه ═══════
export const MOCK_BUSINESSES_MAP = {
  1: {
    id: '1',
    name: 'مجموعه زیبایی و سلامت نیلارام',
    category: 'کلینیک پوست و مو',
    address: 'سعادت‌آباد، خیابان سرو غربی، ساختمان پزشکان نگین، طبقه ۳',
    phone: '۰۲۱-۲۲۳۳۴۴۵۵',
    workingHours: 'شنبه تا پنج‌شنبه: ۱۰:۰۰ الی ۲۰:۰۰',
    location: {
      latitude: 35.7898,
      longitude: 51.3768,
    },
  },
  2: {
    id: '2',
    name: 'سالن زیبایی لاویا',
    category: 'سالن زیبایی',
    address: 'نیاوران، خیابان باهنر، پلاک ۱۲۴',
    phone: '۰۲۱-۲۲۷۷۸۸۹۹',
    workingHours: 'شنبه تا پنج‌شنبه: ۰۹:۰۰ الی ۲۱:۰۰',
    location: {
      latitude: 35.8069,
      longitude: 51.4744,
    },
  },
  3: {
    id: '3',
    name: 'مرکز لیزر رویال',
    category: 'مرکز لیزر',
    address: 'شهرک غرب، خیابان ایران زمین، مجتمع رویال',
    phone: '۰۲۱-۸۸۶۶۵۵۴۴',
    workingHours: 'شنبه تا پنج‌شنبه: ۱۰:۰۰ الی ۲۲:۰۰',
    location: {
      latitude: 35.7807,
      longitude: 51.3735,
    },
  },
};

// ═══════ دسته‌بندی‌ها (صفحه اصلی) ═══════
export const MOCK_CATEGORIES = [
  { id: 1, name: 'میکاپ', icon: 'face', count: 6 },
  { id: 2, name: 'کاشت ناخن', icon: 'brush', count: 6 },
  { id: 3, name: 'لیزر مو', icon: 'flash-on', count: 5 },
  { id: 4, name: 'پاکسازی', icon: 'spa', count: 6 },
  { id: 5, name: 'رنگ مو', icon: 'palette', count: 6 },
  { id: 6, name: 'کراتین', icon: 'auto-awesome', count: 5 },
  { id: 7, name: 'مژه', icon: 'visibility', count: 6 },
  { id: 8, name: 'ماساژ', icon: 'self-improvement', count: 4 },
];

// ═══════ نگاشت نام دسته‌بندی ═══════
export const CATEGORY_NAMES = {
  1: 'میکاپ',
  2: 'کاشت ناخن',
  3: 'لیزر مو',
  4: 'پاکسازی',
  5: 'رنگ مو',
  6: 'کراتین',
  7: 'مژه',
  8: 'ماساژ',
};

// ═══════ علاقه‌مندی‌ها (favorites) ═══════
export const MOCK_FAVORITE_BUSINESSES = [
  {
    id: 'b1',
    name: 'سالن زیبایی نیلارام',
    category: 'کلینیک پوست و مو',
    city: 'تهران، سعادت‌آباد',
    rating: 4.9,
    reviewsCount: 142,
    logo: 'https://picsum.photos/150?random=21',
    VIP: true,
  },
  {
    id: 'b2',
    name: 'مرکز لیزر رویال',
    category: 'مرکز لیزر',
    city: 'تهران، شهرک غرب',
    rating: 4.8,
    reviewsCount: 178,
    logo: 'https://picsum.photos/150?random=25',
    VIP: true,
  },
];

export const MOCK_FAVORITE_POSTS = [
  {
    id: 'p1',
    businessName: 'کلینیک زیبایی صدف',
    businessLogo: 'https://picsum.photos/100/100?random=1',
    caption: 'فیشیال VIP با ماسک طلا ✨',
    image: 'https://picsum.photos/400/400?random=101',
    imageCount: 2,
  },
  {
    id: 'p2',
    businessName: 'سالن زیبایی ماهرو',
    businessLogo: 'https://picsum.photos/100/100?random=2',
    caption: 'میکاپ عروس اروپایی 👰‍♀️',
    image: 'https://picsum.photos/400/400?random=103',
    imageCount: 3,
  },
];
