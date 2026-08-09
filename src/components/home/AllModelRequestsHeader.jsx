'use client';
import { FiArrowRight, FiFilter } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { toPersianDigit } from '@/utils/numberUtils';

export default function AllModelRequestsHeader({
  requestsCount = 0,
  onFilterPress,
  hasActiveFilter = false,
}) {
  const router = useRouter();

  return (
    <div className="rounded-b-3xl pb-6 pt-4 px-5" style={{ backgroundColor: '#E91E63' }}>
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl flex items-center justify-center
            transition-transform hover:scale-105"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        >
          <FiArrowRight size={22} color="#fff" />
        </button>

        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
            style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
          >
            <span className="text-2xl">👤</span>
          </div>
          <div className="flex flex-col gap-0.5">
            {/* <span className="text-xs text-white/80 font-[Vazir]">لیست درخواست مدل</span> */}
            <h1 className="text-md font-[Vazir-Bold] text-white">فرصت‌های مدلینگ </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <span className="text-sm font-[Vazir-Bold] text-white">
              {toPersianDigit(requestsCount)}
            </span>
          </div>
          {onFilterPress && (
            <button
              onClick={onFilterPress}
              className="w-10 h-10 rounded-xl flex items-center justify-center
                relative"
              style={{
                backgroundColor: hasActiveFilter
                  ? 'rgba(255,255,255,0.32)'
                  : 'rgba(255,255,255,0.2)',
              }}
            >
              <FiFilter size={20} color="#fff" />
              {hasActiveFilter && (
                <div
                  className="absolute top-2 right-2 w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#FFD700' }}
                />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
