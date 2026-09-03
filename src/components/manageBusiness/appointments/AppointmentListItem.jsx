// src/components/manageBusiness/appointments/AppointmentListItem.jsx
'use client';
import { useState } from 'react';
import { FiKey, FiChevronLeft, FiCheckCircle, FiShield } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

const STATUS_META = {
  reserved: {
    label: 'تایید شده',
    color: '#43A047',
    bg: '#43A04712',
    border: '#43A04750',
  },
  confirmed: {
    label: 'اعتمادی',
    color: '#2196F3',
    bg: '#2196F312',
    border: '#2196F350',
  },
  pending_verification: {
    label: 'نیاز به کد',
    color: '#FF9800',
    bg: '#FF980008',
    border: '#FF9800',
  },
};

export default function AppointmentListItem({
  appointment,
  onPress,
  onVerifyCode,
  onTrustConfirm,
}) {
  const { colors } = useTheme();
  const [codeInput, setCodeInput] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const status = STATUS_META[appointment.status] || STATUS_META.reserved;
  const needsCode = appointment.status === 'pending_verification';
  const isTrust = appointment.status === 'confirmed';

  const handleVerify = async () => {
    if (codeInput.length < 4) return;
    setVerifying(true);
    const success = await onVerifyCode?.(appointment.id, codeInput);
    setVerifying(false);
    if (success) {
      setCodeInput('');
      setShowCodeInput(false);
    }
  };

  const handleTrust = async () => {
    setVerifying(true);
    await onTrustConfirm?.(appointment.id);
    setVerifying(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleVerify();
  };

  return (
    <div
      className={`flex-shrink-0 w-[155px] flex flex-col gap-1.5 p-3 rounded-2xl border-2
        transition-all duration-200 select-none
        ${needsCode ? 'cursor-pointer hover:shadow-md' : ''}`}
      style={{
        backgroundColor: status.bg,
        borderColor: needsCode ? status.border : status.border + '80',
        boxShadow: needsCode ? '0 2px 8px rgba(255, 152, 0, 0.15)' : 'none',
      }}
      onClick={() => {
        if (needsCode && !showCodeInput) {
          setShowCodeInput(true);
        } else {
          onPress?.(appointment);
        }
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (needsCode && !showCodeInput) setShowCodeInput(true);
          else onPress?.(appointment);
        }
      }}
    >
      {/* ساعت + نقطه وضعیت */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-[Vazir-Bold]" style={{ color: status.color }}>
          {appointment.time}
        </span>
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
      </div>

      {/* نام مشتری */}
      <span
        className="text-xs font-[Vazir-Bold] line-clamp-1"
        style={{ color: colors.textMain }}
      >
        {appointment.customerName}
      </span>

      {/* نام خدمت */}
      <span
        className="text-[10px] font-[Vazir] line-clamp-1"
        style={{ color: colors.textSecondary }}
      >
        {appointment.serviceName}
      </span>

      {/* برچسب وضعیت */}
      <div
        className="self-start px-2 py-0.5 rounded-lg"
        style={{ backgroundColor: status.color + '20' }}
      >
        <span className="text-[9px] font-[Vazir-Bold]" style={{ color: status.color }}>
          {status.label}
        </span>
      </div>

      {/* ─── بخش نیاز به کد ─── */}
      {needsCode && (
        <div className="mt-1">
          {showCodeInput ? (
            <div className="flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.replace(/[^0-9۰-۹]/g, ''))}
                onKeyDown={handleKeyDown}
                placeholder="کد ۴ رقمی"
                autoFocus
                className="w-full h-8 px-2 rounded-lg border text-center text-xs font-[Vazir-Bold] outline-none"
                style={{
                  borderColor: status.border,
                  backgroundColor: colors.cardBackground,
                  color: colors.textMain,
                  direction: 'ltr',
                }}
              />
              <button
                onClick={handleVerify}
                disabled={codeInput.length < 4 || verifying}
                className="w-full py-1.5 rounded-lg text-[10px] font-[Vazir-Bold] text-white
                  transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: verifying ? '#9E9E9E' : '#FF9800' }}
              >
                {verifying ? 'در حال تایید...' : 'تایید کد'}
              </button>
            </div>
          ) : (
            <div
              className="flex items-center justify-center gap-1 mt-1 py-1.5 px-2 rounded-lg w-full"
              style={{ backgroundColor: '#FF9800' }}
            >
              <FiKey size={11} color="#fff" />
              <span className="text-[9px] font-[Vazir-Bold] text-white">
                وارد کردن کد
              </span>
              <FiChevronLeft size={11} color="#fff" />
            </div>
          )}
        </div>
      )}

      {/* ─── بخش اعتمادی: دکمه تایید ─── */}
      {isTrust && (
        <div className="mt-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleTrust}
            disabled={verifying}
            className="w-full flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg
              text-[9px] font-[Vazir-Bold] text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: verifying ? '#9E9E9E' : '#2196F3' }}
          >
            <FiShield size={11} color="#fff" />
            {verifying ? 'در حال تایید...' : 'تایید بدون کد'}
          </button>
        </div>
      )}

      {/* ─── بخش تایید شده ─── */}
      {appointment.status === 'reserved' && (
        <div
          className="flex items-center justify-center gap-1 mt-1 py-1.5 px-2 rounded-lg w-full"
          style={{ backgroundColor: '#43A04718' }}
        >
          <FiCheckCircle size={11} color="#43A047" />
          <span className="text-[9px] font-[Vazir-Bold]" style={{ color: '#43A047' }}>
            بدون نیاز به کد
          </span>
        </div>
      )}
    </div>
  );
}