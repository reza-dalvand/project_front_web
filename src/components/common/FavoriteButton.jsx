// src/components/common/FavoriteButton.jsx
"use client";
import { useState } from "react";
import { FiBookmark } from "react-icons/fi";
import { useAuth } from "@/stores/useAuth";
import { useTheme } from "@/stores/useThemeStore";

export default function FavoriteButton({
  isFavorite = false,
  onPress,
  size = 24,
  color = "#fff",
  activeColor = "#E91E63",
  className = "",
}) {
  const { isAuthenticated } = useAuth();
  const [localFavorite, setLocalFavorite] = useState(isFavorite);

  // ✅ اگر لاگین نیست، اصلاً نمایش داده نشود
  if (!isAuthenticated) return null;

  const handleClick = () => {
    const newState = !localFavorite;
    setLocalFavorite(newState);
    onPress?.(newState);
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