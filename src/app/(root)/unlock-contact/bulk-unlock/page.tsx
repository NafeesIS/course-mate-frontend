import { BASE_URL_FRONTEND } from '@/constants';
import HeroBanner from './_components/HeroBanner';
import PricingSection from './_components/PricingSection';
import SupportSection from './_components/SupportSection';
import WhatsIncluded from './_components/WhatsIncluded';

export async function generateMetadata() {
  return {
    metadataBase: new URL(`${BASE_URL_FRONTEND}/unlock-contact/bulk-unlock`),
    title: 'Bulk Unlock Director Data | FileSure',
    description:
      'Access verified director data in bulk for lead generation, marketing campaigns, and business development at discounted rates. Unlock valuable insights for your business growth.',
    keywords: [
      'unlock directors contacts',
      'get director contact information',
      'indian directors mobile number',
      'indian directors email',
      'indian ceo',
      'indian company founders contact',
      'director data',
      'bulk unlock',
      'lead generation',
      'business development',
      'marketing campaigns',
    ],
    authors: [{ name: 'FileSure Team', url: BASE_URL_FRONTEND }],
    creator: 'FileSure',
    publisher: 'FileSure',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: 'Bulk Unlock Director Data | FileSure',
      description:
        'Access verified director data in bulk for lead generation and business growth.',
      url: new URL(`${BASE_URL_FRONTEND}/unlock-contact/bulk-unlock`),
      siteName: 'FileSure',
      images: [
        {
          url: `${BASE_URL_FRONTEND}/assets/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: 'Bulk Unlock Director Data',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Bulk Unlock Director Data | FileSure',
      description:
        'Access verified director data in bulk for lead generation and business growth.',
      images: [`${BASE_URL_FRONTEND}/assets/twitter-image.png`],
    },
    alternates: {
      canonical: new URL(`${BASE_URL_FRONTEND}/unlock-contact/bulk-unlock`),
    },
    category: 'Business Intelligence',
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
      googleBot: 'index, follow',
    },
  };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Bulk Director Data Unlock',
  description:
    'Access verified director data in bulk for lead generation, marketing campaigns, and business development at discounted rates.',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice: '350',
    highPrice: '10000',
  },
  brand: {
    '@type': 'Brand',
    name: 'FileSure',
  },
  features: [
    'Verified and reliable data',
    'Secure and private searches',
    'Marketing and lead generation insights',
    'Bulk unlock discounts',
    '365 days validity',
    'Advanced search capabilities',
  ],
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
    target: `${BASE_URL_FRONTEND}/unlock-contact/bulk-unlock`,
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '150',
  },
};

const BulkUnlockPage = () => {
  return (
    <>
      <script
        id='unlockBulkContactJsonLd'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className='h-14 overflow-hidden bg-gradient-to-r from-midnight-blue to-navy-blue md:h-16'></div>

      {/* Banner */}
      <HeroBanner />

      {/* Pricing Cards */}
      <PricingSection />

      {/* What's Included */}
      <WhatsIncluded />

      {/* call for support or queries */}
      <SupportSection />
    </>
  );
};

export default BulkUnlockPage;
