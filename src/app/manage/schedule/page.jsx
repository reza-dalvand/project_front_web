'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiClock, FiCalendar, FiPlus, FiEdit2, FiCheck, FiX, FiCoffee,
  FiChevronRight, FiChevronLeft,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import ServiceTypeIcon from '@/components/manageBusiness/services/ServiceTypeIcon';
import BottomSheet from '@/components/common/BottomSheet';
import { toPersianDigit } from '@/utils/numberUtils';
import { PERSIAN_MONTHS, toJalaali, jalaaliMonthLength, getFirstDayOfWeekJalaali, todayJalaali } from '@/utils/dateUtils';

export default function ManageSchedulePage() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();
  const businessData = useBusinessStore((s) => s.businessData);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [modalStep, setModalStep] = useState(1); // 1=انتخاب خدمت, 2=ساعات, 3=تاریخ
  const [selectedDates, setSelectedDates] = useState([]);
  const [workStart, setWorkStart] = useState('09:00');
  const [workEnd, setWorkEnd] = useState('21:00');
  const [slotDuration, setSlotDuration] = useState(30);
  const [viewMonth, setViewMonth] = useState(() => todayJalaali());

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
    return {
      daysCount: activeDays.length,
      totalSlots: activeDays.reduce((sum, d) => sum + (d.slotCount || 0), 0),
    };
  };

  const openModal = (serviceId) => {
    setSelectedServiceId(serviceId);
    setModalStep(1);
    setSelectedDates([]);
    setModalVisible(true);
  };

  const handleSaveSchedule = () => {
    if (!selectedServiceId || selectedDates.length === 0) return;
    const slotCount = Math.floor(
      (parseInt(workEnd.split(':')[0]) * 60 + parseInt(workEnd.split(':')[1]) -
        parseInt(workStart.split(':')[0]) * 60 - parseInt(workStart.split(':')[1])) / slotDuration
    );

    selectedDates.forEach((date) => {
      const dateKey = `${date.jy}/${String(date.jm).padStart(2, '0')}/${String(date.jd).padStart(2, '0')}`;
      const scheduleData = {
        active: true,
        workStart,
        workEnd,
        slotDuration,
        slotCount,
        dateKey,
        breaks: [],
      };
      // ذخیره در store
      useBusinessStore.setState((state) => ({
        businessData: {
          ...state.businessData,
          schedules: {
            ...state.businessData.schedules,
            [ownerId]: {
              ...(state.businessData.schedules?.[ownerId] || {}),
              [selectedServiceId]: {
                ...(state.businessData.schedules?.[ownerId]?.[selectedServiceId] || {}),
                [`d_${date.jy}_${date.jm}_${date.jd}`]: scheduleData,
              },
            },
          },
        },
      }));
    });

    showToast(`✓ ${toPersianDigit(selectedDates.length)} روز تنظیم شد`, 'success');
    setModalVisible(false);
  };

  const toggleDate = (day) => {
    const exists = selectedDates.find(
      (d) => d.jy === day.jy && d.jm === day.jm && d.jd === day.jd
    );
    if (exists) {
      setSelectedDates((prev) =>
        prev.filter((d) => !(d.jy === day.jy && d.jm === day.jm && d.jd === day.jd))
      );
    } else {
      setSelectedDates((prev) => [...prev, day]);
    }
  };

  // رندر تقویم
  const renderCalendar = () => {
    const monthLength = jalaaliMonthLength(viewMonth.jy, viewMonth.jm);
    const firstDay = getFirstDayOfWeekJalaali(viewMonth.jy, viewMonth.jm);
    const today = todayJalaali();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= monthLength; d++) {
      days.push({ jd: d, jy: viewMonth.jy, jm: viewMonth.jm });
    }

    return (
      <div>
        {/* هدر ماه */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setViewMonth((p) => p.jm === 1 ? { jy: p.jy - 1, jm: 12 } : { ...p, jm: p.jm - 1 })}
  className="w-8 h-8 rounded-lg flex items-center justify-center"
  style={{ backgroundColor: colors.border }}>
  <FiChevronRight size={18} style={{ color: colors.textMain }} />
          </button>
          <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            {PERSIAN_MONTHS[viewMonth.jm - 1]} {toPersianDigit(viewMonth.jy)}
          </span>
          <button onClick={() => setViewMonth((p) => p.jm === 12 ? { jy: p.jy + 1, jm: 1 } : { ...p, jm: p.jm + 1 })}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colors.border }}>
            <FiChevronLeft size={18} style={{ color: colors.textMain }} />
          </button>
        </div>
        {/* روزهای هفته */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map((d) => (
            <div key={d} className="text-center text-[11px] font-[Vazir-Medium]"
              style={{ color: colors.textSecondary }}>{d}</div>
          ))}
        </div>
        {/* روزها */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            if (!day) return <div key={i} />;
            const isSelected = selectedDates.some(
              (d) => d.jy === day.jy && d.jm === day.jm && d.jd === day.jd
            );
            const isToday = today.jy === day.jy && today.jm === day.jm && today.jd === day.jd;
            return (
              <button
                key={i}
                onClick={() => toggleDate(day)}
                className="aspect-square rounded-xl flex items-center justify-center text-sm font-[Vazir-Medium] transition-all"
                style={{
                  backgroundColor: isSelected ? colors.primary : isToday ? colors.primary + '15' : 'transparent',
                  color: isSelected ? '#fff' : isToday ? colors.primary : colors.textMain,
                  border: isToday && !isSelected ? `1px solid ${colors.primary}` : 'none',
                }}
              >
                {toPersianDigit(day.jd)}
              </button>
            );
          })}
        </div>
      </div>
    );
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

      <div className="overflow-y-auto pb-32 px-5 pt-3 space-y-4">
        {/* هدر */}
        <div className="flex flex-col items-center gap-2 py-3">
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
            بازه کاری، مدت هر نوبت و روزهای فعال را مشخص کنید
          </p>
        </div>

        {/* لیست خدمات */}
        {services.length > 0 ? (
          <div className="flex flex-col gap-3">
            {services.map((service) => {
              const stats = getServiceStats(service.id);
              return (
                <Card key={service.id} variant="elevated" padding={14} radius={18}>
                  <div className="flex items-center gap-3">
                    <ServiceTypeIcon typeId={service.typeId} size={52} />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                        {service.name}
                      </h4>
                      <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                        {service.typeName}
                      </p>
                      {/* آمار */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <FiCalendar size={12} style={{ color: '#43A047' }} />
                          <span className="text-[11px]" style={{ color: colors.textSecondary }}>
                            {toPersianDigit(stats.daysCount)} روز
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiClock size={12} style={{ color: '#2196F3' }} />
                          <span className="text-[11px]" style={{ color: colors.textSecondary }}>
                            {toPersianDigit(stats.totalSlots)} نوبت
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* دکمه تنظیم */}
                    <button
                      onClick={() => openModal(service.id)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl shadow-md"
                      style={{ backgroundColor: '#43A047' }}
                    >
                      <FiEdit2 size={16} color="#fff" />
                      <span className="text-xs font-[Vazir-Bold] text-white">
                        {stats.daysCount > 0 ? 'تغییر نوبت‌ها' : 'تنظیم نوبت‌ها'}
                      </span>
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon="📅"
            title="خدمتی برای تنظیم وجود ندارد"
            description="ابتدا خدمات سالن خود را اضافه کنید"
            actionLabel="مدیریت خدمات"
            onAction={() => router.push('/manage/services')}
          />
        )}
      </div>

      {/* مدال تنظیم نوبت */}
      <BottomSheet
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="تنظیم نوبت‌های کاری"
        snapPoint={0.85}
        footer={
          <Button
            title={selectedDates.length > 0
              ? `ذخیره ${toPersianDigit(selectedDates.length)} روز`
              : 'ابتدا روزها را انتخاب کنید'}
            onPress={handleSaveSchedule}
            variant="primary"
            size="lg"
            fullWidth
            disabled={selectedDates.length === 0}
            icon={<FiCheck size={20} color="#fff" />}
            iconPosition="right"
          />
        }
      >
        <div className="space-y-5 pb-4">
          {/* ساعت کاری */}
          <Card variant="default" padding={14} radius={14}>
            <h4 className="text-sm font-[Vazir-Bold] mb-3" style={{ color: colors.textMain }}>
              بازه ساعت کاری
            </h4>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs mb-1 block" style={{ color: colors.textSecondary }}>
                  شروع
                </label>
                <input
                  type="time"
                  value={workStart}
                  onChange={(e) => setWorkStart(e.target.value)}
                  className="w-full p-2.5 rounded-xl border text-center text-sm"
                  style={{
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                    color: colors.textMain,
                  }}
                />
              </div>
              <div className="flex-1">
                <label className="text-xs mb-1 block" style={{ color: colors.textSecondary }}>
                  پایان
                </label>
                <input
                  type="time"
                  value={workEnd}
                  onChange={(e) => setWorkEnd(e.target.value)}
                  className="w-full p-2.5 rounded-xl border text-center text-sm"
                  style={{
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                    color: colors.textMain,
                  }}
                />
              </div>
            </div>
            {/* مدت نوبت */}
            <div className="mt-3">
              <label className="text-xs mb-1 block" style={{ color: colors.textSecondary }}>
                مدت هر نوبت (دقیقه)
              </label>
              <div className="flex gap-2 flex-wrap">
                {[15, 30, 45, 60, 90, 120].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSlotDuration(d)}
                    className="px-3 py-2 rounded-lg border text-xs font-[Vazir-Bold]"
                    style={{
                      backgroundColor: slotDuration === d ? colors.primary : colors.cardBackground,
                      borderColor: slotDuration === d ? colors.primary : colors.border,
                      color: slotDuration === d ? '#fff' : colors.textMain,
                    }}
                  >
                    {toPersianDigit(d)} دقیقه
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* تقویم */}
          <Card variant="default" padding={14} radius={14}>
            <h4 className="text-sm font-[Vazir-Bold] mb-3" style={{ color: colors.textMain }}>
              انتخاب روزهای فعال
            </h4>
            {renderCalendar()}
            {selectedDates.length > 0 && (
              <div
                className="flex items-center gap-2 mt-3 p-2.5 rounded-xl border"
                style={{ backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }}
              >
                <FiCheck size={14} style={{ color: colors.primary }} />
                <span className="text-xs font-[Vazir-Bold]" style={{ color: colors.primary }}>
                  {toPersianDigit(selectedDates.length)} روز انتخاب شده
                </span>
              </div>
            )}
          </Card>
        </div>
      </BottomSheet>
    </ScreenWrapper>
  );
}