// src/components/providers/ToastProvider.jsx
'use client';
import Toast from '@/components/common/Toast';
import { useToast } from '@/hooks/useToast';

export default function ToastProvider() {
  const { toast, hideToast } = useToast();

  return (
    <Toast
      visible={toast.visible}
      message={toast.message}
      type={toast.type}
      position="top"
    />
  );
}
