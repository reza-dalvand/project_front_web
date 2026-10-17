// src/hooks/useCategoryOptions.js
/**
 * هوک دریافت دسته‌بندی‌ها از بک‌اند
 *
 * ✅ فاز ۵: کاملاً از بک‌اند می‌خواند.
 * ✅ FIX: بهینه‌سازی useSubServices با استفاده از cache محلی
 * ✅ FIX: سازگاری پارامترهای location در همه هوک‌ها
 */
import { useState, useEffect, useRef } from 'react';
import { categoriesService } from '@/api';
import { useGlobalLocationStore } from '@/stores/useGlobalLocationStore';
import { useShallow } from 'zustand/react/shallow';

import {
  FiEdit3,
  FiHeart,
  FiScissors,
  FiFeather,
  FiZap,
  FiEye,
  FiDroplet,
  FiMoreHorizontal,
  FiStar,
  FiSun,
} from 'react-icons/fi';

// نگاشت آیکون بر اساس نام آیکون بک‌اند
const ICON_MAP = {
  nail: FiEdit3,
  skin: FiHeart,
  hair: FiScissors,
  makeup: FiFeather,
  laser: FiZap,
  eyelash: FiEye,
  massage: FiDroplet,
  waxing: FiDroplet,
  bridal: FiStar,
  tattoo: FiEdit3,
  skincare: FiDroplet,
  keratin: FiSun,
  other: FiMoreHorizontal,
  default: FiStar,
};

const COLOR_MAP = {
  nail: '#7B1FA2',
  skin: '#C2185B',
  hair: '#0277BD',
  makeup: '#AD1457',
  laser: '#00838F',
  eyelash: '#4527A0',
  massage: '#2E7D32',
  waxing: '#558B2F',
  bridal: '#880E4F',
  tattoo: '#D84315',
  skincare: '#00695C',
  keratin: '#E65100',
  other: '#455A64',
  default: '#455A64',
};

const GRADIENT_MAP = {
  nail: ['#E1BEE7', '#BA68C8'],
  skin: ['#F8BBD9', '#F48FB1'],
  hair: ['#B3E5FC', '#4FC3F7'],
  makeup: ['#F8BBD0', '#EC407A'],
  laser: ['#B2EBF2', '#26C6DA'],
  eyelash: ['#D1C4E9', '#7E57C2'],
  massage: ['#C8E6C9', '#66BB6A'],
  waxing: ['#DCEDC8', '#AED581'],
  bridal: ['#F8BBD0', '#F06292'],
  tattoo: ['#FFCCBC', '#FF8A65'],
  skincare: ['#B2DFDB', '#4DB6AC'],
  keratin: ['#FFE082', '#FFB74D'],
  other: ['#CFD8DC', '#90A4AE'],
  default: ['#CFD8DC', '#90A4AE'],
};

// ✅ FIX: Cache ماژول‌سطح برای جلوگیری از درخواست‌های تکراری
let cachedServiceCategories = null;
let cachedServiceCategoriesTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // ۵ دقیقه

export const useBusinessCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const fetch = async () => {
      try {
        const result = await categoriesService.getBusinessCategories();
        setCategories(
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
  }, []);

  return { categories, isLoading, error };
};

export const useServiceCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const locationParams = useGlobalLocationStore(
    useShallow((state) => ({
      provinceId: state.provinceId,
      cityId: state.cityId,
      latitude: state.latitude,
      longitude: state.longitude,
      locationType: state.locationType,
    }))
  );

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const fetch = async () => {
      try {
        const params = {};
        if (locationParams.provinceId) params.province_id = locationParams.provinceId;
        if (locationParams.cityId) params.city_id = locationParams.cityId;
        if (locationParams.latitude && locationParams.longitude) {
          params.lat = locationParams.latitude;
          params.lng = locationParams.longitude;
        }

        const result = await categoriesService.getServiceCategories(params);

        const mappedCategories = (result.data || []).map((c) => ({
          id: String(c.id),
          label: c.name,
          subServices: (c.sub_services || c.subServices || []).map((s) => ({
            id: String(s.id),
            label: s.name,
            typeId: s.type_id || s.typeId || '',
          })),
        }));

        setCategories(mappedCategories);
        
        // ✅ FIX: ذخیره در cache برای استفاده در useSubServices
        cachedServiceCategories = mappedCategories;
        cachedServiceCategoriesTime = Date.now();
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [
    locationParams.provinceId,
    locationParams.cityId,
    locationParams.latitude,
    locationParams.longitude,
    locationParams.locationType,
  ]);

  return { categories, isLoading, error };
};

/**
 * دریافت زیرخدمات یک دسته‌بندی
 * ✅ FIX: استفاده از cache به جای درخواست API تکراری
 * ✅ FIX: سازگاری پارامترهای location
 */
export const useSubServices = (categoryId) => {
  const [subServices, setSubServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const locationParams = useGlobalLocationStore(
    useShallow((state) => ({
      provinceId: state.provinceId,
      cityId: state.cityId,
      latitude: state.latitude,
      longitude: state.longitude,
      locationType: state.locationType,
    }))
  );

  useEffect(() => {
    if (!categoryId) {
      setSubServices([]);
      return;
    }

    // ✅ FIX: بررسی cache قبل از درخواست API
    const now = Date.now();
    if (cachedServiceCategories && (now - cachedServiceCategoriesTime) < CACHE_TTL) {
      const cat = cachedServiceCategories.find((c) => String(c.id) === String(categoryId));
      setSubServices(cat?.subServices || []);
      return;
    }

    setIsLoading(true);
    setError(null);

    const fetch = async () => {
      try {
        // ✅ FIX: ارسال پارامترهای location برای سازگاری
        const params = {};
        if (locationParams.provinceId) params.province_id = locationParams.provinceId;
        if (locationParams.cityId) params.city_id = locationParams.cityId;
        if (locationParams.latitude && locationParams.longitude) {
          params.lat = locationParams.latitude;
          params.lng = locationParams.longitude;
        }

        const result = await categoriesService.getServiceCategories(params);
        const cat = (result.data || []).find((c) => String(c.id) === String(categoryId));
        
        const mappedSubServices = (cat?.sub_services || cat?.subServices || []).map((s) => ({
          id: String(s.id),
          label: s.name,
          typeId: s.type_id || s.typeId || '',
        }));
        
        setSubServices(mappedSubServices);
        
        // ذخیره در cache
        const allCategories = (result.data || []).map((c) => ({
          id: String(c.id),
          label: c.name,
          subServices: (c.sub_services || c.subServices || []).map((s) => ({
            id: String(s.id),
            label: s.name,
            typeId: s.type_id || s.typeId || '',
          })),
        }));
        cachedServiceCategories = allCategories;
        cachedServiceCategoriesTime = Date.now();
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [
    categoryId,
    locationParams.provinceId,
    locationParams.cityId,
    locationParams.latitude,
    locationParams.longitude,
    locationParams.locationType,
  ]);

  return { subServices, isLoading, error };
};