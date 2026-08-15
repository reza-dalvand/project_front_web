// src/components/manageBusiness/lineRental/CollabTypeSelector.jsx
'use client';
import { useTheme } from '@/stores/useThemeStore';
import { COLLAB_TYPES } from '@/constants/collabTypes';

export default function CollabTypeSelector({ collabType, onSelect, error }) {
  const { colors } = useTheme();

  return (
    <div>
      <p className="text-sm font-[Vazir-Medium] mb-3" style={{ color: colors.textMain }}>
        نوع همکاری *
      </p>
      <div className="flex gap-2">
        {COLLAB_TYPES.map((ct) => {
          const isSel = collabType === ct.id;
          return (
            <button
              key={ct.id}
              onClick={() => onSelect(ct.id)}
              className="flex-1 flex flex-col items-center gap-2 py-3 px-2 rounded-xl border-2 transition-all text-center"
              style={{
                backgroundColor: isSel ? ct.color + '15' : colors.cardBackground,
                borderColor: isSel ? ct.color : colors.border,
              }}
            >
              <span
                className="text-sm font-[Vazir-Bold]"
                style={{ color: isSel ? ct.color : colors.textMain }}
              >
                {ct.label}
              </span>
              <span className="text-[10px] leading-4" style={{ color: colors.textSecondary }}>
                {ct.hint}
              </span>
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-[#E53935] mt-2">{error}</p>}
    </div>
  );
}