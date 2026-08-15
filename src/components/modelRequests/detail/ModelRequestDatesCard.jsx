// src/components/modelRequests/detail/ModelRequestDatesCard.jsx
'use client';
import Card from '@/components/common/Card';
import InfoRow from '@/components/common/InfoRow';
import { useTheme } from '@/stores/useThemeStore';

export default function ModelRequestDatesCard({ createdAt, expiresAt }) {
  const { colors } = useTheme();

  if (!createdAt && !expiresAt) return null;

  return (
    <Card variant="default" padding={14} radius={14}>
      {createdAt && (
        <InfoRow icon="📅" label="تاریخ ایجاد" value={createdAt} />
      )}
      {expiresAt && (
        <InfoRow icon="⏰" label="تاریخ انقضا" value={expiresAt} />
      )}
    </Card>
  );
}