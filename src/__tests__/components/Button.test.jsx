// src/__tests__/components/Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/common/Button';

describe('Button', () => {
  it('نمایش عنوان دکمه', () => {
    render(<Button title="تست دکمه" />);
    expect(screen.getByText('تست دکمه')).toBeInTheDocument();
  });

  it('اجرای onPress با کلیک', () => {
    const onPress = jest.fn();
    render(<Button title="کلیک" onPress={onPress} />);
    fireEvent.click(screen.getByText('کلیک'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('غیرفعال بودن دکمه', () => {
    const onPress = jest.fn();
    render(<Button title="غیرفعال" onPress={onPress} disabled />);
    fireEvent.click(screen.getByText('غیرفعال'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('حالت loading', () => {
    const onPress = jest.fn();
    render(<Button title="در حال بارگذاری" loading onPress={onPress} />);
    // ✅ FIX: در حالت loading متن مخفی می‌شود، پس از getByRole استفاده می‌کنیم
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('نمایش آیکون', () => {
    render(<Button title="با آیکون" icon={<span data-testid="icon">🔥</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('fullWidth', () => {
    const { container } = render(<Button title="تمام عرض" fullWidth />);
    const button = container.querySelector('button');
    expect(button.className).toContain('w-full');
  });
});
