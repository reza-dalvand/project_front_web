// src/components/home/search/searchData.js

// ═══════════ 🏪 کسب‌وکارها ═══════════
export const MOCK_BUSINESSES = [
  {
    id: 'b1',
    name: 'سالن زیبایی نیلارام',
    serviceType: 'کلینیک پوست و مو',
    category: 'کلینیک پوست و مو',
    address: 'تهران، سعادت‌آباد، خیابان سرو غربی',
    rating: 4.9,
    ratingNum: 4.9,
    reviewsCount: 142,
    discount: 12,
    logo: 'https://picsum.photos/200?random=21',
    servicesCount: 24,
    provinceId: 'tehran',
    cityId: 'tehran-city',
    VIP: true,
    isNew: false,
  },
  {
    id: 'b2',
    name: 'سالن زیبایی ماهرو',
    serviceType: 'میکاپ عروس اروپایی',
    category: 'سالن زیبایی',
    address: 'تهران، نیاوران',
    rating: 4.7,
    ratingNum: 4.7,
    reviewsCount: 89,
    discount: 15,
    logo: 'https://picsum.photos/200?random=22',
    servicesCount: 18,
    provinceId: 'tehran',
    cityId: 'shemiran',
    VIP: false,
    isNew: true,
  },
  {
    id: 'b3',
    name: 'کلینیک رویال لیزر',
    serviceType: 'لیزر الکساندرایت فول بادی',
    category: 'مرکز لیزر',
    address: 'اصفهان، خیابان چهارباغ',
    rating: 4.9,
    ratingNum: 4.9,
    reviewsCount: 215,
    discount: 30,
    logo: 'https://picsum.photos/200?random=23',
    servicesCount: 32,
    provinceId: 'isfahan',
    cityId: 'isfahan-city',
    VIP: true,
    isNew: false,
  },
  {
    id: 'b4',
    name: 'ناخن گالری پریا',
    serviceType: 'کاشت ناخن ژله‌ای طرح‌دار',
    category: 'مرکز کاشت ناخن',
    address: 'کرج، میدان کرج',
    rating: 4.6,
    ratingNum: 4.6,
    reviewsCount: 67,
    discount: 0,
    logo: 'https://picsum.photos/200?random=24',
    servicesCount: 15,
    provinceId: 'alborz',
    cityId: 'karaj',
    VIP: false,
    isNew: false,
  },
  {
    id: 'b5',
    name: 'مرکز لیزر پارسه',
    serviceType: 'لیزر دایود صورت',
    category: 'مرکز لیزر',
    address: 'تهران، شهرک غرب',
    rating: 4.8,
    ratingNum: 4.8,
    reviewsCount: 178,
    discount: 25,
    logo: 'https://picsum.photos/200?random=25',
    servicesCount: 12,
    provinceId: 'tehran',
    cityId: 'tehran-city',
    VIP: false,
    isNew: true,
  },
  {
    id: 'b6',
    name: 'ناخن گالری پریا',
    serviceType: 'ژلیش ناخن مینیمال',
    category: 'مرکز کاشت ناخن',
    address: 'کرج، فردیس',
    rating: 4.4,
    ratingNum: 4.4,
    reviewsCount: 56,
    discount: 0,
    logo: 'https://picsum.photos/200?random=26',
    servicesCount: 8,
    provinceId: 'alborz',
    cityId: 'fardis',
    VIP: false,
    isNew: false,
  },
  {
    id: 'b7',
    name: 'سالن النا',
    serviceType: 'میکاپ مجلسی شاین',
    category: 'سالن زیبایی',
    address: 'تهران، ونک',
    rating: 4.9,
    ratingNum: 4.9,
    reviewsCount: 124,
    discount: 10,
    logo: 'https://picsum.photos/200?random=27',
    servicesCount: 20,
    provinceId: 'tehran',
    cityId: 'tehran-city',
    VIP: true,
    isNew: false,
  },
  {
    id: 'b8',
    name: 'کلینیک ماه',
    serviceType: 'هیدروفیشیال تخصصی',
    category: 'کلینیک پوست و مو',
    address: 'مشهد، بلوار وکیل‌آباد',
    rating: 4.7,
    ratingNum: 4.7,
    reviewsCount: 98,
    discount: 0,
    logo: 'https://picsum.photos/200?random=28',
    servicesCount: 14,
    provinceId: 'khorasan',
    cityId: 'mashhad',
    VIP: false,
    isNew: true,
  },
];

