// src/components/manageBusiness/CancelReasonModal.jsx
'use client';
import { useState, useEffect } from 'react';
import { FiXCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import {
  canCancelAppointment,
  getCancellationPolicy,
  formatHoursLeft,
} from '@/utils/cancellation-utils';

const REASON_SUGGESTIONS = [
  'سالن در این تاریخ تعطیل است',
  'کارمند مربوطه در دسترس نیست',
  'مشکل فنی در سالن',
  'تغییر برنامه کاری',
  'سایر موارد',
];

export default function CancelReasonModal({ visible, appointment, onClose, onConfirm }) {
  const { colors } = useTheme();
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (visible && appointment) {
      setReason('');
    }
  }, [visible, appointment]);

  if (!visible || !appointment) return null;

  // ✅ بررسی سیاست لغو
  const policy = getCancellationPolicy(appointment.date, appointment.time);
  const hoursText = formatHoursLeft(policy.hoursLeft);

  const handleConfirm = () => {
    onConfirm(appointment.id, reason.trim() || 'دلیلی ذکر نشده است');
    setReason('');
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 flex flex-col gap-3"
        style={{ backgroundColor: colors.cardBackground }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#E5393515' }}
          >
            <FiXCircle size={20} color="#E53935" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              لغو نوبت مشتری
            </h3>
            <p className="text-[10px]" style={{ color: colors.textSecondary }}>
              دلیل لغو نوبت را ذکر کنید
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: colors.background }}
          >
            <FiXCircle size={16} style={{ color: colors.textMain }} />
          </button>
        </div>

        {/* اطلاعات مشتری */}
        <div className="flex items-center gap-2.5">
          <Avatar name={appointment.customerName} size="sm" />
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="text-xs font-[Vazir-Bold] truncate" style={{ color: colors.textMain }}>
              {appointment.customerName}
            </span>
            <span className="text-[10px] truncate" style={{ color: colors.textSecondary }}>
              {appointment.serviceName}
            </span>
          </div>
        </div>

        {/* ═══ باکس سیاست لغو ═══ */}
        {policy.canCancel ? (
          <div
            className="flex items-start gap-2 p-2.5 rounded-xl border"
            style={{ backgroundColor: '#43A04708', borderColor: '#43A04730' }}
          >
            <FiInfo size={14} color="#43A047" className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span
                className="text-[11px] font-[Vazir-Bold] block mb-1"
                style={{ color: '#43A047' }}
              >
                ✓ لغو مجاز است ({hoursText} تا نوبت)
              </span>
              <span
                className="text-[10px] font-[Vazir] leading-4 block"
                style={{ color: colors.textSecondary }}
              >
                بیعانه به صورت کامل به مشتری مسترد می‌شود (بدون جریمه)
              </span>
            </div>
          </div>
        ) : (
          <div
            className="flex items-start gap-2 p-2.5 rounded-xl border"
            style={{ backgroundColor: '#E5393508', borderColor: '#E5393530' }}
          >
            <FiAlertTriangle size={14} color="#E53935" className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span
                className="text-[11px] font-[Vazir-Bold] block mb-1"
                style={{ color: '#E53935' }}
              >
                ⚠️ لغو مجاز نیست ({hoursText} تا نوبت)
              </span>
              <span
                className="text-[10px] font-[Vazir] leading-4 block"
                style={{ color: colors.textSecondary }}
              >
                طبق قوانین، لغو نوبت فقط تا ۱۲ ساعت قبل امکان‌پذیر است
              </span>
            </div>
          </div>
        )}

        {/* دلایل پیشنهادی - فقط اگر لغو مجاز باشد */}
        {policy.canCancel && (
          <div>
            <span
              className="text-[11px] font-[Vazir-Bold] block mb-1.5"
              style={{ color: colors.textMain }}
            >
              دلایل پیشنهادی:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {REASON_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setReason(suggestion)}
                  className="px-2.5 py-1.5 rounded-lg border text-[10px] font-[Vazir-Medium] transition-colors"
                  style={{
                    backgroundColor:
                      reason === suggestion ? colors.primary + '20' : colors.background,
                    borderColor: reason === suggestion ? colors.primary : colors.border,
                    color: reason === suggestion ? colors.primary : colors.textMain,
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* فیلد دلیل - فقط اگر لغو مجاز باشد */}
        {policy.canCancel && (
          <Input
            label="دلیل لغو (اختیاری)"
            placeholder="دلیل لغو نوبت را بنویسید..."
            value={reason}
            onChangeText={setReason}
            multiline
          />
        )}

        {/* دکمه‌ها */}
        <div className="flex gap-2">
          <Button
            title="انصراف"
            onPress={() => {
              setReason('');
              onClose();
            }}
            variant="outline"
            size="md"
            className="flex-1 whitespace-nowrap"
          />
          <Button
            title="تایید و لغو نوبت"
            onPress={handleConfirm}
            variant="primary"
            size="md"
            disabled={!policy.canCancel}
            className="flex-1 whitespace-nowrap"
            style={{
              backgroundColor: policy.canCancel ? '#E53935' : colors.border,
            }}
          />
        </div>
      </div>
    </div>
  );
}
