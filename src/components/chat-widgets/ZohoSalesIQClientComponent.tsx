/* eslint-disable camelcase */
'use client';

import { useEffect } from 'react';

const ZohoSalesIQClientComponent: React.FC = () => {
  useEffect(() => {
    const $zoho = (window.$zoho = window.$zoho || {});
    $zoho.salesiq = $zoho.salesiq || {
      widgetcode:
        'siqfdfd673e45b0beaf635825012a948b02ad184817680e5adb835e2ac3a87130026c79bc0ad59b8370d21e53359b514b9b',
      values: {},
      ready: function () {
        // Additional logic can be added here if needed
      },
    };

    const d = document;
    const s = d.createElement('script');
    s.type = 'text/javascript';
    s.id = 'zsiqscript';
    s.defer = true;
    s.src = 'https://salesiq.zoho.in/widget';
    const t = d.getElementsByTagName('script')[0];
    t.parentNode?.insertBefore(s, t);

    // Create the div element
    const widgetDiv = d.createElement('div');
    widgetDiv.id = 'zsiqwidget';
    d.body.appendChild(widgetDiv);
  }, []);

  return null; // This component does not render anything visually.
};

export default ZohoSalesIQClientComponent;
