'use client';
import EmptyState from '@/components/common/EmptyState';

export default function ServiceEmptyState({ onAdd }) {
  return <EmptyState variant="service" onAction={onAdd} />;
}
