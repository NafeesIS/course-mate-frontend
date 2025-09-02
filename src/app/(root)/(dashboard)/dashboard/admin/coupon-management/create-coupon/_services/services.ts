/* eslint-disable camelcase */

import { BASE_URL_BACKEND } from '@/constants';
import * as z from 'zod';
import { couponSchema } from '../_components/CouponCreationForm';

export const createCoupon = async (data: z.infer<typeof couponSchema>) => {
  const response = await fetch(`${BASE_URL_BACKEND}/api/v1/coupon/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create coupon');
  }

  return response.json();
};

export const fetchUsersByEmail = async (inputValue: string) => {
  if (!inputValue.trim()) return [];

  // Utility functions to validate email and phone
  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidPhone = (value: string) => /^\d{10,15}$/.test(value); // Adjust regex based on your phone format requirements

  // Determine the field to send in the API request
  const requestBody: Record<string, string> = {};
  if (isValidEmail(inputValue)) {
    requestBody.email = inputValue;
  } else if (isValidPhone(inputValue)) {
    requestBody.phone = inputValue;
  } else {
    // If inputValue is neither valid email nor phone, return empty
    return [];
  }

  // Make the API request
  const response = await fetch(`${BASE_URL_BACKEND}/api/v1/users/search-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const result = await response.json();

  if (result.success && result.data) {
    const { emails, meta_data } = result.data;

    // Determine the label
    const label =
      meta_data?.firstName?.trim() || meta_data?.lastName?.trim()
        ? `${meta_data.firstName || ''} ${meta_data.lastName || ''}`.trim()
        : emails[0];

    return emails.map(() => ({
      label,
      value: result.data._id,
    }));
  }

  return [];
};
