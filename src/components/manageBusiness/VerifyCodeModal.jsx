'use client';
import { useState, useRef, useEffect } from 'react';
import { FiCheckCircle, FiInfo } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import { toPersianDigit, toEnglishDigits } from '@/utils/numberUtils';

const CODE_LENGTH = 4;

export default function VerifyCodeModal({ visible, appointment, onClose, onConfirm }) {
  const { colors } = useTheme();
  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (visible && appointment) {
      setCode(['', '', '', '']);
      setError('');
      setTimeout(() => inputRefs.current[0]?.focus(), 300);
    }
  }, [visible, appointment]);

  if (!visible || !appointment) return null;

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

  const handleConfirm = async () => {
    const enteredCode = code.join('');
    if (enteredCode.length < CODE_LENGTH) {
      setError(`کد تایید ${toPersianDigit(CODE_LENGTH)} رقمی را کامل وارد کنید`);
      return;
    }

    if (enteredCode !== appointment.verificationCode) {
      setError('کد وارد شده صحیح نیست. لطفاً از مشتری کد درست را بپرسید.');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    onConfirm(appointment.id);
    setLoading(false);
  };

  const isComplete = code.join('').length === CODE_LENGTH;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 flex flex-col gap-3"
        style={{ backgroundColor: colors.cardBackground }}
      >
        {/* هدر فشرده */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#43A04715' }}
          >
            <FiCheckCircle size={20} color="#43A047" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              تایید انجام خدمت
            </h3>
            <p className="text-[10px]" style={{ color: colors.textSecondary }}>
              کد تایید مشتری را وارد کنید
            </p>
          </div>
        </div>

        {/* اطلاعات مشتری فشرده */}
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

        {/* ورودی کد */}
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
              onKeyDown={(e) => handleKeyPress(e, index)}
              className="w-12 h-14 rounded-xl text-center text-xl font-[Vazir-Bold] outline-none transition-all"
              style={{
                backgroundColor: colors.background,
                borderColor:
                  error && digit === '' ? '#E53935' : digit ? colors.primary : colors.border,
                borderWidth: digit ? 2 : 1.5,
                color: colors.textMain,
              }}
            />
          ))}
        </div>

        {/* خطا */}
        {error && (
          <p className="text-center text-xs" style={{ color: '#E53935' }}>
            {error}
          </p>
        )}

        {/* راهنمای کد تست */}
        <div
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border"
          style={{
            backgroundColor: colors.primary + '10',
            borderColor: colors.primary + '30',
          }}
        >
          <FiInfo size={12} style={{ color: colors.primary }} />
          <span className="text-[10px]" style={{ color: colors.textSecondary }}>
            کد تایید این مشتری:{' '}
            <span className="font-[Vazir-Bold]" style={{ color: colors.primary }}>
              {toPersianDigit(appointment.verificationCode)}
            </span>
          </span>
        </div>

        {/* دکمه‌ها فشرده */}
        <div className="flex gap-2">
          <Button
            title="انصراف"
            onPress={onClose}
            variant="outline"
            size="md"
            className="flex-1 whitespace-nowrap"
          />
          <Button
            title={loading ? 'در حال تایید...' : 'تایید خدمت'}
            onPress={handleConfirm}
            loading={loading}
            disabled={!isComplete || loading}
            variant="primary"
            size="md"
            className="flex-1 whitespace-nowrap"
            style={{ backgroundColor: '#43A047' }}
          />
        </div>
      </div>
    </div>
  );
}
