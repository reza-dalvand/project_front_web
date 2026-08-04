'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import AllAdsHeader from '@/components/home/AllAdsHeader';
import AllAdsCard from '@/components/home/AllAdsCard';
import EmptyState from '@/components/common/EmptyState';

const MOCK_ALL_ADS = [
  {
    id: 1,
    businessId: '1',
    imageUrl: 'https://picsum.photos/800/400?random=1',
    title: 'جشنواره تخفیف‌های بهار کلینیک رُز',
    subtitle: 'تا ۳۰٪ تخفیف خدمات پوست و فیشیال VIP',
    badge: 'پیشنهاد ویژه',
    businessName: 'کلینیک زیبایی رُز',
    city: 'تهران، ونک',
  },
  {
    id: 2,
    businessId: '2',
    imageUrl: 'https://picsum.photos/800/400?random=2',
    title: 'افتتاحیه سالن زیبایی لاویا',
    subtitle: 'نوبت‌دهی آنلاین با بیعانه اقتصادی',
    badge: 'جدید',
    businessName: 'سالن زیبایی لاویا',
    city: 'تهران، نیاوران',
  },
  {
    id: 3,
    businessId: '3',
    imageUrl: 'https://picsum.photos/800/400?random=3',
    title: 'لیزر با جدیدترین دستگاه ۲۰۲۴',
    subtitle: 'مرکز رویال - تخفیف ویژه',
    badge: 'پرفروش',
    businessName: 'مرکز لیزر رویال',
    city: 'تهران، شهرک غرب',
  },
];

export default function AllAdsPage() {
  const router = useRouter();
  const [ads] = useState(MOCK_ALL_ADS);

  const handleAdPress = (ad) => {
    router.push(`/business/${ad.businessId || '1'}`);
  };

  return (
    <ScreenWrapper scrollable padding={0}>
      <AllAdsHeader adsCount={ads.length} />

      <div className="p-4 pb-32 space-y-4">
        {ads.length > 0 ? (
          ads.map((ad) => (
            <AllAdsCard key={ad.id} ad={ad} onPress={handleAdPress} />
          ))
        ) : (
          <EmptyState
            icon="🔥"
            title="فعلاً پیشنهاد ویژه‌ای وجود ندارد"
            description="به زودی تخفیف‌ها و جشنواره‌های جدید اضافه می‌شود"
          />
        )}
      </div>
    </ScreenWrapper>
  );
}