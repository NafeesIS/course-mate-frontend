/* eslint-disable camelcase */
import { useEffect } from 'react';

const googleClientScriptURL = 'https://accounts.google.com/gsi/client';
const scriptFlag = '__googleOneTapScript__';

function loadScript(src: string) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export function useGoogleOneTapLogin({
  client_id,
  onSuccess,
}: {
  client_id: string;
  // eslint-disable-next-line no-unused-vars
  onSuccess: (response: any) => void;
}) {
  useEffect(() => {
    if (!window[scriptFlag]) {
      loadScript(googleClientScriptURL).then(() => {
        window.google.accounts.id.initialize({
          client_id,
          callback: onSuccess,
        });
        window.google.accounts.id.prompt();
        window[scriptFlag] = true;
      });
    } else {
      window.google.accounts.id.prompt();
    }
  }, [client_id, onSuccess]);
}
