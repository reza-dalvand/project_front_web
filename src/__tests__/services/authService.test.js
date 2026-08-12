// src/__tests__/services/authService.test.js
import { authService } from '@/api';
import { USE_MOCK } from '@/api/config';

// اطمینان از حالت mock
jest.mock('@/api/config', () => ({
  USE_MOCK: true,
  API_CONFIG: { baseURL: 'http://localhost:8000/api/v1', timeout: 15000 },
  JWT_CONFIG: { ACCESS_TOKEN_KEY: 'test', REFRESH_TOKEN_KEY: 'test' },
  OTP_CONFIG: { CODE_LENGTH: 5, EXPIRY_SECONDS: 300, RESEND_COOLDOWN_SECONDS: 60 },
}));

describe('authService', () => {
  it('sendOTP → موفقیت', async () => {
    const result = await authService.sendOTP('09123456789');
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('expires_in');
    expect(result.data).toHaveProperty('resend_after');
  });

  it('verifyOTP → موفقیت', async () => {
    const result = await authService.verifyOTP('09123456789', '12345');
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('access_token');
    expect(result.data).toHaveProperty('refresh_token');
    expect(result.data).toHaveProperty('user');
  });

  it('refreshToken → موفقیت', async () => {
    const result = await authService.refreshToken('mock_refresh_token');
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('access');
  });

  it('logout → موفقیت', async () => {
    const result = await authService.logout('mock_refresh_token');
    expect(result.success).toBe(true);
  });

  it('verifyNationalId → موفقیت', async () => {
    const result = await authService.verifyNationalId('0012345679');
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('verified_name');
  });

  it('getDevices → لیست دستگاه‌ها', async () => {
    const result = await authService.getDevices();
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  });
});
