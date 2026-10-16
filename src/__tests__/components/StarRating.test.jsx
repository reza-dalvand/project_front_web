import { render, screen, fireEvent } from '@testing-library/react';
import StarRating from '@/components/common/StarRating';

describe('StarRating', () => {
  it('نمایش ۵ ستاره', () => {
    const { container } = render(<StarRating value={3} />);
    const stars = container.querySelectorAll('[data-star-index]');
    expect(stars).toHaveLength(5);
  });

  it('ستاره‌های پر و خالی', () => {
    const { container } = render(<StarRating value={3} />);

    const fullStars = container.querySelectorAll('[data-star-state="full"]');
    const emptyStars = container.querySelectorAll('[data-star-state="empty"]');

    expect(fullStars).toHaveLength(3);
    expect(emptyStars).toHaveLength(2);
  });

  it('پشتیبانی از امتیاز اعشاری', () => {
    const { container } = render(<StarRating value={3.5} />);

    const partialStar = container.querySelector('[data-star-index="3"]');

    expect(partialStar?.getAttribute('data-star-fill')).toBe('50');
    expect(partialStar?.getAttribute('data-star-state')).toBe('partial');
  });

  it('مقدار نامعتبر باعث نمایش ستاره پر نمی‌شود', () => {
    const { container } = render(<StarRating value={NaN} />);

    const fullStars = container.querySelectorAll('[data-star-state="full"]');
    const emptyStars = container.querySelectorAll('[data-star-state="empty"]');

    expect(fullStars).toHaveLength(0);
    expect(emptyStars).toHaveLength(5);
  });

  it('حالت تعاملی', () => {
    const onRate = jest.fn();
    render(<StarRating value={0} interactive onRate={onRate} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5);

    fireEvent.click(buttons[2]);
    expect(onRate).toHaveBeenCalledWith(3);
  });
});