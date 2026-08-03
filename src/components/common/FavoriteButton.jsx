// src/components/common/FavoriteButton.jsx
"use client";

import { useState } from "react";
import { FiBookmark } from "react-icons/fi";
import { useAuth } from "@/stores/useAuth";
import { useTheme } from "@/stores/useThemeStore";

/**
 * دکمه علاقه‌مندی که فقط برای کاربران لاگین‌شده فعال است
 * اگر کاربر لاگین نباشد، با کلیک مدال Auth باز می‌شود
 */
export default function FavoriteButton({
  isFavorite = false,
  onPress,
  size = 24,
  color = "#fff",
  activeColor = "#E91E63",
  className = "",
}) {
  const { requireAuth } = useAuth();
  const { colors } = useTheme();
  const [localFavorite, setLocalFavorite] = useState(isFavorite);

  const handleClick = () => {
    requireAuth(() => {
      // این اکشن فقط اگر کاربر لاگین باشد اجرا می‌شود
      const newState = !localFavorite;
      setLocalFavorite(newState);
      onPress?.(newState);
    });
  };

  return (
    <button
      onClick={handleClick}
      className={`transition-transform hover:scale-110 active:scale-95 ${className}`}
      type="button"
      aria-label={localFavorite ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
    >
      <FiBookmark
        size={size}
        style={{
          color: localFavorite ? activeColor : color,
          fill: localFavorite ? activeColor : "transparent",
        }}
      />
    </button>
  );
}
