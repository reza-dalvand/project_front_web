// src/app/manage/reminders/page.jsx
'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiSend, FiBell, FiCheckSquare, FiSquare } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { toPersianDigit } from '@/utils/numberUtils';
import { remindersService } from '@/api';
import Button from '@/components/common/Button';

const REMINDER_THRESHOLD_DAYS = 2;

export default function RemindersPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const { showToast } = useToast();

  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sending, setSending] = useState(false);

  // ═══ دریافت لیست یادآوری‌ها از API ═══
  useEffect(() => {
    const fetchReminders = async () => {
      setIsLoading(true);
      try {
        const result = await remindersService.getBusinessReminders();
        // ✅ اصلاح: مدیریت حالت‌های مختلف بازگشتی (wrapped یا unwrapped)
        const items = result?.data || result || [];
        setCustomers(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error('Failed to fetch reminders:', error);
        showToast('خطا در بارگذاری یادآوری‌ها', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReminders();
  }, [showToast]);

  // ═══ مشتریان نیازمند یادآوری ═══
  const dueCustomers = useMemo(() => {
    return customers.filter((c) => {
      // ✅ اصلاح: پشتیبانی از camelCase (تولید شده توسط normalizer) و snake_case
      const days = c.daysRemaining ?? c.days_remaining;
      return days !== undefined && days !== null && days <= REMINDER_THRESHOLD_DAYS;
    });
  }, [customers]);

  // ═══ مشتریان قابل ارسال ═══
  const sendableCustomers = useMemo(() => {
    return dueCustomers.filter((c) => {
      const sent = c.reminderSent ?? c.reminder_sent;
      const hasNew = c.hasNewBookingAfterSend ?? c.has_new_booking_after_send;
      
      if (!sent) return true;
      if (hasNew) return true;
      return false;
    });
  }, [dueCustomers]);
  

  // ═══ آمار ═══
  const stats = useMemo(() => {
    return {
      // ✅ اصلاح ۱: نیازمند یادآوری = کسانی که موعدشان نزدیک است و هنوز ارسال نشده‌اند
      // (دقیقاً همان لیست sendableCustomers)
      totalDue: sendableCustomers.length,
      
      // ✅ اصلاح ۲: گذشته از موعد (از بین نیازمندانِ ارسال نشده)
      overdue: sendableCustomers.filter((c) => {
        const days = c.daysRemaining ?? c.days_remaining;
        return days < 0;
      }).length,
      
      // ✅ اصلاح ۳: ارسال شده (پشتیبانی از هر دو فرمت snake_case و camelCase)
      sentToday: customers.filter((c) => {
        const isSent = c.reminderSent ?? c.reminder_sent;
        const sentDate = c.sentDate || c.sent_date;
        return isSent && sentDate;
      }).length,
    };
  }, [sendableCustomers, customers]);

  // ═══ انتخاب/لغو انتخاب ═══
  const toggleCustomer = useCallback((customerId) => {
    setSelectedIds((prev) =>
      prev.includes(customerId) ? prev.filter((id) => id !== customerId) : [...prev, customerId]
    );
  }, []);

  const selectAll = useCallback(() => {
    if (selectedIds.length === sendableCustomers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sendableCustomers.map((c) => c.id));
    }
  }, [selectedIds.length, sendableCustomers]);

  // ═══ ارسال یادآوری ═══
  const handleSendReminders = useCallback(async () => {
    if (selectedIds.length === 0) {
      showToast('لطفاً حداقل یک مشتری را انتخاب کنید', 'warning');
      return;
    }

    setSending(true);
    try {
      await remindersService.sendReminders(selectedIds);

      setCustomers((prev) =>
        prev.map((c) =>
          selectedIds.includes(c.id)
            ? { 
                ...c, 
                reminder_sent: true, 
                reminderSent: true,
                sent_date: 'امروز', 
                sentDate: 'امروز',
                has_new_booking_after_send: false,
                hasNewBookingAfterSend: false 
              }
            : c
        )
      );
      setSelectedIds([]);
      showToast(
        `پیام یادآوری برای ${toPersianDigit(selectedIds.length)} مشتری ارسال شد`,
        'success'
      );
    } catch (error) {
      console.error('Failed to send reminders:', error);
      showToast(error.message || 'خطا در ارسال یادآوری', 'error');
    } finally {
      setSending(false);
    }
  }, [selectedIds, showToast]);

  return (
    <ScreenWrapper padding={0}>
      <Header title="یادآوری تمدید خدمت" onBackPress={() => router.push('/manage')} />

      {/* آمار */}
      <div className="flex gap-3 px-5 py-4">
        <div
          className="flex-1 p-3 rounded-xl border text-center"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          <p className="text-lg font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            {toPersianDigit(stats.totalDue)}
          </p>
          <p className="text-[10px]" style={{ color: colors.textSecondary }}>
            نیازمند یادآوری
          </p>
        </div>
        <div
          className="flex-1 p-3 rounded-xl border text-center"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          <p className="text-lg font-[Vazir-Bold]" style={{ color: '#E53935' }}>
            {toPersianDigit(stats.overdue)}
          </p>
          <p className="text-[10px]" style={{ color: colors.textSecondary }}>
            گذشته از موعد
          </p>
        </div>
        <div
          className="flex-1 p-3 rounded-xl border text-center"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          <p className="text-lg font-[Vazir-Bold]" style={{ color: '#43A047' }}>
            {toPersianDigit(stats.sentToday)}
          </p>
          <p className="text-[10px]" style={{ color: colors.textSecondary }}>
            ارسال شده
          </p>
        </div>
      </div>

      {/* نوار انتخاب همه */}
      {sendableCustomers.length > 0 && (
        <div className="flex items-center justify-between px-5 pb-3">
          <button onClick={selectAll} className="flex items-center gap-2">
            {selectedIds.length === sendableCustomers.length ? (
              <FiCheckSquare size={20} style={{ color: colors.primary }} />
            ) : (
              <FiSquare size={20} style={{ color: colors.textSecondary }} />
            )}
            <span className="text-[13px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              {selectedIds.length === sendableCustomers.length ? 'لغو انتخاب همه' : 'انتخاب همه'}
            </span>
          </button>
          <span className="text-[11px]" style={{ color: colors.textSecondary }}>
            {toPersianDigit(sendableCustomers.length)} مشتری قابل ارسال
          </span>
        </div>
      )}

      {/* لیست مشتریان */}
      <div className="px-5 pb-32 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="در حال بارگذاری..." />
          </div>
        ) : dueCustomers.length > 0 ? (
          dueCustomers.map((customer) => {
            const isSendable = sendableCustomers.some((c) => c.id === customer.id);
            const isSelected = selectedIds.includes(customer.id);
            
            // ✅ استخراج متغیرها با پشتیبانی از هر دو فرمت
            const customerName = customer.customerName || customer.customer_name;
            const customerPhone = customer.customerPhone || customer.customer_phone;
            const serviceName = customer.serviceName || customer.service_name;
            const lastServiceDate = customer.lastServiceDate || customer.last_service_date;
            const dueDate = customer.dueDate || customer.due_date;
            const daysRemaining = customer.daysRemaining ?? customer.days_remaining;
            const reminderSent = customer.reminderSent ?? customer.reminder_sent;
            const sentDate = customer.sentDate || customer.sent_date;

            // ✅ اصلاح: استفاده از متغیر استخراج شده به جای دسترسی مستقیم که undefined بود
            const isOverdue = daysRemaining < 0;
            const isToday = daysRemaining === 0;

            return (
              <button
                key={customer.id}
                onClick={() => isSendable && toggleCustomer(customer.id)}
                disabled={!isSendable}
                className="w-full flex items-start gap-3 p-3.5 rounded-2xl border-[1.5px] text-right transition-all disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor: isSelected ? colors.primary + '08' : colors.cardBackground,
                  borderColor: isSelected
                    ? colors.primary
                    : isSendable
                      ? colors.border
                      : colors.border + '60',
                }}
              >
                {/* چک‌باکس */}
                <div className="flex-shrink-0 mt-1">
                  {isSelected ? (
                    <FiCheckSquare size={22} style={{ color: colors.primary }} />
                  ) : (
                    <FiSquare
                      size={22}
                      style={{ color: isSendable ? colors.textSecondary : colors.border }}
                    />
                  )}
                </div>

                {/* اطلاعات */}
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-sm font-[Vazir-Bold] truncate"
                      style={{ color: colors.textMain }}
                    >
                      {customerName}
                    </span>
                    <span className="text-[11px]" style={{ color: colors.textSecondary }}>
                      {toPersianDigit(customerPhone)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px]" style={{ color: colors.textSecondary }}>
                      💆‍♀️
                    </span>
                    <span
                      className="text-[11px] font-[Vazir-Medium] truncate"
                      style={{ color: colors.textSecondary }}
                    >
                      {serviceName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px]" style={{ color: colors.textSecondary }}>
                      انجام: {lastServiceDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px]" style={{ color: colors.textSecondary }}>
                      موعد: {dueDate}
                    </span>
                  </div>

                  {/* Badge وضعیت */}
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {reminderSent && (
                      <span
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-[Vazir-Bold]"
                        style={{ backgroundColor: '#9E9E9E15', color: '#9E9E9E' }}
                      >
                        ارسال شده {sentDate ? `(${sentDate})` : ''}
                      </span>
                    )}
                    {isOverdue && !reminderSent && (
                      <span
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-[Vazir-Bold]"
                        style={{ backgroundColor: '#E5393515', color: '#E53935' }}
                      >
                        {toPersianDigit(Math.abs(daysRemaining))} روز گذشته
                      </span>
                    )}
                    {isToday && !reminderSent && (
                      <span
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-[Vazir-Bold]"
                        style={{ backgroundColor: '#FF980015', color: '#FF9800' }}
                      >
                        امروز موعد تمدید
                      </span>
                    )}
                    {!isOverdue && !isToday && !reminderSent && (
                      <span
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-[Vazir-Bold]"
                        style={{ backgroundColor: '#FF980015', color: '#FF9800' }}
                      >
                        {toPersianDigit(daysRemaining)} روز تا موعد
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <EmptyState
            icon="🔔"
            title="مشتری برای یادآوری وجود ندارد"
            description="در حال حاضر هیچ مشتری‌ای نیاز به یادآوری تمدید ندارد"
          />
        )}
      </div>

      {/* دکمه ارسال */}
      {selectedIds.length > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 px-5 pt-3 pb-5 border-t z-30"
          style={{ backgroundColor: colors.cardBackground, borderTopColor: colors.border }}
        >
          <Button
            title={
              sending ? 'در حال ارسال...' : `ارسال به ${toPersianDigit(selectedIds.length)} مشتری`
            }
            onPress={handleSendReminders}
            loading={sending}
            disabled={sending}
            variant="primary"
            size="lg"
            fullWidth
            icon={<FiSend size={16} color="#fff" />}
            iconPosition="right"
            style={{ backgroundColor: '#FF9800' }}
          />
        </div>
      )}
    </ScreenWrapper>
  );
}
