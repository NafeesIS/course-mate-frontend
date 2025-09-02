'use client';
import { useCallback, useEffect, useState } from 'react';

/**
 * Loads reCAPTCHA v3 and exposes an execute(action) helper.
 * Ensure NEXT_PUBLIC_RECAPTCHA_SITE_KEY is set.
 */
export function useRecaptchaV3() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as
    | string
    | undefined;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!siteKey) return; // missing key

    // If already present, mark ready once grecaptcha is available
    if (typeof window !== 'undefined' && (window as any).grecaptcha) {
      setReady(true);
      return;
    }

    // Inject script once
    const id = 'recaptcha-v3-script';
    if (document.getElementById(id)) return;
    const s = document.createElement('script');
    s.id = id;
    s.async = true;
    s.defer = true;
    s.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    s.onload = () => setReady(true);
    document.body.appendChild(s);

    return () => {
      // Keep script for reuse; do not remove on unmount
    };
  }, [siteKey]);

  const execute = useCallback(
    async (action: string) => {
      if (!siteKey) throw new Error('reCAPTCHA site key not configured.');
      if (typeof window === 'undefined')
        throw new Error('Window not available');
      const grecaptcha = (window as any).grecaptcha;
      if (!grecaptcha || !grecaptcha.execute)
        throw new Error('reCAPTCHA not ready');
      const token = await grecaptcha.execute(siteKey, { action });
      return token as string;
    },
    [siteKey]
  );

  return { ready, execute };
}
