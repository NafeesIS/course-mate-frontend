import { Metadata } from 'next';
import ROICalculator from './_components/ROICalculator';

export const metadata: Metadata = {
  title:
    'Marketing ROI Calculator | Calculate Your Campaign Returns | FileSure',
  description:
    'Calculate the return on investment for your multi-channel marketing campaigns across SMS, Email, WhatsApp, and Calls.',
  openGraph: {
    title:
      'Marketing ROI Calculator | Calculate Your Campaign Returns | FileSure',
    description:
      'Calculate the return on investment for your multi-channel marketing campaigns across SMS, Email, WhatsApp, and Calls.',
    type: 'website',
    images: [
      {
        url: '/images/roi-calculator-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Marketing ROI Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Marketing ROI Calculator | Calculate Your Campaign Returns | FileSure',
    description:
      'Calculate the return on investment for your multi-channel marketing campaigns across SMS, Email, WhatsApp, and Calls.',
  },
};

export default function Page() {
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Marketing ROI Calculator',
            description:
              'Calculate the return on investment for your multi-channel marketing campaigns across SMS, Email, WhatsApp, and Calls.',
            applicationCategory: 'BusinessApplication',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'INR',
            },
          }),
        }}
      />
      <ROICalculator />
    </>
  );
}
