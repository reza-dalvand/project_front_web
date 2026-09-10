// src/components/manageBusiness/schedule/ScheduleModal.jsx
'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/common/Button';
import StepIndicator from './StepIndicator';
import ServiceSelectionStep from './ServiceSelectionStep';
import CalendarStep from './CalendarStep';
import WorkingHoursStep from './WorkingHoursStep';
import { toPersianDigit } from '@/utils/numberUtils';
import { timeToMinutes } from '@/utils/dateUtils';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

// ✅ FIX فاز ۲: مقدار پیش‌فرض ایمن برای مدت نوبت
const DEFAULT_SLOT_DURATION = 60;
const MIN_SLOT_DURATION = 5;

export default function ScheduleModal({
  visible,
  onClose,
  services,
  initialServiceId,
  existingSchedule,
  existingDates = [],
  onSave,
}) {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId);
  const [selectedDates, setSelectedDates] = useState([]);
  const [workStart, setWorkStart] = useState('09:00');
  const [workEnd, setWorkEnd] = useState('21:00');
  const [breaks, setBreaks] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const instanceId = useRef('schedule-modal');

  // ✅ FIX فاز ۲: محاسبه ایمن مدت نوبت
  // قبلاً: selectedService?.duration || 60
  //   اگر duration === 0 بود → 60 می‌شد ✓
  //   اما اگر duration === -5 یا NaN بود → مقدار نامعتبر
  // حالا: صریحاً بررسی می‌کنیم
  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId),
    [services, selectedServiceId]
  );

  const slotDuration = useMemo(() => {
    if (!selectedService) return DEFAULT_SLOT_DURATION;
    const d = selectedService.duration;
    // ✅ اگر صفر، منفی، یا عدد نامعتبر باشد → پیش‌فرض
    if (!d || typeof d !== 'number' || isNaN(d) || d < MIN_SLOT_DURATION) {
      return DEFAULT_SLOT_DURATION;
    }
    return Math.floor(d);
  }, [selectedService]);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      releaseScrollLock(instanceId.current);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      setCurrentStep(initialServiceId ? 2 : 1);
      setSelectedServiceId(initialServiceId || null);
      if (existingDates && existingDates.length > 0) {
        setSelectedDates([...existingDates]);
      } else {
        setSelectedDates([]);
      }
      setWorkStart('09:00');
      setWorkEnd('21:00');
      setBreaks([]);
      setSaving(false);
      acquireScrollLock(instanceId.current);
    } else {
      releaseScrollLock(instanceId.current);
    }
    return () => releaseScrollLock(instanceId.current);
  }, [visible, initialServiceId, existingDates]);

  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  // ═══ محاسبه تعداد اسلات‌ها — ✅ با محافظت در برابر تقسیم بر صفر ═══
  const computedSlotCount = useMemo(() => {
    const startMin = timeToMinutes(workStart);
    const endMin = timeToMinutes(workEnd);
    // ✅ FIX: اگر هر یک نامعتبر بود → صفر
    if (!startMin || !endMin || endMin <= startMin) return 0;
    // ✅ FIX: اگر slotDuration نامعتبر بود → صفر (قبلاً تقسیم بر صفر می‌شد)
    if (!slotDuration || slotDuration <= 0) return 0;

    const occupiedRanges = breaks.map((b) => {
      const bStart = Math.max(timeToMinutes(b.start), startMin);
      const bEnd = Math.min(timeToMinutes(b.end), endMin);
      return { start: bStart, end: Math.max(bStart, bEnd) };
    });

    let count = 0;
    let currentMin = startMin;
    while (currentMin + slotDuration <= endMin) {
      const slotEnd = currentMin + slotDuration;
      const isOccupied = occupiedRanges.some(
        (range) => currentMin < range.end && slotEnd > range.start
      );
      if (!isOccupied) count++;
      currentMin += slotDuration;
    }
    return count;
  }, [workStart, workEnd, slotDuration, breaks]);

  // ═══ اعتبارسنجی — ✅ با بررسی‌های ایمنی ═══
  const canGoNext = useMemo(() => {
    if (currentStep === 1) return !!selectedServiceId;
    if (currentStep === 2) {
      const startMin = timeToMinutes(workStart);
      const endMin = timeToMinutes(workEnd);
      if (!startMin || !endMin || endMin <= startMin) return false;
      // ✅ FIX: بررسی ایمنی — اگر سرویس انتخاب نشده، ادامه نده
      if (!selectedService) return false;
      // ✅ FIX: بررسی ایمنی — اگر مدت نوبت نامعتبر است
      if (slotDuration <= 0) return false;
      const allBreaksValid = breaks.every((b) => {
        const bStart = timeToMinutes(b.start);
        const bEnd = timeToMinutes(b.end);
        return bEnd > bStart && bStart >= startMin && bEnd <= endMin;
      });
      return allBreaksValid && computedSlotCount > 0;
    }
    if (currentStep === 3) return selectedDates.length > 0;
    return false;
  }, [
    currentStep,
    selectedServiceId,
    workStart,
    workEnd,
    breaks,
    selectedDates,
    computedSlotCount,
    selectedService,
    slotDuration,
  ]);

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // ═══ ذخیره ═══
  const handleSave = async () => {
    if (!selectedServiceId || selectedDates.length === 0) return;
    // ✅ FIX: بررسی نهایی قبل از ذخیره
    if (slotDuration <= 0) {
      showToast('مدت هر نوبت نامعتبر است. لطفاً خدمت را بررسی کنید.', 'error');
      return;
    }
    setSaving(true);
    try {
      for (const date of selectedDates) {
        const scheduleData = {
          serviceId: selectedServiceId,
          jy: date.jy,
          jm: date.jm,
          jd: date.jd,
          workStart,
          workEnd,
          slotDuration, // ✅ مقدار ایمن
          breaks: breaks.map(({ id, ...rest }) => rest),
          slotCount: computedSlotCount,
        };
        await onSave(scheduleData);
      }
      showToast(`✓ ${toPersianDigit(selectedDates.length)} روز تنظیم شد`, 'success');
      onClose();
    } catch (error) {
      showToast(error.message || 'خطا در ذخیره زمان‌بندی', 'error');
    } finally {
      setSaving(false);
    }
  };

  const isEditMode = existingDates && existingDates.length > 0;

  const renderFooter = () => {
    if (currentStep === 3) {
      return (
        <div className="flex gap-3">
          <Button
            title="قبلی"
            onPress={handlePrev}
            variant="outline"
            size="lg"
            className="flex-1"
          />
          <Button
            title={saving ? 'در حال ذخیره...' : isEditMode ? 'ذخیره تغییرات' : 'ذخیره'}
            onPress={handleSave}
            variant="primary"
            size="lg"
            disabled={!canGoNext || saving}
            loading={saving}
            className="flex-1"
            icon={<FiCheck size={18} color="#fff" />}
            iconPosition="right"
          />
        </div>
      );
    }
    return (
      <div className="flex gap-3">
        {currentStep > 1 && (
          <Button
            title="قبلی"
            onPress={handlePrev}
            variant="outline"
            size="lg"
            className="flex-1"
          />
        )}
        <Button
          title="ادامه"
          onPress={handleNext}
          variant="primary"
          size="lg"
          disabled={!canGoNext}
          className="flex-1"
          icon={<FiArrowLeft size={18} color="#fff" />}
          iconPosition="right"
        />
      </div>
    );
  };

  if (!mounted || !visible) return null;

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-lg max-h-[95vh] rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden"
        style={{ backgroundColor: colors.cardBackground, borderTop: `1px solid ${colors.border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div
          className="flex items-center justify-between px-4 sm:px-5 py-4 border-b flex-shrink-0"
          style={{ borderColor: colors.border }}
        >
          <h3
            className="text-sm sm:text-base font-[Vazir-Bold] truncate pr-2"
            style={{ color: colors.textMain }}
          >
            {isEditMode ? 'ویرایش زمان‌بندی خدمت' : 'تنظیم زمان‌بندی خدمت'}
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={20} style={{ color: colors.textMain }} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex-shrink-0">
          <StepIndicator currentStep={currentStep} />
        </div>

        {/* محتوای اسکرولی */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4 w-full">
          {currentStep === 1 && (
            <ServiceSelectionStep
              services={services.filter((s) => s.isActive !== false)}
              selectedId={selectedServiceId}
              onSelect={setSelectedServiceId}
            />
          )}
          {currentStep === 2 && (
            <WorkingHoursStep
              workStart={workStart}
              workEnd={workEnd}
              slotDuration={slotDuration}
              breaks={breaks}
              onWorkStartChange={setWorkStart}
              onWorkEndChange={setWorkEnd}
              onBreaksChange={setBreaks}
            />
          )}
          {currentStep === 3 && (
            <CalendarStep
              selectedDates={selectedDates}
              onDatesChange={setSelectedDates}
              existingDates={existingDates}
            />
          )}
        </div>

        {/* فوتر */}
        <div
          className="px-4 sm:px-5 py-4 border-t flex-shrink-0"
          style={{ borderColor: colors.border }}
        >
          {renderFooter()}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
