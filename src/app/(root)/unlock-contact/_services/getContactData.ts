/* eslint-disable no-console */
import { BASE_URL_BACKEND } from '@/constants';

export const checkContactStatus = async (din: string) => {
  try {
    const response = await fetch(
      `${BASE_URL_BACKEND}/api/v1/directors/checkContactStatus?din=${din}`
    );

    if (response.status === 400) {
      const res = await response.json();
      return { success: false, message: res.message };
    }

    if (!response.ok) {
      console.log('Error checking contact status');
      return null;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getDirectorDetailsData = async (din: string) => {
  try {
    const response = await fetch(
      `${BASE_URL_BACKEND}/api/v1/directors/directorInfo?din=${din}`
    );

    if (response.status === 400) {
      const res = await response.json();
      return { success: false, message: res.message };
    }

    if (!response.ok) {
      console.log('Error fetching director details');
      return null;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createOrder = async (
  din: string,
  currency: string,
  price: number | string
) => {
  const response = await fetch(
    `${BASE_URL_BACKEND}/api/v1/transactions/create-order`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serviceId: din,
        amount: Number(price) * 100, // Amount in paisa
        currency: currency,
        description: 'Payment for unlocking contact',
      }),
    }
  );
  const order = await response.json();
  return order;
};

export const getDirectorContactData = async (data: any, din: string) => {
  let payload;

  if (data.isPromoCodeEntered) {
    // if promo code exists
    payload = {
      couponCode: data.couponCode,
      serviceId: din,
      email: data.email,
      phoneNumber: data.phoneNumber,
    };
  } else {
    // if promo code doesn't exist: payment via razorpay
    payload = {
      serviceId: din,
      orderId: data.razorpay_order_id,
      paymentId: data.razorpay_payment_id,
      signature: data.razorpay_signature,
    };
  }

  console.log('Razorpay response:', payload);

  const response = await fetch(
    `${BASE_URL_BACKEND}/api/v1/directors/getPaidContactDetails?din=${din}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  if (response.status === 400) {
    const res = await response.json();
    return { success: false, message: res.message };
  }

  if (!response.ok) {
    console.log('Error fetching director contact details', response);
    return null;
  }

  const result = await response.json();
  return result;
};
