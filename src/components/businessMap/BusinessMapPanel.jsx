// src/components/businessMap/BusinessMapPanel.jsx
'use client';
import { FiMapPin, FiCopy, FiCheck, FiPhone, FiShare2 } from 'react-icons/fi';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit } from '@/utils/numberUtils';

export default function BusinessMapPanel({
  business,
  copied,
  onCopyAddress,
  onNavigation,
  onCall,
  onShare,
}) {
  const { colors } = useTheme();

  return (
    <div
      className="border-t p-5 space-y-4"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      <Card variant="default" padding={14} radius={16}>
        <div className="flex items-start gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: colors.primary + '18' }}
          >
            <FiMapPin size={22} style={{ color: colors.primary }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-[Vazir-Bold] mb-1" style={{ color: colors.textMain }}>
              {business.name}
            </h3>
            <p className="text-xs font-[Vazir] leading-5" style={{ color: colors.textSecondary }}>
              {business.address}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className="text-[10px] font-[Vazir-Bold] px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: colors.primary + '15',
                  color: colors.primary,
                }}
              >
                {business.category}
              </span>
            </div>
          </div>
          <button
            onClick={onCopyAddress}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: copied ? '#43A04718' : colors.primary + '10',
            }}
          >
            {copied ? (
              <FiCheck size={18} color="#43A047" />
            ) : (
              <FiCopy size={18} style={{ color: colors.primary }} />
            )}
          </button>
        </div>
        <div
          className="flex items-center gap-2 mt-3 pt-3 border-t"
          style={{ borderColor: colors.border }}
        >
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            📍 مختصات:
          </span>
          <span
            className="text-[11px] font-[Vazir] font-mono"
            style={{
              color: colors.textSecondary,
              direction: 'ltr',
            }}
          >
            {toPersianDigit(business.location.latitude.toFixed(4))}°N,{' '}
            {toPersianDigit(business.location.longitude.toFixed(4))}°E
          </span>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button
          title="مسیریابی"
          onPress={onNavigation}
          variant="primary"
          size="lg"
          className="flex-[2]"
          style={{ backgroundColor: '#43A047' }}
        />
        <button
          onClick={onCall}
          className="flex-1 h-14 rounded-2xl flex items-center justify-center border-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            backgroundColor: '#2196F315',
            borderColor: '#2196F3',
          }}
        >
          <div className="flex flex-col items-center gap-0.5">
            <FiPhone size={20} color="#2196F3" />
            <span className="text-[10px] font-[Vazir-Bold]" style={{ color: '#2196F3' }}>
              تماس
            </span>
          </div>
        </button>
        <button
          onClick={onShare}
          className="flex-1 h-14 rounded-2xl flex items-center justify-center border-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            borderColor: colors.primary,
            backgroundColor: colors.primary + '10',
          }}
        >
          <div className="flex flex-col items-center gap-0.5">
            <FiShare2 size={18} style={{ color: colors.primary }} />
            <span className="text-[10px] font-[Vazir-Bold]" style={{ color: colors.primary }}>
              اشتراک
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}