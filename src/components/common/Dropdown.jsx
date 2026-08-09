'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiChevronDown, FiChevronUp, FiX, FiCheck } from 'react-icons/fi';
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
    ? 'border-[var(--border)]/60'
    : visible
      ? 'border-[var(--primary)]'
      : 'border-[var(--border)]';

  if (!mounted) return null;

  const content = visible ? (
    <div
      className="fixed inset-0 z-[10001] flex flex-col justify-end"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={() => setVisible(false)}
    >
      <div
        className="w-full max-h-[75vh] rounded-t-3xl flex flex-col animate-slide-up
          bg-[var(--card)] border-t border-[var(--border)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[var(--border)]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h3 className="text-base font-vazir-bold flex-1 text-[var(--text)]">
            {label || placeholder}
          </h3>
          <button
            onClick={() => setVisible(false)}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--bg)]"
          >
            <FiX size={20} className="text-[var(--text)]" />
          </button>
        </div>

        {/* Options */}
        <div className="flex-1 overflow-y-auto py-2">
          {options.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-[var(--text-secondary)]">گزینه‌ای موجود نیست</p>
            </div>
          ) : (
            options.map((item) => {
              const isSelected = item.id === value;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`w-full flex items-center justify-between px-5 py-4 border-b
                    transition-colors hover:opacity-80
                    ${isSelected ? 'bg-[var(--primary)]/12' : 'bg-transparent'}
                  `}
                  style={{ borderColor: 'var(--border)' + '40' }}
                >
                  <span
                    className={`text-sm flex-1 text-right
                      ${isSelected ? 'text-[var(--primary)] font-vazir-bold' : 'text-[var(--text)] font-vazir'}
                    `}
                  >
                    {item.label}
                  </span>
                  {isSelected && <FiCheck size={20} className="text-[var(--primary)]" />}
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
        <label className="block text-sm mb-2 text-right font-vazir-medium text-[var(--text)]">
          {label}
        </label>
      )}
      <button
        onClick={() => !disabled && setVisible((v) => !v)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 h-12 rounded-xl border-2
          transition-colors bg-[var(--card)] ${inputBorderColor}
          ${disabled ? 'opacity-60' : ''}
        `}
      >
        <span
          className={`text-sm flex-1 text-right truncate font-vazir
            ${selectedItem ? 'text-[var(--text)]' : 'text-[var(--text-secondary)]'}
          `}
        >
          {selectedItem ? selectedItem.label : placeholder}
        </span>
        {visible ? (
          <FiChevronUp
            size={20}
            className={disabled ? 'text-[var(--text-secondary)]/60' : 'text-[var(--primary)]'}
          />
        ) : (
          <FiChevronDown
            size={20}
            className={
              disabled ? 'text-[var(--text-secondary)]/60' : 'text-[var(--text-secondary)]'
            }
          />
        )}
      </button>
      {createPortal(content, document.body)}
    </div>
  );
}
