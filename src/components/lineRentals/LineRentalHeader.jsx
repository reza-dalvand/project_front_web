// src/components/lineRentals/LineRentalHeader.jsx
'use client';
import { FiArrowRight } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { toPersianDigit } from '@/utils/numberUtils';

export default function LineRentalHeader({ count }) {
  const router = useRouter();

  return (
    <div className="rounded-b-3xl pb-6 pt-4 px-5" style={{ backgroundColor: '#667eea' }}>
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        >
          <FiArrowRight size={22} color="#fff" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
            style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
          >
            <span className="text-2xl">🏢</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-white/80 font-[Vazir]">فرصت‌های همکاری</span>
            <h1 className="text-md font-[Vazir-Bold] text-white">اجاره لاین</h1>
          </div>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        >
          <span className="text-sm font-[Vazir-Bold] text-white">
            {toPersianDigit(count)}
          </span>
        </div>
      </div>
    </div>
  );
}