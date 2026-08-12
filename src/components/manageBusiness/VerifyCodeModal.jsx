// src/components/manageBusiness/VerifyCodeModal.jsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  FiKey,
  FiPhone,
  FiX,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiShield,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useToast } from '@/hooks/useToast';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import OTPInput from '@/components/common/OTPInput';
import { toPersianDigit, toEnglishDigits } from '@/utils/numberUtils';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';
// ═══════ فاز ۲: لایه API ═══════
import { appointmentsService } from '@/api';
import { USE_MOCK } from '@/api/config';

const CODE_LENGTH = 4; // ✅ هماهنگ با بک‌اند: verification_code CharField(max_length=4)

/**
 * کامپوننت واحد تایید کد خدمت
 *
 * @param {boolean}  visible      - وضعیت نمایش
 * @param {object}   appointment  - داده نوبت
 * @param {function} onClose      - بستن مودال
 * @param {function} onConfirm    - تایید موفق (appointmentId) => void
 * @param {boolean}  showCall     - نمایش دکمه تماس با مشتری
 * @param {boolean}  usePortal    - رندر با پورتال (پیش‌فرض: true)
 * @param {'orange'|'primary'} variant - رنگ‌بندی دکمه تایید
 */
export default function VerifyCodeModal({
  visible,
  appointment,
  onClose,
  onConfirm,
  showCall = false,
  usePortal = true,
  variant = 'orange',
}) {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const [code, setCode] = useState(['', '', '', '']);
  const [currentBox, setCurrentBox] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const instanceId = useRef('verify-code-modal');

  // ─── ریست هنگام باز شدن ───
  useEffect(() => {
    if (visible && appointment) {
      setCode(['', '', '', '']);
      setCurrentBox(0);
      setError('');
      setLoading(false);
    }
  }, [visible, appointment]);

  // ─── قفل اسکرول ───
  useEffect(() => {
    if (visible) acquireScrollLock(instanceId.current);
    else releaseScrollLock(instanceId.current);
    return () => releaseScrollLock(instanceId.current);
  }, [visible]);

  // ─── بستن با Escape ───
  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  if (!visible || !appointment) return null;

  // ─── تایید کد — هماهنگ با بک‌اند ═══════
  const handleConfirm = async () => {
    const enteredCode = code.join('');
    if (enteredCode.length < CODE_LENGTH) {
      setError(`کد تایید ${toPersianDigit(CODE_LENGTH)} رقمی را کامل وارد کنید`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!USE_MOCK) {
        // در آینده: فراخوانی واقعی API
        // POST /appointments/{pk}/verify-code/
        await appointmentsService.verifyServiceCode(appointment.id, enteredCode);
      } else {
        // حالت Mock — بررسی محلی کد
        await new Promise((r) => setTimeout(r, 1200));
        if (enteredCode !== appointment.verificationCode) {
          setError('کد وارد شده صحیح نیست. لطفاً از مشتری کد درست را بپرسید.');
          setCode(['', '', '', '']);
          setCurrentBox(0);
          setLoading(false);
          setTimeout(() => inputRefs.current[0]?.focus(), 100);
          return;
        }
      }

      setLoading(false);
      onConfirm?.(appointment.id, enteredCode);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'خطا در تایید کد');
      showToast(err.message || 'خطا در تایید کد', 'error');
    }
  };

  // ─── تماس با مشتری ───
  const handleCall = () => {
    const phone = toEnglishDigits(appointment.customerPhone || '').replace(/[^0-9]/g, '');
    if (phone) {
      window.location.href = `tel:${phone}`;
    } else {
      showToast('شماره تماسی ثبت نشده است', 'error');
    }
  };

  const isComplete = code.join('').length === CODE_LENGTH;

  // ─── رنگ دکمه تایید ───
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
        {/* ═══ هدر ═══ */}
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

        {/* ═══ اطلاعات مشتری ═══ */}
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

        {/* ═══ ورودی کد — کامپوننت مشترک OTPInput ═══ */}
        <div className="py-2">
          <OTPInput
            value={code}
            onChange={(newCode) => {
              setCode(newCode);
              if (error) setError('');
            }}
            length={CODE_LENGTH}
            error={error}
            currentBox={currentBox}
            onCurrentBoxChange={setCurrentBox}
          />
        </div>

        {/* ═══ پیام خطا ═══ */}
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

        {/* ═══ راهنمای کد تست ═══ */}
        {USE_MOCK && (
          <div
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border"
            style={{
              backgroundColor: colors.primary + '08',
              borderColor: colors.primary + '25',
            }}
          >
            <FiInfo size={12} style={{ color: colors.primary }} />
            <span className="text-[10px]" style={{ color: colors.textSecondary }}>
              حالت آزمایشی: کد{' '}
              <span className="font-[Vazir-Bold]" style={{ color: colors.primary }}>
                {toPersianDigit(appointment.verificationCode)}
              </span>{' '}
              است
            </span>
          </div>
        )}

        {/* ═══ دکمه‌ها ═══ */}
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
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 text-sm font-[Vazir-Bold] transition-all hover:scale-[1.01] active:scale-[0.99]"
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

  if (usePortal) {
    return createPortal(content, document.body);
  }
  return content;
}
