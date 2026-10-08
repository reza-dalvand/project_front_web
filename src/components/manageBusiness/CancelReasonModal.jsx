// src/components/manageBusiness/CancelReasonModal.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiXCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Avatar from '@/components/common/Avatar';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';
import { appointmentsService } from '@/api';
import { toPersianDigit } from '@/utils/numberUtils';

const REASON_SUGGESTIONS = [
  'سالن در این تاریخ تعطیل است',
  'کارمند مربوطه در دسترس نیست',
  'مشکل فنی در سالن',
  'تغییر برنامه کاری',
  'سایر موارد',
];

const MAX_REASON_LENGTH = 500;
const MIN_REASON_LENGTH = 10;

export default function CancelReasonModal({ visible, appointment, onClose, onConfirm }) {
  const { colors } = useTheme();
  const instanceId = useRef('cancel-reason-modal');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible && appointment) {
      setReason('');
      setLoading(false);
      setError('');
      acquireScrollLock(instanceId.current);
    } else {
      releaseScrollLock(instanceId.current);
    }
    return () => releaseScrollLock(instanceId.current);
  }, [visible, appointment]);

  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  if (!visible || !appointment) return null;

  const handleReasonChange = (text) => {
    setReason(text);
    if (error) setError('');
  };

  const handleConfirm = async () => {
    const trimmedReason = reason.trim();
    
    // ✅ FIX: اعتبارسنجی طول و محتوای دلیل لغو
    if (trimmedReason.length > 0 && trimmedReason.length < MIN_REASON_LENGTH) {
      setError(`دلیل لغو باید حداقل ${MIN_REASON_LENGTH} کاراکتر باشد`);
      return;
    }
    if (trimmedReason.length > MAX_REASON_LENGTH) {
      setError(`دلیل لغو نباید بیشتر از ${MAX_REASON_LENGTH} کاراکتر باشد`);
      return;
    }

    setError('');
    setLoading(true);
    try {
      const finalReason = trimmedReason || 'دلیلی ذکر نشده است';
      await appointmentsService.cancelByBusiness(appointment.id, finalReason);
      setLoading(false);
      onConfirm?.(appointment.id, finalReason);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'خطا در لغو نوبت');
      console.error('Cancel failed:', err);
    }
  };

  const content = (
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
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E5393515' }}>
            <FiXCircle size={20} color="#E53935" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>لغو نوبت مشتری</h3>
            <p className="text-[10px]" style={{ color: colors.textSecondary }}>دلیل لغو نوبت را ذکر کنید</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.background }}>
            <FiXCircle size={16} style={{ color: colors.textMain }} />
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <Avatar name={appointment.customerName} size="sm" />
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="text-xs font-[Vazir-Bold] truncate" style={{ color: colors.textMain }}>{appointment.customerName}</span>
            <span className="text-[10px] truncate" style={{ color: colors.textSecondary }}>{appointment.serviceName}</span>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-[Vazir-Bold] block mb-1.5" style={{ color: colors.textMain }}>دلایل پیشنهادی:</span>
          <div className="flex flex-wrap gap-1.5">
            {REASON_SUGGESTIONS.map((suggestion) => (
              <button key={suggestion} onClick={() => handleReasonChange(suggestion)} className="px-2.5 py-1.5 rounded-lg border text-[10px] font-[Vazir-Medium] transition-colors" style={{ backgroundColor: reason === suggestion ? colors.primary + '20' : colors.background, borderColor: reason === suggestion ? colors.primary : colors.border, color: reason === suggestion ? colors.primary : colors.textMain }}>
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="دلیل لغو (اختیاری)"
          placeholder="دلیل لغو نوبت را بنویسید..."
          value={reason}
          onChangeText={handleReasonChange}
          multiline
          maxLength={MAX_REASON_LENGTH}
          error={error}
        />
        
        {/* شمارنده کاراکتر */}
        <div className="flex justify-between items-center mt-1 px-1">
          <span className="text-[10px]" style={{ color: colors.textSecondary }}>
            {error ? '' : 'حداقل ۱۰ کاراکتر در صورت نوشتن دلیل'}
          </span>
          <span className="text-[10px]" style={{ color: colors.textSecondary }}>
            {toPersianDigit(reason.length)} / {toPersianDigit(MAX_REASON_LENGTH)}
          </span>
        </div>

        <div className="flex gap-2">
          <Button title="انصراف" onPress={onClose} variant="outline" size="md" className="flex-1 whitespace-nowrap" />
          <Button title={loading ? 'در حال لغو...' : 'تایید و لغو نوبت'} onPress={handleConfirm} loading={loading} variant="primary" size="md" className="flex-1 whitespace-nowrap" style={{ backgroundColor: '#E53935' }} />
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}