// ═══════════ 💆 خدمات ═══════════
export const MOCK_SERVICES = [
  {
    id: 's1',
    name: 'فیشیال تخصصی و پاکسازی پوست',
    typeId: 'facial',
    typeName: 'فیشیال و پاکسازی پوست',
    price: 750000,
    originalPrice: 850000,
    discount: 12,
    duration: 60,
    image: 'https://picsum.photos/200/200?random=50',
    businessId: 'b1',
    businessName: 'کلینیک زیبایی صدف',
    rating: 4.8,
    reviewsCount: 142,
  },
  {
    id: 's2',
    name: 'کاشت مژه هالیوودی (تار به تار)',
    typeId: 'eyelash',
    typeName: 'کاشت مژه و ابرو',
    price: 580000,
    originalPrice: 580000,
    discount: 0,
    duration: 90,
    image: 'https://picsum.photos/200/200?random=51',
    businessId: 'b2',
    businessName: 'سالن زیبایی ماهرو',
    rating: 4.6,
    reviewsCount: 89,
  },
  {
    id: 's3',
    name: 'لیزر فول بادی با دستگاه الکس',
    typeId: 'laser',
    typeName: 'لیزر موهای زائد',
    price: 2500000,
    originalPrice: 3000000,
    discount: 17,
    duration: 120,
    image: 'https://picsum.photos/200/200?random=52',
    businessId: 'b3',
    businessName: 'کلینیک رویال لیزر',
    rating: 4.9,
    reviewsCount: 215,
  },
  {
    id: 's4',
    name: 'کاشت ناخن ژله‌ای طرح‌دار',
    typeId: 'nail',
    typeName: 'کاشت و طراحی ناخن',
    price: 450000,
    originalPrice: 520000,
    discount: 13,
    duration: 75,
    image: 'https://picsum.photos/200/200?random=53',
    businessId: 'b4',
    businessName: 'ناخن گالری پریا',
    rating: 4.4,
    reviewsCount: 56,
  },
  {
    id: 's5',
    name: 'رنگ و لایت مو با مواد ایتالیایی',
    typeId: 'hair_color',
    typeName: 'رنگ و مش مو',
    price: 1200000,
    originalPrice: 1500000,
    discount: 20,
    duration: 150,
    image: 'https://picsum.photos/200/200?random=54',
    businessId: 'b5',
    businessName: 'سالن زیبایی افرا',
    rating: 4.8,
    reviewsCount: 124,
  },
  {
    id: 's6',
    name: 'کراتینه برزیلی مو',
    typeId: 'keratin',
    typeName: 'کراتین و احیای مو',
    price: 1800000,
    originalPrice: 2200000,
    discount: 18,
    duration: 180,
    image: 'https://picsum.photos/200/200?random=55',
    businessId: 'b6',
    businessName: 'سالن زیبایی افرا',
    rating: 4.7,
    reviewsCount: 98,
  },
];

// ═══════════ 🖼️ پست‌های ویترین ═══════════
export const MOCK_POSTS = [
  {
    id: 'p1',
    businessName: 'کلینیک زیبایی صدف',
    businessLogo: 'https://picsum.photos/100/100?random=1',
    businessId: 'b1',
    rating: 4.8,
    caption: 'فیشیال VIP با ماسک طلا ✨ بهترین خدمات پوست صورت با مواد کره‌ای',
    saved: false,
    gallery: [
      'https://picsum.photos/800/800?random=101',
      'https://picsum.photos/800/800?random=102',
    ],
  },
  {
    id: 'p2',
    businessName: 'سالن زیبایی ماهرو',
    businessLogo: 'https://picsum.photos/100/100?random=2',
    businessId: 'b2',
    rating: 4.6,
    caption: 'میکاپ عروس اروپایی 👰‍♀️ سبک مینیمال و طبیعی',
    saved: false,
    gallery: [
      'https://picsum.photos/800/800?random=103',
      'https://picsum.photos/800/800?random=104',
      'https://picsum.photos/800/800?random=105',
    ],
  },
  {
    id: 'p3',
    businessName: 'مرکز لیزر رویال',
    businessLogo: 'https://picsum.photos/100/100?random=3',
    businessId: 'b3',
    rating: 4.9,
    caption: 'لیزر فول بادی با جدیدترین دستگاه ۲۰۲۴ 🌸 بدون درد',
    saved: false,
    gallery: ['https://picsum.photos/800/800?random=106'],
  },
  {
    id: 'p4',
    businessName: 'ناخن گالری پریا',
    businessLogo: 'https://picsum.photos/100/100?random=9',
    businessId: 'b4',
    rating: 4.4,
    caption: 'طراحی ناخن با سبک ژورنالی و مینیمال 💖',
    saved: false,
    gallery: [
      'https://picsum.photos/800/800?random=107',
      'https://picsum.photos/800/800?random=108',
    ],
  },
];

