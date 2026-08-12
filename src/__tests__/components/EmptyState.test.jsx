// src/__tests__/components/EmptyState.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import EmptyState from '@/components/common/EmptyState';

describe('EmptyState', () => {
  it('نمایش عنوان و توضیحات', () => {
    render(<EmptyState icon="📭" title="موردی یافت نشد" description="توضیحات حالت خالی" />);
    expect(screen.getByText('موردی یافت نشد')).toBeInTheDocument();
    expect(screen.getByText('توضیحات حالت خالی')).toBeInTheDocument();
  });

  it('نمایش دکمه اکشن', () => {
    const onAction = jest.fn();
    render(<EmptyState icon="📭" title="خالی" actionLabel="افزودن" onAction={onAction} />);
    fireEvent.click(screen.getByText('افزودن'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('بدون دکمه اکشن', () => {
    render(<EmptyState icon="📭" title="خالی" />);
    expect(screen.queryByText('افزودن')).not.toBeInTheDocument();
  });
});
