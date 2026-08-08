'use client';
import EmptyState from '../../common/EmptyState';

export default function LineRentalEmptyState({ onCreate, tabType }) {
  return (
    <EmptyState
      variant="lineRental"
      onAction={tabType === 'myAds' ? onCreate : null}
      actionLabel={tabType === 'myAds' ? 'ثبت اولین آگهی لاین' : null}
    />
  );
}
