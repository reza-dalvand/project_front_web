'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  FiCreditCard,
  FiCalendar,
  FiClock,
  FiCopy,
  FiFileText,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { Card } from '@/components/common';
import { toPersianDigit, formatPrice } from '@/utils/numberUtils';
import { useToast } from '@/hooks/useToast';

const MOCK_PAYMENTS = [
  {
    id: 'pay_1',
    businessName: 'سالن زیبایی نیلارام',
    businessLogo: 'https://picsum.photos/100/100?random=21',
    serviceName: 'فیشیال تخصصی پوست VIP',
    date: '۱۴۰۳/۰۴/۱۰',
    dayName: 'شنبه',
    time: '۱۴:۳۲',
    totalPrice: 675000,
    paidAmount: 200000,
    status: 'success',
    trackingCode: 'TRK-1234567890',
    cardNumber: '6037 9918 **** 1234',
  },
  {
    id: 'pay_2',
    businessName: 'مرکز لیزر رویال',
    businessLogo: 'https://picsum.photos/100/100?random=25',
    serviceName: 'لیزر فول بادی',
    date: '۱۴۰۳/۰۴/۰۵',
    dayName: 'دوشنبه',
    time: '۱۱:۱۸',
    totalPrice: 2125000,
    paidAmount: 500000,
    status: 'success',
    trackingCode: 'TRK-9876543210',
    cardNumber: '6219 8610 **** 5678',
  },
];

export default function PaymentsPage() {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(0);

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    showToast('کد پیگیری کپی شد', 'success');
  };

  return (
    <div
      className="min-h-screen pb-20"
      style={{ backgroundColor: colors.background }}
    >
      <div className="p-4 flex flex-col gap-3.5">
        {MOCK_PAYMENTS.map((pay) => (
          <Card key={pay.id} variant="elevated" padding={0} radius={20}>
            {/* هدر */}
            <div
              className="px-3.5 py-3 border-b flex items-center gap-2.5"
              style={{ borderColor: colors.border }}
            >
              <Image
                src={pay.businessLogo}
                alt={pay.businessName}
                width={44}
                height={44}
                className="rounded-xl"
              />
              <div className="flex flex-col gap-0.5 flex-1">
                <span
                  className="text-sm font-[Vazir-Bold]"
                  style={{ color: colors.textMain }}
                >
                  {pay.businessName}
                </span>
                <span
                  className="text-xs"
                  style={{ color: colors.textSecondary }}
                >
                  {pay.serviceName}
                </span>
              </div>
              <div
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl"
                style={{ backgroundColor: '#4CAF5020' }}
              >
                <span
                  className="text-[11px] font-[Vazir-Bold]"
                  style={{ color: '#4CAF50' }}
                >
                  موفق
                </span>
              </div>
            </div>

            {/* تاریخ */}
            <div
              className="flex items-center justify-between px-3.5 py-2.5 border-b"
              style={{ borderColor: colors.border }}
            >
              <div className="flex items-center gap-1.5">
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded-lg"
                  style={{ backgroundColor: '#2196F318' }}
                >
                  <FiCreditCard size={12} color="#2196F3" />
                  <span
                    className="text-[11px] font-[Vazir-Bold]"
                    style={{ color: '#2196F3' }}
                  >
                    بیعانه
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <FiCalendar size={13} color={colors.textSecondary} />
                <span
                  className="text-[11px]"
                  style={{ color: colors.textMain }}
                >
                  {pay.dayName} {pay.date}
                </span>
                <div
                  className="w-0.5 h-0.5 rounded-full mx-0.5"
                  style={{ backgroundColor: colors.border }}
                />
                <FiClock size={13} color={colors.textSecondary} />
                <span
                  className="text-[11px]"
                  style={{ color: colors.textMain }}
                >
                  {pay.time}
                </span>
              </div>
            </div>

            {/* اطلاعات مالی */}
            <div
              className="p-3 m-3 rounded-xl border flex flex-col gap-1.5"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.border,
              }}
            >
              <div className="flex justify-between items-center">
                <span
                  className="text-xs"
                  style={{ color: colors.textSecondary }}
                >
                  مبلغ کل خدمت
                </span>
                <span
                  className="text-xs font-[Vazir-Bold]"
                  style={{ color: colors.textMain }}
                >
                  {formatPrice(pay.totalPrice).replace(' تومان', '')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className="text-xs"
                  style={{ color: colors.textSecondary }}
                >
                  مبلغ نهایی خدمت
                </span>
                <span
                  className="text-xs font-[Vazir-Bold]"
                  style={{ color: colors.textMain }}
                >
                  {formatPrice(pay.totalPrice).replace(' تومان', '')}
                </span>
              </div>
              <div
                className="flex justify-between items-center py-2 px-2 rounded-lg mt-1"
                style={{ backgroundColor: colors.primary + '08' }}
              >
                <span
                  className="text-xs"
                  style={{ color: colors.textSecondary }}
                >
                  مبلغ پرداختی شما
                </span>
                <span
                  className="text-sm font-[Vazir-Bold]"
                  style={{ color: colors.primary }}
                >
                  {formatPrice(pay.paidAmount).replace(' تومان', '')}
                </span>
              </div>
            </div>

            {/* کد پیگیری */}
            <div
              className="px-3.5 py-2.5 border-b flex flex-col gap-1"
              style={{ borderColor: colors.border }}
            >
              <div className="flex justify-between items-center py-1">
                <div className="flex items-center gap-1.5">
                  <FiFileText size={14} color={colors.textSecondary} />
                  <span
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    کد پیگیری
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-xs font-[Vazir-Bold]"
                    style={{ color: colors.textMain }}
                  >
                    {toPersianDigit(pay.trackingCode)}
                  </span>
                  <button
                    onClick={() => handleCopyCode(pay.trackingCode)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: colors.primary + '15' }}
                  >
                    <FiCopy size={12} color={colors.primary} />
                  </button>
                </div>
              </div>
            </div>

            {/* فوتر */}
            <div className="px-3.5 py-3">
              <button
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
                           transition-all"
                style={{ backgroundColor: colors.primary }}
              >
                <FiFileText size={16} color="#fff" />
                <span className="text-sm font-[Vazir-Bold] text-white">
                  مشاهده فاکتور کامل
                </span>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}