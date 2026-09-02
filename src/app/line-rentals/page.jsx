// src/app/line-rentals/page.jsx
'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';
import { useNearbyStore } from '@/stores/useNearbyStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { adsService } from '@/api';
import LineRentalHeader from '@/components/lineRentals/LineRentalHeader';
import LineRentalFilter from '@/components/lineRentals/LineRentalFilter';
import LineRentalCard from '@/components/lineRentals/LineRentalCard';
import { useGlobalLocationStore } from '@/stores/useGlobalLocationStore';

export default function LineRentalsPage() {
  const router = useRouter();
  const getLocationParams = useGlobalLocationStore((s) => s.getLocationParams);
  const nearbyEnabled = useNearbyStore((s) => s.enabled);
  const userLocation = useNearbyStore((s) => s.userLocation);
  const [rentals, setRentals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [collabFilter, setCollabFilter] = useState('all');
  const { provinceId, cityId, latitude, longitude } = useGlobalLocationStore();

  useEffect(() => {
    const fetchRentals = async () => {
      setIsLoading(true);
      try {
        // ✅ FIX: پارامترهای موقعیت از استور سراسری
        const locationParams = getLocationParams();
        const params = { ...locationParams };
        // اگر GPS فعال نبود ولی فیلتر سراسری هم نبود، از موقعیت محلی استفاده کن
        if (nearbyEnabled && userLocation && !locationParams.lat) {
          params.lat = userLocation.latitude;
          params.lng = userLocation.longitude;
          params.radius = 10;
        }
        const result = await adsService.getLineRentals(params);
        setRentals(result.data || []);
      } catch (error) {
        console.error('Failed to fetch line rentals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRentals();
  }, [nearbyEnabled, userLocation, provinceId, cityId, latitude, longitude]);

  const filteredRentals = useMemo(() => {
    if (collabFilter === 'all') return rentals;
    return rentals.filter((r) => r.collab_type === collabFilter || r.collabType === collabFilter);
  }, [rentals, collabFilter]);

  const handleRentalPress = useCallback(
    (rental) => {
      router.push(`/line-rentals/detail?id=${rental.id}`);
    },
    [router]
  );

  return (
    <ScreenWrapper scrollable padding={0}>
      <LineRentalHeader count={filteredRentals.length} />
      <LineRentalFilter activeFilter={collabFilter} onFilterChange={setCollabFilter} />

      <div className="px-5 pb-32 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="در حال بارگذاری..." />
          </div>
        ) : filteredRentals.length > 0 ? (
          filteredRentals.map((rental) => (
            <LineRentalCard key={rental.id} rental={rental} onPress={handleRentalPress} />
          ))
        ) : (
          <EmptyState
            icon="🏢"
            title="آگهی لاینی یافت نشد"
            description="فیلترهای خود را تغییر دهید"
          />
        )}
      </div>
    </ScreenWrapper>
  );
}
