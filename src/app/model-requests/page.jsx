// src/app/model-requests/page.jsx
'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowRight, FiFilter, FiMapPin, FiTag } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useNearbyStore } from '@/stores/useNearbyStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import CostTypeBadge from '@/components/common/CostTypeBadge';
import { toPersianDigit } from '@/utils/numberUtils';
import { adsService } from '@/api';
import { USE_MOCK } from '@/api/config';
import { MOCK_MODEL_REQUESTS } from '@/data/modelRequests';

// ═══════ ایموجی هوشمند بر اساس نام خدمت ═══════
const getServiceEmoji = (serviceName = '') => {
  if (serviceName.includes('ناخن')) return '💅';
  if (serviceName.includes('میکاپ') || serviceName.includes('گریم')) return '💄';
  if (
    serviceName.includes('فیشیال') ||
    serviceName.includes('پوست') ||
    serviceName.includes('پاکسازی')
  )
    return '✨';
  if (serviceName.includes('لیزر')) return '⚡';
  if (serviceName.includes('مو') || serviceName.includes('رنگ') || serviceName.includes('کراتین'))
    return '🎨';
  if (serviceName.includes('مژه') || serviceName.includes('ابرو')) return '👁️';
  if (serviceName.includes('ماساژ')) return '💆‍♀️';
  return '💆‍♀️';
};

const COST_FILTER_OPTIONS = [
  { id: 'all', label: 'همه' },
  { id: 'free', label: 'رایگان' },
  { id: 'material_cost', label: 'هزینه مواد' },
  { id: 'paid', label: 'با هزینه' },
];

