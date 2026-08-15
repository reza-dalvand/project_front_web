// src/app/line-rentals/page.jsx
'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowRight, FiMapPin } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useNearbyStore } from '@/stores/useNearbyStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import CollabBadge from '@/components/common/CollabBadge';
import { toPersianDigit } from '@/utils/numberUtils';
import { adsService } from '@/api';
import { USE_MOCK } from '@/api/config';
import { MOCK_LINE_RENTALS } from '@/data/lineRentals';

// ═══════ ایموجی هوشمند بر اساس نوع خدمت ═══════
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

const COLLAB_FILTER_OPTIONS = [
{ id: 'all', label: 'همه', icon: '📋' },
{ id: 'percent', label: 'درصدی', icon: '📊' },
{ id: 'fixed', label: 'اجاره ثابت', icon: '💰' },
{ id: 'hourly', label: 'ساعتی', icon: '⏰' },
];

export default function LineRentalsPage() {
const router = useRouter();
const { colors } = useTheme();
const nearbyEnabled = useNearbyStore((s) => s.enabled);
const userLocation = useNearbyStore((s) => s.userLocation);
const [rentals, setRentals] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [collabFilter, setCollabFilter] = useState('all');

// ═══ دریافت لیست از API ═══
useEffect(() => {
const fetchRentals = async () => {
setIsLoading(true);
try {
if (USE_MOCK) {
setRentals(MOCK_LINE_RENTALS.filter((r) => r.status === 'active'));
} else {
const params = {};
if (nearbyEnabled && userLocation) {
params.lat = userLocation.latitude;
params.lng = userLocation.longitude;
params.radius = 10;
}
const result = await adsService.getLineRentals(params);
setRentals(result.data || []);
}
} catch (error) {
console.error('Failed to fetch line rentals:', error);
} finally {
setIsLoading(false);
}
};
fetchRentals();
}, [nearbyEnabled, userLocation]);

// ═══ فیلتر نوع همکاری ═══
const filteredRentals = useMemo(() => {
if (collabFilter === 'all') return rentals;
return rentals.filter((r) => r.collab_type === collabFilter || r.collabType === collabFilter);
}, [rentals, collabFilter]);

const handleRentalPress = useCallback(
(rental) => {
router.push(`/line-rentals/${rental.id}`);
},
[router]
);

return (
<ScreenWrapper scrollable padding={0}>
{/* هدر */}
<div className="rounded-b-3xl pb-6 pt-4 px-5" style={{ backgroundColor: '#667eea' }}>
<div className="flex items-center gap-3">
<button
onClick={() => router.back()}
className="w-10 h-10 rounded-xl flex items-center justify-center"
style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
>
<FiArrowRight size={22} color="#fff" />
</button>
<div className="flex items-center gap-3 flex-1">
<div
className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
>
<span className="text-2xl">🏢</span>
</div>
<div className="flex flex-col gap-0.5">
<span className="text-xs text-white/80 font-[Vazir]">فرصت‌های همکاری</span>
<h1 className="text-md font-[Vazir-Bold] text-white">اجاره لاین</h1>
</div>
</div>
<div
className="w-10 h-10 rounded-xl flex items-center justify-center"
style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
>
<span className="text-sm font-[Vazir-Bold] text-white">
{toPersianDigit(filteredRentals.length)}
</span>
</div>
</div>
</div>

{/* فیلتر نوع همکاری */}
<div className="flex gap-2 overflow-x-auto px-5 py-3 scrollbar-hide">
{COLLAB_FILTER_OPTIONS.map((option) => {
const isActive = collabFilter === option.id;
return (
<button
key={option.id}
onClick={() => setCollabFilter(option.id)}
className="flex items-center gap-1.5 px-3.5 py-2 rounded-[14px] border-[1.5px] whitespace-nowrap text-xs font-[Vazir-Bold] transition-all flex-shrink-0"
style={{
backgroundColor: isActive ? '#667eea' : colors.cardBackground,
borderColor: isActive ? '#667eea' : colors.border,
color: isActive ? '#fff' : colors.textMain,
}}
>
<span>{option.icon}</span>
{option.label}
</button>
);
})}
</div>

{/* لیست آگهی‌ها */}
<div className="px-5 pb-32 space-y-4">
{isLoading ? (
<div className="flex justify-center py-12">
<LoadingSpinner label="در حال بارگذاری..." />
</div>
) : filteredRentals.length > 0 ? (
filteredRentals.map((rental) => {
const collabType = rental.collab_type || rental.collabType;
const businessName = rental.business_name || rental.businessName;
const city = rental.city || '';
const serviceTypeName = rental.service_category_name || rental.serviceTypeName || '';
const distance = rental.distance;

return (
<button
key={rental.id}
onClick={() => handleRentalPress(rental)}
className="w-full rounded-2xl border overflow-hidden text-right transition-all hover:shadow-md active:scale-[0.99]"
style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
>
{/* ═══ هدر گرادیانی (بدون تصویر) ═══ */}
<div
className="relative w-full h-[160px] overflow-hidden"
style={{
background: 'linear-gradient(135deg, #667eea 0%, #5a67d8 50%, #764ba2 100%)',
}}
>
{/* دایره‌های تزئینی */}
<div
className="absolute -top-6 -left-6 w-24 h-24 rounded-full"
style={{ backgroundColor: 'rgba(255,255,255,0.10)' }}
/>
<div
className="absolute -bottom-8 -right-6 w-28 h-28 rounded-full"
style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
/>
<div
className="absolute top-10 right-12 w-8 h-8 rounded-full"
style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
/>
<div
className="absolute bottom-6 left-8 w-5 h-5 rounded-full"
style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
/>

{/* ایموجی خدمت */}
<div className="absolute inset-0 flex items-center justify-center">
<span
className="text-[48px]"
style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}
>
{getLineEmoji(serviceTypeName)}
</span>
</div>

{/* بج نوع خدمت */}
{serviceTypeName && (
<div
className="absolute top-3 left-3 px-2.5 py-1 rounded-lg shadow-md"
style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
>
<span className="text-[10px] font-[Vazir-Bold] text-white">
{serviceTypeName}
</span>
</div>
)}

{/* نوار شیشه‌ای پایین */}
<div
className="absolute bottom-0 left-0 right-0 h-[36px] flex items-center px-3 gap-2"
style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)' }}
>
<span className="text-[11px] font-[Vazir-Medium] text-white/90 truncate flex-1">
{collabType === 'percent'
? `درصدی ${rental.priceDisplay || ''}`
: collabType === 'fixed'
? `اجاره ثابت ${rental.priceDisplay || ''}`
: `ساعتی ${rental.priceDisplay || ''}`}
</span>
</div>
</div>

{/* محتوا */}
<div className="p-3.5 space-y-2.5">
<h3
className="text-base font-[Vazir-Bold] leading-6 line-clamp-2"
style={{ color: colors.textMain }}
>
{rental.title}
</h3>

{/* بج نوع همکاری */}
<div className="flex items-center gap-1.5">
<CollabBadge type={collabType} priceDisplay={rental.priceDisplay} variant="compact" />
</div>

{/* متا */}
<div className="flex items-center gap-3 flex-wrap">
<div className="flex items-center gap-1.5">
<span className="text-xs">🏪</span>
<span
className="text-[11px] font-[Vazir-Medium] line-clamp-1"
style={{ color: colors.primary }}
>
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
{distance !== null && distance !== undefined && (
<div className="flex items-center gap-1">
<FiMapPin size={11} color="#2196F3" />
<span
className="text-[10px] font-[Vazir-Bold]"
style={{ color: '#2196F3' }}
>
{distance < 1
? `${Math.round(distance * 1000)} متر`
: `${distance.toFixed(1)} کیلومتر`}
</span>
</div>
)}
</div>
</div>
</button>
);
})
) : (
<EmptyState
icon="🏢"
title="آگهی لاینی یافت نشد"
description="فیلترهای خود را تغییر دهید"
/>
)}
</div>
</ScreenWrapper>
);
}