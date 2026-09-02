// src/app/model-requests/page.jsx
'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';
import { useNearbyStore } from '@/stores/useNearbyStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { adsService } from '@/api';
import ModelRequestHeader from '@/components/modelRequests/ModelRequestHeader';
import ModelRequestFilter from '@/components/modelRequests/ModelRequestFilter';
import ModelRequestCard from '@/components/modelRequests/ModelRequestCard';
import { useGlobalLocationStore } from '@/stores/useGlobalLocationStore';

export default function ModelRequestsPage() {
  const router = useRouter();
  const getLocationParams = useGlobalLocationStore((s) => s.getLocationParams);
  const nearbyEnabled = useNearbyStore((s) => s.enabled);
  const userLocation = useNearbyStore((s) => s.userLocation);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [costFilter, setCostFilter] = useState('all');
  const { provinceId, cityId, latitude, longitude } = useGlobalLocationStore();

  useEffect(() => {
  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const locationParams = getLocationParams();
      const params = { ...locationParams };
      if (nearbyEnabled && userLocation && !locationParams.lat) {
        params.lat = userLocation.latitude;
        params.lng = userLocation.longitude;
        params.radius = 10;
      }
      const result = await adsService.getModelRequests(params);
        setRequests(result.data || []);
      } catch (error) {
        console.error('Failed to fetch model requests:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, [nearbyEnabled, userLocation, provinceId, cityId, latitude, longitude]);

  const filteredRequests = useMemo(() => {
    if (costFilter === 'all') return requests;
    return requests.filter((r) => r.cost_type === costFilter || r.costType === costFilter);
  }, [requests, costFilter]);

  const handleRequestPress = useCallback(
    (request) => {
      router.push(`/model-requests/detail?id=${request.id}`);
    },
    [router]
  );

  return (
    <ScreenWrapper scrollable padding={0}>
      <ModelRequestHeader count={filteredRequests.length} />
      <ModelRequestFilter activeFilter={costFilter} onFilterChange={setCostFilter} />

      <div className="px-5 pb-32 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="در حال بارگذاری..." />
          </div>
        ) : filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <ModelRequestCard key={request.id} request={request} onPress={handleRequestPress} />
          ))
        ) : (
          <EmptyState
            icon="👤"
            title="فرصت مدلینگی یافت نشد"
            description="به زودی فرصت‌های جدید اضافه می‌شود"
          />
        )}
      </div>
    </ScreenWrapper>
  );
}
