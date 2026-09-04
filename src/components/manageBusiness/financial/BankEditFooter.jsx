// src/components/manageBusiness/financial/BankEditFooter.jsx
'use client';
import { FiSave } from 'react-icons/fi';
import Button from '@/components/common/Button';

export default function BankEditFooter({ onClose, onSubmit, saving = false }) {
  return (
    <div className="p-5 border-t flex gap-3" style={{ borderColor: 'var(--color-border)' }}>
      <Button title="انصراف" onPress={onClose} variant="outline" size="lg" className="flex-1" />
      <Button
        title={saving ? 'در حال ثبت...' : 'ثبت اطلاعات'}
        onPress={onSubmit}
        loading={saving}
        disabled={saving}
        variant="primary"
        size="lg"
        icon={<FiSave size={18} color="#fff" />}
        iconPosition="right"
        className="flex-1"
      />
    </div>
  );
}