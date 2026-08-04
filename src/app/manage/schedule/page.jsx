'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FiClock, FiCalendar, FiEdit2 } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import EmptyState from '@/components/common/EmptyState';
import ServiceTypeIcon from '@/components/manageBusiness/services/ServiceTypeIcon';
import { ScheduleModal } from '@/components/manageBusiness/schedule';
import { toPersianDigit } from '@/utils/numberUtils';
import { toJalaali } from '@/utils/dateUtils';

export default function ManageSchedulePage() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();
  const businessData = useBusinessStore((s) => s.businessData);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const services = useMemo(
    () => (businessData?.services || []).filter((s) => s.isActive !== false),
    [businessData?.services]
  );

  const schedules = businessData?.schedules || {};
  const ownerId = 'owner';

  const getServiceStats = (serviceId) => {
    const schedule = schedules[ownerId]?.[serviceId] || {};
    const allDays = Object.values(schedule);
    const activeDays = allDays.filter((d) => d.active);
    const totalSlots = activeDays.reduce((sum, d) => sum + (d.slotCount || 0), 0);
    const totalBreaks = activeDays.reduce((sum, d) => sum + (d.breaks?.length || 0), 0);

    const existingDates = activeDays
      .filter((d) => d.dateKey)
      .map((d) => {
        const parts = d.dateKey.split('/').map(Number);
        if (parts.length === 3 && !parts.some(isNaN)) {
          return { jy: parts[0], jm: parts[1], jd: parts[2] };
        }
        return null;
      })
      .filter(Boolean);

    return {
      daysCount: activeDays.length,
      totalSlots,
      totalBreaks,
      existingDates,
    };
  };

  const openModal = (serviceId) => {
    setSelectedServiceId(serviceId);
    setModalVisible(true);
  };

  const handleSave = ({ serviceId, date, workStart, workEnd, slotDuration, breaks, slotCount }) => {
    const dateKey = `${date.jy}/${String(date.jm).padStart(2, '0')}/${String(date.jd).padStart(2, '0')}`;
    const scheduleData = {
      active: true,
      workStart,
      workEnd,
      slotDuration,
      breaks: breaks || [],
      slotCount: slotCount || 0,
      dateKey,
      updatedAt: new Date().toISOString(),
    };

    useBusinessStore.setState((state) => ({
      businessData: {
        ...state.businessData,
        schedules: {
          ...state.businessData.schedules,
          [ownerId]: {
            ...(state.businessData.schedules?.[ownerId] || {}),
            [serviceId]: {
              ...(state.businessData.schedules?.[ownerId]?.[serviceId] || {}),
              [`d_${date.jy}_${date.jm}_${date.jd}`]: scheduleData,
            },
          },
        },
      },
    }));

    showToast(`✓ ${toPersianDigit(slotCount)} نوبت کاری با موفقیت تنظیم شد`, 'success');
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
      <Header title="مدیریت زمان‌بندی" onBackPress={() => router.push('/manage')} />

      <div className="flex-1 overflow-y-auto px-4 pb-32">
        {/* هدر */}
        <div className="flex flex-col items-center gap-2 py-4">
          <div
            className="w-[72px] h-[72px] rounded-3xl flex items-center justify-center"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <FiClock size={32} style={{ color: colors.primary }} />
          </div>
          <h2 className="text-lg font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            مدیریت ساعات کاری
          </h2>
          <p className="text-xs font-[Vazir] text-center" style={{ color: colors.textSecondary }}>
            بازه کاری، مدت هر نوبت و زمان‌های استراحت را مشخص کنید
          </p>
        </div>

        {/* کارت راهنما */}
        <Card
          variant="default"
          padding={12}
          radius={14}
          className="mb-4 border"
          style={{ borderColor: colors.primary + '30', backgroundColor: colors.primary + '08' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">💡</span>
            <span className="text-xs font-[Vazir] flex-1" style={{ color: colors.textSecondary }}>
              با ضربه روی دکمه زیر هر خدمت، می‌توانید نوبت‌ها را تنظیم یا ویرایش کنید. امکان انتخاب چند روز همزمان وجود دارد.
            </span>
          </div>
        </Card>

        {/* لیست خدمات */}
        {services.length > 0 ? (
          <div className="flex flex-col gap-3">
            {services.map((service) => {
              const stats = getServiceStats(service.id);
              const hasSchedule = stats.daysCount > 0;

              return (
                <Card key={service.id} variant="elevated" padding={0} radius={18}>
                  {/* محتوای خدمت */}
                  <div className="flex items-center gap-3 p-3.5">
                    <ServiceTypeIcon typeId={service.typeId} size={56} />
                    <div className="flex-1 gap-1 min-w-0">
                      <span className="text-sm font-[Vazir-Bold] block truncate" style={{ color: colors.textMain }}>
                        {service.name}
                      </span>
                      <span className="text-xs font-[Vazir-Medium] block" style={{ color: colors.textSecondary }}>
                        {service.typeName}
                      </span>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[11px]" style={{ color: colors.textSecondary }}>
                          ⏱️ {toPersianDigit(service.duration || 60)} دقیقه هر نوبت
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* آمار */}
                  <div
                    className="flex items-center border-t py-2.5"
                    style={{ borderTopColor: colors.border }}
                  >
                    <div className="flex-1 flex items-center justify-center gap-1">
                      <span className="text-[11px]" style={{ color: '#43A047' }}>📅</span>
                      <span className="text-[11px] font-[Vazir-Bold]" style={{ color: colors.textSecondary }}>
                        {toPersianDigit(stats.daysCount)} روز
                      </span>
                    </div>
                    <div className="w-px h-6" style={{ backgroundColor: colors.border }} />
                    <div className="flex-1 flex items-center justify-center gap-1">
                      <span className="text-[11px]" style={{ color: '#2196F3' }}>🕐</span>
                      <span className="text-[11px] font-[Vazir-Bold]" style={{ color: colors.textSecondary }}>
                        {toPersianDigit(stats.totalSlots)} نوبت
                      </span>
                    </div>
                    <div className="w-px h-6" style={{ backgroundColor: colors.border }} />
                    <div className="flex-1 flex items-center justify-center gap-1">
                      <span className="text-[11px]" style={{ color: '#9C27B0' }}>☕</span>
                      <span className="text-[11px] font-[Vazir-Bold]" style={{ color: colors.textSecondary }}>
                        {toPersianDigit(stats.totalBreaks)} استراحت
                      </span>
                    </div>
                  </div>

                  {/* دکمه سبز تنظیم/تغییر نوبت‌ها */}
                  <button
                    onClick={() => openModal(service.id)}
                    className="flex items-center gap-3 p-3.5 w-full transition-all hover:opacity-90"
                    style={{ backgroundColor: '#43A047' }}
                  >
                    <div className="w-11 h-11 rounded-[14px] flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                      <FiEdit2 size={20} color="#fff" />
                    </div>
                    <div className="flex-1 text-right gap-0.5">
                      <span className="text-sm font-[Vazir-Bold] text-white block">
                        {hasSchedule ? 'تغییر زمان نوبت‌ها' : 'تنظیم نوبت‌ها'}
                      </span>
                      <span className="text-[11px] text-white/80 block">
                        {hasSchedule
                          ? `${toPersianDigit(stats.daysCount)} روز تنظیم‌شده — برای ویرایش یا افزودن روز جدید ضربه بزنید`
                          : 'هنوز روزی تنظیم نشده — برای شروع ضربه بزنید'}
                      </span>
                    </div>
                    <span className="text-white text-xl">←</span>
                  </button>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon="📅"
            title="خدمتی برای تنظیم وجود ندارد"
            description="ابتدا خدمات سالن خود را اضافه کنید، سپس زمان‌بندی آن‌ها را مشخص کنید"
            actionLabel="مدیریت خدمات"
            onAction={() => router.push('/manage/services')}
          />
        )}
      </div>

      {/* مدال زمان‌بندی */}
      <ScheduleModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        services={services}
        initialServiceId={selectedServiceId}
        existingSchedule={schedules[ownerId] || {}}
        existingDates={selectedServiceId ? getServiceStats(selectedServiceId).existingDates : []}
        onSave={handleSave}
      />
    </ScreenWrapper>
  );
}