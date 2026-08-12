// src/__tests__/components/StarRating.test.jsx
import { render, screen } from '@testing-library/react';
import StarRating from '@/components/common/StarRating';

describe('StarRating', () => {
  it('نمایش ۵ ستاره', () => {
    const { container } = render(<StarRating value={3} />);
    const stars = container.querySelectorAll('span');
    expect(stars.length).toBe(5);
  });

  it('ستاره‌های پر و خالی', () => {
    const { container } = render(<StarRating value={3} />);
    const stars = container.querySelectorAll('span');
    const filledStars = Array.from(stars).filter((s) => s.textContent === '★');
    expect(filledStars.length).toBe(3);
  });

  it('حالت تعاملی', () => {
    const onRate = jest.fn();
    render(<StarRating value={0} interactive onRate={onRate} />);
    // کلیک روی ستاره سوم
    const buttons = screen.getAllByRole('button');
    buttons[2].click();
    expect(onRate).toHaveBeenCalledWith(3);
  });
});
