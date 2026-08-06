'use client';
import { FiCheck } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ServiceTypeIcon from '@/components/manageBusiness/services/ServiceTypeIcon';
import { toPersianDigit } from '@/utils/numberUtils';

export default function ServiceSelectionStep({ services, selectedId, onSelect }) {
  const { colors } = useTheme();

  return (
    <div className="flex flex-col gap-3 px-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">💆‍♀️</span>
        <span className="text-[15px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
          خدمت موردنظر را انتخاب کنید
        </span>
      </div>

      <div className="flex flex-col gap-2.5 max-h-[400px] overflow-y-auto">
        {services.map((service) => {
          const isSelected = selectedId === service.id;
          return (
            <button
              key={service.id}
              onClick={() => onSelect(service.id)}
              className="flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-right"
              style={{
                backgroundColor: isSelected ? colors.primary + '08' : colors.cardBackground,
                borderColor: isSelected ? colors.primary : colors.border,
                borderWidth: isSelected ? 2 : 1,
              }}
            >
              <ServiceTypeIcon typeId={service.typeId} size={52} />
              <div className="flex-1 gap-1 min-w-0">
                <span
                  className="text-sm font-[Vazir-Bold] block truncate"
                  style={{ color: colors.textMain }}
                >
                  {service.name}
                </span>
                <span
                  className="text-xs font-[Vazir-Medium] block"
                  style={{ color: colors.textSecondary }}
                >
                  {service.typeName}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[11px]" style={{ color: colors.textSecondary }}>
                    ⏱️ {toPersianDigit(service.duration || 60)} دقیقه هر نوبت
                  </span>
                </div>
              </div>
              {isSelected && (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center border-2 border-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  <FiCheck size={14} color="#fff" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
