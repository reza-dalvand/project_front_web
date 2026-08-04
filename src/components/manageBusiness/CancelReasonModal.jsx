'use client';

import { useState, useEffect } from 'react';
import { FiXCircle, FiAlertTriangle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

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

  const handleConfirm = () => {
    onConfirm(appointment.id, reason.trim() || 'دلیلی ذکر نشده است');
    setReason('');
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-5"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-3xl p-6 flex flex-col gap-4"
        style={{ backgroundColor: colors.cardBackground }}
      >
        {/* هدر */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#E5393515' }}
          >
            <FiXCircle size={32} color="#E53935" />
          </div>
          <h3 className="text-lg font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            لغو نوبت مشتری
          </h3>
          <p className="text-xs" style={{ color: colors.textSecondary }}>
            دلیل لغو نوبت را ذکر کنید
          </p>
        </div>

        {/* اطلاعات مشتری */}
        <div className="flex items-center gap-3 py-2">
          <Avatar name={appointment.customerName} size="md" />
          <div className="flex flex-col gap-0.5 flex-1">
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              {appointment.customerName}
            </span>
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              {appointment.serviceName}
            </span>
          </div>
        </div>

        {/* هشدار استرداد */}
        <div
          className="flex items-start gap-2.5 p-3 rounded-xl border"
          style={{ backgroundColor: '#FF980010', borderColor: '#FF980040' }}
        >
          <FiAlertTriangle size={18} color="#FF9800" className="flex-shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5 flex-1">
            <span className="text-[13px] font-[Vazir-Bold]" style={{ color: '#FF9800' }}>
              بیعانه به مشتری مسترد می‌شود
            </span>
            <span className="text-[11px] font-[Vazir] leading-[18px]" style={{ color: colors.textSecondary }}>
              با لغو نوبت، کل بیعانه پرداخت شده ظرف ۴۸ ساعت به حساب مشتری واریز می‌شود.
            </span>
          </div>
        </div>

        {/* دلایل پیشنهادی */}
        <div>
          <span className="text-[13px] font-[Vazir-Bold] block mb-2" style={{ color: colors.textMain }}>
            دلایل پیشنهادی:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {REASON_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setReason(suggestion)}
                className="px-3 py-1.5 rounded-[14px] border text-xs font-[Vazir-Medium] transition-colors"
                style={{
                  backgroundColor: reason === suggestion ? colors.primary + '20' : colors.background,
                  borderColor: reason === suggestion ? colors.primary : colors.border,
                  color: reason === suggestion ? colors.primary : colors.textMain,
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* فیلد دلیل */}
        <Input
          label="دلیل لغو (اختیاری)"
          placeholder="دلیل لغو نوبت را بنویسید..."
          value={reason}
          onChangeText={setReason}
          multiline
        />

        {/* دکمه‌ها */}
        <div className="flex gap-3 mt-2">
          <Button
            title="انصراف"
            onPress={() => { setReason(''); onClose(); }}
            variant="outline"
            size="lg"
            className="flex-1"
          />
          <Button
            title="تایید و لغو نوبت"
            onPress={handleConfirm}
            variant="primary"
            size="lg"
            className="flex-1"
            style={{ backgroundColor: '#E53935' }}
            icon={<FiXCircle size={18} color="#fff" />}
            iconPosition="right"
          />
        </div>
      </div>
    </div>
  );
}