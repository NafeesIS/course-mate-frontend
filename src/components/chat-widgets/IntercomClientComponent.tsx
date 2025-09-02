/* eslint-disable camelcase */
'use client';
import { useEffect } from 'react';

const IntercomClientComponent: React.FC = () => {
  useEffect(() => {
    window.intercomSettings = {
      api_base: 'https://api-iam.intercom.io',
      app_id: 'uup7e04c',
    };
    if (window.Intercom) {
      window.Intercom('reattach_activator');
      window.Intercom('update', window.intercomSettings);
    } else {
      const intercomScript = document.createElement('script');
      intercomScript.type = 'text/javascript';
      intercomScript.async = true;
      intercomScript.src = 'https://widget.intercom.io/widget/uup7e04c';
      intercomScript.onload = () =>
        window.Intercom('update', window.intercomSettings);
      document.body.appendChild(intercomScript);
    }
  }, []);
  return null; // This component does not render anything visually.
};

export default IntercomClientComponent;
