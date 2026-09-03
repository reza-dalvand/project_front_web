// src/components/manageBusiness/VerifyCodeModal.jsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiKey, FiX, FiAlertCircle, FiCheckCircle, FiInfo, FiPhone } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useToast } from '@/hooks/useToast';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import { toPersianDigit, toEnglishDigits } from '@/utils/numberUtils';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

const CODE_LENGTH = 4;

export default function VerifyCodeModal({
  visible,
  appointment,
  onClose,
  onConfirm,
  showCall = false,
  variant = 'orange',
}) {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const instanceId = useRef('verify-code-modal');
  const inputRefs = useRef([]);
  
  // ✅ FIX: تغییر نام state برای شفافیت بیشتر (اختیاری اما توصیه شده)
  const [code, setCode] = useState(['', '', '', '']); 
  const [currentBox, setCurrentBox] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && appointment) {
      setCode(['', '', '', '']);
      setCurrentBox(0);
      setError('');
      setLoading(false);
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

  const handleConfirm = async () => {
      const enteredCode = code.join('');
      
      if (enteredCode.length < CODE_LENGTH) {
        setError(`کد تایید ${toPersianDigit(CODE_LENGTH)} رقمی را کامل وارد کنید`);
        return;
      }

      setLoading(true);
      setError('');

      // ✅ فقط پاس دادن کد به والد — ارسال API اینجا انجام نمی‌شود
      onConfirm?.(appointment.id, enteredCode);
      setLoading(false);
  };
  

  const handleChange = (text, index) => {
    const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
    const newCode = [...code];

    // پشتیبانی از پیست کردن چند رقم
    if (cleaned.length > 1) {
      const digits = cleaned.slice(0, CODE_LENGTH).split('');
      digits.forEach((digit, i) => {
        if (index + i < CODE_LENGTH) newCode[index + i] = digit;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, CODE_LENGTH - 1);
      setCurrentBox(nextIndex);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    // ورود تک رقمی
    const digit = cleaned[0] || '';
    newCode[index] = digit;
    setCode(newCode);
    
    if (error) setError('');
    
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
      setCurrentBox(index + 1);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setCurrentBox(index - 1);
    }
  };

  const handleCall = () => {
    const phone = toEnglishDigits(appointment.customerPhone || '').replace(/[^0-9]/g, '');
    if (phone) {
      window.location.href = `tel:${phone}`;
    } else {
      showToast('شماره تماسی ثبت نشده است', 'error');
    }
  };

  const isComplete = code.join('').length === CODE_LENGTH;
  const confirmBg = variant === 'orange' ? '#FF9800' : '#43A047';

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-5"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-5 flex flex-col gap-4"
        style={{ backgroundColor: colors.cardBackground }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: confirmBg + '15' }}
            >
              <FiKey size={22} color={confirmBg} />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                تایید انجام خدمت
              </h3>
              <p className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                کد {toPersianDigit(CODE_LENGTH)} رقمی مشتری را وارد کنید
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={20} style={{ color: colors.textMain }} />
          </button>
        </div>

        {/* اطلاعات مشتری */}
        <div className="flex items-center gap-3 py-1">
          <Avatar name={appointment.customerName} size="md" />
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="text-sm font-[Vazir-Bold] truncate" style={{ color: colors.textMain }}>
              {appointment.customerName}
            </span>
            <span className="text-xs truncate" style={{ color: colors.textSecondary }}>
              {appointment.serviceName}
            </span>
          </div>
        </div>

        {/* ورودی کد */}
        <div className="py-2">
          <div className="flex justify-center gap-2.5" dir="ltr">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={toPersianDigit(digit)}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={() => setCurrentBox(index)}
                className="outline-none"
                style={{
                  width: '56px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: colors.cardBackground,
                  border: `2px solid ${
                    error && digit === ''
                      ? '#E53935'
                      : currentBox === index
                      ? colors.primary
                      : colors.border
                  }`,
                  color: colors.textMain,
                  fontSize: '24px',
                  fontFamily: "'Vazir-Bold', sans-serif",
                  textAlign: 'center',
                  lineHeight: '60px',
                  padding: 0,
                  direction: 'ltr',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* خطا */}
        {error && (
          <div
            className="flex items-center gap-2 p-3 rounded-xl border"
            style={{ backgroundColor: '#E5393508', borderColor: '#E5393530' }}
          >
            <FiAlertCircle size={14} color="#E53935" />
            <span className="text-xs font-[Vazir]" style={{ color: '#E53935' }}>
              {error}
            </span>
          </div>
        )}

        {/* دکمه‌ها */}
        <div className="flex flex-col gap-2.5 mt-1">
          <Button
            title={loading ? 'در حال تایید...' : 'تایید کد'}
            onPress={handleConfirm}
            loading={loading}
            disabled={!isComplete || loading}
            variant="primary"
            size="lg"
            fullWidth
            icon={<FiCheckCircle size={18} color="#fff" />}
            iconPosition="right"
            style={{ backgroundColor: confirmBg }}
          />
          {showCall && (
            <button
              onClick={handleCall}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 text-sm font-[Vazir-Bold] transition-all"
              style={{ borderColor: '#2196F3', color: '#2196F3' }}
            >
              <FiPhone size={16} color="#2196F3" />
              <span>تماس با مشتری</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}