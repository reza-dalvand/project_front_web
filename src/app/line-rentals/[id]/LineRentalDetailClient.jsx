// src/app/line-rentals/[id]/LineRentalDetailClient.jsx
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowRight, FiShare2, FiPhone, FiMapPin, FiCalendar, FiInfo } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import CollabBadge from '@/components/common/CollabBadge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { toPersianDigit } from '@/utils/numberUtils';
import { cleanPhone } from '@/utils/phoneUtils';
import { useToast } from '@/hooks/useToast';
import { adsService } from '@/api';
import { USE_MOCK } from '@/api/config';
import { MOCK_LINE_RENTAL_DETAIL } from '@/data/lineRentals';

// ✅ Helper تعریف شده
const getLineEmoji = (typeName = '') => {
  if (typeName.includes('ناخن')) return '💅';
  if (typeName.includes('میکاپ') || typeName.includes('گریم')) return '💄';
  if (typeName.includes('فیشیال') || typeName.includes('پوست')) return '✨';
  if (typeName.includes('لیزر')) return '⚡';
  if (typeName.includes('مو') || typeName.includes('رنگ') || typeName.includes('کراتین')) return '🎨';
  if (typeName.includes('مژه') || typeName.includes('ابرو')) return '👁️';
  if (typeName.includes('ماساژ')) return '💆‍♀️';
  return '🏢';
};

