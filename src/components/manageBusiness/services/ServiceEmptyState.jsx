'use client';
import EmptyStateVariants from '@/components/common/EmptyStateVariants';

export default function ServiceEmptyState({ onAdd }) {
  return (
    <EmptyStateVariants
      variant="service"
      onAction={onAdd}
    />
  );
}