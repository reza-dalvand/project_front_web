'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { FiCalendar, FiClock, FiUser, FiCheck, FiCopy } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { Card } from '@/components/common';
import { toPersianDigit, formatPrice } from '@/utils/numberUtils';
import { useToast } from '@/hooks/useToast';

const MOCK_APPOINTMENTS = [
  {
    id: 'apt_1',
    businessName: 'سالن زیبایی نیلارام',
    businessLogo: 'https://picsum.photos/100/100?random=21',
    serviceName: 'فیشیال تخصصی پوست',
    employeeName: 'سارا احمدی',
    date: '۱۴۰۳/۰۴/۱۵',
    time: '۱۰:۳۰',
    status: 'reserved',
    totalPrice: 675000,
    depositPaid: 200000,
    isUpcoming: true,
    verificationCode: '۵۸۹۲',
  },
  {
    id: 'apt_2',
    businessName: 'مرکز لیزر رویال',
    businessLogo: 'https://picsum.photos/100/100?random=25',
    serviceName: 'لیزر فول بادی',
    employeeName: 'دکتر رضایی',
    date: '۱۴۰۳/۰۴/۲۰',
    time: '۱۶:۰۰',
    status: 'reserved',
    totalPrice: 2125000,
    depositPaid: 500000,
    isUpcoming: true,
    verificationCode: '۲۵۷۱',
  },
  {
    id: 'apt_3',
    businessName: 'ناخن گالری پریا',
    businessLogo: 'https://picsum.photos/100/100?random=26',
    serviceName: 'کاشت ناخن ژلیش',
    employeeName: 'مریم',
    date: '۱۴۰۳/۰۳/۱۰',
    time: '۱۴:۰۰',
    status: 'done',
    totalPrice: 450000,
    depositPaid: 0,
    isUpcoming: false,
  },
];

const STATUS_MAP = {
  reserved: { label: 'رزرو شده', color: '#2196F3', bg: '#2196F320' },
  done: { label: 'انجام شده', color: '#4CAF50', bg: '#4CAF5020' },
  cancelled: { label: 'لغو شده', color: '#E53935', bg: '#E5393520' },
};

