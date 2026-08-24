// src/hooks/useLocationOptions.js
/**
 * هوک دریافت استان‌ها و شهرها از بک‌اند
 *
 * ✅ فاز ۵: کاملاً از بک‌اند می‌خواند.
 * - استان‌ها: GET /locations/provinces/
 * - شهرها: GET /locations/provinces/{province_id}/cities/
 */
import { useState, useEffect } from 'react';
import { locationsService } from '@/api';

/**
 * دریافت لیست استان‌ها از بک‌اند
 */
export const useProvinces = () => {
  const [provinces, setProvinces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const fetch = async () => {
      try {
        const result = await locationsService.getProvinces();
        setProvinces(
          (result.data || []).map((p) => ({
            id: String(p.id),
            label: p.name,
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, []);

  return { provinces, isLoading, error };
};

/**
 * دریافت لیست شهرهای یک استان از بک‌اند
 */
export const useCities = (provinceId) => {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!provinceId) {
      setCities([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    const fetch = async () => {
      try {
        const result = await locationsService.getCities(provinceId);
        setCities(
          (result.data || []).map((c) => ({
            id: String(c.id),
            label: c.name,
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [provinceId]);

  return { cities, isLoading, error };
};
