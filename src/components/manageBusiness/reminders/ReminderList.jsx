// src/components/manageBusiness/reminders/ReminderList.jsx
'use client';
import { FiCheckSquare, FiSquare } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ReminderCustomerCard from './ReminderCustomerCard';
import ReminderEmptyState from './ReminderEmptyState';
import { toPersianDigit } from '@/utils/numberUtils';

export default function ReminderList({
  customers,
  selectedIds,
  onToggle,
  onSelectAll,
  canSendCustomer,
}) {
  const { colors } = useTheme();

  if (!customers || customers.length === 0) {
    return <ReminderEmptyState />;
  }

  // مشتریان قابل ارسال (نه قفل شده)
  const sendableCustomers = customers.filter((c) => canSendCustomer(c));
  const allSelected =
    sendableCustomers.length > 0 && sendableCustomers.every((c) => selectedIds.includes(c.id));
  const someSelected = sendableCustomers.some((c) => selectedIds.includes(c.id));

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectAll([]);
    } else {
      onSelectAll(sendableCustomers.map((c) => c.id));
    }
  };

  return (
    <div className="flex flex-col gap-3 px-4 pb-32">
      {/* نوار انتخاب همه */}
      {sendableCustomers.length > 0 && (
        <div
          className="flex items-center justify-between p-3 rounded-2xl border"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            {allSelected ? (
              <FiCheckSquare size={20} style={{ color: colors.primary }} />
            ) : (
              <FiSquare size={20} style={{ color: colors.textSecondary }} />
            )}
            <span className="text-[13px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              {allSelected ? 'لغو انتخاب همه' : 'انتخاب همه'}
            </span>
          </button>
          <span className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
            {toPersianDigit(sendableCustomers.length)} مشتری قابل ارسال
            {someSelected && (
              <span style={{ color: colors.primary }}>
                {' '}
                • {toPersianDigit(selectedIds.length)} انتخاب شده
              </span>
            )}
          </span>
        </div>
      )}

      {/* لیست مشتریان */}
      {customers.map((customer) => (
        <ReminderCustomerCard
          key={customer.id}
          customer={customer}
          selected={selectedIds.includes(customer.id)}
          canSend={canSendCustomer(customer)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
