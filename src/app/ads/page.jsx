// src/app/ads/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import AllAdsHeader from '@/components/home/AllAdsHeader';
import AllAdsCard from '@/components/home/AllAdsCard';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { adsService } from '@/api';
import { useGlobalLocationStore } from '@/stores/useGlobalLocationStore';

export default function AllAdsPage() {
  const router = useRouter();
  const { colors } = useTheme();

  // ✅ FIX: import و استفاده از استور سراسری
  const getLocationParams = useGlobalLocationStore((s) => s.getLocationParams);
  const provinceId = useGlobalLocationStore((s) => s.provinceId);
  const cityId = useGlobalLocationStore((s) => s.cityId);
  const latitude = useGlobalLocationStore((s) => s.latitude);
  const longitude = useGlobalLocationStore((s) => s.longitude);

  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAds = async () => {
      setIsLoading(true);
      try {
        const locationParams = getLocationParams();

        const [modelRes, lineRes] = await Promise.all([
          adsService.getModelRequests(locationParams),
          adsService.getLineRentals(locationParams),
        ]);

        const models = (modelRes.data || []).map((r) => ({ ...r, adType: 'model' }));
        const lines = (lineRes.data || []).map((l) => ({ ...l, adType: 'line' }));
        setAds([...models, ...lines]);
      } catch (error) {
        console.error('Failed to fetch ads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAds();
  }, [provinceId, cityId, latitude, longitude]);
  // ✅ FIX: وابستگی به تغییرات فیلتر سراسری

  const handleAdPress = (ad) => {
    if (ad.adType === 'model') {
      router.push(`/model-requests/detail?id=${ad.id}`);
    } else {
      router.push(`/line-rentals/detail?id=${ad.id}`);
    }
  };

  return (
    <ScreenWrapper scrollable padding={0}>
      <AllAdsHeader adsCount={ads.length} />
      <div className="p-4 pb-32 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="در حال بارگذاری آگهی‌ها..." />
          </div>
        ) : ads.length > 0 ? (
          ads.map((ad) => (
            <AllAdsCard key={`${ad.adType}_${ad.id}`} ad={ad} onPress={handleAdPress} />
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
