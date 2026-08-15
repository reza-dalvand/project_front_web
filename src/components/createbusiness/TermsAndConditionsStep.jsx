// src/components/createbusiness/TermsAndConditionsStep.jsx
'use client';
import { useState } from 'react';
import { FiShield, FiCheck, FiChevronLeft, FiLock } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import { toPersianDigit } from '@/utils/numberUtils';

// ═══════ مراحل ثبت کسب‌وکار ═══════
const REGISTRATION_STEPS = [
{
id: 1,
emoji: '📋',
title: 'قوانین و مقررات',
description: 'مطالعه و پذیرش قوانین زیبانو',
color: '#9C27B0',
},
{
id: 2,
emoji: '🪪',
title: 'احراز هویت',
description: 'تایید کد ملی با شماره ثبت‌نام',
color: '#FF9800',
},
{
id: 3,
emoji: '🏪',
title: 'اطلاعات کسب‌وکار',
description: 'نام، آدرس، تصاویر و موقعیت مکانی',
color: '#2196F3',
},
];

export default function TermsAndConditionsStep({ onAccept, onDecline }) {
const { colors } = useTheme();
const [accepted, setAccepted] = useState(false);

const canProceed = accepted;

return (
<div className="flex flex-col h-full" style={{ backgroundColor: colors.background }}>
{/* ═══════ محتوای اسکرولی ═══════ */}
<div className="flex-1 overflow-y-auto px-5 pt-6 pb-4 space-y-6">
{/* هدر */}
<div className="flex flex-col items-center gap-4">
<div className="relative">
<div
className="absolute -inset-3 rounded-full border-2 border-dashed"
style={{ borderColor: colors.primary + '25' }}
/>
<div
className="w-20 h-20 rounded-full flex items-center justify-center relative z-10 shadow-lg"
style={{ backgroundColor: colors.primary }}
>
<FiShield size={36} color="#fff" />
</div>
</div>
<div className="text-center">
<h2 className="text-xl font-[Vazir-Bold] mb-1" style={{ color: colors.textMain }}>
ثبت کسب‌وکار جدید
</h2>
<p className="text-sm" style={{ color: colors.textSecondary }}>
برای شروع، مراحل زیر را طی خواهید کرد
</p>
</div>
</div>

{/* ═══════ مراحل ثبت ═══════ */}
<div className="space-y-0">
{REGISTRATION_STEPS.map((step, index) => {
const isFirst = index === 0;
const isLast = index === REGISTRATION_STEPS.length - 1;
return (
<div key={step.id} className="flex gap-4">
{/* خط تایم‌لاین + دایره */}
<div className="flex flex-col items-center">
{/* دایره شماره */}
<div
className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 border-2 z-10"
style={{
backgroundColor: isFirst ? step.color : colors.cardBackground,
borderColor: isFirst ? step.color : colors.border,
}}
>
{isFirst ? (
<span className="text-lg">{step.emoji}</span>
) : (
<span
className="text-sm font-[Vazir-Bold]"
style={{ color: isFirst ? '#fff' : colors.textSecondary }}
>
{toPersianDigit(step.id)}
</span>
)}
</div>
{/* خط عمودی */}
{!isLast && (
<div
className="w-0.5 flex-1 my-1 rounded-full"
style={{
backgroundColor: colors.border,
minHeight: '32px',
}}
/>
)}
</div>
{/* محتوای مرحله */}
<div className={`flex-1 ${!isLast ? 'pb-5' : ''}`}>
<div
className="p-3.5 rounded-2xl border transition-all"
style={{
backgroundColor: isFirst
? step.color + '08'
: colors.cardBackground,
borderColor: isFirst
? step.color + '40'
: colors.border,
}}
>
<div className="flex items-center gap-2.5 mb-1">
<span className="text-base">{step.emoji}</span>
<span
className="text-sm font-[Vazir-Bold] flex-1"
style={{
color: isFirst ? step.color : colors.textMain,
}}
>
{step.title}
</span>
{isFirst && (
<span
className="text-[9px] font-[Vazir-Bold] px-2 py-0.5 rounded-full"
style={{
backgroundColor: step.color,
color: '#fff',
}}
>
مرحله فعلی
</span>
)}
</div>
<p
className="text-xs leading-5"
style={{ color: colors.textSecondary }}
>
{step.description}
</p>
</div>
</div>
</div>
);
})}
</div>

{/* ═══════ چک‌باکس قوانین ═══════ */}
<div
className="rounded-2xl border-2 overflow-hidden"
style={{
borderColor: accepted ? colors.primary : colors.border,
}}
>
<button
onClick={() => setAccepted(!accepted)}
className="w-full flex items-center gap-3.5 p-4 text-right transition-all"
style={{
backgroundColor: accepted
? colors.primary + '08'
: colors.cardBackground,
}}
>
{/* چک‌باکس */}
<div
className="w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors"
style={{
backgroundColor: accepted ? colors.primary : 'transparent',
borderColor: accepted ? colors.primary : colors.border,
}}
>
{accepted && <FiCheck size={16} color="#fff" />}
</div>
{/* متن */}
<span
className="text-sm font-[Vazir] leading-6 flex-1"
style={{ color: colors.textMain }}
>
تمامی قوانین و مقررات زیبانو را{' '}
<span className="font-[Vazir-Bold]" style={{ color: colors.primary }}>
مطالعه کرده و می‌پذیرم.
</span>
</span>
</button>
{/* لینک قوانین */}
<div
className="flex items-center justify-center gap-1.5 py-2.5 border-t"
style={{ borderColor: colors.border }}
>
<a
href="https://zibano.app/terms"
target="_blank"
rel="noopener noreferrer"
className="flex items-center gap-1"
>
<FiLock size={11} style={{ color: colors.primary }} />
<span
className="text-[11px] font-[Vazir-Medium] underline underline-offset-2"
style={{ color: colors.primary }}
>
مطالعه کامل قوانین و مقررات
</span>
</a>
</div>
</div>

{/* پیام راهنما */}
{!accepted && (
<p
className="text-[11px] text-center"
style={{ color: colors.textSecondary }}
>
برای ادامه، ابتدا قوانین را بپذیرید
</p>
)}
</div>

{/* ═══════ فوتر ثابت — بدون اسکرول ═══════ */}
<div
className="flex-shrink-0 px-5 pt-3 border-t"
style={{
borderColor: colors.border,
backgroundColor: colors.cardBackground,
/* ✅ فاصله از Navigation Bar گوشی */
paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
}}
>
<div className="flex gap-3">
<Button
title="انصراف"
onPress={onDecline}
variant="outline"
size="lg"
className="flex-1"
/>
<Button
title="مرحله بعد"
onPress={onAccept}
variant="primary"
size="lg"
disabled={!canProceed}
className="flex-[2]"
icon={<FiChevronLeft size={18} color="#fff" />}
iconPosition="right"
/>
</div>
</div>
</div>
);
}