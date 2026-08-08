'use client';
import { FiArrowRight, FiHome, FiFilter } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

export default function AllLineRentalsHeader({
  adsCount = 0,
  onFilterPress,
  hasActiveFilter = false,
}) {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <div
      className="rounded-b-[24px] pb-6 px-5"
      style={{
        backgroundColor: '#667eea',
        paddingTop: '20px',
      }}
    >
      <div className="flex items-center gap-3">
        {/* دکمه بازگشت */}
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl flex items-center justify-center
            transition-colors hover:opacity-80"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        >
          <FiArrowRight size={22} color="#fff" />
        </button>

        {/* عنوان */}
        <div className="flex-1 flex items-center gap-2.5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
          >
            <FiHome size={24} color="#667eea" />
          </div>
          <div>
            <span className="text-[11px] text-white/80 block">فرصت‌های همکاری</span>
            <h1 className="text-[17px] font-[Vazir-Bold] text-white">اجاره لاین کسب و کار</h1>
          </div>
        </div>

        {/* Badge تعداد */}
        <div className="flex items-center gap-2">
          {/* Badge تعداد آگهی‌ها */}
          <div
            className="min-w-[40px] h-10 rounded-xl flex items-center justify-center px-2 border"
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderColor: 'rgba(255,255,255,0.15)',
            }}
          >
            <span className="text-[15px] font-[Vazir-Bold] text-white">
              {toPersianDigit(adsCount)}
            </span>
          </div>

          {/* دکمه فیلتر */}
          {onFilterPress && (
            <button
              onClick={onFilterPress}
              className="w-10 h-10 rounded-xl flex items-center justify-center
                relative border transition-colors hover:opacity-80"
              style={{
                backgroundColor: hasActiveFilter
                  ? 'rgba(255,255,255,0.32)'
                  : 'rgba(255,255,255,0.2)',
                borderColor: 'rgba(255,255,255,0.15)',
              }}
            >
              <FiFilter size={20} color="#fff" />
              {hasActiveFilter && (
                <div
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full
                    border-[1.5px]"
                  style={{
                    backgroundColor: '#FFD700',
                    borderColor: 'rgba(0,0,0,0.15)',
                  }}
                />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
