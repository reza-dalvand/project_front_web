'use client';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiArrowRight, FiShare2, FiMapPin, FiPhone, FiInfo, FiCheckCircle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import { Card, ActionButtons, CollabBadge } from '@/components/common';
import { toPersianDigit } from '@/utils/numberUtils';
import { cleanPhone } from '@/utils/phoneUtils';

// داده‌های MOCK (در production از API)
const MOCK_AD = {
  id: 'lr_1',
  businessId: 'b1',
  title: 'لاین ناخن VIP با تجهیزات کامل',
  serviceTypeId: 'nail',
  serviceTypeName: 'کاشت و طراحی ناخن',
  collabType: 'percent',
  collabLabel: 'درصدی',
  percentSalon: 40,
  percentPartner: 60,
  priceDisplay: '۴۰-۶۰٪',
  description:
    'لاین ناخن کامل با میز حرفه‌ای، دستگاه UV/LED، و مجموعه کامل لاک ژل. مناسب ناخن‌کار حرفه‌ای با سابقه کار حداقل ۲ سال. فضای اختصاصی با نور طبیعی و تهویه مناسب. امکان استفاده از انبار و محصولات مشترک.',
  lineImage: 'https://picsum.photos/800/600?random=70',
  businessName: 'سالن زیبایی نیلارام',
  city: 'تهران، سعادت‌آباد',
  contactPhone: '09121234567',
  createdAt: '۱۴۰۳/۰۴/۱۱',
  expiresAt: '۱۴۰۳/۰۵/۱۱',
};

