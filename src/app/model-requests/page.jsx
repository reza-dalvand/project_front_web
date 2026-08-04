'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import AllModelRequestsHeader from '@/components/home/AllModelRequestsHeader';
import AllModelRequestsCard from '@/components/home/AllModelRequestsCard';
import EmptyState from '@/components/common/EmptyState';

const MOCK_MODEL_REQUESTS = [
  {
    id: 'mr_1',
    title: 'مدل فیشیال VIP عروس',
    serviceName: 'فیشیال تخصصی پوست',
    serviceImage: 'https://picsum.photos/400/300?random=50',
    businessName: 'کلینیک زیبایی صدف',
    city: 'تهران، سعادت‌آباد',
    serviceTypeId: 'facial',
    discount: 50,
    costType: 'paid',
  },
  {
    id: 'mr_2',
    title: 'مدل طراحی ناخن ژورنالی',
    serviceName: 'کاشت ناخن',
    serviceImage: 'https://picsum.photos/400/300?random=51',
    businessName: 'ناخن گالری پریا',
    city: 'کرج، فردیس',
    serviceTypeId: 'nail',
    discount: 70,
    costType: 'material_cost',
  },
  {
    id: 'mr_3',
    title: 'مدل تکنیک بالیاژ فرانسوی',
    serviceName: 'رنگ و لایت مو',
    serviceImage: 'https://picsum.photos/400/300?random=52',
    businessName: 'سالن زیبایی افرا',
    city: 'تهران، نیاوران',
    serviceTypeId: 'hair',
    discount: 60,
    costType: 'paid',
  },
  {
    id: 'mr_4',
    title: 'مدل لیزر الکس ۲۰۲۴',
    serviceName: 'لیزر موهای زائد',
    serviceImage: 'https://picsum.photos/400/300?random=53',
    businessName: 'مرکز لیزر رویال',
    city: 'تهران، شهرک غرب',
    serviceTypeId: 'laser',
    discount: 0,
    costType: 'material_cost',
  },
];

export default function AllModelRequestsPage() {
  const router = useRouter();
  const [requests] = useState(MOCK_MODEL_REQUESTS);
  const [filters, setFilters] = useState({
    costType: 'all',
    serviceType: 'all',
  });

  const filteredRequests = useMemo(() => {
    let data = [...requests];
    if (filters.costType !== 'all') {
      data = data.filter((r) => r.costType === filters.costType);
    }
    if (filters.serviceType !== 'all') {
      data = data.filter((r) => r.serviceTypeId === filters.serviceType);
    }
    return data;
  }, [requests, filters]);

  const hasActiveFilter =
    filters.costType !== 'all' || filters.serviceType !== 'all';

  const handleRequestPress = (request) => {
    router.push(`/model-requests/${request.id}`);
  };

  return (
    <ScreenWrapper scrollable padding={0}>
      <AllModelRequestsHeader
        requestsCount={filteredRequests.length}
        onFilterPress={() => {
          // TODO: باز کردن مدال فیلتر
        }}
        hasActiveFilter={hasActiveFilter}
      />

      <div className="p-4 pb-32 space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <AllModelRequestsCard
              key={request.id}
              request={request}
              onPress={handleRequestPress}
            />
          ))
        ) : (
          <EmptyState
            icon="👤"
            title="فعلاً فرصت مدلینگی وجود ندارد"
            description="به زودی فرصت‌های جدید اضافه می‌شود"
          />
        )}
      </div>
    </ScreenWrapper>
  );
}