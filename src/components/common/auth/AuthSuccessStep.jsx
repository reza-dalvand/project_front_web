// src/components/common/auth/AuthSuccessStep.jsx
'use client';
import { FiCheck } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

export default function AuthSuccessStep() {
  const { colors } = useTheme();

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
        style={{ backgroundColor: '#4CAF50' }}
      >
        <FiCheck size={50} style={{ color: '#fff' }} />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-[Vazir-Bold]" style={{ color: colors.textMain }}>
          خوش آمدید! 🎉
        </h3>
        <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
          ورود شما با موفقیت انجام شد
        </p>
      </div>
    </div>
  );
}