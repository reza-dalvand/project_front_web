'use client';

import { FiUsers, FiStar, FiCheck } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Avatar from '@/components/common/Avatar';
import { toPersianDigit } from '@/utils/numberUtils';

const ROLE_ICONS = {
  ناخن‌کار: '💅',
  آرایشگر: '💄',
  'متخصص پوست': '🧖‍♀️',
  لیزر: '⚡',
  میکاپ: '✨',
  default: '👤',
};

const ROLE_COLORS = {
  ناخن‌کار: '#E91E63',
  آرایشگر: '#9C27B0',
  'متخصص پوست': '#4CAF50',
  لیزر: '#2196F3',
  میکاپ: '#FF9800',
  default: '#607D8B',
};

export default function EmployeeSelector({ employees = [], selectedId, onSelect }) {
  const { colors } = useTheme();

  return (
    <div className="flex flex-col gap-3.5 mb-6">
      {/* هدر */}
      <div className="flex items-center gap-2 px-1">
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center"
          style={{ backgroundColor: colors.primary + '15' }}
        >
          <FiUsers size={18} style={{ color: colors.primary }} />
        </div>
        <span className="text-[15px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
          انتخاب کارمند
        </span>
        <div className="flex-1" />
        <span className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
          {toPersianDigit(employees.length)} نفر
        </span>
      </div>

      {/* اسکرول افقی کارمندان */}
      <div className="flex gap-3 overflow-x-auto px-1 pb-1 scrollbar-hide">
        {employees.map((emp) => {
          const isSelected = selectedId === emp.id;
          const roleColor = ROLE_COLORS[emp.role] || ROLE_COLORS.default;
          const roleIcon = ROLE_ICONS[emp.role] || ROLE_ICONS.default;

          return (
            <button
              key={emp.id}
              onClick={() => onSelect(emp.id)}
              className="relative flex flex-col items-center gap-2.5 p-3.5 pt-4 rounded-[20px] border w-[135px] flex-shrink-0 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                borderColor: isSelected ? colors.primary : colors.border,
                backgroundColor: isSelected ? colors.primary + '08' : colors.cardBackground,
                borderWidth: isSelected ? 2 : 1,
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              }}
            >
              {/* Badge انتخاب */}
              {isSelected && (
                <div
                  className="absolute top-2.5 left-2.5 w-[22px] h-[22px] rounded-full flex items-center justify-center z-10 border-2"
                  style={{
                    backgroundColor: colors.primary,
                    borderColor: '#fff',
                  }}
                >
                  <FiCheck size={14} color="#fff" />
                </div>
              )}

              {/* آواتار با آیکون نقش */}
              <div className="relative mb-2.5">
                <Avatar name={emp.name} size="lg" showBorder={isSelected} />
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 z-[1]"
                  style={{
                    backgroundColor: roleColor + '25',
                    borderColor: '#fff',
                  }}
                >
                  <span className="text-xs">{roleIcon}</span>
                </div>
              </div>

              <span
                className="text-[13px] font-[Vazir-Bold] text-center truncate w-full"
                style={{ color: colors.textMain }}
              >
                {emp.name}
              </span>
              <span
                className="text-[11px] font-[Vazir-Medium] text-center truncate w-full"
                style={{ color: roleColor }}
              >
                {emp.role}
              </span>

              {/* سابقه کار */}
              <div
                className="flex items-center gap-1 mt-2.5 pt-2 border-t w-full justify-center"
                style={{ borderColor: colors.border }}
              >
                <FiStar size={11} color="#FFC107" />
                <span className="text-[10px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                  {emp.experience}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
