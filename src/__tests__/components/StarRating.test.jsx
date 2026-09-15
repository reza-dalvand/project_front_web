// src/__tests__/components/StarRating.test.jsx
import { render, screen } from '@testing-library/react';
import StarRating from '@/components/common/StarRating';

describe('StarRating', () => {
  it('نمایش ۵ ستاره', () => {
    const { container } = render(<StarRating value={3} />);
    // ✅ FIX: فقط فرزندان مستقیم wrapper را بشمار (نه span های داخلی)
    const wrapper = container.querySelector('.flex');
    expect(wrapper.children.length).toBe(5);
  });

  it('ستاره‌های پر و خالی', () => {
    const { container } = render(<StarRating value={3} />);
    const wrapper = container.querySelector('.flex');
    // ✅ FIX: بررسی textContent هر wrapper (شامل ★ اگر پر باشد)
    const filledStars = Array.from(wrapper.children).filter((el) =>
      el.textContent.includes('★')
    );
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