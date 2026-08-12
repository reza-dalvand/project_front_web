// src/__tests__/components/CharCounter.test.jsx
import { render, screen } from '@testing-library/react';
import CharCounter from '@/components/common/CharCounter';

describe('CharCounter', () => {
  it('نمایش شمارنده عادی', () => {
    render(<CharCounter current={100} max={300} />);
    expect(screen.getByText(/۱۰۰ از ۳۰۰/)).toBeInTheDocument();
  });

  it('هشدار نزدیک به محدودیت', () => {
    render(<CharCounter current={280} max={300} />);
    expect(screen.getByText(/۲۰ کاراکتر باقی مانده/)).toBeInTheDocument();
  });

  it('هشدار رسیدن به محدودیت', () => {
    render(<CharCounter current={300} max={300} />);
    expect(screen.getByText(/حداکثر تعداد کاراکتر/)).toBeInTheDocument();
  });
});
