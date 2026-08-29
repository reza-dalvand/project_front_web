// src/components/booking/hooks/useBookingName.js
'use client';
import { useState, useMemo } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

/**
 * Hook برای مدیریت مرحله وارد کردن نام کاربر
 * @returns {Object} آبجکت شامل stateها و متدهای مربوط به نام کاربر
 */
export function useBookingName() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [nameErrors, setNameErrors] = useState({ firstName: '', lastName: '', confirm: '' });

  const needsNameStep = useMemo(() => {
    const name = user?.name?.trim();
    return !name || name === 'کاربر بیو کلاب' || name.length < 3;
  }, [user?.name]);

  const validateName = () => {
    const errors = { firstName: '', lastName: '', confirm: '' };
    let isValid = true;

    if (!firstName.trim()) {
      errors.firstName = 'نام الزامی است';
      isValid = false;
    } else if (firstName.trim().length < 2) {
      errors.firstName = 'نام باید حداقل ۲ کاراکتر باشد';
      isValid = false;
    }

    if (!lastName.trim()) {
      errors.lastName = 'نام خانوادگی الزامی است';
      isValid = false;
    } else if (lastName.trim().length < 2) {
      errors.lastName = 'نام خانوادگی باید حداقل ۲ کاراکتر باشد';
      isValid = false;
    }

    if (!nameConfirmed) {
      errors.confirm = 'لطفاً تایید کنید که اطلاعات مطابق کارت بانکی است';
      isValid = false;
    }

    setNameErrors(errors);
    return isValid;
  };

  const prefillNameFromUser = () => {
    if (user?.firstName) setFirstName(user.firstName);
    if (user?.lastName) setLastName(user.lastName);
    if (!user?.firstName && !user?.lastName && user?.name) {
      const parts = user.name.trim().split(' ');
      if (parts.length >= 2) {
        setFirstName(parts[0]);
        setLastName(parts.slice(1).join(' '));
      }
    }
  };

  const updateUserName = () => {
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    updateUser({ 
      name: fullName, 
      firstName: firstName.trim(), 
      lastName: lastName.trim() 
    });
  };

  const resetNameState = () => {
    setFirstName('');
    setLastName('');
    setNameConfirmed(false);
    setNameErrors({ firstName: '', lastName: '', confirm: '' });
  };

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    nameConfirmed,
    setNameConfirmed,
    nameErrors,
    setNameErrors,
    needsNameStep,
    validateName,
    prefillNameFromUser,
    updateUserName,
    resetNameState,
  };
}
