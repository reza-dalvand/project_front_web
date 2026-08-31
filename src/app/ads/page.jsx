// src/app/ads/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiZap, FiMapPin } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useNearbyStore } from '@/stores/useNearbyStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import AllAdsHeader from '@/components/home/AllAdsHeader';
import AllAdsCard from '@/components/home/AllAdsCard';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { adsService } from '@/api';

export default function AllAdsPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const { enabled: nearbyEnabled, userLocation } = useNearbyStore();
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ═══════ دریافت آگهی‌ها از API ═══════
  useEffect(() => {
    const fetchAds = async () => {
      setIsLoading(true);
      try {
        // دریافت همزمان مدلینگ و لاین
        const [modelRes, lineRes] = await Promise.all([
          adsService.getModelRequests(
            nearbyEnabled && userLocation
              ? { lat: userLocation.latitude, lng: userLocation.longitude }
              : {}
          ),
          adsService.getLineRentals(
            nearbyEnabled && userLocation
              ? { lat: userLocation.latitude, lng: userLocation.longitude }
              : {}
          ),
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
  }, [nearbyEnabled, userLocation]);

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
