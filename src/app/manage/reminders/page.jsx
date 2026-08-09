'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FiSend, FiBell } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import {
  ReminderStats,
  ReminderTabs,
  ReminderList,
} from '@/components/manageBusiness/reminders';
import { toPersianDigit } from '@/utils/numberUtils';
import dynamic from 'next/dynamic';


const SendReminderModal = dynamic(
  () => import('@/components/manageBusiness/reminders/SendReminderModal'),
  { ssr: false, loading: () => null }
);


const REMINDER_THRESHOLD_DAYS = 2;

const MOCK_REMINDER_CUSTOMERS = [
  {
    id: 'rem_1',
    customerName: 'نازنین کریمی',
    customerPhone: '09121112233',
    serviceId: 'svc_1',
    serviceName: 'فیشیال تخصصی پوست',
    lastServiceDate: '۱۴۰۵/۰۳/۲۰',
    renewalDays: 30,
    dueDate: '۱۴۰۵/۰۴/۲۰',
    daysRemaining: 2,
    reminderSent: false,
    sentDate: null,
    hasNewBookingAfterSend: false,
  },
  {
    id: 'rem_2',
    customerName: 'الهام محمدی',
    customerPhone: '09124445566',
    serviceId: 'svc_1',
    serviceName: 'فیشیال تخصصی پوست',
    lastServiceDate: '۱۴۰۵/۰۳/۱۸',
    renewalDays: 30,
    dueDate: '۱۴۰۵/۰۴/۱۸',
    daysRemaining: 0,
    reminderSent: false,
    sentDate: null,
    hasNewBookingAfterSend: false,
  },
  {
    id: 'rem_3',
    customerName: 'زهرا حسینی',
    customerPhone: '09127778899',
    serviceId: 'svc_1',
    serviceName: 'فیشیال تخصصی پوست',
    lastServiceDate: '۱۴۰۵/۰۳/۱۵',
    renewalDays: 30,
    dueDate: '۱۴۰۵/۰۴/۱۵',
    daysRemaining: -3,
    reminderSent: true, // ← قبلاً ارسال شده
    sentDate: '۱۴۰۵/۰۴/۱۳',
    hasNewBookingAfterSend: false, // ← هنوز خدمت جدید انجام نداده
  },
  {
    id: 'rem_4',
    customerName: 'مریم احمدی',
    customerPhone: '09123334455',
    serviceId: 'svc_1',
    serviceName: 'فیشیال تخصصی پوست',
    lastServiceDate: '۱۴۰۵/۰۳/۲۲',
    renewalDays: 30,
    dueDate: '۱۴۰۵/۰۴/۲۲',
    daysRemaining: 1,
    reminderSent: true, // ← قبلاً ارسال شده
    sentDate: '۱۴۰۵/۰۴/۱۰',
    hasNewBookingAfterSend: true, // ← ولی خدمت جدید انجام داده → نمایش داده شود
  },
  {
    id: 'rem_5',
    customerName: 'سمیرا قاسمی',
    customerPhone: '09126665544',
    serviceId: 'svc_2',
    serviceName: 'کاشت ناخن ژلیش',
    lastServiceDate: '۱۴۰۵/۰۳/۲۸',
    renewalDays: 21,
    dueDate: '۱۴۰۵/۰۴/۱۹',
    daysRemaining: 1,
    reminderSent: false,
    sentDate: null,
    hasNewBookingAfterSend: false,
  },
  {
    id: 'rem_6',
    customerName: 'پریسا نوری',
    customerPhone: '09128889900',
    serviceId: 'svc_2',
    serviceName: 'کاشت ناخن ژلیش',
    lastServiceDate: '۱۴۰۵/۰۳/۲۷',
    renewalDays: 21,
    dueDate: '۱۴۰۵/۰۴/۱۸',
    daysRemaining: 0,
    reminderSent: true, // ← ارسال شده و خدمت جدید نداده
    sentDate: '۱۴۰۵/۰۴/۱۲',
    hasNewBookingAfterSend: false,
  },
  {
    id: 'rem_7',
    customerName: 'فاطمه رضوی',
    customerPhone: '09121234567',
    serviceId: 'svc_2',
    serviceName: 'کاشت ناخن ژلیش',
    lastServiceDate: '۱۴۰۵/۰۳/۲۵',
    renewalDays: 21,
    dueDate: '۱۴۰۵/۰۴/۱۶',
    daysRemaining: -2,
    reminderSent: false,
    sentDate: null,
    hasNewBookingAfterSend: false,
  },
  {
    id: 'rem_8',
    customerName: 'شیما کاظمی',
    customerPhone: '09129876543',
    serviceId: 'svc_3',
    serviceName: 'لیزر فول بادی',
    lastServiceDate: '۱۴۰۵/۰۳/۰۳',
    renewalDays: 45,
    dueDate: '۱۴۰۵/۰۴/۱۸',
    daysRemaining: 0,
    reminderSent: false,
    sentDate: null,
    hasNewBookingAfterSend: false,
  },
  {
    id: 'rem_9',
    customerName: 'نگار موسوی',
    customerPhone: '09125556677',
    serviceId: 'svc_3',
    serviceName: 'لیزر فول بادی',
    lastServiceDate: '۱۴۰۵/۰۳/۰۱',
    renewalDays: 45,
    dueDate: '۱۴۰۵/۰۴/۱۶',
    daysRemaining: -2,
    reminderSent: false,
    sentDate: null,
    hasNewBookingAfterSend: false,
  },
];

