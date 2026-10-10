// src/components/common/ScreenWrapper.jsx
export default function ScreenWrapper({ 
  children, 
  padding = 4, 
  scrollable = true,
  hasBottomTab = false // ✅ پراپ جدید
}) {
  const { colors } = useTheme();

  // محاسبه پدینگ پایین: ارتفاع تب‌بار + Safe Area + فاصله اضافی
  const safeBottom = hasBottomTab 
    ? 'calc(var(--tab-bar-height) + env(safe-area-inset-bottom, 0px) + 16px)' 
    : 'env(safe-area-inset-bottom, 0px)';

  return (
    <div
      className="flex flex-col h-dvh w-full overflow-hidden" // ✅ استفاده از h-dvh
      style={{ backgroundColor: colors.background }}
    >
      <div
        className={`flex-1 ${scrollable ? 'overflow-y-auto' : 'overflow-hidden'}`}
        style={{
          padding: padding ? `${padding * 4}px` : '0',
          paddingBottom: safeBottom, // ✅ پدینگ داینامیک
        }}
      >
        {children}
      </div>
    </div>
  );
}