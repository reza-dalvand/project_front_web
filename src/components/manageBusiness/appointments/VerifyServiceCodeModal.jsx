'use client';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiKey, FiPhone, FiX, FiAlertCircle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Avatar from '@/components/common/Avatar';
import { toPersianDigit, toEnglishDigits } from '@/utils/numberUtils';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

const CODE_LENGTH = 4;

export default function VerifyServiceCodeModal({ visible, appointment, onClose, onConfirm }) {
  const { colors } = useTheme();
  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const instanceId = useRef('verify-service-code-modal');

  // ریست هنگام باز شدن
  useEffect(() => {
    if (visible && appointment) {
      setCode(['', '', '', '']);
      setError('');
      setLoading(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 300);
    }
  }, [visible, appointment]);

  // قفل اسکرول
  useEffect(() => {
    if (visible) acquireScrollLock(instanceId.current);
    else releaseScrollLock(instanceId.current);
    return () => releaseScrollLock(instanceId.current);
  }, [visible]);

  // بستن با Escape
  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  if (!visible || !appointment) return null;

  // هندلر ورود کد
  const handleChange = (text, index) => {
    const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
    const newCode = [...code];

    if (cleaned.length > 1) {
      const digits = cleaned.slice(0, CODE_LENGTH).split('');
      digits.forEach((digit, i) => {
        if (index + i < CODE_LENGTH) newCode[index + i] = digit;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, CODE_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
      setError('');
      return;
    }

    const digit = cleaned[0] || '';
    newCode[index] = digit;
    setCode(newCode);
    setError('');

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // تایید کد
  const handleConfirm = async () => {
    const enteredCode = code.join('');
    if (enteredCode.length < CODE_LENGTH) {
      setError('کد تایید ۴ رقمی را کامل وارد کنید');
      return;
    }

    setLoading(true);
    setError('');

    // شبیه‌سازی تاخیر API
    await new Promise((r) => setTimeout(r, 800));

    if (enteredCode === appointment.verificationCode) {
      onConfirm(appointment.id);
    } else {
      setError('کد وارد شده صحیح نیست. لطفاً از مشتری کد درست را بپرسید.');
      setCode(['', '', '', '']);
      setLoading(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  };

  // تماس با مشتری
  const handleCall = () => {
    const phone = toEnglishDigits(appointment.customerPhone || '').replace(/[^0-9]/g, '');
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const isComplete = code.join('').length === CODE_LENGTH;

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-5"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-3xl p-6 flex flex-col gap-4"
        style={{ backgroundColor: colors.cardBackground }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-11 h-11 rounded-[14px] flex items-center justify-center"
              style={{ backgroundColor: '#FF980015' }}
            >
              <FiKey size={22} color="#FF9800" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                وارد کردن کد تایید خدمت
              </h3>
              <p className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                کد ۴ رقمی مشتری را وارد کنید
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={20} style={{ color: colors.textMain }} />
          </button>
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

        {/* ورودی کد ۴ رقمی */}
        <div className="flex justify-center gap-3 py-2" dir="ltr">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={toPersianDigit(digit)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyPress(e, index)}
              className="w-14 h-16 rounded-2xl text-center text-2xl font-[Vazir-Bold]
                outline-none transition-all"
              style={{
                backgroundColor: colors.background,
                borderColor: error && digit === '' ? '#E53935' : digit ? '#FF9800' : colors.border,
                borderWidth: digit ? 2 : 1.5,
                color: colors.textMain,
              }}
            />
          ))}
        </div>

        {/* پیام خطا */}
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
        <div className="flex flex-col gap-3 mt-2">
          {/* دکمه تایید کد */}
          <button
            onClick={handleConfirm}
            disabled={!isComplete || loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl
              text-sm font-[Vazir-Bold] transition-all hover:scale-[1.01] active:scale-[0.99]
              disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#43A047', color: '#fff' }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiKey size={16} color="#fff" />
            )}
            <span>{loading ? 'در حال تایید...' : 'تایید کد'}</span>
          </button>

          {/* دکمه تماس با مشتری */}
          <button
            onClick={handleCall}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl
              border-2 text-sm font-[Vazir-Bold] transition-all
              hover:scale-[1.01] active:scale-[0.99]"
            style={{ borderColor: '#2196F3', color: '#2196F3' }}
          >
            <FiPhone size={16} color="#2196F3" />
            <span>تماس با مشتری</span>
          </button>
        </div>

        {/* راهنمای کد تست */}
        <div
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border"
          style={{ backgroundColor: colors.primary + '08', borderColor: colors.primary + '25' }}
        >
          <span className="text-xs font-[Vazir]" style={{ color: colors.primary }}>
            حالت آزمایشی: کد تایید{' '}
            <span className="font-[Vazir-Bold]">
              {toPersianDigit(appointment.verificationCode)}
            </span>{' '}
            است
          </span>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}