export default function RemindersPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();
  const businessData = useBusinessStore((s) => s.businessData);

  const [customers, setCustomers] = useState(MOCK_REMINDER_CUSTOMERS);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [sendModalVisible, setSendModalVisible] = useState(false);

  const businessName = businessData?.name || 'سالن زیبایی نیلارام';
  const bookingLink = `https://zibano.app/book/${businessData?.id || 'biz_1'}`;

  // ═══════ منطق قابلیت ارسال ═══════
  const canSendCustomer = (customer) => {
    if (!customer.reminderSent) return true;
    if (customer.hasNewBookingAfterSend) return true;
    return false;
  };

  // ═══════ منطق نمایش: حذف کسانی که ارسال شده و خدمت جدید ندارند ═══════
  const shouldShowCustomer = (customer) => {
    if (!customer.reminderSent) return true; // هنوز ارسال نشده → نمایش بده
    if (customer.hasNewBookingAfterSend) return true; // خدمت جدید انجام داده → نمایش بده
    return false; // ارسال شده و خدمت جدید نداده → حذف کن
  };

  // ═══════ مشتریان فیلترشده بر اساس آستانه و تب و وضعیت ارسال ═══════
  const filteredCustomers = useMemo(() => {
    const dueCustomers = customers.filter((c) => c.daysRemaining <= REMINDER_THRESHOLD_DAYS);

    // ✅ حذف کسانی که پیام دریافت کرده‌اند و خدمت جدید انجام نداده‌اند
    const visibleCustomers = dueCustomers.filter(shouldShowCustomer);

    if (activeTab === 'all') return visibleCustomers;
    return visibleCustomers.filter((c) => c.serviceId === activeTab);
  }, [customers, activeTab]);

  // ═══════ ساخت تب‌ها از خدمات ═══════
  const tabs = useMemo(() => {
    const dueCustomers = customers.filter((c) => c.daysRemaining <= REMINDER_THRESHOLD_DAYS);
    // ✅ فقط مشتریانی که باید نمایش داده شوند
    const visibleCustomers = dueCustomers.filter(shouldShowCustomer);

    const allTab = {
      id: 'all',
      label: 'همه',
      count: visibleCustomers.length,
    };

    const serviceIds = [...new Set(visibleCustomers.map((c) => c.serviceId))];
    const serviceTabs = serviceIds.map((serviceId) => {
      const service = (businessData?.services || []).find((s) => s.id === serviceId);
      const count = visibleCustomers.filter((c) => c.serviceId === serviceId).length;
      return {
        id: serviceId,
        label: service?.name || 'خدمت',
        count,
      };
    });

    return [allTab, ...serviceTabs];
  }, [customers, businessData]);

  // ═══════ آمار ═══════
  const stats = useMemo(() => {
    const dueCustomers = customers.filter((c) => c.daysRemaining <= REMINDER_THRESHOLD_DAYS);
    // ✅ فقط مشتریانی که نمایش داده می‌شوند
    const visibleCustomers = dueCustomers.filter(shouldShowCustomer);
    return {
      totalDue: visibleCustomers.length,
      overdue: visibleCustomers.filter((c) => c.daysRemaining < 0).length,
      sentToday: customers.filter((c) => c.reminderSent && c.sentDate === '۱۴۰۵/۰۴/۱۸').length,
    };
  }, [customers]);

  // ═══════ هندلرها ═══════
  const handleToggleCustomer = (customerId) => {
    setSelectedIds((prev) =>
      prev.includes(customerId) ? prev.filter((id) => id !== customerId) : [...prev, customerId]
    );
  };

  const handleSelectAll = (ids) => {
    setSelectedIds(ids);
  };

  const handleOpenSendModal = () => {
    if (selectedIds.length === 0) {
      showToast('لطفاً حداقل یک مشتری را انتخاب کنید', 'warning');
      return;
    }
    setSendModalVisible(true);
  };

  const handleConfirmSend = (sentCustomerIds) => {
    // به‌روزرسانی وضعیت مشتریان: ارسال شده
    setCustomers((prev) =>
      prev.map((c) =>
        sentCustomerIds.includes(c.id)
          ? {
              ...c,
              reminderSent: true,
              sentDate: '۱۴۰۵/۰۴/۱۸',
              hasNewBookingAfterSend: false, // ← هنوز خدمت جدید انجام نداده
            }
          : c
      )
    );

    // ✅ پاک کردن انتخاب‌ها
    setSelectedIds([]);
    setSendModalVisible(false);
    showToast(
      `پیام یادآوری برای ${toPersianDigit(sentCustomerIds.length)} مشتری ارسال شد`,
      'success'
    );
  };

  // ═══════ رندر ═══════
  if (!isAuthenticated) {
    return (
      <ScreenWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <p style={{ color: colors.textMain }}>در حال بارگذاری...</p>
        </div>
      </ScreenWrapper>
    );
  }

  const selectedCustomers = filteredCustomers.filter((c) => selectedIds.includes(c.id));

  return (
    <ScreenWrapper padding={0}>
      <Header title="یادآوری خدمت" onBackPress={() => router.push('/manage')} />

      {/* توضیح */}
      <div className="px-4 pt-3 pb-1">
        <div
          className="flex items-start gap-2.5 p-3.5 rounded-2xl border"
          style={{
            backgroundColor: '#FF980008',
            borderColor: '#FF980025',
          }}
        >
          <span className="text-base flex-shrink-0">🔔</span>
          <p
            className="text-[12px] font-[Vazir] leading-5 flex-1"
            style={{ color: colors.textSecondary }}
          >
            مشتریانی که حداکثر {toPersianDigit(REMINDER_THRESHOLD_DAYS)} روز دیگر موعد تمدید خدمتشان
            فرا می‌رسد. پس از ارسال پیام، تا انجام خدمت جدید در لیست نمایش داده نمی‌شوند.
          </p>
        </div>
      </div>

      {/* آمار */}
      <ReminderStats
        totalDue={stats.totalDue}
        sentToday={stats.sentToday}
        overdue={stats.overdue}
      />

      {/* تب‌های خدمات */}
      <ReminderTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* لیست مشتریان */}
      <div className="flex-1 overflow-y-auto pt-4">
        <ReminderList
          customers={filteredCustomers}
          selectedIds={selectedIds}
          onToggle={handleToggleCustomer}
          onSelectAll={handleSelectAll}
          canSendCustomer={canSendCustomer}
        />
      </div>

      {/* نوار پایین ارسال */}
      {selectedIds.length > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 px-4 pt-3 pb-5 border-t z-30"
          style={{
            backgroundColor: colors.cardBackground,
            borderTopColor: colors.border,
            boxShadow: '0 -4px 10px rgba(0,0,0,0.08)',
          }}
        >
          <button
            onClick={handleOpenSendModal}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl
              transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg"
            style={{ backgroundColor: '#FF9800' }}
          >
            <FiSend size={18} color="#fff" />
            <span className="text-[15px] font-[Vazir-Bold] text-white">
              ارسال پیام یادآوری به {toPersianDigit(selectedIds.length)} مشتری
            </span>
          </button>
        </div>
      )}

      {/* مدال ارسال */}
      <SendReminderModal
        visible={sendModalVisible}
        customers={selectedCustomers}
        businessName={businessName}
        bookingLink={bookingLink}
        onClose={() => setSendModalVisible(false)}
        onConfirm={handleConfirmSend}
      />
    </ScreenWrapper>
  );
}
