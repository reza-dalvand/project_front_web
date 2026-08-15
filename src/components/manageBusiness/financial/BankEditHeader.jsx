// src/components/manageBusiness/financial/BankEditHeader.jsx
'use client';
import { FiX } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function BankEditHeader({ onClose }) {
  const { colors } = useTheme();

  return (
    <div
      className="flex items-center justify-between px-5 py-4 border-b"
      style={{ borderColor: colors.border }}
    >
      <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
        ثبت حساب بانکی تسویه
      </h3>
      <button
        onClick={onClose}
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <FiX size={20} style={{ color: colors.textMain }} />
      </button>
    </div>
  );
}
