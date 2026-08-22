// src/components/common/FavoriteButton.jsx
'use client';
import { useState } from 'react';
import { FiBookmark } from 'react-icons/fi';
import { useAuth } from '@/stores/useAuthStore';
import { useToast } from '@/hooks/useToast';
import { favoritesService } from '@/api';
export default function FavoriteButton({
  isFavorite = false,
  onPress,
  size = 24,
  color = '#fff',
  activeColor = '#E91E63',
  className = '',
  favoriteType = 'business', // 'business' یا 'post'
  objectId = null,
}) {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [localFavorite, setLocalFavorite] = useState(isFavorite);
  const [isLoading, setIsLoading] = useState(false);

  // اگر لاگین نیست، اصلاً نمایش داده نشود
  if (!isAuthenticated) return null;

  const handleClick = async () => {
    if (isLoading) return;

    const newState = !localFavorite;
    setLocalFavorite(newState);
    setIsLoading(true);

    try {
      // ✅ فراخوانی API (در حالت mock فقط state آپدیت می‌شود)
      if (!USE_MOCK && objectId) {
        await favoritesService.toggleFavorite(favoriteType, objectId);
      }

      showToast(newState ? 'به علاقه‌مندی‌ها اضافه شد' : 'از علاقه‌مندی‌ها حذف شد', 'success');

      onPress?.(newState);
    } catch (error) {
      // Rollback در صورت خطا
      setLocalFavorite(!newState);
      showToast(error.message || 'خطا در عملیات', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 ${className}`}
      type="button"
      aria-label={localFavorite ? 'حذف از علاقه‌مندی' : 'افزودن به علاقه‌مندی'}
    >
      <FiBookmark
        size={size}
        style={{
          color: localFavorite ? activeColor : color,
          fill: localFavorite ? activeColor : 'transparent',
        }}
      />
    </button>
  );
}