// ═══════════ 👩‍🎨 فرصت‌های مدلینگ ═══════════
export const MOCK_MODEL_REQUESTS = [
  {
    id: 'mr_1',
    title: 'مدل فیشیال VIP عروس',
    serviceName: 'فیشیال تخصصی پوست',
    serviceImage: 'https://picsum.photos/400/300?random=50',
    businessName: 'کلینیک زیبایی صدف',
    businessId: 'b1',
    city: 'تهران، سعادت‌آباد',
    provinceId: 'tehran',
    cityId: 'tehran-city',
    serviceTypeId: 'facial',
    discount: 50,
    isUrgent: true,
    costType: 'paid',
    description:
      'نیاز به مدل برای تست محصولات جدید فیشیال. این خدمت شامل پاکسازی عمیق پوست، استفاده از ماسک طلای ۲۴ عیار و ماساژ صورت با روغن‌های طبیعی است.',
    contactPhone: '09121234567',
    createdAt: '۱۴۰۳/۰۴/۱۰',
    expiresAt: '۱۴۰۳/۰۴/۲۰',
    createdAtTimestamp: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'mr_2',
    title: 'مدل طراحی ناخن ژورنالی',
    serviceName: 'کاشت ناخن',
    serviceImage: 'https://picsum.photos/400/300?random=51',
    businessName: 'ناخن گالری پریا',
    businessId: 'b2',
    city: 'کرج، فردیس',
    provinceId: 'alborz',
    cityId: 'fardis',
    serviceTypeId: 'nail',
    discount: 70,
    isUrgent: false,
    costType: 'material_cost',
    description:
      'طراحی‌های جدید و خاص برای نمونه‌کار با تکنیک‌های روز دنیا. مناسب ناخن‌های طبیعی و سالم.',
    contactPhone: '09129876543',
    createdAt: '۱۴۰۳/۰۴/۰۸',
    expiresAt: '۱۴۰۳/۰۴/۱۸',
    createdAtTimestamp: Date.now() - 12 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'mr_3',
    title: 'مدل تکنیک بالیاژ فرانسوی',
    serviceName: 'رنگ و لایت مو',
    serviceImage: 'https://picsum.photos/400/300?random=52',
    businessName: 'سالن زیبایی افرا',
    businessId: 'b3',
    city: 'تهران، نیاوران',
    provinceId: 'tehran',
    cityId: 'shemiran',
    serviceTypeId: 'hair',
    discount: 60,
    isUrgent: false,
    costType: 'paid',
    description:
      'تست تکنیک جدید بالیاژ فرانسوی با مواد اورجینال ایتالیایی. مناسب موهای بلند و سالم.',
    contactPhone: '09121112233',
    createdAt: '۱۴۰۳/۰۴/۰۵',
    expiresAt: '۱۴۰۳/۰۴/۱۵',
    createdAtTimestamp: Date.now() - 15 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'mr_4',
    title: 'مدل لیزر الکس ۲۰۲۴',
    serviceName: 'لیزر موهای زائد',
    serviceImage: 'https://picsum.photos/400/300?random=53',
    businessName: 'مرکز لیزر رویال',
    businessId: 'b4',
    city: 'تهران، شهرک غرب',
    provinceId: 'tehran',
    cityId: 'tehran-city',
    serviceTypeId: 'laser',
    discount: 0,
    isUrgent: true,
    costType: 'material_cost',
    description:
      'تست دستگاه جدید لیزر الکساندرایت ۲۰۲۴. بدون درد و با خنک‌کننده قوی.',
    contactPhone: '09124445566',
    createdAt: '۱۴۰۳/۰۴/۰۳',
    expiresAt: '۱۴۰۳/۰۴/۱۳',
    createdAtTimestamp: Date.now() - 17 * 24 * 60 * 60 * 1000,
  },
];

