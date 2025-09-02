/* eslint-disable indent */
import { BASE_URL_FRONTEND } from '@/constants';
import Script from 'next/script';

export default async function UnlockContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Unlock Director Contact Details | FileSure',
    description: `Unlock director contact information only at ₹399. Instant access. No hidden fees.`,
    image: `${BASE_URL_FRONTEND}/assets/opengraph-image.png`,
    brand: {
      '@type': 'Brand',
      name: 'FileSure',
    },
    offers: {
      '@type': 'Offer',
      price: '399',
      priceCurrency: 'INR',
    },
    keywords:
      'unlock directors contacts, get director contact information, indian directors mobile number, indian directors email, indian ceo, indian company founders contact',
    category: 'Business Intelligence',
    applicationCategory: 'Business Software',
    audience: {
      '@type': 'Audience',
      audienceType: 'Business Professionals, Marketers, Sales Teams',
    },
    potentialAction: {
      '@type': 'ViewAction',
      target: `${BASE_URL_FRONTEND}/unlock-contact`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
    },
  };

  return (
    <div>
      <script
        id='unlockSingleContactJsonLd'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Script
        id='razorpay-checkout-js'
        src='https://checkout.razorpay.com/v1/checkout.js'
      />

      {children}
    </div>
  );
}
