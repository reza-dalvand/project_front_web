'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import SearchBar from '@/components/common/SearchBar';
import {
  ServiceCard,
  ServiceHeader,
  ServiceStats,
  ServiceEmptyState,
} from '@/components/manageBusiness/services';
import { toPersianDigit } from '@/utils/numberUtils';

export default function ManageServicesPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();
  const businessData = useBusinessStore((s) => s.businessData);
  const updateService = useBusinessStore((s) => s.updateService);
  const deleteService = useBusinessStore((s) => s.deleteService);
  const [searchQuery, setSearchQuery] = useState('');
  const services = businessData?.services || [];

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return services;
    const q = searchQuery.trim().toLowerCase();
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.typeName?.toLowerCase().includes(q)
    );
  }, [services, searchQuery]);

  const handleEdit = (service) => {
    router.push(`/manage/services/edit?id=${service.id}`);
  };

  const handleAdd = () => {
    router.push('/manage/services/edit');
  };

  const handleToggle = (serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    if (service) {
      updateService(serviceId, { isActive: !service.isActive });
      showToast(
        service.isActive ? 'خدمت غیرفعال شد' : 'خدمت فعال شد',
        'success'
      );
    }
  };

  const handleDelete = (serviceId) => {
    deleteService(serviceId);
    showToast('خدمت با موفقیت حذف شد', 'success');
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
      <Header title="مدیریت خدمات" onBackPress={() => router.push('/manage')} />
      <div className="overflow-y-auto pb-32">
        <ServiceHeader servicesCount={services.length} />

        {services.length > 0 && <ServiceStats services={services} />}

        {services.length > 0 && (
          <div className="px-5 mb-4">
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="جستجو در خدمات..."
            />
          </div>
        )}

        {/* دکمه سبز افزودن */}
        {services.length > 0 && (
          <div className="px-5 mb-4">
            <button
              onClick={handleAdd}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg"
              style={{ backgroundColor: '#43A047' }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <FiPlus size={22} color="#fff" />
              </div>
              <div className="flex-1 text-right">
                <p className="text-[15px] font-[Vazir-Bold] text-white">افزودن خدمت جدید</p>
                <p className="text-[11px] font-[Vazir] text-white/80">
                  خدمت جدیدی به سالن خود اضافه کنید
                </p>
              </div>
              <span className="text-xl text-white">←</span>
            </button>
          </div>
        )}

        {/* لیست خدمات */}
        <div className="px-5 flex flex-col gap-3">
          {services.length === 0 ? (
            <ServiceEmptyState onAdd={handleAdd} />
          ) : filteredServices.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-3">
              <FiSearch size={48} style={{ color: colors.textSecondary + '60' }} />
              <p className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                نتیجه‌ای یافت نشد
              </p>
            </div>
          ) : (
            filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={handleEdit}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </ScreenWrapper>
  );
}