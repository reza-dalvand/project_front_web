// src/components/profile/edit/PhoneSection.jsx
'use client';
import { FiSmartphone } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import { toPersianDigit } from '@/utils/numberUtils';
import { maskPhone } from '@/utils/phoneUtils';

export default function PhoneSection({ phone, onChangePhonePress }) {
  const { colors } = useTheme();

  return (
    <Card variant="elevated" padding={20} radius={18}>
      <div className="flex items-center gap-2 mb-5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#2196F318' }}
        >
          <FiSmartphone size={16} color="#2196F3" />
        </div>
        <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
          شماره موبایل
        </span>
      </div>
      <div
        className="flex items-center gap-3 p-3.5 rounded-xl border"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border,
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#2196F320' }}
        >
          <FiSmartphone size={14} color="#2196F3" />
        </div>
        <span className="text-sm font-[Vazir-Bold] flex-1" style={{ color: colors.textMain }}>
          {toPersianDigit(maskPhone(phone || '09123456789'))}
        </span>
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-lg"
          style={{ backgroundColor: '#43A04720' }}
        >
          <span className="text-[10px] font-[Vazir-Bold]" style={{ color: '#43A047' }}>
            تایید شده
          </span>
        </div>
      </div>
      <button
        onClick={onChangePhonePress}
        className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
        style={{
          borderColor: colors.primary,
          backgroundColor: colors.primary + '10',
        }}
      >
        <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.primary }}>
          تغییر شماره موبایل
        </span>
      </button>
    </Card>
  );
}
