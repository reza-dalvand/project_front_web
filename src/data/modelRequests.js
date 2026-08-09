// src/data/modelRequests.js

/**
 * 👤 فرصت‌های مدلینگ
 * استفاده شده در: صفحه اصلی، صفحه همه مدلینگ، جزئیات مدلینگ
 */
export const MOCK_MODEL_REQUESTS = [
  {
    id: 'mr_1', title: 'مدل فیشیال VIP عروس', serviceName: 'فیشیال تخصصی پوست',
    serviceImage: 'https://picsum.photos/400/300?random=50', serviceTypeId: 'facial',
    businessName: 'کلینیک زیبایی صدف', businessId: 'b1', city: 'تهران، سعادت‌آباد',
    costType: 'paid', discount: 50, isUrgent: true,
    description: 'نیاز به مدل برای تست محصولات جدید فیشیال. این خدمت شامل پاکسازی عمیق پوست، استفاده از ماسک طلای ۲۴ عیار و ماساژ صورت با روغن‌های طبیعی است.',
    contactPhone: '09121234567', createdAt: '۱۴۰۳/۰۴/۱۰', expiresAt: '۱۴۰۳/۰۴/۲۰',
  },
  {
    id: 'mr_2', title: 'مدل طراحی ناخن ژورنالی', serviceName: 'کاشت ناخن',
    serviceImage: 'https://picsum.photos/400/300?random=51', serviceTypeId: 'nail',
    businessName: 'ناخن گالری پریا', businessId: 'b2', city: 'کرج، فردیس',
    costType: 'material_cost', discount: 70, isUrgent: false,
    description: 'طراحی‌های جدید و خاص برای نمونه‌کار با تکنیک‌های روز دنیا. مناسب ناخن‌های طبیعی و سالم.',
    contactPhone: '09129876543', createdAt: '۱۴۰۳/۰۴/۰۸', expiresAt: '۱۴۰۳/۰۴/۱۸',
  },
  {
    id: 'mr_3', title: 'مدل تکنیک بالیاژ فرانسوی', serviceName: 'رنگ و لایت مو',
    serviceImage: 'https://picsum.photos/400/300?random=52', serviceTypeId: 'hair',
    businessName: 'سالن زیبایی افرا', businessId: 'b3', city: 'تهران، نیاوران',
    costType: 'paid', discount: 60, isUrgent: false,
    description: 'تست تکنیک جدید بالیاژ فرانسوی با مواد اورجینال ایتالیایی. مناسب موهای بلند و سالم.',
    contactPhone: '09121112233', createdAt: '۱۴۰۳/۰۴/۰۵', expiresAt: '۱۴۰۳/۰۴/۱۵',
  },
  {
    id: 'mr_4', title: 'مدل لیزر الکس ۲۰۲۴', serviceName: 'لیزر موهای زائد',
    serviceImage: 'https://picsum.photos/400/300?random=53', serviceTypeId: 'laser',
    businessName: 'مرکز لیزر رویال', businessId: 'b4', city: 'تهران، شهرک غرب',
    costType: 'material_cost', discount: 0, isUrgent: true,
    description: 'تست دستگاه جدید لیزر الکساندرایت ۲۰۲۴. بدون درد و با خنک‌کننده قوی.',
    contactPhone: '09124445566', createdAt: '۱۴۰۳/۰۴/۰۳', expiresAt: '۱۴۰۳/۰۴/۱۳',
  },
];