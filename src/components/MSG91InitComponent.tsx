'use client';

import { useEffect } from 'react';

const token = '430158TblL20YbEq66e17a4eP1';

const MSG91InitComponent: React.FC = () => {
  useEffect(() => {
    const url = 'https://verify.msg91.com/otp-provider.js';
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = url;

    const configuration = {
      widgetId: '34696b6a3279363439323535',
      tokenAuth: token,
      identifier: '8801753571470', // optional
      // exposeMethods: true,
      exposeMethods: false,
      captchaRenderId: '', // id of the HTML element where to render captcha
      success: (data: any) => {
        // handle success response
        // eslint-disable-next-line no-console
        console.log('Success response:', data);
      },
      failure: (error: any) => {
        // handle error response
        // eslint-disable-next-line no-console
        console.log('Failure reason:', error);
      },
      VAR1: '<VAR1>',
    };

    script.onload = () => {
      if (typeof window.initSendOTP !== 'undefined') {
        window.initSendOTP(configuration);
      } else {
        console.error('Failed to load MSG91 OTP provider script.');
      }
    };

    document.body.appendChild(script);

    // Cleanup function
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default MSG91InitComponent;
