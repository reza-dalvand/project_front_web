jest.mock('@/api', () => ({
  authService: {
    logout: jest.fn().mockResolvedValue({}),
    refreshToken: jest.fn().mockResolvedValue({
      data: { access: 'new-access', refresh: 'new-refresh' },
    }),
  },
}));

import { useAuthStore } from '@/stores/useAuthStore';
import { useTokenStore } from '@/stores/useTokenStore';
import { authService } from '@/api';

const baseUser = {
  id: 1,
  phone: '09123456789',
  firstName: 'مریم',
  lastName: 'حسینی',
  fullName: 'مریم حسینی',
  isVerified: true,
};

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      pendingPhone: null,
      pendingName: null,
      needsProfileCompletion: false,
    });
    // ✅ FIX: ریست توکن‌ها برای جلوگیری از تداخل بین تست‌ها
    useTokenStore.getState().clearTokens();
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('کاربر را وارد و ذخیره می‌کند', () => {
      useAuthStore.getState().login(baseUser, { accessToken: 'a', refreshToken: 'r' }, {});

      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().user.name).toBe('مریم حسینی');
      expect(useAuthStore.getState().user.phone).toBe('09123456789');
    });

    it('وضعیت تکمیل پروفایل را از گزینه‌ها می‌گیرد', () => {
      useAuthStore
        .getState()
        .login(baseUser, { accessToken: 'a', refreshToken: 'r' }, { needsProfileCompletion: true });

      expect(useAuthStore.getState().needsProfileCompletion).toBe(true);
    });
  });

  describe('logout', () => {
    it('کاربر را خارج و استیت را پاک می‌کند', async () => {
      useAuthStore.getState().login(baseUser, { accessToken: 'a', refreshToken: 'r' }, {});

      await useAuthStore.getState().logout();

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('کاربر را به‌روز می‌کند', () => {
      useAuthStore.getState().login(baseUser, {}, {});

      useAuthStore.getState().updateUser({ name: 'نام جدید' });

      expect(useAuthStore.getState().user.name).toBe('نام جدید');
    });
  });

  describe('completeProfile', () => {
    it('وضعیت تکمیل پروفایل را خالی می‌کند', () => {
      useAuthStore.setState({ needsProfileCompletion: true });

      useAuthStore.getState().completeProfile();

      expect(useAuthStore.getState().needsProfileCompletion).toBe(false);
    });
  });

  describe('setPendingAuth', () => {
    it('شماره در انتظار را ذخیره می‌کند', () => {
      useAuthStore.getState().setPendingAuth('09123456789', 'مریم', 'حسینی');

      expect(useAuthStore.getState().pendingPhone).toBe('09123456789');
      expect(useAuthStore.getState().pendingName).toBe('مریم حسینی');
    });
  });

  describe('checkSession', () => {
    it('بدون توکن، خالی برمی‌گرداند و استیت را پاک می‌کند', async () => {
      // ✅ FIX: اطمینان از خالی بودن توکن‌ها
      useTokenStore.getState().clearTokens();
      useAuthStore.setState({ isAuthenticated: true, user: baseUser });

      const result = await useAuthStore.getState().checkSession();

      expect(result).toBe(false);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });
});
