// src/__tests__/services/appointmentsService.test.js
import { appointmentsService } from '@/api';

jest.mock('@/api/config', () => ({
  USE_MOCK: true,
  API_CONFIG: { baseURL: 'http://localhost:8000/api/v1', timeout: 15000 },
}));

describe('appointmentsService', () => {
  it('createAppointment → موفقیت', async () => {
    const result = await appointmentsService.createAppointment({
      service_id: 1,
      jy: 1403,
      jm: 4,
      jd: 15,
      time_slot: '10:30',
    });
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('verification_code');
    expect(result.data).toHaveProperty('date_key');
    expect(result.data.verification_code).toHaveLength(4);
  });

  it('getMyAppointments → لیست نوبت‌ها', async () => {
    const result = await appointmentsService.getMyAppointments('upcoming');
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  });

  it('cancelAppointment → موفقیت', async () => {
    const result = await appointmentsService.cancelAppointment(1, 'تست');
    expect(result.success).toBe(true);
  });

  it('verifyServiceCode → موفقیت', async () => {
    const result = await appointmentsService.verifyServiceCode(1, '5892');
    expect(result.success).toBe(true);
  });
});
