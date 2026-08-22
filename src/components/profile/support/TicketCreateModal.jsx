// src/components/profile/support/TicketCreateModal.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiSend, FiAlertCircle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Dropdown from '@/components/common/Dropdown';
import { supportService } from '@/api';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

const PRIORITY_OPTIONS = [
  { id: 'low', label: 'کم' },
  { id: 'medium', label: 'متوسط' },
  { id: 'high', label: 'بالا' },
  { id: 'urgent', label: 'فوری' },
];

export default function TicketCreateModal({ visible, onClose, onTicketCreated }) {
  const { colors } = useTheme();
  const [mounted, setMounted] = useState(false);
  const instanceId = useRef('ticket-create-modal');

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      releaseScrollLock(instanceId.current);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      setSubject('');
      setMessage('');
      setPriority('medium');
      setError('');
      setIsLoading(false);
      acquireScrollLock(instanceId.current);
    } else {
      releaseScrollLock(instanceId.current);
    }
    return () => releaseScrollLock(instanceId.current);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  const handleSubmit = async () => {
    if (!subject.trim()) {
      setError('موضوع تیکت الزامی است');
      return;
    }
    if (!message.trim()) {
      setError('متن پیام الزامی است');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await supportService.createTicket({
        subject: subject.trim(),
        message: message.trim(),
        priority,
      });
      onTicketCreated?.(result.data);
    } catch (err) {
      setError(err.message || 'خطا در ایجاد تیکت');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || !visible) return null;

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-5"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md max-h-[85vh] rounded-3xl flex flex-col overflow-hidden"
        style={{ backgroundColor: colors.cardBackground }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div
          className="flex items-center gap-3 px-5 py-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <div
            className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <FiSend size={22} style={{ color: colors.primary }} />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              ایجاد تیکت جدید
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={20} style={{ color: colors.textMain }} />
          </button>
        </div>

        {/* محتوا */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <Input
            label="موضوع *"
            placeholder="مثال: مشکل در پرداخت"
            value={subject}
            onChangeText={(t) => {
              setSubject(t);
              setError('');
            }}
            error={error && !subject.trim() ? error : ''}
          />

          <Input
            label="متن پیام *"
            placeholder="مشکل خود را به طور کامل توضیح دهید..."
            value={message}
            onChangeText={(t) => {
              setMessage(t);
              setError('');
            }}
            multiline
            error={error && !message.trim() ? error : ''}
          />

          <Dropdown
            label="اولویت"
            value={priority}
            options={PRIORITY_OPTIONS}
            onSelect={(val) => setPriority(val)}
          />

          {error && (
            <div
              className="flex items-center gap-2 p-3 rounded-xl border"
              style={{ backgroundColor: '#E5393508', borderColor: '#E5393530' }}
            >
              <FiAlertCircle size={14} color="#E53935" />
              <span className="text-xs font-[Vazir]" style={{ color: '#E53935' }}>
                {error}
              </span>
            </div>
          )}
        </div>

        {/* فوتر */}
        <div className="px-5 py-4 border-t space-y-3" style={{ borderColor: colors.border }}>
          <Button
            title={isLoading ? 'در حال ارسال...' : 'ارسال تیکت'}
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            variant="primary"
            size="lg"
            fullWidth
            icon={<FiSend size={16} color="#fff" />}
            iconPosition="right"
          />
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
