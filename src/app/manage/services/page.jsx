'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch,
  FiTag, FiInfo, FiCheckCircle,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import SearchBar from '@/components/common/SearchBar';
import SectionHeader from '@/components/common/SectionHeader';
import EmptyStateVariants from '@/components/common/EmptyStateVariants';
import StatsCard from '@/components/common/StatsCard';
import ServiceTypeIcon from '@/components/manageBusiness/services/ServiceTypeIcon';
import { toPersianDigit, formatPrice } from '@/utils/numberUtils';

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

  const stats = useMemo(() => ({
    total: services.length,
    active: services.filter((s) => s.isActive !== false).length,
    avgPrice: services.length > 0
      ? Math.round(services.reduce((sum, s) => sum + (s.finalPrice || s.originalPrice || 0), 0) / services.length)
      : 0,
  }), [services]);

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

  const handleDelete = (service) => {
    if (confirm(`آیا از حذف "${service.name}" مطمئن هستید؟`)) {
      deleteService(service.id);
      showToast('خدمت با موفقیت حذف شد', 'success');
    }
  };

  const handleAdd = () => router.push('/manage/services/edit');
  const handleEdit = (service) => router.push(`/manage/services/edit?id=${service.id}`);

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
        {/* هدر Hero */}
        <div className="flex flex-col items-center gap-2 py-5 px-5">
          <div
            className="w-[72px] h-[72px] rounded-3xl flex items-center justify-center"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <FiTag size={32} style={{ color: colors.primary }} />
          </div>
          <h2 className="text-xl font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            خدمات سالن شما
          </h2>
          <p className="text-sm font-[Vazir]" style={{ color: colors.textSecondary }}>
            مدیریت، ویرایش و افزودن خدمات جدید
          </p>
        </div>

        {/* آمار */}
        {services.length > 0 && (
          <Card variant="elevated" padding={14} radius={18} className="mx-5 mb-4">
            <div className="flex items-center">
              <StatsCard
                icon="📦"
                label="کل خدمات"
                value={toPersianDigit(stats.total)}
                color="#667eea"
                variant="compact"
              />
              <div className="w-px h-10 mx-2" style={{ backgroundColor: colors.border }} />
              <StatsCard
                icon="✅"
                label="فعال"
                value={toPersianDigit(stats.active)}
                color="#43A047"
                variant="compact"
              />
              <div className="w-px h-10 mx-2" style={{ backgroundColor: colors.border }} />
              <StatsCard
                icon="💰"
                label="میانگین قیمت"
                value={formatPrice(stats.avgPrice).replace(' تومان', '')}
                color="#FF9800"
                variant="compact"
              />
            </div>
          </Card>
        )}

        {/* جستجو */}
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
                <p className="text-[15px] font-[Vazir-Bold] text-white">
                  افزودن خدمت جدید
                </p>
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
            <EmptyStateVariants variant="service" onAction={handleAdd} />
          ) : filteredServices.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-3">
              <FiSearch size={48} style={{ color: colors.textSecondary + '60' }} />
              <p className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                نتیجه‌ای یافت نشد
              </p>
            </div>
          ) : (
            filteredServices.map((service) => {
              const isActive = service.isActive !== false;
              const hasDiscount = service.discountPercent > 0;
              return (
                <Card
                  key={service.id}
                  variant="elevated"
                  padding={14}
                  radius={18}
                  className={`transition-opacity ${!isActive ? 'opacity-60' : ''}`}
                >
                  {/* ردیف بالا */}
                  <div className="flex items-start gap-3">
                    <ServiceTypeIcon typeId={service.typeId} size={56} />
                    <div className="flex-1 min-w-0">
                      <h4
                        className="text-sm font-[Vazir-Bold] line-clamp-1"
                        style={{ color: colors.textMain }}
                      >
                        {service.name}
                      </h4>
                      <p
                        className="text-xs font-[Vazir-Medium] mt-1"
                        style={{ color: colors.textSecondary }}
                      >
                        {service.typeName}
                      </p>
                      {/* قیمت */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {hasDiscount && (
                          <span
                            className="text-[11px] font-[Vazir] line-through"
                            style={{ color: colors.textSecondary }}
                          >
                            {formatPrice(service.originalPrice)}
                          </span>
                        )}
                        <span
                          className="text-sm font-[Vazir-Bold]"
                          style={{ color: colors.primary }}
                        >
                          {formatPrice(hasDiscount ? service.finalPrice : service.originalPrice)}
                        </span>
                        {hasDiscount && (
                          <span
                            className="text-[10px] font-[Vazir-Bold] px-2 py-0.5 rounded-md"
                            style={{ backgroundColor: '#4CAF5020', color: '#4CAF50' }}
                          >
                            {toPersianDigit(service.discountPercent)}٪
                          </span>
                        )}
                      </div>
                    </div>
                    {/* دکمه‌ها */}
                    <div className="flex flex-col gap-2 items-end">
                      {/* Switch */}
                      <button
                        onClick={() => handleToggle(service.id)}
                        className="relative w-11 h-6 rounded-full transition-colors"
                        style={{
                          backgroundColor: isActive ? colors.primary + '55' : colors.border,
                        }}
                      >
                        <div
                          className="absolute top-0.5 w-5 h-5 rounded-full shadow-md transition-all"
                          style={{
                            backgroundColor: isActive ? colors.primary : '#ccc',
                            [isActive ? 'right' : 'left']: '2px',
                          }}
                        />
                      </button>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleEdit(service)}
                          className="w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: colors.primary + '15' }}
                        >
                          <FiEdit2 size={16} style={{ color: colors.primary }} />
                        </button>
                        <button
                          onClick={() => handleDelete(service)}
                          className="w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: '#E5393515' }}
                        >
                          <FiTrash2 size={16} color="#E53935" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* بیعانه */}
                  {service.hasDeposit && service.depositAmount > 0 && (
                    <div
                      className="flex items-center gap-2 mt-3 pt-3 border-t"
                      style={{ borderColor: colors.border }}
                    >
                      <span className="text-sm">💰</span>
                      <span className="text-[11px]" style={{ color: colors.textSecondary }}>
                        بیعانه رزرو:
                      </span>
                      <span className="text-xs font-[Vazir-Bold] mr-auto text-[#1ba609]">
                        {formatPrice(service.depositAmount)}
                      </span>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </div>
    </ScreenWrapper>
  );
}