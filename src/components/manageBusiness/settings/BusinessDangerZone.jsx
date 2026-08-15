// src/components/manageBusiness/settings/BusinessDangerZone.jsx
'use client';
import { FiTrash2 } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';

export default function BusinessDangerZone({ onDeletePress }) {
  const { colors } = useTheme();

  return (
    <div className="pt-6">
      <Card
        variant="default"
        padding={0}
        radius={16}
        className="border-2 overflow-hidden"
        style={{ borderColor: '#E5393540', backgroundColor: '#E5393508' }}
      >
        <div className="p-4 flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#E5393520' }}
          >
            <FiTrash2 size={22} color="#E53935" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-[Vazir-Bold] block" style={{ color: '#E53935' }}>
              حذف کسب و کار
            </p>
            <p
              className="text-[11px] font-[Vazir] leading-4"
              style={{ color: colors.textSecondary }}
            >
              حذف دائمی کسب‌وکار و تمام اطلاعات مرتبط
            </p>
          </div>
        </div>
        <button
          onClick={onDeletePress}
          className="w-full py-3.5 border-t transition-colors hover:bg-[#E5393508]"
          style={{ borderColor: '#E5393540' }}
        >
          <span className="text-sm font-[Vazir-Bold]" style={{ color: '#E53935' }}>
            حذف کسب و کار
          </span>
        </button>
      </Card>
    </div>
  );
}