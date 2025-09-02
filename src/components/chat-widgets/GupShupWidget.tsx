'use client';

import Script from 'next/script';
import { useEffect } from 'react';

interface WhatsAppOptInProps {
  appId: string;
  appName: string;
  source?: string;
  env?: string;
  lang?: string;
  buttonStyle?: React.CSSProperties;
}

const GupShupWhatsAppOptIn = ({
  appId,
  appName,
  source = 'WEB',
  env = 'QA',
  lang = 'en_US',
  buttonStyle,
}: WhatsAppOptInProps) => {
  // Widget script integration
  useEffect(() => {
    return () => {
      const widget = document.querySelector('.gs-widget-container');
      if (widget) {
        widget.remove();
      }
    };
  }, []);

  // Direct URL opt-in handler
  const handleDirectOptIn = () => {
    const optInUrl = `https://www.gupshup.io/whatsapp/optin/?bId=${appId}&bName=${appName}&s=URL&lang=${lang}`;
    window.open(optInUrl, '_blank');
  };

  // QR code opt-in handler using wa.me link
  const handleWaMeOptIn = () => {
    const waUrl = 'https://wa.me/message/QUH7ODZLO7CZK1'; // Replace with your wa.me link
    window.open(waUrl, '_blank');
  };

  return (
    <div className='flex flex-col gap-4'>
      {/* Widget Integration */}
      <Script
        src='https://www.buildquickbots.com/gsui/js/embedScript/gs_wa_widget.js'
        strategy='lazyOnload'
        data-appid={appId}
        data-appname={appName}
        data-source={source}
        data-env={env}
        data-lang={lang}
      />

      {/* Direct Opt-in Button */}
      <button
        onClick={handleDirectOptIn}
        className='rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700'
        style={buttonStyle}
      >
        Opt-in via Direct Link
      </button>

      {/* WA.me Opt-in Button */}
      <button
        onClick={handleWaMeOptIn}
        className='rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700'
        style={buttonStyle}
      >
        Opt-in via WhatsApp
      </button>
    </div>
  );
};

export default GupShupWhatsAppOptIn;
