"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  FiX,
  FiShare2,
  FiBookmark,
  FiStar,
  FiCalendar,
  FiChevronLeft,
  FiInfo,
  FiZap,
} from "react-icons/fi";
import { MdAutoAwesome, MdVerified } from "react-icons/md";
import { createPortal } from "react-dom";
import { useTheme } from "@/stores/useThemeStore";
import { useAuth } from "@/stores/useAuth";
import { useToast } from "@/hooks/useToast";
import GallerySlider from "./GallerySlider";
import StarRating from "@/components/common/StarRating";
import Avatar from "@/components/common/Avatar";
import Button from "@/components/common/Button";
import { acquireScrollLock, releaseScrollLock } from "@/utils/scrollLock";

export default function PostModal({
  post,
  visible,
  onClose,
  onSave,
  onNavigateToProfile,
}) {
  const { colors } = useTheme();
  const { isAuthenticated, requireAuth } = useAuth();
  const [isSaved, setIsSaved] = useState(post?.saved || false);
  const [mounted, setMounted] = useState(false);
  const instanceId = useRef("post-modal");
  const { showToast } = useToast();  


  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      releaseScrollLock(instanceId.current);
    };
  }, []);

  useEffect(() => {
    if (post) {
      setIsSaved(post.saved);
    }
  }, [post]);

  // قفل کردن اسکرول بدنه با سیستم مرکزی
  useEffect(() => {
    if (visible) {
      acquireScrollLock(instanceId.current);
    } else {
      releaseScrollLock(instanceId.current);
    }
    return () => {
      releaseScrollLock(instanceId.current);
    };
  }, [visible]);

  // بستن با Escape
  useEffect(() => {
    if (!visible) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [visible, onClose]);

  if (!mounted || !visible || !post) return null;

  const isMagazine = post.source === "magazine";
  const media = post.gallery || post.images || [];

  // ✅ بعد (جدید — با toast و fallback)

  // تابع کپی در کلیپ‌بورد با fallback برای HTTP
  const copyTextToClipboard = async (text) => {
    // روش ۱: Clipboard API مدرن (فقط در HTTPS یا localhost)
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.log("Clipboard API failed:", err);
      }
    }

    // روش ۲: execCommand fallback (برای محیط‌های قدیمی و HTTP)
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "-9999px";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      return success;
    } catch (err) {
      console.log("execCommand copy failed:", err);
      return false;
    }
  };

  const handleShare = async () => {
    // ساخت لینک اختصاصی پست
    const postUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/post/${post.id}`
        : `https://zibano.app/post/${post.id}`;

    // ساخت پیام کامل اشتراک‌گذاری
    const shareMessage = [
      `🌟 ${post.businessName || "زیبانو"}`,
      post.caption ? post.caption : "",
      "",
      `🔗 ${postUrl}`,
      "📱 مشاهده در اپلیکیشن زیبانو",
    ]
      .filter(Boolean)
      .join("\n");

    // روش ۱: Web Share API (موبایل و مرورگرهای مدرن)
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.businessName || "زیبانو",
          text: post.caption || "",
          url: postUrl,
        });
        return;
      } catch (err) {
        // اگر کاربر خودش لغو کرد، خروج
        if (err.name === "AbortError") return;
        // در غیر این صورت به fallback ادامه می‌دهیم
        console.log("Web Share failed, trying clipboard...");
      }
    }

    // روش ۲: کپی در کلیپ‌بورد
    const copied = await copyTextToClipboard(shareMessage);

    if (copied) {
      showToast("✓ لینک و توضیحات پست کپی شد", "success");
    } else {
      showToast("امکان اشتراک‌گذاری وجود ندارد", "error");
    }
  };

  const handleSave = () => {
    requireAuth(() => {
      const newState = !isSaved;
      setIsSaved(newState);
      onSave?.(post.id);
    });
  };

  const handleProfilePress = () => {
    onClose();
    setTimeout(() => {
      onNavigateToProfile?.(post.businessId);
    }, 300);
  };

  const handleBooking = () => {
    onClose();
    setTimeout(() => {
      onNavigateToProfile?.(post.businessId);
    }, 300);
  };

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] rounded-3xl overflow-hidden
        flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-300"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border,
          borderWidth: 1,
        }}
      >
        {/* هدر مدال */}
        <div
          className="flex items-center gap-2 px-4 py-3 border-b"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center
            border transition-colors hover:opacity-80"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border,
            }}
          >
            <FiX size={20} style={{ color: colors.textMain }} />
          </button>
          <div className="flex-1" />
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full flex items-center justify-center
            border transition-colors hover:opacity-80"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border,
            }}
          >
            <FiShare2 size={18} style={{ color: colors.textMain }} />
          </button>
          {isAuthenticated && (
            <button
              onClick={handleSave}
              className="w-10 h-10 rounded-full flex items-center justify-center
                border transition-colors hover:opacity-80"
              style={{
                backgroundColor: isSaved ? colors.primary + "20" : colors.background,
                borderColor: isSaved ? colors.primary : colors.border,
              }}
            >
              <FiBookmark
                size={18}
                style={{ color: isSaved ? colors.primary : colors.textMain }}
                fill={isSaved ? colors.primary : "transparent"}
              />
            </button>
          )}
        </div>

        {/* گالری تصاویر */}
        <div className="w-full bg-black">
          <GallerySlider gallery={media} />
        </div>

        {/* محتوای اسکرولی */}
        <div className="flex-1 overflow-y-auto">
          {/* اطلاعات کسب‌وکار */}
          {!isMagazine && (
            <div
              className="flex items-center gap-3 p-4 border-b"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              }}
            >
              <button
                onClick={handleProfilePress}
                className="flex items-center gap-3 flex-1 text-right"
              >
                <Avatar
                  uri={post.businessLogo}
                  name={post.businessName}
                  size="md"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-sm font-bold line-clamp-1"
                      style={{ color: colors.textMain }}
                    >
                      {post.businessName}
                    </span>
                    <MdVerified size={14} color="#4FC3F7" />
                  </div>
                  <span
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    مشاهده پروفایل
                  </span>
                </div>
              </button>
              {/* دکمه رزرو */}
              <button
                onClick={handleBooking}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl
                shadow-md transition-all hover:shadow-lg"
                style={{ backgroundColor: "#43A047" }}
              >
                <FiCalendar size={14} color="#fff" />
                <span className="text-xs font-bold text-white">رزرو</span>
              </button>
            </div>
          )}

          {/* هدر مجله زیبانو */}
          {isMagazine && (
            <div
              className="flex items-center gap-3 p-4 border-b"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#9C27B020" }}
              >
                <MdAutoAwesome size={22} color="#9C27B0" />
              </div>
              <div className="flex-1">
                <span
                  className="text-sm font-bold line-clamp-1"
                  style={{ color: colors.textMain }}
                >
                  {post.businessName}
                </span>
                <span className="text-xs" style={{ color: "#9C27B0" }}>
                  مقاله و محتوای آموزشی
                </span>
              </div>
            </div>
          )}

          {/* امتیاز - فقط برای کسب‌وکار */}
          {!isMagazine && post.rating > 0 && (
            <div
              className="flex items-center justify-between p-3 mx-4 mt-4
              rounded-2xl border"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              }}
            >
              <div className="flex items-center gap-2">
                <FiStar size={18} color="#FFC107" fill="#FFC107" />
                <span
                  className="text-lg font-bold"
                  style={{ color: colors.textMain }}
                >
                  {post.rating.toFixed(1)}
                </span>
                <span
                  className="text-xs"
                  style={{ color: colors.textSecondary }}
                >
                  از ۵
                </span>
              </div>
              <div
                className="w-px h-6"
                style={{ backgroundColor: colors.border }}
              />
              <StarRating value={post.rating} size="md" />
            </div>
          )}

          {/* کپشن */}
          <div
            className="p-4 mx-4 mt-4 rounded-2xl border"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: isMagazine
                    ? "#9C27B015"
                    : colors.primary + "15",
                }}
              >
                {isMagazine ? (
                  <MdAutoAwesome size={14} color="#9C27B0" />
                ) : (
                  <FiInfo size={14} style={{ color: colors.primary }} />
                )}
              </div>
              <span
                className="text-xs font-bold"
                style={{ color: colors.textSecondary }}
              >
                {isMagazine ? "متن مقاله" : "توضیحات"}
              </span>
            </div>
            <p
              className="text-sm leading-7 text-justify"
              style={{ color: colors.textMain }}
            >
              {post.caption}
            </p>
          </div>

          {/* راهنما */}
          <div
            className="flex items-center gap-2.5 p-3 mx-4 mt-4 mb-4
            rounded-xl border"
            style={{
              backgroundColor: isMagazine ? "#9C27B008" : colors.primary + "08",
              borderColor: isMagazine ? "#9C27B025" : colors.primary + "25",
            }}
          >
            <FiZap
              size={16}
              style={{ color: isMagazine ? "#9C27B0" : colors.primary }}
            />
            <span
              className="text-xs leading-5 flex-1"
              style={{ color: colors.textSecondary }}
            >
              {isMagazine
                ? "این مقاله توسط تیم تحریریه مجله زیبانو تهیه شده است"
                : "با رزرو نوبت از این کسب‌وکار، از تخفیف‌های ویژه بهره‌مند شوید"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}