// src/components/home/search/DistanceFilterSheet.jsx
'use client';
import { useState, useEffect } from 'react';
import { FiMapPin, FiCheck, FiNavigation } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import BottomSheet from '@/components/common/BottomSheet';
import Button from '@/components/common/Button';
import { formatDistance } from '@/utils/geo-utils';

/**
 * باتم‌شیت فیلتر فاصله
 *
 * @param {boolean}  visible       - وضعیت نمایش
 * @param {function} onClose       - بستن
 * @param {function} onApply       - اعمال فیلتر (value: number | null)
 * @param {number}   currentFilter - فیلتر فعلی
 * @param {Array}    options       - گزینه‌های فاصله
 * @param {object}   userLocation  - موقعیت کاربر { latitude, longitude }
 */
export default function DistanceFilterSheet({
  visible,
  onClose,
  onApply,
  currentFilter,
  options,
  userLocation,
}) {
  const { colors } = useTheme();
  const [selected, setSelected] = useState(currentFilter);

  useEffect(() => {
    if (visible) {
      setSelected(currentFilter);
    }
  }, [visible, currentFilter]);

  const handleApply = () => {
    onApply(selected);
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="فیلتر فاصله"
      snapPoint={0.5}
      footer={
        <Button
          title="اعمال فیلتر"
          onPress={handleApply}
          variant="primary"
          size="lg"
          fullWidth
          icon={<FiCheck size={18} color="#fff" />}
          iconPosition="right"
        />
      }
    >
      <div className="space-y-2 pb-4">
        {/* وضعیت موقعیت */}
        {userLocation ? (
          <div
            className="flex items-center gap-3 p-3.5 rounded-2xl border mb-3"
            style={{
              backgroundColor: '#43A04708',
              borderColor: '#43A04730',
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#43A04720' }}
            >
              <FiNavigation size={16} color="#43A047" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-[Vazir-Bold]" style={{ color: '#43A047' }}>
                موقعیت شما دریافت شد
              </p>
              <p
                className="text-[10px] font-[Vazir]"
                style={{ color: colors.textSecondary, direction: 'ltr', textAlign: 'right' }}
              >
                {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
              </p>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center gap-3 p-3.5 rounded-2xl border mb-3"
            style={{
              backgroundColor: '#FF980008',
              borderColor: '#FF980030',
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#FF980020' }}
            >
              <FiMapPin size={16} color="#FF9800" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-[Vazir-Bold]" style={{ color: '#FF9800' }}>
                موقعیت شما در دسترس نیست
              </p>
              <p className="text-[10px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                فیلتر فاصله پس از دریافت موقعیت فعال می‌شود
              </p>
            </div>
          </div>
        )}

        {/* گزینه‌های فاصله */}
        {options.map((option) => {
          const isSelected = selected === option.value;
          return (
            <button
              key={option.id}
              onClick={() => setSelected(option.value)}
              className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-right transition-all"
              style={{
                backgroundColor: isSelected ? colors.primary + '08' : colors.cardBackground,
                borderColor: isSelected ? colors.primary : colors.border,
              }}
            >
              <span className="text-xl">{option.icon}</span>
              <span
                className="flex-1 text-sm font-[Vazir-Bold]"
                style={{ color: isSelected ? colors.primary : colors.textMain }}
              >
                {option.label}
              </span>
              {isSelected && (
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <FiCheck size={14} color="#fff" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
}
