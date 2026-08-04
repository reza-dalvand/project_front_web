'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiHome } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import EmptyState from '@/components/common/EmptyState';
import LineRentalAdCard from '@/components/manageBusiness/lineRental/LineRentalAdCard';
import LineRentalStats from '@/components/manageBusiness/lineRental/LineRentalStats';
import { useToast } from '@/hooks/useToast';

// داده‌های موقت
const MOCK_LINE_ADS = [
  {
    id: 'lr_1',
    title: 'لاین ناخن VIP با تجهیزات کامل',
    serviceTypeId: 'nail',
    serviceTypeName: 'کاشت و طراحی ناخن',
    collabType: 'percent',
    collabLabel: 'درصدی',
    percentSalon: 40,
    percentPartner: 60,
    priceDisplay: '۴۰-۶۰٪',
    description:
      'لاین ناخن کامل با میز حرفه‌ای، دستگاه UV/LED، و مجموعه کامل لاک ژل. مناسب ناخن‌کار حرفه‌ای با سابقه کار حداقل ۲ سال.',
    lineImage: 'https://picsum.photos/400/400?random=70',
    status: 'active',
    createdAt: '۱۴۰۳/۰۴/۱۱',
    expiresAt: '۱۴۰۳/۰۵/۱۱',
    businessName: 'سالن زیبایی نیلارام',
    city: 'تهران، سعادت‌آباد',
    contactPhone: '09121234567',
  },
  {
    id: 'lr_2',
    title: 'لاین میکاپ با نور طبیعی',
    serviceTypeId: 'makeup',
    serviceTypeName: 'میکاپ و گریم',
    collabType: 'hourly',
    collabLabel: 'ساعتی',
    hourlyRate: 150000,
    priceDisplay: '۱۵۰,۰۰۰ / ساعت',
    description:
      'لاین میکاپ با نور طبیعی، آینه LED حرفه‌ای و میز گریم کامل. مناسب میکاپ‌آرتیست‌های حرفه‌ای که برای پروژه‌های کوتاه‌مدت نیاز به فضا دارند.',
    lineImage: 'https://picsum.photos/400/400?random=71',
    status: 'active',
    createdAt: '۱۴۰۳/۰۴/۰۴',
    expiresAt: '۱۴۰۳/۰۵/۰۴',
    businessName: 'سالن زیبایی نیلارام',
    city: 'تهران، سعادت‌آباد',
    contactPhone: '09121234567',
  },
  {
    id: 'lr_3',
    title: 'لاین فیشیال حرفه‌ای',
    serviceTypeId: 'facial',
    serviceTypeName: 'فیشیال و پاکسازی پوست',
    collabType: 'fixed',
    collabLabel: 'اجاره ثابت',
    fixedAmount: 5000000,
    fixedDeposit: 20000000,
    priceDisplay: '۵,۰۰۰,۰۰۰ + ۲۰,۰۰۰,۰۰۰ رهن',
    description:
      'لاین فیشیال VIP با تخت حرفه‌ای، دستگاه هیدروفیشیال، بخار ازن‌دار و مجموعه کامل محصولات پوستی کره‌ای.',
    lineImage: 'https://picsum.photos/400/400?random=72',
    status: 'active',
    createdAt: '۱۴۰۳/۰۳/۲۷',
    expiresAt: '۱۴۰۳/۰۴/۲۷',
    businessName: 'سالن زیبایی نیلارام',
    city: 'تهران، سعادت‌آباد',
    contactPhone: '09121234567',
  },
  {
    id: 'lr_4',
    title: 'لاین لیزر با دستگاه الکس',
    serviceTypeId: 'laser',
    serviceTypeName: 'لیزر موهای زائد',
    collabType: 'fixed',
    collabLabel: 'اجاره ثابت',
    fixedAmount: 8000000,
    fixedDeposit: 0,
    priceDisplay: '۸,۰۰۰,۰۰۰ تومان',
    description:
      'لاین لیزر با دستگاه الکساندرایت ۲۰۲۴، اتاق اختصاصی با تهویه مناسب و تجهیزات استریل. مناسب پزشکان و متخصصان پوست.',
    lineImage: 'https://picsum.photos/400/400?random=73',
    status: 'inactive',
    createdAt: '۱۴۰۳/۰۳/۱۱',
    expiresAt: '۱۴۰۳/۰۴/۱۱',
    businessName: 'سالن زیبایی نیلارام',
    city: 'تهران، سعادت‌آباد',
    contactPhone: '09121234567',
  },
];

