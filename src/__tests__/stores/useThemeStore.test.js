// src/__tests__/stores/useThemeStore.test.js
import { useThemeStore } from '@/stores/useThemeStore';
import { act } from '@testing-library/react';

describe('useThemeStore', () => {
  beforeEach(() => {
    // ریست store
    useThemeStore.setState({
      theme: 'system',
      resolvedTheme: 'light',
      _hydrated: true,
    });
  });

  it('مقدار پیش‌فرض: system', () => {
    const state = useThemeStore.getState();
    expect(state.theme).toBe('system');
  });

  it('تغییر تم به dark', () => {
    act(() => {
      useThemeStore.getState().setTheme('dark');
    });
    const state = useThemeStore.getState();
    expect(state.theme).toBe('dark');
    expect(state.resolvedTheme).toBe('dark');
    expect(state.colors.background).toBe('#171412');
  });

  it('تغییر تم به light', () => {
    act(() => {
      useThemeStore.getState().setTheme('light');
    });
    const state = useThemeStore.getState();
    expect(state.theme).toBe('light');
    expect(state.resolvedTheme).toBe('light');
    expect(state.colors.background).toBe('#F5F0EC');
  });

  it('رنگ‌ها در تم روشن و تاریک متفاوت‌اند', () => {
    act(() => {
      useThemeStore.getState().setTheme('light');
    });
    const lightColors = useThemeStore.getState().colors;

    act(() => {
      useThemeStore.getState().setTheme('dark');
    });
    const darkColors = useThemeStore.getState().colors;

    expect(lightColors.background).not.toBe(darkColors.background);
    expect(lightColors.textMain).not.toBe(darkColors.textMain);
  });
});
