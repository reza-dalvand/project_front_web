// src/components/manageBusiness/schedule/CalendarActions.jsx
'use client';
import { FiCheck, FiX } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function CalendarActions({ onSelectAll, onClearAll }) {
  const { colors } = useTheme();

  return (
    <div className="flex gap-2">
      <button
        onClick={onSelectAll}
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-[Vazir-Bold] transition-all"
        style={{
          backgroundColor: colors.primary + '10',
          borderColor: colors.primary + '40',
          color: colors.primary,
        }}
      >
        <FiCheck size={14} />
        انتخاب کل ماه
      </button>
      <button
        onClick={onClearAll}
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-[Vazir-Bold] transition-all"
        style={{
          backgroundColor: '#E5393510',
          borderColor: '#E5393540',
          color: '#E53935',
        }}
      >
        <FiX size={14} />
        پاک کردن همه
      </button>
    </div>
  );
}
