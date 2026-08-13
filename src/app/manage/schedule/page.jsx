// src/app/manage/schedule/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiClock, FiCalendar, FiPlus } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ServiceTypeIcon from '@/components/manageBusiness/services/ServiceTypeIcon';
import { ScheduleModal } from '@/components/manageBusiness/schedule';
import { toPersianDigit } from '@/utils/numberUtils';
import { USE_MOCK } from '@/api/config';

export default function ManageSchedulePage() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();

  const businessData = useBusinessStore((s) => s.businessData);
  const fetchSchedules = useBusinessStore((s) => s.fetchSchedules);
  const createScheduleApi = useBusinessStore((s) => s.createScheduleApi);
  const schedulesLoading = useBusinessStore((s) => s.schedulesLoading);

  const services = (businessData?.services || []).filter((s) => s.isActive !== false);
  const schedules = businessData?.schedules || {};

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  // ═══ دریافت زمان‌بندی‌ها از API ═══
  useEffect(() => {
    if (!USE_MOCK) {
      fetchSchedules().catch(() => {});
    }
  }, []);

  const handleSave = async (scheduleData) => {
    try {
      await createScheduleApi(scheduleData);
      showToast('✓ زمان‌بندی با موفقیت ذخیره شد', 'success');
    } catch (error) {
      showToast(error.message || 'خطا در ذخیره زمان‌بندی', 'error');
    }
  };

  // ═══ محاسبه تعداد روزهای تنظیم‌شده هر سرویس ═══
  const getServiceScheduleCount = (serviceId) => {
    const ownerSchedules = schedules['owner'] || {};
    const serviceSchedules = ownerSchedules[serviceId] || {};
    return Object.keys(serviceSchedules).filter((key) => serviceSchedules[key]?.active).length;
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

      <div className="overflow-y-auto pb-32 px-5 pt-4 space-y-4">
        {/* هدر */}
        <div className="flex flex-col items-center gap-2 py-3">
          <div
            className="w-[72px] h-[72px] rounded-3xl flex items-center justify-center"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <FiClock size={32} style={{ color: colors.primary }} />
          </div>
          <h2 className="text-xl font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            زمان‌بندی خدمات
          </h2>
          <p className="text-sm text-center" style={{ color: colors.textSecondary }}>
            ساعات کاری و اسلات‌های رزرو را تنظیم کنید
          </p>
        </div>

        {schedulesLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="در حال دریافت زمان‌بندی‌ها..." />
          </div>
        ) : (
          <>
            {/* لیست خدمات */}
            {services.length > 0 ? (
              <div className="flex flex-col gap-3">
                {services.map((service) => {
                  const scheduleCount = getServiceScheduleCount(service.id);
                  return (
                    <Card key={service.id} variant="elevated" padding={14} radius={18}>
                      <div className="flex items-center gap-3">
                        <ServiceTypeIcon typeId={service.typeId} size={52} />
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-[Vazir-Bold] truncate"
                            style={{ color: colors.textMain }}
                          >
                            {service.name}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                            {service.typeName}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <FiCalendar
                              size={12}
                              color={scheduleCount > 0 ? '#43A047' : colors.textSecondary}
                            />
                            <span
                              className="text-[11px] font-[Vazir-Bold]"
                              style={{
                                color: scheduleCount > 0 ? '#43A047' : colors.textSecondary,
                              }}
                            >
                              {scheduleCount > 0
                                ? `${toPersianDigit(scheduleCount)} روز تنظیم شده`
                                : 'هنوز تنظیم نشده'}
                            </span>
                          </div>
                        </div>
                        <Button
                          title={scheduleCount > 0 ? 'ویرایش' : 'تنظیم'}
                          onPress={() => {
                            setSelectedServiceId(service.id);
                            setModalVisible(true);
                          }}
                          variant={scheduleCount > 0 ? 'outline' : 'primary'}
                          size="sm"
                        />
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card variant="default" padding={24} radius={18}>
                <div className="flex flex-col items-center gap-3 text-center">
                  <span className="text-4xl">📅</span>
                  <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                    هنوز خدمتی ثبت نشده
                  </p>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    ابتدا خدمات را اضافه کنید، سپس زمان‌بندی آن‌ها را تنظیم کنید
                  </p>
                  <Button
                    title="مدیریت خدمات"
                    onPress={() => router.push('/manage/services')}
                    variant="outline"
                    size="md"
                  />
                </div>
              </Card>
            )}
          </>
        )}
      </div>

      {/* مدال زمان‌بندی */}
      <ScheduleModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedServiceId(null);
        }}
        services={services}
        initialServiceId={selectedServiceId}
        existingSchedule={schedules}
        existingDates={[]}
        onSave={handleSave}
      />
    </ScreenWrapper>
  );
}
