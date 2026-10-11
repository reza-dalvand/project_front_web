// src/components/common/ScreenWrapper.jsx
import { useTheme } from '@/stores/useThemeStore';

export default function ScreenWrapper({
  children,
  padding = 4,
  scrollable = true,
  hasBottomTab = false,
}) {
  const { colors } = useTheme();

  // محاسبه پدینگ پایین: ارتفاع تب‌بار + فاصله + Safe Area
  const safeBottom = hasBottomTab
    ? 'calc(var(--tab-bar-height) + 20px + env(safe-area-inset-bottom, 0px))'
    : 'env(safe-area-inset-bottom, 0px)';

  return (
    <div
      className="flex flex-col h-dvh w-full overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      <div
        className={`flex-1 ${scrollable ? 'overflow-y-auto' : 'overflow-hidden'}`}
        style={{
          padding: padding ? `${padding * 4}px` : '0',
          paddingBottom: safeBottom,
        }}
      >
        {children}
      </div>
    </div>
  );
}