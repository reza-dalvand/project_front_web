'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import EmptyStateVariants from '@/components/common/EmptyStateVariants';
import AllLineRentalsHeader from '@/components/home/AllLineRentalsHeader';
import AllLineRentalsCard from '@/components/home/AllLineRentalsCard';
import LineRentalFilterModal from '@/components/home/LineRentalFilterModal';
import { toJalaali } from '@/utils/dateUtils';

// داده‌های MOCK
const MOCK_LINE_RENTALS = [
  {
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
    description: 'لاین ناخن کامل با میز حرفه‌ای، دستگاه UV/LED، و مجموعه کامل لاک ژل. مناسب ناخن‌کار حرفه‌ای با سابقه کار حداقل ۲ سال.',
    lineImage: 'https://picsum.photos/400/300?random=70',
    businessName: 'سالن زیبایی نیلارام',
    city: 'تهران، سعادت‌آباد',
    contactPhone: '09121234567',
    createdAt: '۱۴۰۳/۰۴/۱۱',
    expiresAt: '۱۴۰۳/۰۵/۱۱',
  },
  {
    id: 'lr_2',
    businessId: 'b2',
    title: 'لاین میکاپ با نور طبیعی',
    serviceTypeId: 'makeup',
    serviceTypeName: 'میکاپ و گریم',
    collabType: 'hourly',
    collabLabel: 'ساعتی',
    hourlyRate: 150000,
    priceDisplay: '۱۵۰,۰۰۰ / ساعت',
    description: 'لاین میکاپ با نور طبیعی، آینه LED حرفه‌ای و میز گریم کامل. مناسب میکاپ‌آرتیست‌های حرفه‌ای که برای پروژه‌های کوتاه‌مدت نیاز به فضا دارند.',
    lineImage: 'https://picsum.photos/400/300?random=71',
    businessName: 'استودیو لاویا',
    city: 'تهران، نیاوران',
    contactPhone: '09129876543',
    createdAt: '۱۴۰۳/۰۴/۰۴',
    expiresAt: '۱۴۰۳/۰۵/۰۴',
  },
  {
    id: 'lr_3',
    businessId: 'b3',
    title: 'لاین فیشیال حرفه‌ای',
    serviceTypeId: 'facial',
    serviceTypeName: 'فیشیال و پاکسازی پوست',
    collabType: 'fixed',
    collabLabel: 'اجاره ثابت',
    fixedAmount: 5000000,
    fixedDeposit: 20000000,
    priceDisplay: '۵,۰۰۰,۰۰۰ + ۲۰,۰۰۰,۰۰۰ رهن',
    description: 'لاین فیشیال VIP با تخت حرفه‌ای، دستگاه هیدروفیشیال، بخار ازن‌دار و مجموعه کامل محصولات پوستی کره‌ای.',
    lineImage: 'https://picsum.photos/400/300?random=72',
    businessName: 'مرکز پوست صدف',
    city: 'تهران، ونک',
    contactPhone: '09124445566',
    createdAt: '۱۴۰۳/۰۳/۲۰',
    expiresAt: '۱۴۰۳/۰۴/۲۰',
  },
  {
    id: 'lr_4',
    businessId: 'b4',
    title: 'لاین لیزر با دستگاه الکس',
    serviceTypeId: 'laser',
    serviceTypeName: 'لیزر موهای زائد',
    collabType: 'fixed',
    collabLabel: 'اجاره ثابت',
    fixedAmount: 8000000,
    fixedDeposit: 0,
    priceDisplay: '۸,۰۰۰,۰۰۰ تومان',
    description: 'لاین لیزر با دستگاه الکساندرایت ۲۰۲۴، اتاق اختصاصی با تهویه مناسب و تجهیزات استریل. مناسب پزشکان و متخصصان پوست.',
    lineImage: 'https://picsum.photos/400/300?random=73',
    businessName: 'کلینیک رویال',
    city: 'تهران، شهرک غرب',
    contactPhone: '09121112233',
    createdAt: '۱۴۰۳/۰۳/۱۱',
    expiresAt: '۱۴۰۳/۰۴/۱۱',
  },
  {
    id: 'lr_5',
    businessId: 'b5',
    title: 'لاین کراتین و رنگ مو',
    serviceTypeId: 'keratin',
    serviceTypeName: 'کراتین و احیای مو',
    collabType: 'percent',
    collabLabel: 'درصدی',
    percentSalon: 50,
    percentPartner: 50,
    priceDisplay: '۵۰-۵۰٪',
    description: 'لاین تخصصی کراتین و رنگ مو با مواد اورجینال برزیلی و ایتالیایی. مناسب آرایشگران حرفه‌ای با تجربه.',
    lineImage: 'https://picsum.photos/400/300?random=74',
    businessName: 'سالن زیبایی افرا',
    city: 'تهران، شهرک غرب',
    contactPhone: '09127778899',
    createdAt: '۱۴۰۳/۰۳/۱۵',
    expiresAt: '۱۴۰۳/۰۴/۱۵',
  },
  {
    id: 'lr_6',
    businessId: 'b6',
    title: 'لاین مژه و ابرو',
    serviceTypeId: 'eyelash',
    serviceTypeName: 'کاشت مژه و ابرو',
    collabType: 'hourly',
    collabLabel: 'ساعتی',
    hourlyRate: 100000,
    priceDisplay: '۱۰۰,۰۰۰ / ساعت',
    description: 'لاین کاشت مژه با تخت راحت، نور تخصصی و مجموعه کامل مژه‌های هالیوودی. مناسب متخصصان کاشت مژه.',
    lineImage: 'https://picsum.photos/400/300?random=75',
    businessName: 'سالن زیبایی ماهرو',
    city: 'کرج، فردیس',
    contactPhone: '09125556677',
    createdAt: '۱۴۰۳/۰۳/۱۰',
    expiresAt: '۱۴۰۳/۰۴/۱۰',
  },
];

export default function AllLineRentalsPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    collabType: 'all',
    serviceType: 'all',
  });

  // فیلتر آگهی‌ها
  const filteredAds = useMemo(() => {
    let data = [...MOCK_LINE_RENTALS];

    if (filters.collabType !== 'all') {
      data = data.filter((a) => a.collabType === filters.collabType);
    }

    if (filters.serviceType !== 'all') {
      data = data.filter((a) => a.serviceTypeId === filters.serviceType);
    }

    return data;
  }, [filters]);

  const hasActiveFilter =
    filters.collabType !== 'all' || filters.serviceType !== 'all';

  const handleAdPress = (ad) => {
    router.push(`/line-rentals/${ad.id}`);
  };

  return (
    <ScreenWrapper scrollable={false} padding={0}>
      <AllLineRentalsHeader
        adsCount={filteredAds.length}
        onFilterPress={() => setFilterVisible(true)}
        hasActiveFilter={hasActiveFilter}
      />

      {/* لیست آگهی‌ها */}
      <div className="flex-1 overflow-y-auto p-4 pb-28">
        {filteredAds.length > 0 ? (
          filteredAds.map((ad) => (
            <AllLineRentalsCard
              key={ad.id}
              ad={ad}
              onPress={handleAdPress}
            />
          ))
        ) : (
          <EmptyStateVariants
            variant="lineRental"
            customTitle="آگهی لاینی یافت نشد"
            customDescription="فیلترهای خود را تغییر دهید"
          />
        )}
      </div>

      {/* مدال فیلتر */}
      <LineRentalFilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setFilters}
        currentFilters={filters}
      />
    </ScreenWrapper>
  );
}