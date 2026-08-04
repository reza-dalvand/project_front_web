'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiChevronDown, FiChevronUp, FiX, FiCheck } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

let dropdownCounter = 0;

export default function Dropdown({
  label,
  value,
  options = [],
  onSelect,
  placeholder = 'انتخاب کنید...',
  disabled = false,
}) {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const instanceId = useRef(`dropdown-${++dropdownCounter}`);
  const selectedItem = options.find((opt) => opt.id === value);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      releaseScrollLock(instanceId.current);
    };
  }, []);

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

  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') setVisible(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible]);

  const handleSelect = (item) => {
    onSelect?.(item.id);
    setVisible(false);
  };

  const inputBorderColor = disabled
    ? colors.border + '60'
    : visible
    ? colors.primary
    : colors.border;

  if (!mounted) return null;

  const content = visible ? (
    <div
      className="fixed inset-0 z-[9998] flex flex-col justify-end"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={() => setVisible(false)}
    >
      <div
        className="w-full max-h-[75vh] rounded-t-3xl flex flex-col animate-slide-up"
        style={{
          backgroundColor: colors.cardBackground,
          borderTop: `1px solid ${colors.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div
            className="w-10 h-1 rounded-full"
            style={{ backgroundColor: colors.border }}
          />
        </div>

        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <h3
            className="text-base font-[Vazir-Bold] flex-1"
            style={{ color: colors.textMain }}
          >
            {label || placeholder}
          </h3>
          <button
            onClick={() => setVisible(false)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={20} style={{ color: colors.textMain }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {options.length === 0 ? (
            <div className="py-12 text-center">
              <p
                className="text-sm"
                style={{ color: colors.textSecondary }}
              >
                گزینه‌ای موجود نیست
              </p>
            </div>
          ) : (
            options.map((item) => {
              const isSelected = item.id === value;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center justify-between px-5 py-4 border-b transition-colors hover:opacity-80"
                  style={{
                    backgroundColor: isSelected
                      ? colors.primary + '12'
                      : 'transparent',
                    borderColor: colors.border + '40',
                  }}
                >
                  <span
                    className="text-sm flex-1 text-right"
                    style={{
                      color: isSelected ? colors.primary : colors.textMain,
                      fontFamily: isSelected ? 'Vazir-Bold' : 'Vazir',
                    }}
                  >
                    {item.label}
                  </span>
                  {isSelected && (
                    <FiCheck size={20} style={{ color: colors.primary }} />
                  )}
                </button>
              );
            })
          )}
          <div className="h-6" />
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="w-full mb-4">
      {label && (
        <label
          className="block text-sm mb-2 text-right font-[Vazir-Medium]"
          style={{ color: colors.textMain }}
        >
          {label}
        </label>
      )}
      <button
        onClick={() => !disabled && setVisible((v) => !v)}
        disabled={disabled}
        className="w-full flex items-center justify-between px-4 h-12 rounded-xl border-2 transition-colors"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: inputBorderColor,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <span
          className="text-sm flex-1 text-right truncate"
          style={{
            color: selectedItem ? colors.textMain : colors.textSecondary,
            fontFamily: 'Vazir',
          }}
        >
          {selectedItem ? selectedItem.label : placeholder}
        </span>
        {visible ? (
          <FiChevronUp
            size={20}
            style={{
              color: disabled
                ? colors.textSecondary + '60'
                : colors.primary,
            }}
          />
        ) : (
          <FiChevronDown
            size={20}
            style={{
              color: disabled
                ? colors.textSecondary + '60'
                : colors.textSecondary,
            }}
          />
        )}
      </button>
      {createPortal(content, document.body)}
    </div>
  );
}