'use client';

import { useTheme } from '@/stores/useThemeStore';
import ProfileMenuCard from './ProfileMenuCard';

export default function ProfileMenuList({ title, items, onItemPress }) {
  const { colors } = useTheme();

  return (
    <div className="mb-6">
      {title && (
        <h3 className="text-base font-[Vazir-Bold] mb-3" style={{ color: colors.textMain }}>
          {title}
        </h3>
      )}
      <div>
        {items.map((item) => (
          <ProfileMenuCard key={item.id} item={item} onPress={() => onItemPress?.(item)} />
        ))}
      </div>
    </div>
  );
}
