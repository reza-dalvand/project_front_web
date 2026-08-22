// src/hooks/useCategoryOptions.js
/**
* هوک دریافت دسته‌بندی‌ها از بک‌اند با کش
*
* جایگزین ثابت‌های هاردکد BUSINESS_TYPES, MAIN_CATEGORIES,
* SUB_CATEGORIES, SERVICE_CATEGORIES و CATEGORY_SUB_SERVICES
*/
import { useState, useEffect } from 'react';
import { categoriesService } from '@/api';
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

// نگاشت آیکون بر اساس نام
const ICON_MAP = {
  nail: FiEdit3,
  skin: FiHeart,
  hair: FiScissors,
  makeup: FiFeather,
  laser: FiZap,
  eyelash: FiEye,
  massage: FiDroplet,
  other: FiMoreHorizontal,
  default: FiStar,
};

// نگاشت رنگ بر اساس نام
const COLOR_MAP = {
  nail: '#7B1FA2',
  skin: '#C2185B',
  hair: '#0277BD',
  makeup: '#AD1457',
  laser: '#00838F',
  eyelash: '#4527A0',
  massage: '#2E7D32',
  keratin: '#E65100',
  other: '#455A64',
  default: '#455A64',
};

// نگاشت گرادیان بر اساس نام
const GRADIENT_MAP = {
  nail: ['#E1BEE7', '#BA68C8'],
  skin: ['#F8BBD9', '#F48FB1'],
  hair: ['#B3E5FC', '#4FC3F7'],
  makeup: ['#F8BBD0', '#EC407A'],
  laser: ['#B2EBF2', '#26C6DA'],
  eyelash: ['#D1C4E9', '#7E57C2'],
  massage: ['#C8E6C9', '#66BB6A'],
  keratin: ['#FFE082', '#FFB74D'],
  other: ['#CFD8DC', '#90A4AE'],
  default: ['#CFD8DC', '#90A4AE'],
};

/**
* دریافت دسته‌بندی‌های کسب‌وکار از بک‌اند
* جایگزین: BUSINESS_TYPES و BUSINESS_CATEGORIES
*/
export const useBusinessCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const result = await categoriesService.getBusinessCategories();
        setCategories(
          (result.data || []).map((c) => ({ id: String(c.id), label: c.name }))
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

/**
* دریافت دسته‌بندی‌های خدمات از بک‌اند
* جایگزین: MAIN_CATEGORIES, SUB_CATEGORIES, SERVICE_CATEGORIES
*/
export const useServiceCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const result = await categoriesService.getServiceCategories();
        setCategories(
          (result.data || []).map((c) => ({
            id: String(c.id),
            label: c.name,
            icon: ICON_MAP[c.icon] || ICON_MAP.default,
            color: COLOR_MAP[c.icon] || COLOR_MAP.default,
            gradient: GRADIENT_MAP[c.icon] || GRADIENT_MAP.default,
            subServices: (c.sub_services || []).map((s) => ({
              id: String(s.id),
              label: s.name,
            })),
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

/**
* دریافت زیرخدمات یک دسته‌بندی از بک‌اند
* جایگزین: CATEGORY_SUB_SERVICES
*/
export const useSubServices = (categoryId) => {
  const [subServices, setSubServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId) {
      setSubServices([]);
      return;
    }

    const fetch = async () => {
      setIsLoading(true);
      try {
        const result = await categoriesService.getServiceCategories();
        const cat = (result.data || []).find((c) => String(c.id) === String(categoryId));
        setSubServices(
          (cat?.sub_services || []).map((s) => ({
            id: String(s.id),
            label: s.name,
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [categoryId]);

  return { subServices, isLoading, error };
};