// src/components/home/BusinessInfoCard.jsx
'use client';
import Image from 'next/image';
import { FiNavigation, FiPhone, FiShare2, FiCheck } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useToast } from '@/hooks/useToast';
import { toPersianDigit } from '@/utils/numberUtils';
import { cleanPhone } from '@/utils/phoneUtils';

/**
 * 🏪 کارت اطلاعات کسب‌وکار — نسخه مینیمال تخت
 * بدون سایه سنگین، چیپ‌های ظریف، دکمه‌های دایره‌ای
 */
export default function BusinessInfoCard({ business, onMapPress }) {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const memberSince = business.memberSince || '۲ سال';
  const servicesCount = business.servicesCount || business.services?.length || 0;

  // ═══ تماس ═══
  const handleCall = () => {
    const phone = cleanPhone(business.phone || '');
    if (phone) {
      window.location.href = `tel:${phone}`;
    } else {
      showToast('شماره تماسی ثبت نشده است', 'error');
    }
  };

  // ═══ اشتراک‌گذاری ═══
  const handleShare = async () => {
    const shareMessage = `🌸 ${business.name}\n📍 ${business.address}\n✨ رزرو از اپلیکیشن بیو کلاب`;
    if (navigator.share) {
      try {
        await navigator.share({ title: business.name, text: shareMessage });
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(shareMessage);
      showToast('✓ لینک کپی شد', 'success');
    } catch {
      showToast('امکان کپی کردن لینک وجود ندارد', 'error');
    }
  };

  const actions = [
    {
      id: 'map',
      label: 'مسیریابی',
      icon: <FiNavigation size={18} />,
      color: '#E53935',
      onClick: onMapPress,
    },
    {
      id: 'call',
      label: 'تماس',
      icon: <FiPhone size={17} />,
      color: '#43A047',
      onClick: handleCall,
    },
    {
      id: 'share',
      label: 'اشتراک',
      icon: <FiShare2 size={16} />,
      color: colors.primary,
      onClick: handleShare,
    },
  ];

  return (
    <div className="px-5 pt-5">
      {/* ═══ لوگو (زیر کاور — بدون تغییر) ═══ */}
      <div
        className="relative w-[88px] h-[88px] -mt-[64px] rounded-[24px] overflow-hidden"
        style={{ border: `4px solid ${colors.background}` }}
      >
        {business.ownerPhoto ? (
          <Image
            src={business.ownerPhoto}
            alt={business.name || 'لوگو کسب‌وکار'}
            width={80} // یا هر ابعادی که در کد خودتان دارید
            height={70}
            className="object-cover"
          />
        ) : (
          // یک جایگزین (Placeholder) در صورتی که کسب‌وکار لوگو نداشته باشد
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
            style={{ backgroundColor: colors?.border || '#e5e7eb' }}
          >
            🏪
          </div>
        )}
      </div>

      {/* ═══ نام + VIP ═══ */}
      <div className="flex items-center gap-2 mt-3">
        <h1 className="text-[20px] font-[Vazir-Bold] leading-7" style={{ color: colors.textMain }}>
          {business.name}
        </h1>
        {business.VIP && <span className="text-[15px]">👑</span>}
      </div>

      {/* ═══ مدیر + تایید ═══ */}
      {business.ownerName && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="text-[11px]" style={{ color: colors.textSecondary }}>
            مدیریت:
          </span>
          <span className="text-[12px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            {business.ownerName}
          </span>
          {business.ownerVerified && (
            <span
              className="flex items-center gap-0.5 text-[10px] font-[Vazir-Bold]"
              style={{ color: '#43A047' }}
            >
              <FiCheck size={11} />
              تایید شده
            </span>
          )}
        </div>
      )}

      {/* ═══ چیپ‌های ظریف: دسته‌بندی / شهر ═══ */}
      <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
        <span
          className="px-2.5 py-1 rounded-full border text-[10px] font-[Vazir-Medium]"
          style={{ borderColor: colors.border, color: colors.textSecondary }}
        >
          💆‍♀️ {business.category}
        </span>
        <span
          className="px-2.5 py-1 rounded-full border text-[10px] font-[Vazir-Medium]"
          style={{ borderColor: colors.border, color: colors.textSecondary }}
        >
          📍 {business.city}
        </span>
      </div>

      {/* ═══ چیپ‌های آمار یک‌ردیفی ═══ */}
      <div className="flex flex-wrap items-center gap-1.5 mt-2">
        <span
          className="flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-[Vazir-Bold]"
          style={{ borderColor: colors.border, color: colors.textMain }}
        >
          <span style={{ color: '#FFC107' }}>★</span>
          {toPersianDigit((parseFloat(business.rating) || 0).toFixed(1))}
          <span className="font-[Vazir]" style={{ color: colors.textSecondary }}>
            ({toPersianDigit(business.reviewsCount || 0)})
          </span>
        </span>
        <span
          className="flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-[Vazir-Bold]"
          style={{ borderColor: colors.border, color: colors.textMain }}
        >
          💆‍♀️ {toPersianDigit(servicesCount)} خدمت
        </span>
        <span
          className="flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-[Vazir-Bold]"
          style={{ borderColor: colors.border, color: colors.textMain }}
        >
          🏆 {memberSince} عضویت
        </span>
      </div>

      {/* ═══ دکمه‌های دایره‌ای اکشن ═══ */}
      <div className="flex items-center gap-5 mt-4 pb-1">
        {actions.map((a) => (
          <button key={a.id} onClick={a.onClick} className="flex flex-col items-center gap-1.5">
            <span
              className="w-12 h-12 rounded-full border flex items-center justify-center transition-transform active:scale-90"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.cardBackground,
                color: a.color,
              }}
            >
              {a.icon}
            </span>
            <span
              className="text-[10px] font-[Vazir-Medium]"
              style={{ color: colors.textSecondary }}
            >
              {a.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