export default function LineRentalPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();
  const [ads, setAds] = useState(MOCK_LINE_ADS);

  const handleCreate = () => {
    showToast('فرم ثبت آگهی لاین به زودی اضافه می‌شود', 'info');
    // router.push('/manage/line-rental/create');
  };

  const handleDelete = (ad) => {
    if (confirm(`آیا از حذف "${ad.title}" مطمئن هستید؟`)) {
      setAds((prev) => prev.filter((a) => a.id !== ad.id));
      showToast('آگهی لاین با موفقیت حذف شد', 'success');
    }
  };

  if (!isAuthenticated) {
    return (
      <ScreenWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <p style={{ color: colors.textMain }}>در حال بارگذاری...</p>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper padding={0}>
      <Header
        title="اجاره لاین"
        onBackPress={() => router.push('/manage')}
      />

      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-2 py-4 mb-4">
          <div
            className="w-[72px] h-[72px] rounded-3xl flex items-center justify-center"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <FiHome size={32} style={{ color: colors.primary }} />
          </div>
          <h2
            className="text-lg font-[Vazir-Bold]"
            style={{ color: colors.textMain }}
          >
            اجاره لاین
          </h2>
          <p
            className="text-xs font-[Vazir] text-center px-5 leading-5"
            style={{ color: colors.textSecondary }}
          >
            با اجاره لاین، کسب‌وکار خود را گسترش دهید و درآمد بیشتری کسب کنید
          </p>
        </div>

        {/* Stats */}
        {ads.length > 0 && (
          <div className="mb-4">
            <LineRentalStats ads={ads} />
          </div>
        )}

        {/* دکمه ایجاد */}
        {ads.length > 0 && (
          <button
            onClick={handleCreate}
            className="w-full flex items-center gap-3 p-3.5 rounded-2xl mb-4
              transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{ backgroundColor: '#43A047' }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <FiPlus size={22} color="#fff" />
            </div>
            <div className="flex-1 text-right">
              <p className="text-sm font-[Vazir-Bold] text-white">
                ثبت آگهی همکاری
              </p>
              <p className="text-[11px] text-white/80">
                جذب متخصص برای محیط کاری
              </p>
            </div>
          </button>
        )}

        {/* لیست آگهی‌ها */}
        {ads.length > 0 ? (
          ads.map((ad) => (
            <LineRentalAdCard
              key={ad.id}
              ad={ad}
              onPress={() => {
                console.log('Open detail:', ad.id);
              }}
            />
          ))
        ) : (
          <EmptyState
            icon="🏢"
            title="هنوز آگهی لاینی ثبت نکرده‌اید"
            description="با ثبت آگهی لاین، می‌توانید متخصصان جدید جذب کنید"
            actionLabel="ثبت اولین آگهی"
            onAction={handleCreate}
          />
        )}
      </div>

      {/* FAB برای حالت خالی */}
      {ads.length === 0 && (
        <button
          onClick={handleCreate}
          className="fixed bottom-24 left-5 w-14 h-14 rounded-full flex items-center
            justify-center shadow-lg z-40"
          style={{ backgroundColor: colors.primary }}
        >
          <FiPlus size={28} color="#fff" />
        </button>
      )}
    </ScreenWrapper>
  );
}