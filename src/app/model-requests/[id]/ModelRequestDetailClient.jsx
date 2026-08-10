'use client';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiArrowRight, FiShare2, FiPhone, FiMapPin, FiClock, FiInfo } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Card from '@/components/common/Card';
import ActionButtons from '@/components/common/ActionButtons';
import CostTypeBadge from '@/components/common/CostTypeBadge';
import { toPersianDigit } from '@/utils/numberUtils';
import { cleanPhone } from '@/utils/phoneUtils';
import { MOCK_MODEL_REQUESTS } from '@/data/modelRequests';

// ✅ اضافه کردن generateStaticParams برای Static Export
export async function generateStaticParams() {
  return MOCK_MODEL_REQUESTS.map((req) => ({
    id: req.id.toString(),
  }));
}

const MOCK_REQUEST = {
  id: 'mr_1',
  title: 'مدل فیشیال VIP عروس',
  serviceName: 'فیشیال تخصصی پوست',
  serviceImage: 'https://picsum.photos/800/600?random=50',
  businessName: 'کلینیک زیبایی صدف',
  businessId: 'b1',
  city: 'تهران، سعادت‌آباد',
  costType: 'paid',
  discount: 50,
  description:
    'نیاز به مدل برای تست محصولات جدید فیشیال. این خدمت شامل پاکسازی عمیق پوست، استفاده از ماسک طلای ۲۴ عیار و ماساژ صورت با روغن‌های طبیعی است. مدل باید پوست حساس نداشته باشد و ترجیحاً بین ۲۰ تا ۳۵ سال سن داشته باشد.',
  contactPhone: '09121234567',
  createdAt: '۱۴۰۳/۰۴/۱۰',
  expiresAt: '۱۴۰۳/۰۴/۲۰',
};

export default function ModelRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { colors } = useTheme();
  const request = MOCK_REQUEST;

  const handleBusinessPress = () => {
    router.push(`/business/${request.businessId}`);
  };

  return (
    <ScreenWrapper scrollable padding={0}>
      {/* Hero */}
      <div className="relative w-full h-[320px] bg-black">
        <Image
          src={request.serviceImage}
          alt={request.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[120px]"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        />
        {/* دکمه‌ها */}
        <div className="absolute top-4 left-4 right-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-11 h-11 rounded-full flex items-center justify-center
              border border-white/15"
            style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          >
            <FiArrowRight size={22} color="#fff" />
          </button>
          <div className="flex-1" />
          <button
            className="w-11 h-11 rounded-full flex items-center justify-center
              border border-white/15"
            style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          >
            <FiShare2 size={20} color="#fff" />
          </button>
        </div>
        {/* Badge تاریخ */}
        <div
          className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-2 rounded-xl"
          style={{ backgroundColor: 'rgba(233,30,99,0.85)' }}
        >
          <span className="text-[11px] font-[Vazir-Bold] text-white">ثبت: {request.createdAt}</span>
        </div>
      </div>

      {/* محتوا */}
      <div className="p-5 space-y-4 pb-32">
        {/* عنوان */}
        <h1
          className="text-2xl font-[Vazir-Bold] leading-[34px]"
          style={{ color: colors.textMain }}
        >
          {request.title}
        </h1>

        {/* Chip خدمت */}
        <div
          className="flex items-center gap-1.5 self-start px-3 py-1.5 rounded-xl"
          style={{ backgroundColor: colors.primary + '15' }}
        >
          <span className="text-sm">💆‍♀️</span>
          <span className="text-xs font-[Vazir-Bold]" style={{ color: colors.primary }}>
            {request.serviceName}
          </span>
        </div>

        {/* کارت کسب‌وکار */}
        <button onClick={handleBusinessPress} className="w-full text-right">
          <Card variant="elevated" padding={14} radius={16}>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: colors.primary + '15' }}
              >
                <span className="text-xl">🏪</span>
              </div>
              <div className="flex-1">
                <span
                  className="text-sm font-[Vazir-Bold] block"
                  style={{ color: colors.textMain }}
                >
                  {request.businessName}
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <FiMapPin size={12} color={colors.textSecondary} />
                  <span className="text-xs" style={{ color: colors.textSecondary }}>
                    {request.city}
                  </span>
                </div>
              </div>
              <span className="text-xl" style={{ color: colors.textSecondary }}>
                ←
              </span>
            </div>
          </Card>
        </button>

        {/* نوع هزینه */}
        <Card variant="elevated" padding={16} radius={18}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💰</span>
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              شرایط هزینه
            </span>
          </div>
          <CostTypeBadge type={request.costType} variant="default" />
          {request.discount > 0 && (
            <div
              className="flex items-center gap-2 mt-3 p-3 rounded-xl border"
              style={{
                backgroundColor: '#E5393510',
                borderColor: '#E5393530',
              }}
            >
              <span className="text-sm">🏷️</span>
              <span className="text-sm font-[Vazir-Bold]" style={{ color: '#E53935' }}>
                {toPersianDigit(request.discount)}٪ تخفیف ویژه مدل‌ها
              </span>
            </div>
          )}
        </Card>

        {/* توضیحات */}
        <Card variant="elevated" padding={16} radius={18}>
          <div className="flex items-center gap-2 mb-3">
            <FiInfo size={18} color="#2196F3" />
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              توضیحات آگهی
            </span>
          </div>
          <p className="text-sm leading-[26px] text-justify" style={{ color: colors.textMain }}>
            {request.description}
          </p>
        </Card>

        {/* تماس */}
        <ActionButtons
          phone={cleanPhone(request.contactPhone)}
          shareMessage={`${request.title}
${request.description || ''}
🏪 ${request.businessName}
📍 ${request.city}`}
        />

        {/* نکات */}
        <Card variant="default" padding={16} radius={18}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💡</span>
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              نکات مهم
            </span>
          </div>
          <div className="space-y-2.5">
            {[
              'قبل از تماس، شرایط آگهی را به دقت مطالعه کنید',
              'برای رزرو نوبت با سالن تماس بگیرید',
              'مدل‌ها اجازه استفاده از تصاویر را به سالن می‌دهند',
              'شرایط همکاری را قبل از شروع کار مشخص کنید',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-xs mt-0.5" style={{ color: '#4CAF50' }}>
                  ✓
                </span>
                <span className="text-xs leading-5 flex-1" style={{ color: colors.textSecondary }}>
                  {tip}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ScreenWrapper>
  );
}
