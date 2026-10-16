// src/components/profile/edit/DangerZone.jsx
'use client';
import { FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';

export default function DangerZone({ onDeletePress }) {
  const { colors } = useTheme();

  return (
    <Card
      variant="default"
      padding={0}
      radius={22}
      className="relative overflow-hidden"
      style={{ borderColor: '#E5393530' }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: '#E53935' }}
        aria-hidden="true"
      />

      <div className="p-5">
        <div className="flex items-start gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#E5393515' }}
          >
            <FiAlertTriangle size={19} color="#E53935" />
          </div>

          <div className="flex-1 min-w-0">
            <span
              className="text-sm font-[Vazir-Bold] block"
              style={{ color: '#E53935' }}
            >
              حذف حساب کاربری
            </span>
            <span
              className="text-[11px] font-[Vazir] leading-5 block mt-1"
              style={{ color: colors.textSecondary }}
            >
              با حذف حساب، تمام اطلاعات، نوبت‌ها و علاقه‌مندی‌های شما به‌صورت دائمی پاک می‌شود.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onDeletePress}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-2xl border transition-all hover:bg-[#E5393508] active:scale-[0.99]"
          style={{
            borderColor: '#E5393535',
            backgroundColor: 'transparent',
          }}
        >
          <FiTrash2 size={16} color="#E53935" />
          <span
            className="text-sm font-[Vazir-Bold]"
            style={{ color: '#E53935' }}
          >
            حذف حساب کاربری
          </span>
        </button>
      </div>
    </Card>
  );
}