export default function LineRentalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { colors } = useTheme();
  const ad = MOCK_AD; // در production: بر اساس params.id از API

  const shareUrl = `https://zibano.app/line-rental/${ad.id}`;

  const handleBusinessPress = () => {
    router.push(`/business/${ad.businessId}`);
  };

  return (
    <ScreenWrapper scrollable padding={0}>
      {/* ═══ Hero Section ═══ */}
      <div className="relative w-full h-[320px] bg-black overflow-hidden">
        <Image
          src={ad.lineImage}
          alt={ad.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[17%]"
          style={{ backgroundColor: 'rgba(0,0,0,0.20)' }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-[120px]"
          style={{ backgroundColor: 'rgba(0,0,0,0.20)' }}
        />

        {/* دکمه‌های بالا */}
        <div
          className="absolute top-0 left-4 right-4 flex items-center gap-3 z-10"
          style={{ paddingTop: '20px' }}
        >
          <button
            onClick={() => router.back()}
            className="w-11 h-11 rounded-full flex items-center justify-center
              border border-white/15 transition-transform hover:scale-105"
            style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          >
            <FiArrowRight size={22} color="#fff" />
          </button>
          <div className="flex-1" />
          <button
            onClick={async () => {
              if (navigator.share) {
                await navigator.share({
                  title: ad.title,
                  text: ad.description,
                  url: shareUrl,
                });
              } else {
                navigator.clipboard?.writeText(shareUrl);
              }
            }}
            className="w-11 h-11 rounded-full flex items-center justify-center
              border border-white/15 transition-transform hover:scale-105"
            style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          >
            <FiShare2 size={20} color="#fff" />
          </button>
        </div>

        {/* بج‌های پایین هیرو */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2">
          {/* تگ تاریخ ثبت */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl shadow-md"
            style={{ backgroundColor: 'rgba(33,150,243,0.85)' }}
          >
            <span className="text-xs">📅</span>
            <span className="text-[11px] font-[Vazir-Bold] text-white">ثبت: {ad.createdAt}</span>
          </div>

          {/* تگ نوع خدمت */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl shadow-md"
            style={{ backgroundColor: '#7B1FA2' }}
          >
            <span className="text-xs">💅</span>
            <span className="text-[11px] font-[Vazir-Bold] text-white">{ad.serviceTypeName}</span>
          </div>
        </div>
      </div>

      {/* ═══ Content ═══ */}
      <div className="p-5 space-y-4 pb-16">
        {/* عنوان */}
        <h1
          className="text-[22px] font-[Vazir-Bold] leading-[34px]"
          style={{ color: colors.textMain }}
        >
          {ad.title}
        </h1>

        {/* شهر و نام کسب‌وکار */}
        <div className="flex items-center gap-2 -mt-1">
          <span className="text-sm">🏪</span>
          <span className="text-[13px] font-[Vazir-Bold]" style={{ color: colors.primary }}>
            {ad.businessName}
          </span>
          <div className="w-1 h-1 rounded-full mx-0.5" style={{ backgroundColor: colors.border }} />
          <FiMapPin size={14} color={colors.textSecondary} />
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            {ad.city}
          </span>
        </div>

        {/* ═══ کارت کسب و کار ═══ */}
        <Card variant="elevated" padding={14} radius={16}>
          <button onClick={handleBusinessPress} className="w-full">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: colors.primary + '15' }}
              >
                <span className="text-xl">🏪</span>
              </div>
              <div className="flex-1 text-right">
                <span
                  className="text-[15px] font-[Vazir-Bold] block"
                  style={{ color: colors.textMain }}
                >
                  {ad.businessName}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <FiMapPin size={12} color={colors.textSecondary} />
                  <span className="text-xs" style={{ color: colors.textSecondary }}>
                    {ad.city}
                  </span>
                </div>
              </div>
              <span className="text-2xl" style={{ color: colors.textSecondary }}>
                ←
              </span>
            </div>
          </button>
        </Card>

        {/* ═══ کارت شرایط همکاری ═══ */}
        <Card variant="elevated" padding={16} radius={18} className="border-[1.5px]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🤝</span>
            <span className="text-[15px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              شرایط همکاری
            </span>
          </div>

          <CollabBadge type={ad.collabType} priceDisplay={ad.priceDisplay} variant="solid" />

          <div
            className="flex items-start gap-2 p-3 rounded-xl border mt-3"
            style={{
              backgroundColor: colors.primary + '08',
              borderColor: colors.primary + '25',
            }}
          >
            <FiInfo size={14} style={{ color: colors.primary, flexShrink: 0 }} />
            <p className="text-xs leading-5 flex-1" style={{ color: colors.textSecondary }}>
              {ad.collabType === 'percent'
                ? 'درصدی از درآمد بین سالن و همکار تقسیم می‌شود'
                : ad.collabType === 'fixed'
                  ? 'مبلغ ثابت ماهانه + رهن (اختیاری)'
                  : 'به ازای هر ساعت استفاده از لاین'}
            </p>
          </div>
        </Card>

        {/* ═══ کارت توضیحات ═══ */}
        <Card variant="elevated" padding={16} radius={18}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📝</span>
            <span className="text-[15px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              توضیحات آگهی
            </span>
          </div>
          <p className="text-sm leading-7 text-justify" style={{ color: colors.textMain }}>
            {ad.description}
          </p>
        </Card>

        {/* ═══ کارت ارتباط و همکاری ═══ */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🤝</span>
            <span className="text-[15px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              ارتباط و همکاری
            </span>
          </div>

          <ActionButtons
            phone={cleanPhone(ad.contactPhone)}
            shareMessage={`${ad.title}
${ad.description || ''}
🏪 ${ad.businessName}
📍 ${ad.city}`}
            shareUrl={shareUrl}
          />
        </div>

        {/* ═══ کارت نکات مهم ═══ */}
        <Card variant="default" padding={16} radius={18} className="border">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💡</span>
            <span className="text-[15px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              نکات مهم
            </span>
          </div>
          <div className="space-y-2.5">
            {[
              'قبل از تماس، شرایط آگهی را به دقت مطالعه کنید',
              'شرایط همکاری را حضوری و قبل از شروع کار نهایی کنید',
              'از هویت و مجوزهای کسب‌وکار اطمینان حاصل کنید',
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: '#4CAF5018' }}
                >
                  <FiCheckCircle size={12} color="#4CAF50" />
                </div>
                <p className="text-xs leading-5 flex-1" style={{ color: colors.textSecondary }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ScreenWrapper>
  );
}
