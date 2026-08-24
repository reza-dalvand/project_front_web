import { useBusinessStore } from '@/stores/useBusinessStore';

describe('useBusinessStore', () => {
  beforeEach(() => {
    useBusinessStore.getState().resetToDefaults();
  });

  describe('initial state', () => {
    it('داده اولیه کسب‌وکار خالی است', () => {
      expect(useBusinessStore.getState().businessData.id).toBeNull();
      expect(useBusinessStore.getState().businessData.name).toBe('');
      expect(useBusinessStore.getState().businessData.services).toEqual([]);
    });
  });

  describe('updateBusinessInfo', () => {
    it('اطلاعات کسب‌وکار را به‌روز می‌کند', () => {
      useBusinessStore.getState().updateBusinessInfo({ name: 'سالن تست' });
      expect(useBusinessStore.getState().businessData.name).toBe('سالن تست');
    });
  });

  describe('addService', () => {
    it('خدمت جدید اضافه می‌کند', () => {
      useBusinessStore.getState().addService({ id: 's1', name: 'فیشیال', isActive: true });
      expect(useBusinessStore.getState().businessData.services).toHaveLength(1);
      expect(useBusinessStore.getState().businessData.services[0].name).toBe('فیشیال');
    });
  });

  describe('getActiveServices', () => {
    it('فقط خدمات فعال را برمی‌گرداند', () => {
      useBusinessStore.getState().addService({ id: 's1', name: 'فعال', isActive: true });
      useBusinessStore.getState().addService({ id: 's2', name: 'غیرفعال', isActive: false });
      const active = useBusinessStore.getState().getActiveServices();
      expect(active).toHaveLength(1);
      expect(active[0].id).toBe('s1');
    });
  });

  describe('deleteService', () => {
    it('خدمت را حذف می‌کند', () => {
      useBusinessStore.getState().addService({ id: 's1', name: 'فیشیال' });
      useBusinessStore.getState().deleteService('s1');
      expect(useBusinessStore.getState().businessData.services).toHaveLength(0);
    });
  });

  describe('toggleServiceActive', () => {
    it('وضعیت فعال بودن خدمت را معکوس می‌کند', () => {
      useBusinessStore.getState().addService({ id: 's1', name: 'فیشیال', isActive: true });
      useBusinessStore.getState().toggleServiceActive('s1');
      expect(useBusinessStore.getState().businessData.services[0].isActive).toBe(false);
    });
  });

  describe('resetToDefaults', () => {
    it('استیت را به حالت اولیه برمی‌گرداند', () => {
      useBusinessStore.getState().updateBusinessInfo({ name: 'X' });
      useBusinessStore.getState().resetToDefaults();
      expect(useBusinessStore.getState().businessData.name).toBe('');
    });
  });
});
