'use client';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  FiX,
  FiUser,
  FiPhone,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiInfo,
  FiCheckCircle,
  FiXCircle,
  FiBriefcase,
  FiCreditCard,
  FiChevronLeft,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import BottomSheet from '@/components/common/BottomSheet';
import Avatar from '@/components/common/Avatar';
import Card from '@/components/common/Card';
import StatusBadge from '@/components/common/StatusBadge';
import InfoRow from '@/components/common/InfoRow';
import { toPersianDigit, formatPrice } from '@/utils/numberUtils';
import { APPOINTMENT_STATUS_META } from '@/constants/meta';

export default function AppointmentDetailSheet({ visible, appointment, onClose }) {
  const { colors } = useTheme();

  if (!appointment) return null;

  const meta = APPOINTMENT_STATUS_META[appointment.status] || APPOINTMENT_STATUS_META.reserved;
  const isCancelledBySalon = appointment.status === 'cancelled_by_salon';
  const isDone = appointment.status === 'done';
  const isReserved = appointment.status === 'reserved';

  const dateStr = appointment.date
    ? `${toPersianDigit(appointment.date.jy)}/${toPersianDigit(appointment.date.jm)}/${toPersianDigit(appointment.date.jd)}`
    : '—';

  return (
    <BottomSheet visible={visible} onClose={onClose} title="جزئیات نوبت" snapPoint={0.85}>
      <div className="space-y-4 pb-6">
        {/* مشتری */}
        <div className="flex flex-col items-center gap-3 py-4">
          <Avatar name={appointment.customerName} size="xl" />
          <p className="text-lg font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            {appointment.customerName}
          </p>
          <StatusBadge meta={meta} size="lg" />
        </div>

        {/* جزئیات نوبت */}
        <Card variant="default" padding={14} radius={14}>
          <p className="text-sm font-[Vazir-Bold] mb-3" style={{ color: colors.textMain }}>
            جزئیات نوبت
          </p>
          <InfoRow icon={<FiBriefcase size={16} />} label="خدمت" value={appointment.serviceName} />
          <InfoRow icon={<FiUser size={16} />} label="کارمند" value={appointment.employeeName} />
          <InfoRow icon={<FiCalendar size={16} />} label="تاریخ" value={dateStr} />
          <InfoRow icon={<FiClock size={16} />} label="ساعت" value={appointment.time} />
          <InfoRow
            icon={<FiPhone size={16} />}
            label="شماره تماس"
            value={toPersianDigit(appointment.customerPhone || '—')}
            monospace
          />
        </Card>

        {/* مالی */}
        <Card variant="default" padding={14} radius={14}>
          <p className="text-sm font-[Vazir-Bold] mb-3" style={{ color: colors.textMain }}>
            جزئیات مالی
          </p>
          <InfoRow
            icon={<FiDollarSign size={16} />}
            label="مبلغ کل خدمت"
            value={formatPrice(appointment.price)}
          />
          {appointment.depositPaid > 0 && (
            <InfoRow
              icon={<FiCheckCircle size={16} />}
              iconColor="#43A047"
              label="بیعانه پرداخت شده"
              value={formatPrice(appointment.depositPaid)}
              valueColor="#43A047"
              valueBold
              highlight
            />
          )}
          <InfoRow
            icon={<FiCreditCard size={16} />}
            iconColor="#2196F3"
            label="باقیمانده (پرداخت در سالن)"
            value={formatPrice(appointment.price - (appointment.depositPaid || 0))}
            valueColor="#2196F3"
          />
          {isDone && appointment.depositPaid > 0 && (
            <div
              className="flex items-center gap-2 mt-3 p-3 rounded-xl border"
              style={{ backgroundColor: '#43A04710', borderColor: '#43A04740' }}
            >
              <FiCheckCircle size={18} color="#43A047" />
              <p className="text-xs font-[Vazir-Bold] flex-1" style={{ color: '#43A047' }}>
                بیعانه به حساب شما واریز شد
              </p>
            </div>
          )}
        </Card>

        {/* دلیل لغو */}
        {isCancelledBySalon && appointment.cancellationReason && (
          <Card
            variant="default"
            padding={14}
            radius={14}
            className="border"
            style={{ borderColor: '#E5393540', backgroundColor: '#E5393508' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <FiInfo size={20} color="#E53935" />
              <p className="text-sm font-[Vazir-Bold]" style={{ color: '#E53935' }}>
                دلیل لغو نوبت
              </p>
            </div>
            <p className="text-sm leading-6" style={{ color: colors.textMain }}>
              {appointment.cancellationReason}
            </p>
          </Card>
        )}

        {/* راهنما */}
        {isReserved && (
          <Card
            variant="default"
            padding={14}
            radius={14}
            className="border"
            style={{ borderColor: colors.primary + '40', backgroundColor: colors.primary + '08' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <FiInfo size={20} color={colors.primary} />
              <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                راهنمای تکمیل خدمت
              </p>
            </div>
            <div className="space-y-3">
              {[
                'خدمت را برای مشتری انجام دهید',
                'کد تایید ۴ رقمی مشتری را از او بپرسید',
                'کد را وارد کرده و خدمت را تایید کنید تا بیعانه آزاد شود',
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-[Vazir-Bold] text-white flex-shrink-0"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {toPersianDigit(i + 1)}
                  </div>
                  <p className="text-xs flex-1 leading-5" style={{ color: colors.textSecondary }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </BottomSheet>
  );
}
