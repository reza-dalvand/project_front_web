'use client';
import EmptyStateVariants from '../../common/EmptyStateVariants';

export default function LineRentalEmptyState({ onCreate, tabType }) {
  return (
    <EmptyStateVariants
      variant="lineRental"
      onAction={tabType === 'myAds' ? onCreate : null}
      actionLabel={tabType === 'myAds' ? 'ثبت اولین آگهی لاین' : null}
    />
  );
}
