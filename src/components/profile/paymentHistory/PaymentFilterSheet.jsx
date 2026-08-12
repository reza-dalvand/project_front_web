'use client';
import { useState, useEffect } from 'react';
import { FiCalendar, FiCheck } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import BottomSheet from '@/components/common/BottomSheet';
import Button from '@/components/common/Button';

const FILTER_OPTIONS = [
  { id: 'all', label: 'همه پرداخت‌ها', icon: '📋' },
  { id: 'yesterday', label: 'دیروز', icon: '📅' },
  { id: 'last_week', label: 'هفته قبل', icon: '🗓️' },
  { id: 'last_month', label: 'ماه قبل', icon: '📆' },
  { id: 'last_3months', label: 'سه ماه قبل', icon: '🗂️' },
];

export default function PaymentFilterSheet({ visible, onClose, onApply, currentFilter }) {
  const { colors } = useTheme();
  const [selected, setSelected] = useState(currentFilter || 'all');

  useEffect(() => {
    if (visible) {
      setSelected(currentFilter || 'all');
    }
  }, [visible, currentFilter]);

  const handleApply = () => {
    onApply(selected);
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="فیلتر زمانی پرداخت‌ها"
      snapPoint={0.55}
      footer={
        <Button
          title="اعمال فیلتر"
          onPress={handleApply}
          variant="primary"
          size="lg"
          fullWidth
          //   icon={<FiCheck size={18} color="#fff" />}
          iconPosition="right"
        />
      }
    >
      <div className="space-y-2 pb-4">
        {FILTER_OPTIONS.map((option) => {
          const isSelected = selected === option.id;
          return (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
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
