// src/components/manageBusiness/reminders/SendReminderModal.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiSend, FiX, FiMessageSquare, FiAlertTriangle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import ReminderMessagePreview from './ReminderMessagePreview';
import { toPersianDigit } from '@/utils/numberUtils';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';
import { remindersService } from '@/api';
import { USE_MOCK } from '@/api/config';

export default function SendReminderModal({
  visible,
  customers = [],
  businessName,
  bookingLink,
  onClose,
  onConfirm,
}) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const instanceId = useRef('send-reminder-modal');

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      releaseScrollLock(instanceId.current);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      setLoading(false);
      acquireScrollLock(instanceId.current);
    } else {
      releaseScrollLock(instanceId.current);
    }
    return () => releaseScrollLock(instanceId.current);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape' && !loading) onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose, loading]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // در آینده: ارسال پیام یادآوری از طریق API
      if (!USE_MOCK) {
        // await remindersService.sendReminders(customers.map(c => c.id));
      }
      // شبیه‌سازی ارسال پیام
      await new Promise((r) => setTimeout(r, 1500));
      setLoading(false);
      onConfirm?.(customers.map((c) => c.id));
    } catch (error) {
      console.error('Failed to send reminders:', error);
      setLoading(false);
    }
  };

  if (!mounted || !visible) return null;

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose?.();
      }}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] rounded-t-3xl md:rounded-3xl
flex flex-col overflow-hidden shadow-2xl"
        style={{
          backgroundColor: colors.cardBackground,
          borderTop: `1px solid ${colors.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: colors.border }} />
        </div>

        {/* هدر */}
        <div
          className="flex items-center gap-3 px-5 py-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <div
            className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#FF980015' }}
          >
            <FiSend size={22} color="#FF9800" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              ارسال پیام یادآوری
            </h3>
            <p className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
              {toPersianDigit(customers.length)} مشتری انتخاب شده
            </p>
          </div>
          <button
            onClick={() => !loading && onClose?.()}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={20} style={{ color: colors.textMain }} />
          </button>
        </div>

        {/* محتوای اسکرولی */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* هشدار یکبار ارسال */}
          <div
            className="flex items-start gap-2.5 p-3.5 rounded-xl border"
            style={{
              backgroundColor: '#FF980008',
              borderColor: '#FF980030',
            }}
          >
            <FiAlertTriangle size={16} color="#FF9800" className="flex-shrink-0 mt-0.5" />
            <p
              className="text-[11px] font-[Vazir] leading-5 flex-1"
              style={{ color: colors.textSecondary }}
            >
              برای هر مشتری فقط یک بار پیام یادآوری ارسال می‌شود. پس از ارسال، تا زمانی که مشتری
              نوبت جدیدی رزرو نکند، امکان ارسال مجدد وجود ندارد.
            </p>
          </div>

          {/* لیست خلاصه مشتریان */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: colors.border }}>
            <div
              className="px-4 py-2.5 border-b flex items-center gap-2"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.background,
              }}
            >
              <FiMessageSquare size={14} color={colors.textSecondary} />
              <span className="text-[11px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                لیست دریافت‌کنندگان
              </span>
            </div>
            <div className="max-h-[140px] overflow-y-auto">
              {customers.map((customer, index) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between px-4 py-2.5 border-b last:border-b-0"
                  style={{ borderColor: colors.border + '60' }}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span
                      className="text-[11px] font-[Vazir] flex-shrink-0"
                      style={{ color: colors.textSecondary }}
                    >
                      {toPersianDigit(index + 1)}.
                    </span>
                    <span
                      className="text-[12px] font-[Vazir-Bold] truncate"
                      style={{ color: colors.textMain }}
                    >
                      {customer.customerName}
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-[Vazir] flex-shrink-0"
                    style={{ color: colors.textSecondary }}
                  >
                    {customer.serviceName}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* پیش‌نمایش پیام */}
          <ReminderMessagePreview
            businessName={businessName}
            bookingLink={bookingLink}
            selectedCount={customers.length}
          />
        </div>

        {/* فوتر */}
        <div
          className="px-5 pt-4 border-t"
          style={{
            borderColor: colors.border,
            paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <div className="flex gap-3">
            <Button
              title="انصراف"
              onPress={() => onClose?.()}
              disabled={loading}
              variant="outline"
              size="lg"
              className="flex-1"
            />
            <Button
              title={
                loading ? 'در حال ارسال...' : `ارسال به ${toPersianDigit(customers.length)} مشتری`
              }
              onPress={handleConfirm}
              loading={loading}
              disabled={loading || customers.length === 0}
              variant="primary"
              size="lg"
              className="flex-[2]"
              style={{ backgroundColor: '#FF9800' }}
              icon={<FiSend size={16} color="#fff" />}
              iconPosition="left"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
