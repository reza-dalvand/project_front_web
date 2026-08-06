// src/components/manageBusiness/schedule/ScheduleModal.jsx
'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiArrowRight, FiCheck } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import StepIndicator from './StepIndicator';
import ServiceSelectionStep from './ServiceSelectionStep';
import CalendarStep from './CalendarStep';
import WorkingHoursStep from './WorkingHoursStep';
import { toPersianDigit } from '@/utils/numberUtils';
import { timeToMinutes } from '@/utils/dateUtils';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

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
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId);
  const [selectedDates, setSelectedDates] = useState([]);
  const [workStart, setWorkStart] = useState('09:00');
  const [workEnd, setWorkEnd] = useState('21:00');
  const [slotDuration, setSlotDuration] = useState(0);
  const [breaks, setBreaks] = useState([]);
  const [mounted, setMounted] = useState(false);
  const instanceId = useRef('schedule-modal');

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
      setSlotDuration(0);
      setBreaks([]);
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

  const computedSlotCount = useMemo(() => {
    const startMin = timeToMinutes(workStart);
    const endMin = timeToMinutes(workEnd);
    if (!startMin || !endMin || endMin <= startMin || !slotDuration || slotDuration <= 0) return 0;

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

  const canGoNext = useMemo(() => {
    if (currentStep === 1) return !!selectedServiceId;
    if (currentStep === 2) {
      const startMin = timeToMinutes(workStart);
      const endMin = timeToMinutes(workEnd);
      if (!startMin || !endMin || endMin <= startMin) return false;
      if (!slotDuration || slotDuration <= 0) return false;
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
    slotDuration,
    breaks,
    selectedDates,
    computedSlotCount,
  ]);

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSave = () => {
    if (!selectedServiceId || selectedDates.length === 0) return;
    selectedDates.forEach((date) => {
      onSave({
        serviceId: selectedServiceId,
        date,
        workStart,
        workEnd,
        slotDuration,
        breaks: breaks.map(({ id, ...rest }) => rest),
        slotCount: computedSlotCount,
      });
    });
    onClose();
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
            title={isEditMode ? 'ذخیره تغییرات' : 'ذخیره'}
            onPress={handleSave}
            variant="primary"
            size="lg"
            disabled={!canGoNext}
            className="flex-1"
            // icon={<FiCheck size={18} color="#fff" />}
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
          // icon={<FiArrowRight size={18} color="#fff" />}
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
        style={{
          backgroundColor: colors.cardBackground,
          borderTop: `1px solid ${colors.border}`,
        }}
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

        {/* ✅ محتوای اسکرولی با overflow کنترل شده */}
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
              onSlotDurationChange={setSlotDuration}
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
