'use client';

import { useEffect } from 'react';

// declare global {
//   // eslint-disable-next-line no-unused-vars
//   interface Window {
//     // eslint-disable-next-line no-unused-vars
//     CreateWhatsappChatWidget: (options: any) => void;
//   }
// }

const WhatsappChatWidget: React.FC = () => {
  useEffect(() => {
    const url =
      'https://wati-integration-prod-service.clare.ai/v2/watiWidget.js?78062';
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = url;

    const options = {
      enabled: true,
      chatButtonSetting: {
        backgroundColor: '#2386d2',
        ctaText: 'Chat with us',
        borderRadius: '25',
        marginLeft: '0',
        marginRight: '20',
        marginBottom: '20',
        ctaIconWATI: false,
        position: 'right',
        transitionDuration: '2s',
      },
      brandSetting: {
        brandName: 'FileSure',
        brandSubTitle:
          'Instant Access to Indian Company Compliance and Business Profiles',
        // brandImg: 'https://i.ibb.co/d02t7mX/IMG-20240730-134548.jpg',
        brandImg: 'https://i.ibb.co/Mc2N8px/filesure-logo.png',
        welcomeText: 'Hi there!\nHow can I help you?',
        messageText: '',
        // backgroundColor: '#2386d2',
        backgroundColor: '#FFF',
        ctaText: 'Chat with us',
        borderRadius: '25',
        autoShow: false,
        // autoShow: true,
        phoneNumber: '918104946419',
      },
    };

    script.onload = () => {
      if (typeof window.CreateWhatsappChatWidget !== 'undefined') {
        window.CreateWhatsappChatWidget(options);
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

export default WhatsappChatWidget;