export default function AppointmentsPage() {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('upcoming');

  const filteredAppointments = useMemo(() => {
    if (activeTab === 'upcoming') {
      return MOCK_APPOINTMENTS.filter((a) => a.isUpcoming);
    }
    return MOCK_APPOINTMENTS.filter((a) => !a.isUpcoming);
  }, [activeTab]);

  const stats = {
    upcoming: MOCK_APPOINTMENTS.filter((a) => a.isUpcoming).length,
    past: MOCK_APPOINTMENTS.filter((a) => !a.isUpcoming).length,
  };

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    showToast('کد تایید کپی شد', 'success');
  };

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: colors.background }}>
      {/* Tabs */}
      <div className="px-4 pt-3 pb-2">
        <div
          className="flex p-1 rounded-xl border gap-1"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          {[
            { id: 'upcoming', label: 'آینده', count: stats.upcoming },
            { id: 'past', label: 'گذشته', count: stats.past },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg
                         transition-colors"
              style={{
                backgroundColor: activeTab === tab.id ? colors.primary : 'transparent',
              }}
            >
              <span
                className="text-sm font-[Vazir-Bold]"
                style={{
                  color: activeTab === tab.id ? '#fff' : colors.textMain,
                }}
              >
                {tab.label}
              </span>
              <span
                className="min-w-[22px] h-5 px-1.5 rounded-full flex items-center justify-center
                           text-[11px] font-[Vazir-Bold]"
                style={{
                  backgroundColor:
                    activeTab === tab.id ? 'rgba(255,255,255,0.3)' : colors.primary + '20',
                  color: activeTab === tab.id ? '#fff' : colors.primary,
                }}
              >
                {toPersianDigit(tab.count)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* لیست نوبت‌ها */}
      <div className="p-4 flex flex-col gap-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((apt) => {
            const statusMeta = STATUS_MAP[apt.status];
            return (
              <div key={apt.id} className="flex flex-col gap-3">
                <Card variant="elevated" padding={16} radius={18}>
                  {/* هدر */}
                  <div className="flex items-start gap-3 mb-3">
                    <Image
                      src={apt.businessLogo}
                      alt={apt.businessName}
                      width={48}
                      height={48}
                      className="rounded-xl"
                    />
                    <div className="flex-1 gap-1">
                      <span
                        className="text-sm font-[Vazir-Bold] block"
                        style={{ color: colors.textMain }}
                      >
                        {apt.businessName}
                      </span>
                      <span className="text-xs" style={{ color: colors.textSecondary }}>
                        {apt.serviceName}
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl"
                      style={{ backgroundColor: statusMeta.bg }}
                    >
                      <span
                        className="text-[11px] font-[Vazir-Bold]"
                        style={{ color: statusMeta.color }}
                      >
                        {statusMeta.label}
                      </span>
                    </div>
                  </div>

                  {/* جزئیات */}
                  <div className="flex flex-wrap gap-3 mb-3">
                    <div className="flex items-center gap-1">
                      <FiUser size={14} color={colors.textSecondary} />
                      <span className="text-xs" style={{ color: colors.textMain }}>
                        {apt.employeeName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiCalendar size={14} color={colors.textSecondary} />
                      <span className="text-xs" style={{ color: colors.textMain }}>
                        {apt.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock size={14} color={colors.textSecondary} />
                      <span className="text-xs" style={{ color: colors.textMain }}>
                        {apt.time}
                      </span>
                    </div>
                  </div>

                  {/* مبلغ */}
                  <div
                    className="p-3 rounded-xl border flex flex-col gap-2"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs" style={{ color: colors.textSecondary }}>
                        مبلغ کل خدمت
                      </span>
                      <span
                        className="text-sm font-[Vazir-Bold]"
                        style={{ color: colors.textMain }}
                      >
                        {formatPrice(apt.totalPrice)}
                      </span>
                    </div>
                    {apt.depositPaid > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs" style={{ color: colors.textSecondary }}>
                          بیعانه پرداختی
                        </span>
                        <span
                          className="text-sm font-[Vazir-Bold]"
                          style={{ color: colors.primary }}
                        >
                          {formatPrice(apt.depositPaid)}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>

                {/* کد تایید - فقط برای نوبت‌های آینده */}
                {apt.isUpcoming && apt.verificationCode && (
                  <div
                    className="rounded-2xl border-[1.5px] overflow-hidden"
                    style={{ borderColor: colors.primary + '40' }}
                  >
                    <div
                      className="flex items-center gap-3 px-3.5 py-3"
                      style={{ backgroundColor: colors.primary + '15' }}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: colors.primary }}
                      >
                        <FiCheck size={18} color="#fff" />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1">
                        <span
                          className="text-sm font-[Vazir-Bold]"
                          style={{ color: colors.textMain }}
                        >
                          کد تایید نوبت
                        </span>
                        <span className="text-[11px]" style={{ color: colors.textSecondary }}>
                          پس از انجام خدمت به سالن‌دار ارائه دهید
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 px-4 py-4">
                      <div
                        className="flex flex-row-reverse items-center justify-center gap-3 flex-1
                                   py-3 rounded-xl border border-dashed"
                        style={{
                          borderColor: colors.primary,
                          backgroundColor: colors.background,
                        }}
                      >
                        {apt.verificationCode.split('').map((digit, idx) => (
                          <div
                            key={idx}
                            className="w-11 h-[52px] rounded-xl border flex items-center justify-center"
                            style={{
                              borderColor: colors.primary + '50',
                              backgroundColor: colors.cardBackground,
                            }}
                          >
                            <span
                              className="text-2xl font-[Vazir-Bold]"
                              style={{ color: colors.primary }}
                            >
                              {digit}
                            </span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => handleCopyCode(apt.verificationCode)}
                        className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md"
                        style={{ backgroundColor: colors.primary }}
                      >
                        <FiCopy size={16} color="#fff" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-5xl">{activeTab === 'upcoming' ? '📅' : '📜'}</span>
            <h3 className="text-lg font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              {activeTab === 'upcoming' ? 'نوبت آینده‌ای ندارید' : 'سابقه‌ای ثبت نشده'}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