export default function LineRentalDetailPage() {
const params = useParams();
const router = useRouter();
const { colors } = useTheme();
const { showToast } = useToast();
const [rental, setRental] = useState(null);
const [isLoading, setIsLoading] = useState(true);

// ═══ دریافت جزئیات از API ═══
useEffect(() => {
const fetchDetail = async () => {
setIsLoading(true);
try {
if (USE_MOCK) {
setRental(MOCK_LINE_RENTAL_DETAIL);
} else {
const result = await adsService.getLineRentalDetail(params.id);
setRental(result.data);
}
} catch (error) {
console.error('Failed to fetch line rental detail:', error);
showToast('خطا در بارگذاری جزئیات', 'error');
} finally {
setIsLoading(false);
}
};
fetchDetail();
}, [params.id, showToast]);

const handleCall = () => {
if (rental?.contact_phone || rental?.contactPhone) {
const phone = cleanPhone(rental.contact_phone || rental.contactPhone);
window.location.href = `tel:${phone}`;
} else {
showToast('شماره تماسی ثبت نشده است', 'error');
}
};

const handleShare = async () => {
const shareMessage = `🏢 ${rental?.title || ''}
🏪 ${rental?.business_name || rental?.businessName || ''}
🔗 ${typeof window !== 'undefined' ? window.location.href : ''}`;

if (navigator.share) {
try {
await navigator.share({
title: rental?.title || 'آگهی لاین',
text: shareMessage,
url: typeof window !== 'undefined' ? window.location.href : undefined,
});
return;
} catch (err) {
if (err?.name === 'AbortError') return;
}
}
try {
await navigator.clipboard.writeText(shareMessage);
showToast('لینک کپی شد', 'success');
} catch {
showToast('امکان کپی وجود ندارد', 'error');
}
};

if (isLoading) {
return (
<ScreenWrapper>
<div className="flex justify-center py-20">
<LoadingSpinner label="در حال بارگذاری..." />
</div>
</ScreenWrapper>
);
}

if (!rental) {
return (
<ScreenWrapper>
<div className="flex flex-col items-center py-20 gap-3">
<span className="text-4xl">🔍</span>
<p className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
آگهی یافت نشد
</p>
</div>
</ScreenWrapper>
);
}

const collabType = rental.collab_type || rental.collabType;
const businessName = rental.business_name || rental.businessName;
const city = rental.city || '';
const description = rental.description || '';
const contactPhone = rental.contact_phone || rental.contactPhone;
const createdAt = rental.created_jalali || rental.createdAt || '';
const expiresAt = rental.expires_jalali || rental.expiresAt || '';
const serviceTypeName = rental.service_category_name || rental.serviceTypeName || '';
const serviceCategoryName = rental.service_category_name || '';
const subServiceName = rental.sub_service_name || '';
const percentSalon = rental.percent_salon || rental.percentSalon;
const percentPartner = rental.percent_partner || rental.percentPartner;
const fixedAmount = rental.fixed_amount || rental.fixedAmount;
const fixedDeposit = rental.fixed_deposit || rental.fixedDeposit;
const hourlyRate = rental.hourly_rate || rental.hourlyRate;

// ساخت متن قیمت
const getPriceDisplay = () => {
if (collabType === 'percent') {
return `${toPersianDigit(percentSalon)}-${toPersianDigit(percentPartner)}٪`;
}
if (collabType === 'fixed') {
let text = `${toPersianDigit((fixedAmount || 0).toLocaleString('en-US'))} تومان`;
if (fixedDeposit > 0) {
text += ` + ${toPersianDigit(fixedDeposit.toLocaleString('en-US'))} رهن`;
}
return text;
}
if (collabType === 'hourly') {
return `${toPersianDigit((hourlyRate || 0).toLocaleString('en-US'))} / ساعت`;
}
return '';
};

return (
<ScreenWrapper scrollable padding={0}>
{/* ═══ هدر گرادیانی (بدون تصویر) ═══ */}
<div
className="relative w-full h-[320px] overflow-hidden"
style={{
background: 'linear-gradient(135deg, #667eea 0%, #5a67d8 50%, #764ba2 100%)',
}}
>
{/* دایره‌های تزئینی */}
<div
className="absolute -top-12 -left-12 w-44 h-44 rounded-full"
style={{ backgroundColor: 'rgba(255,255,255,0.10)' }}
/>
<div
className="absolute -bottom-10 -right-8 w-36 h-36 rounded-full"
style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
/>
<div
className="absolute top-16 right-14 w-14 h-14 rounded-full"
style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
/>
<div
className="absolute bottom-16 left-10 w-8 h-8 rounded-full"
style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
/>
<div
className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
/>

{/* ایموجی خدمت */}
<div className="absolute inset-0 flex items-center justify-center">
<span
className="text-[80px]"
style={{ filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.3))' }}
>
{getLineEmoji(serviceCategoryName)}
</span>
</div>

{/* دکمه‌ها */}
<div className="absolute top-4 left-4 right-4 flex items-center gap-3 z-10">
<button
onClick={() => router.back()}
className="w-11 h-11 rounded-full flex items-center justify-center border border-white/15 backdrop-blur-sm"
style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
>
<FiArrowRight size={22} color="#fff" />
</button>
<div className="flex-1" />
<button
onClick={handleShare}
className="w-11 h-11 rounded-full flex items-center justify-center border border-white/15 backdrop-blur-sm"
style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
>
<FiShare2 size={20} color="#fff" />
</button>
</div>

{/* بج نوع خدمت */}
{serviceCategoryName && (
<div
className="absolute top-20 left-4 px-3 py-1.5 rounded-xl shadow-md"
style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
>
<span className="text-[11px] font-[Vazir-Bold] text-white">
{serviceCategoryName}
</span>
</div>
)}

{/* نوار شیشه‌ای پایین */}
<div
className="absolute bottom-0 left-0 right-0 h-[50px] flex items-center px-5 gap-3"
style={{ backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
>
<span className="text-sm font-[Vazir-Medium] text-white/90 truncate flex-1">
{collabType === 'percent'
? `درصدی ${getPriceDisplay()}`
: collabType === 'fixed'
? `اجاره ثابت ${getPriceDisplay()}`
: `ساعتی ${getPriceDisplay()}`}
</span>
</div>
</div>

{/* محتوا */}
<div className="p-5 space-y-4 pb-32">
{/* عنوان و اطلاعات */}
<div className="space-y-3">
<h1 className="text-lg font-[Vazir-Bold] leading-7" style={{ color: colors.textMain }}>
{rental.title}
</h1>

{/* Badge نوع همکاری */}
<div className="flex items-center gap-2 flex-wrap">
<CollabBadge type={collabType} priceDisplay={getPriceDisplay()} variant="default" />
</div>

{/* متا */}
<div className="flex items-center gap-3 flex-wrap">
<div className="flex items-center gap-1.5">
<span className="text-xs">🏪</span>
<span className="text-[11px] font-[Vazir-Medium]" style={{ color: colors.primary }}>
{businessName}
</span>
</div>
{city && (
<div className="flex items-center gap-1">
<FiMapPin size={11} color={colors.textSecondary} />
<span className="text-[10px]" style={{ color: colors.textSecondary }}>
{city}
</span>
</div>
)}
</div>

{/* زیرخدمت */}
{subServiceName && (
<div className="flex items-center gap-1.5">
<span className="text-[11px]" style={{ color: colors.textSecondary }}>
💆‍♀️
</span>
<span className="text-[10px]" style={{ color: colors.textSecondary }}>
{subServiceName}
</span>
</div>
)}
</div>

{/* شرایط همکاری */}
<Card variant="elevated" padding={16} radius={18}>
<div className="flex items-center gap-2 mb-3">
<span className="text-base">🤝</span>
<span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
شرایط همکاری
</span>
</div>
<div
className="p-3 rounded-xl border"
style={{
backgroundColor: '#667eea08',
borderColor: '#667eea30',
}}
>
<p className="text-sm font-[Vazir-Bold]" style={{ color: '#667eea' }}>
{getPriceDisplay()}
</p>
</div>
</Card>

{/* توضیحات */}
<Card variant="elevated" padding={16} radius={18}>
<div className="flex items-center gap-2 mb-3">
<FiInfo size={18} style={{ color: colors.primary }} />
<span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
توضیحات آگهی
</span>
</div>
<p className="text-[13px] leading-6 text-justify" style={{ color: colors.textSecondary }}>
{description || 'توضیحاتی برای این آگهی ثبت نشده است.'}
</p>
</Card>

{/* تاریخ‌ها */}
{(createdAt || expiresAt) && (
<Card variant="elevated" padding={14} radius={16}>
{createdAt && (
<div className="flex items-center gap-3 mb-2">
<FiCalendar size={16} color={colors.textSecondary} />
<span className="text-xs" style={{ color: colors.textSecondary }}>
ثبت: {createdAt}
</span>
</div>
)}
{expiresAt && (
<div className="flex items-center gap-3">
<FiCalendar size={16} color="#FF9800" />
<span className="text-xs" style={{ color: colors.textSecondary }}>
انقضا: {expiresAt}
</span>
</div>
)}
</Card>
)}

{/* دکمه تماس */}
{contactPhone && (
<Button
title="تماس با کسب‌وکار"
onPress={handleCall}
variant="primary"
size="lg"
fullWidth
icon={<FiPhone size={18} color="#fff" />}
iconPosition="right"
style={{ backgroundColor: '#4CAF50' }}
/>
)}
</div>
</ScreenWrapper>
);
}