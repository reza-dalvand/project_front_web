// src/components/explore/post/PostBusinessInfo.jsx
'use client';
import Image from 'next/image';
import { FiCalendar, FiChevronLeft } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

/**
 * ✅ اولویت نمایش تصویر:
 * 1. عکس صاحب کسب‌وکار (businessOwnerPhoto)
 * 2. لوگوی بیزینس (businessLogo)
 * 3. آواتار پیش‌فرض (گل 🌸 — بدون عکس رندوم)
 */
export default function PostBusinessInfo({ post, onProfilePress, onBooking }) {
    const { colors } = useTheme();

    // ✅ اولویت: عکس صاحب کسب‌وکار > لوگو > فالبک
    const avatarSrc = post.businessOwnerPhoto || post.businessLogo || null;

    return (
        <div
            className="flex items-center gap-3 p-4 border-b"
            style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
            }}
        >
            {/* پروفایل کسب‌وکار */}
            <button
                onClick={onProfilePress}
                className="flex items-center gap-3 flex-1 text-right min-w-0"
            >
                {/* ✅ تصویر با اولویت صحیح */}
                <div
                    className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2"
                    style={{ borderColor: colors.primary }}
                >
                    {avatarSrc ? (
                        <Image
                            src={avatarSrc}
                            alt={post.businessName || 'کسب‌وکار'}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        /* ✅ فالبک: آیکون گل — بدون عکس رندوم */
                        <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: colors.primary + '20' }}
                        >
                            <span style={{ fontSize: '24px', lineHeight: 1 }}>🌸</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <span
                        className="text-sm font-[Vazir-Bold] truncate block"
                        style={{ color: colors.textMain }}
                    >
                        {post.businessName}
                    </span>
                    <span
                        className="text-xs flex items-center gap-1"
                        style={{ color: colors.primary }}
                    >
                        مشاهده پروفایل
                        <FiChevronLeft size={12} />
                    </span>
                </div>
            </button>

            {/* دکمه رزرو */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onBooking?.();
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl
                    shadow-md transition-all hover:shadow-lg hover:scale-[1.03]
                    active:scale-[0.97] flex-shrink-0"
                style={{ backgroundColor: '#43A047' }}
            >
                <FiCalendar size={14} color="#fff" />
                <span className="text-xs font-[Vazir-Bold] text-white">رزرو</span>
            </button>
        </div>
    );
}