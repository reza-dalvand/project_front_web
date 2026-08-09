// src/components/manageBusiness/AppointmentDetailSheet.jsx
'use client';
import {
  FiUser,
  FiPhone,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiBriefcase,
  FiCreditCard,
  FiCheckCircle,
  FiXCircle,
  FiShield,
  FiKey,
  FiAlertTriangle,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import BottomSheet from '@/components/common/BottomSheet';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import InfoRow from '@/components/common/InfoRow';
import Card from '@/components/common/Card';
import { toPersianDigit, formatPrice } from '@/utils/numberUtils';

export default function AppointmentDetailSheet({
  visible,
  appointment,
  onClose,
  onVerify,
  onTrustConfirm,
  onCancel,
}) {
  const { colors } = useTheme();

  if (!appointment) return null;

  const isReserved = appointment.status === 'reserved';
  const isTrust = appointment.trustBased === true;
  const isDone = appointment.status === 'done';
  const isCancelled = appointment.status === 'cancelled_by_salon';

  const dateStr = appointment.date
    ? `${toPersianDigit(appointment.date.jy)}/${toPersianDigit(appointment.date.jm)}/${toPersianDigit(appointment.date.jd)}`
    : '—';

  return (
    <BottomSheet visible={visible} onClose={onClose} title="جزئیات نوبت" snapPoint={0.85}>
      <div className="space-y-4 pb-6">
        {/* ═══ مشتری ═══ */}
        <div className="flex flex-col items-center gap-3 py-3">
          <Avatar name={appointment.customerName} size="xl" />
          <p className="text-lg font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            {appointment.customerName}
          </p>
          <p className="text-sm" style={{ color: colors.textSecondary, direction: 'ltr' }}>
            {toPersianDigit(appointment.customerPhone || '—')}
          </p>

          {/* Badge وضعیت */}
          {isCancelled && (
            <span
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-[Vazir-Bold]"
              style={{ backgroundColor: '#E5393515', color: '#E53935' }}
            >
              <FiXCircle size={13} />
              لغو شده
            </span>
          )}
          {isDone && (
            <span
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-[Vazir-Bold]"
              style={{ backgroundColor: '#43A04715', color: '#43A047' }}
            >
              <FiCheckCircle size={13} />
              انجام شده
            </span>
          )}
          {isReserved && isTrust && (
            <span
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-[Vazir-Bold]"
              style={{ backgroundColor: '#43A04715', color: '#43A047' }}
            >
              <FiShield size={13} />
              اعتمادی • بدون کد
            </span>
          )}
          {isReserved && !isTrust && (
            <span
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-[Vazir-Bold]"
              style={{ backgroundColor: '#FF980015', color: '#FF9800' }}
            >
              <FiKey size={13} />
              نیاز به کد تایید
            </span>
          )}
        </div>

        {/* ═══ پیام اعتماد ═══ */}
        {isReserved && isTrust && (
          <div
            className="flex items-start gap-2.5 p-3.5 rounded-xl border"
            style={{ backgroundColor: '#43A04708', borderColor: '#43A04730' }}
          >
            <FiShield size={16} color="#43A047" className="flex-shrink-0 mt-0.5" />
            <p className="text-xs font-[Vazir] leading-5 flex-1" style={{ color: '#43A047' }}>
              مشتری به شما اعتماد داشت. نیازی به کد تایید نیست و پس از انجام خدمت، بیعانه به صورت
              خودکار آزاد می‌شود.
            </p>
          </div>
        )}

        {/* ═══ دلیل لغو ═══ */}
        {isCancelled && appointment.cancellationReason && (
          <div
            className="flex items-start gap-2.5 p-3.5 rounded-xl border"
            style={{ backgroundColor: '#E5393508', borderColor: '#E5393530' }}
          >
            <FiAlertTriangle size={16} color="#E53935" className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-[Vazir-Bold] mb-1" style={{ color: '#E53935' }}>
                دلیل لغو
              </p>
              <p className="text-xs font-[Vazir] leading-5" style={{ color: colors.textSecondary }}>
                {appointment.cancellationReason}
              </p>
            </div>
          </div>
        )}

        {/* ═══ جزئیات نوبت ═══ */}
        <Card variant="default" padding={14} radius={14}>
          <p className="text-sm font-[Vazir-Bold] mb-3" style={{ color: colors.textMain }}>
            جزئیات نوبت
          </p>
          <InfoRow
            icon={<FiBriefcase size={16} />}
            label="خدمت"
            value={appointment.serviceName}
            showDivider
          />
          <InfoRow
            icon={<FiUser size={16} />}
            label="کارمند"
            value={appointment.employeeName || '—'}
            showDivider
          />
          <InfoRow icon={<FiCalendar size={16} />} label="تاریخ" value={dateStr} showDivider />
          <InfoRow icon={<FiClock size={16} />} label="ساعت" value={appointment.time} />
        </Card>

        {/* ═══ مالی ═══ */}
        <Card variant="default" padding={14} radius={14}>
          <p className="text-sm font-[Vazir-Bold] mb-3" style={{ color: colors.textMain }}>
            جزئیات مالی
          </p>
          <InfoRow
            icon={<FiDollarSign size={16} />}
            label="مبلغ کل خدمت"
            value={formatPrice(appointment.price)}
            showDivider
          />
          <InfoRow
            icon={<FiCreditCard size={16} />}
            iconColor="#FF9800"
            label="بیعانه پرداخت شده"
            value={formatPrice(appointment.depositPaid || 0)}
            valueColor="#FF9800"
            valueBold
            showDivider
          />
          <InfoRow
            icon={<FiDollarSign size={16} />}
            iconColor="#2196F3"
            label="باقیمانده (در سالن)"
            value={formatPrice((appointment.price || 0) - (appointment.depositPaid || 0))}
            valueColor="#2196F3"
          />
          {/* بیعانه آزاد شده */}
          {isDone && appointment.depositPaid > 0 && (
            <div
              className="flex items-center gap-2 mt-3 p-3 rounded-xl border"
              style={{ backgroundColor: '#43A04710', borderColor: '#43A04740' }}
            >
              <FiCheckCircle size={16} color="#43A047" />
              <p className="text-xs font-[Vazir-Bold] flex-1" style={{ color: '#43A047' }}>
                بیعانه آزاد شد
              </p>
            </div>
          )}
        </Card>

        {/* ═══ دکمه‌های اکشن ═══ */}
        {isReserved && (
          <div className="space-y-2.5">
            {isTrust ? (
              <Button
                title="تایید انجام خدمت (بدون کد)"
                onPress={() => onTrustConfirm?.(appointment)}
                variant="primary"
                size="lg"
                fullWidth
                icon={<FiCheckCircle size={18} color="#fff" />}
                iconPosition="right"
                style={{ backgroundColor: '#43A047' }}
              />
            ) : (
              <Button
                title="تایید کد ۴ رقمی"
                onPress={() => onVerify?.(appointment)}
                variant="primary"
                size="lg"
                fullWidth
                icon={<FiKey size={18} color="#fff" />}
                iconPosition="right"
                style={{ backgroundColor: '#FF9800' }}
              />
            )}
            <Button
              title="لغو نوبت"
              onPress={() => onCancel?.(appointment)}
              variant="outline"
              size="lg"
              fullWidth
              icon={<FiXCircle size={18} color="#E53935" />}
              iconPosition="right"
              className="!border-[#E53935]"
              style={{ color: '#E53935' }}
            />
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