// ═══════════ 🏢 اجاره لاین ═══════════
export const MOCK_LINE_RENTALS = [
  {
    id: 'lr_1',
    businessId: 'b1',
    title: 'لاین ناخن VIP با تجهیزات کامل',
    serviceTypeName: 'کاشت ناخن',
    serviceTypeIcon: 'brush',
    serviceTypeColor: '#7B1FA2',
    collabType: 'percent',
    priceDisplay: '۴۰-۶۰٪',
    businessName: 'سالن زیبایی نیلارام',
    city: 'تهران، سعادت‌آباد',
    lineImage: 'https://picsum.photos/400/300?random=70',
    contactPhone: '09121234567',
    description:
      'لاین ناخن کامل با میز حرفه‌ای، دستگاه UV/LED، و مجموعه کامل لاک ژل.',
    createdAt: '۱۴۰۳/۰۴/۱۱',
    expiresAt: '۱۴۰۳/۰۵/۱۱',
    serviceTypeId: 'nail',
    fixedAmount: 0,
    createdAtTimestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'lr_2',
    businessId: 'b2',
    title: 'لاین میکاپ با نور طبیعی',
    serviceTypeName: 'میکاپ و گریم',
    serviceTypeIcon: 'palette',
    serviceTypeColor: '#AD1457',
    collabType: 'hourly',
    priceDisplay: '۱۵۰K / ساعت',
    businessName: 'استودیو لاویا',
    city: 'تهران، نیاوران',
    lineImage: 'https://picsum.photos/400/300?random=71',
    contactPhone: '09129876543',
    description:
      'لاین میکاپ با نور طبیعی، آینه LED حرفه‌ای و میز گریم کامل.',
    createdAt: '۱۴۰۳/۰۴/۰۴',
    expiresAt: '۱۴۰۳/۰۵/۰۴',
    serviceTypeId: 'makeup',
    fixedAmount: 0,
    createdAtTimestamp: Date.now() - 8 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'lr_3',
    businessId: 'b3',
    title: 'لاین لیزر با دستگاه الکس',
    serviceTypeName: 'لیزر موهای زائد',
    serviceTypeIcon: 'flash-on',
    serviceTypeColor: '#00838F',
    collabType: 'fixed',
    priceDisplay: '۸M ماهانه',
    businessName: 'کلینیک رویال',
    city: 'اصفهان',
    lineImage: 'https://picsum.photos/400/300?random=72',
    contactPhone: '09121112233',
    description:
      'لاین لیزر با دستگاه الکساندرایت ۲۰۲۴، اتاق اختصاصی با تهویه مناسب.',
    createdAt: '۱۴۰۳/۰۳/۲۷',
    expiresAt: '۱۴۰۳/۰۴/۲۷',
    serviceTypeId: 'laser',
    fixedAmount: 8000000,
    createdAtTimestamp: Date.now() - 15 * 24 * 60 * 60 * 1000,
  },
];

// ═══════════ 🎯 توابع جستجو ═══════════
export const searchAll = (query) => {
  if (!query || !query.trim()) {
    return {
      businesses: [],
      services: [],
      posts: [],
      modelRequests: [],
      lineRentals: [],
    };
  }
  const q = query.trim().toLowerCase();
  const matches = (text) => text && text.toLowerCase().includes(q);

  const businesses = MOCK_BUSINESSES.filter(
    (b) =>
      matches(b.name) ||
      matches(b.serviceType) ||
      matches(b.category) ||
      matches(b.address)
  );

  const services = MOCK_SERVICES.filter(
    (s) =>
      matches(s.name) ||
      matches(s.typeName) ||
      matches(s.businessName)
  );

  const posts = MOCK_POSTS.filter(
    (p) =>
      matches(p.businessName) ||
      matches(p.caption)
  );

  const modelRequests = MOCK_MODEL_REQUESTS.filter(
    (m) =>
      matches(m.title) ||
      matches(m.serviceName) ||
      matches(m.businessName) ||
      matches(m.city)
  );

  const lineRentals = MOCK_LINE_RENTALS.filter(
    (l) =>
      matches(l.title) ||
      matches(l.serviceTypeName) ||
      matches(l.businessName) ||
      matches(l.city)
  );

  return { businesses, services, posts, modelRequests, lineRentals };
};

// ═══════════ 📊 محاسبه تعداد نتایج ═══════════
export const getResultCounts = (results) => ({
  all:
    results.businesses.length +
    results.services.length +
    results.posts.length +
    results.modelRequests.length +
    results.lineRentals.length,
  businesses: results.businesses.length,
  services: results.services.length,
  posts: results.posts.length,
  modelRequests: results.modelRequests.length,
  lineRentals: results.lineRentals.length,
});