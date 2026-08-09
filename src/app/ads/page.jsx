'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import AllAdsHeader from '@/components/home/AllAdsHeader';
import AllAdsCard from '@/components/home/AllAdsCard';
import EmptyState from '@/components/common/EmptyState';
import { MOCK_ALL_ADS } from '@/data/ads';

export default function AllAdsPage() {
  const router = useRouter();
  const ads = MOCK_ALL_ADS;
  const handleAdPress = (ad) => {
    router.push(`/business/${ad.businessId || '1'}`);
  };

  return (
    <ScreenWrapper scrollable padding={0}>
      <AllAdsHeader adsCount={ads.length} />

      <div className="p-4 pb-32 space-y-4">
        {ads.length > 0 ? (
          ads.map((ad) => <AllAdsCard key={ad.id} ad={ad} onPress={handleAdPress} />)
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
