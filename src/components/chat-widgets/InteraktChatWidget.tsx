'use client';

import { useEffect } from 'react';

export default function InteraktWhatsAppWidget() {
  useEffect(() => {
    const loadInteraktScript = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src =
          'https://app.interakt.ai/kiwi-sdk/kiwi-sdk-17-prod-min.js?v=' +
          new Date().getTime();
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initializeWidget = () => {
      if (typeof window.kiwi !== 'undefined') {
        window.kiwi.init('', 'euXVzgYy3b2rwLqnLTjo7AGi8tgXTZgv', {});
        // eslint-disable-next-line no-console
        console.log('Interakt widget initialized');
      } else {
        console.error('Kiwi object not found');
      }
    };

    loadInteraktScript()
      .then(() => {
        // eslint-disable-next-line no-console
        console.log('Interakt script loaded successfully');
        // Use window.addEventListener to initialize widget when the page fully loads
        // window.addEventListener('load', initializeWidget);
        setTimeout(initializeWidget, 1500);
      })
      .catch((error) => {
        console.error('Failed to load Interakt script:', error);
      });

    return () => {
      // Cleanup the event listener on component unmount
      window.removeEventListener('load', initializeWidget);
    };
  }, []);

  return null; // This component doesn't render anything
}
