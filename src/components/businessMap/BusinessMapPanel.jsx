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

  const lat = parseFloat(business?.location?.latitude ?? business?.latitude ?? 0);
  const lng = parseFloat(business?.location?.longitude ?? business?.longitude ?? 0);

  return (
    <div
      className="border-t shrink-0 flex flex-col max-h-[52dvh] sm:max-h-[42dvh]"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      {/* بخش اطلاعات: در صورت بلندی اسکرول می‌شود */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-3 sm:space-y-4">
        <Card variant="default" padding={14} radius={16}>
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: colors.primary + '18' }}
            >
              <FiMapPin size={20} style={{ color: colors.primary }} />
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className="text-sm font-[Vazir-Bold] mb-1 break-words"
                style={{ color: colors.textMain }}
              >
                {business.name}
              </h3>

              <p
                className="text-xs font-[Vazir] leading-5 break-words"
                style={{ color: colors.textSecondary }}
              >
                {business.address}
              </p>

              <div className="flex items-center gap-2 mt-2 flex-wrap">
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
              aria-label="کپی آدرس"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 active:scale-95 touch-manipulation"
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
            className="flex items-center gap-2 mt-3 pt-3 border-t flex-wrap"
            style={{ borderColor: colors.border }}
          >
            <span
              className="text-[11px] sm:text-xs"
              style={{ color: colors.textSecondary }}
            >
              📍 مختصات:
            </span>

            <span
              className="text-[10px] sm:text-[11px] font-[Vazir] font-mono break-all"
              style={{
                color: colors.textSecondary,
                direction: 'ltr',
              }}
            >
              {toPersianDigit(lat.toFixed(4))}°N, {toPersianDigit(lng.toFixed(4))}°E
            </span>
          </div>
        </Card>
      </div>

      {/* بخش دکمه‌ها: همیشه پایین پنل ثابت می‌ماند */}
      <div
        className="shrink-0 border-t px-4 sm:px-5 py-3 sm:py-4"
        style={{
          borderColor: colors.border,
          backgroundColor: colors.cardBackground,
        }}
      >
        <div className="flex gap-2 sm:gap-3 items-stretch">
          <Button
            title="مسیریابی"
            onPress={onNavigation}
            variant="primary"
            size="lg"
            className="flex-[2] min-w-0"
            style={{ backgroundColor: '#43A047' }}
          />

          <button
            onClick={onCall}
            aria-label="تماس"
            className="flex-1 min-w-0 h-12 sm:h-14 rounded-2xl flex items-center justify-center border-2 transition-all hover:scale-[1.02] active:scale-[0.98] touch-manipulation"
            style={{
              backgroundColor: '#2196F315',
              borderColor: '#2196F3',
            }}
          >
            <div className="flex flex-col items-center gap-0.5">
              <FiPhone size={18} color="#2196F3" />
              <span
                className="text-[9px] sm:text-[10px] font-[Vazir-Bold]"
                style={{ color: '#2196F3' }}
              >
                تماس
              </span>
            </div>
          </button>

          <button
            onClick={onShare}
            aria-label="اشتراک"
            className="flex-1 min-w-0 h-12 sm:h-14 rounded-2xl flex items-center justify-center border-2 transition-all hover:scale-[1.02] active:scale-[0.98] touch-manipulation"
            style={{
              borderColor: colors.primary,
              backgroundColor: colors.primary + '10',
            }}
          >
            <div className="flex flex-col items-center gap-0.5">
              <FiShare2 size={18} style={{ color: colors.primary }} />
              <span
                className="text-[9px] sm:text-[10px] font-[Vazir-Bold]"
                style={{ color: colors.primary }}
              >
                اشتراک
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}