export default function ModelRequestsPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const nearbyEnabled = useNearbyStore((s) => s.enabled);
  const userLocation = useNearbyStore((s) => s.userLocation);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [costFilter, setCostFilter] = useState('all');

  // ═══ دریافت لیست از API ═══
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        if (USE_MOCK) {
          setRequests(MOCK_MODEL_REQUESTS.filter((r) => r.status === 'active'));
        } else {
          const params = {};
          if (nearbyEnabled && userLocation) {
            params.lat = userLocation.latitude;
            params.lng = userLocation.longitude;
            params.radius = 10;
          }
          const result = await adsService.getModelRequests(params);
          setRequests(result.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch model requests:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, [nearbyEnabled, userLocation]);

  // ═══ فیلتر نوع هزینه ═══
  const filteredRequests = useMemo(() => {
    if (costFilter === 'all') return requests;
    return requests.filter((r) => r.cost_type === costFilter || r.costType === costFilter);
  }, [requests, costFilter]);

  const handleRequestPress = useCallback(
    (request) => {
      router.push(`/model-requests/${request.id}`);
    },
    [router]
  );

  return (
    <ScreenWrapper scrollable padding={0}>
      {/* هدر */}
      <div className="rounded-b-3xl pb-6 pt-4 px-5" style={{ backgroundColor: '#E91E63' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl flex items-center justify-center
transition-transform hover:scale-105"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <FiArrowRight size={22} color="#fff" />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
              style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
            >
              <span className="text-2xl">👤</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-white/80 font-[Vazir]">لیست درخواست مدل</span>
              <h1 className="text-md font-[Vazir-Bold] text-white">فرصت‌های مدلینگ</h1>
            </div>
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <span className="text-sm font-[Vazir-Bold] text-white">
              {toPersianDigit(filteredRequests.length)}
            </span>
          </div>
        </div>
      </div>

      {/* فیلتر نوع هزینه */}
      <div className="flex gap-2 overflow-x-auto px-5 py-3 scrollbar-hide">
        {COST_FILTER_OPTIONS.map((option) => {
          const isActive = costFilter === option.id;
          return (
            <button
              key={option.id}
              onClick={() => setCostFilter(option.id)}
              className="px-3.5 py-2 rounded-[14px] border-[1.5px] whitespace-nowrap text-xs font-[Vazir-Bold] transition-all flex-shrink-0"
              style={{
                backgroundColor: isActive ? '#E91E63' : colors.cardBackground,
                borderColor: isActive ? '#E91E63' : colors.border,
                color: isActive ? '#fff' : colors.textMain,
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* لیست درخواست‌ها */}
      <div className="px-5 pb-32 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="در حال بارگذاری..." />
          </div>
        ) : filteredRequests.length > 0 ? (
          filteredRequests.map((request) => {
            const costType = request.cost_type || request.costType;
            const discount = request.discount || 0;
            const isUrgent = request.is_urgent || request.isUrgent;
            const businessName = request.business_name || request.businessName;
            const serviceName = request.service_name || request.serviceName;
            const city = request.city || '';
            const distance = request.distance;

            return (
              <button
                key={request.id}
                onClick={() => handleRequestPress(request)}
                className="w-full rounded-2xl border overflow-hidden text-right transition-all hover:shadow-md active:scale-[0.99]"
                style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
              >
                {/* ═══ هدر گرادیانی (بدون تصویر) ═══ */}
                <div
                  className="relative w-full h-[160px] overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #E91E63 0%, #AD1457 60%, #880E4F 100%)',
                  }}
                >
                  {/* دایره‌های تزئینی */}
                  <div
                    className="absolute -top-8 -right-8 w-28 h-28 rounded-full"
                    style={{ backgroundColor: 'rgba(255,255,255,0.10)' }}
                  />
                  <div
                    className="absolute -bottom-6 -left-4 w-20 h-20 rounded-full"
                    style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
                  />
                  <div
                    className="absolute top-8 left-10 w-10 h-10 rounded-full"
                    style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                  />
                  <div
                    className="absolute bottom-4 right-6 w-6 h-6 rounded-full"
                    style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                  />

                  {/* ایموجی خدمت */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-[48px]"
                      style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}
                    >
                      {getServiceEmoji(serviceName)}
                    </span>
                  </div>

                  {/* بج فوری */}
                  {isUrgent && (
                    <div
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-lg shadow-md"
                      style={{ backgroundColor: 'rgba(255,152,0,0.9)' }}
                    >
                      <span className="text-[11px] font-[Vazir-Bold] text-white">🔥 فوری</span>
                    </div>
                  )}

                  {/* بج نوع هزینه */}
                  <div className="absolute top-3 right-3">
                    <CostTypeBadge type={costType} variant="solid" />
                  </div>

                  {/* نوار شیشه‌ای پایین */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[36px] flex items-center px-3 gap-2"
                    style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)' }}
                  >
                    <span className="text-[11px] font-[Vazir-Medium] text-white/90 truncate flex-1">
                      {serviceName}
                    </span>
                    {discount > 0 && (
                      <span
                        className="text-[10px] font-[Vazir-Bold] px-1.5 py-0.5 rounded-md flex-shrink-0"
                        style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff' }}
                      >
                        {toPersianDigit(discount)}٪ تخفیف
                      </span>
                    )}
                  </div>
                </div>

                {/* محتوا */}
                <div className="p-3.5 space-y-2.5">
                  <h3
                    className="text-base font-[Vazir-Bold] leading-6 line-clamp-2"
                    style={{ color: colors.textMain }}
                  >
                    {request.title}
                  </h3>

                  {/* متا */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">🏪</span>
                      <span
                        className="text-[11px] font-[Vazir-Medium] line-clamp-1"
                        style={{ color: colors.primary }}
                      >
                        {businessName}
                      </span>
                    </div>
                    {city && (
                      <div className="flex items-center gap-1">
                        <FiMapPin size={11} color={colors.textSecondary} />
                        <span className="text-[10px]" style={{ color: colors.textSecondary }}>
                          {city}
                        </span>
                      </div>
                    )}
                    {distance !== null && distance !== undefined && (
                      <div className="flex items-center gap-1">
                        <FiMapPin size={11} color="#2196F3" />
                        <span
                          className="text-[10px] font-[Vazir-Bold]"
                          style={{ color: '#2196F3' }}
                        >
                          {distance < 1
                            ? `${Math.round(distance * 1000)} متر`
                            : `${distance.toFixed(1)} کیلومتر`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* تخفیف */}
                  {discount > 0 && (
                    <div className="flex items-center gap-1.5">
                      <FiTag size={12} color="#E53935" />
                      <span className="text-[11px] font-[Vazir-Bold]" style={{ color: '#E53935' }}>
                        {toPersianDigit(discount)}٪ تخفیف مدل‌ها
                      </span>
                    </div>
                  )}
                </div>
              </button>
            );
          })
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
