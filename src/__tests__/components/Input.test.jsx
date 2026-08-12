// src/__tests__/components/Input.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '@/components/common/Input';

describe('Input', () => {
  it('نمایش label', () => {
    render(<Input label="نام" />);
    expect(screen.getByText('نام')).toBeInTheDocument();
  });

  it('نمایش placeholder', () => {
    render(<Input placeholder="مثال: مریم" />);
    expect(screen.getByPlaceholderText('مثال: مریم')).toBeInTheDocument();
  });

  it('تغییر مقدار', () => {
    const onChangeText = jest.fn();
    render(<Input onChangeText={onChangeText} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'مریم' } });
    expect(onChangeText).toHaveBeenCalledWith('مریم');
  });

  it('نمایش خطا', () => {
    render(<Input error="این فیلد الزامی است" />);
    expect(screen.getByText('این فیلد الزامی است')).toBeInTheDocument();
  });

  it('نمایش hint', () => {
    render(<Input hint="راهنما" />);
    expect(screen.getByText('راهنما')).toBeInTheDocument();
  });

  it('غیرفعال بودن', () => {
    render(<Input editable={false} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });
});
