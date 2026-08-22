// src/hooks/useLocationOptions.js
/**
* هوک دریافت استان‌ها و شهرها از بک‌اند با کش
*
* جایگزین ثابت‌های هاردکد PROVINCES و CITIES در exploreFilters
*/
import { useState, useEffect } from 'react';
import { locationsService } from '@/api';
import { useApiCacheStore } from '@/stores/useApiCacheStore';

// کلیدهای کش
const PROVINCES_KEY = 'locations_provinces';
const CITY_PREFIX = 'locations_cities_';

/**
* دریافت لیست استان‌ها از بک‌اند
* @returns {{ provinces: Array<{id, label}>, isLoading, error }}
*/
export const useProvinces = () => {
  const [provinces, setProvinces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoading(true);
      try {
        const result = await locationsService.getProvinces();
        setProvinces(
          (result.data || []).map((p) => ({ id: String(p.id), label: p.name }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  return { provinces, isLoading, error };
};

/**
* دریافت لیست شهرهای یک استان از بک‌اند
* @param {string} provinceId - شناسه استان
* @returns {{ cities: Array<{id, label}>, isLoading, error }}
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

    const fetchCities = async () => {
      setIsLoading(true);
      try {
        const result = await locationsService.getCities(provinceId);
        setCities(
          (result.data || []).map((c) => ({ id: String(c.id), label: c.name }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, [provinceId]);

  return { cities, isLoading, error };
};