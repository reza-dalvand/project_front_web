// src/app/manage/services/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiBox, FiCheckCircle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
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
  const fetchServices = useBusinessStore((s) => s.fetchServices);
  const deleteServiceApi = useBusinessStore((s) => s.deleteServiceApi);
  const toggleServiceActiveApi = useBusinessStore((s) => s.toggleServiceActiveApi);
  const servicesLoading = useBusinessStore((s) => s.servicesLoading);

  const services = businessData?.services || [];
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ═══ دریافت خدمات از API هنگام mount ═══
  useEffect(() => {
    if (!USE_MOCK) {
      fetchServices().catch((err) => {
        showToast('خطا در دریافت خدمات', 'error');
      });
    }
  }, []);

  const handleEdit = (service) => {
    router.push(`/manage/services/edit?id=${service.id}`);
  };

  const handleAdd = () => {
    router.push('/manage/services/edit');
  };

  const handleToggle = async (serviceId) => {
    try {
      await toggleServiceActiveApi(serviceId);
      const service = services.find((s) => s.id === serviceId);
      showToast(service?.isActive ? 'خدمت غیرفعال شد' : 'خدمت فعال شد', 'success');
    } catch (error) {
      showToast(error.message || 'خطا در تغییر وضعیت', 'error');
    }
  };

  const handleDelete = async (serviceId) => {
    try {
      await deleteServiceApi(serviceId);
      showToast('خدمت با موفقیت حذف شد', 'success');
    } catch (error) {
      showToast(error.message || 'خطا در حذف خدمت', 'error');
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
      <Header title="مدیریت خدمات" onBackPress={() => router.push('/manage')} />

      <div className="overflow-y-auto pb-32">
        <ServiceHeader servicesCount={services.length} />

        {servicesLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="در حال دریافت خدمات..." />
          </div>
        ) : (
          <>
            {services.length > 0 && <ServiceStats services={services} />}

            {/* دکمه افزودن */}
            {services.length > 0 && (
              <div className="px-5 mb-4">
                <Button
                  title="افزودن خدمت جدید"
                  onPress={handleAdd}
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<FiPlus size={20} color="#fff" />}
                  iconPosition="right"
                  style={{ backgroundColor: '#43A047' }}
                />
              </div>
            )}

            {/* لیست خدمات */}
            <div className="px-5 flex flex-col gap-3">
              {services.length === 0 ? (
                <ServiceEmptyState onAdd={handleAdd} />
              ) : (
                services.map((service) => (
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
          </>
        )}
      </div>
    </ScreenWrapper>
  );
}
