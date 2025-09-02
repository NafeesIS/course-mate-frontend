import HeroWrapper from '@/components/shared/HeroWrapper';
import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata, Viewport } from 'next';
import ContentWriter from '../registration-llp/_components/ContentWriter';
import AdvantagesLLP from './_component/AdvantagesLLP';
import AnnualComplianceLLP from './_component/AnnualComplianceLLP';
import AnnualComplianceLLPOverview from './_component/AnnualComplianceLLPOverview';
import DocumentsRequired from './_component/DocumentsRequired';
import Hero from './_component/Hero';
import LLPPartnersKYC from './_component/LLPPartnersKYC';
import PenaltyLLP from './_component/PenaltyLLP';
import ProcessAnnualLLP from './_component/ProcessAnnualLLp';
import ProtectLLP from './_component/ProtectLLP';

export const metadata: Metadata = {
  metadataBase: new URL(
    `${BASE_URL_FRONTEND}/business-services/annual-compliance-llp`
  ),
  title: 'Annual Compliance for Limited Liability Partnership | FileSure',
  description: `Ensure your Limited Liability Partnership (LLP) stays compliant with expert guidance from FileSure. Avoid penalties and maintain your LLP's active status with our seamless annual compliance process, starting at ₹9,999/- only.`,
  applicationName: 'FileSure',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'annual compliance LLP',
    'limited liability partnership compliance',
    'LLP annual returns',
    'Form-8 filing',
    'Form-11 filing',
    'LLP financial statements',
    'LLP KYC',
    'LLP compliance services',
    'LLP audit requirements',
    'corporate compliance India',
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
    siteName: 'FileSure',
    type: 'website',
    locale: 'en_IN',
    title: 'Annual Compliance for LLP | Secure Your Business with FileSure',
    description:
      'Get expert assistance with LLP annual compliance, avoid penalties, and ensure smooth business operations with FileSure. Starting at ₹9,999/- only.',
    url: `${BASE_URL_FRONTEND}/business-services/annual-compliance-llp`,
    images: [
      {
        url: `${BASE_URL_FRONTEND}/assets/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: 'Annual Compliance for LLP with FileSure',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@FileSure',
    creator: '@FileSure',
    title: 'Annual Compliance for LLP | FileSure',
    description:
      'FileSure makes LLP compliance easy. Ensure timely filing and avoid penalties with our expert compliance services for LLPs.',
    images: [`${BASE_URL_FRONTEND}/assets/twitter-image.png`],
  },
  category: 'Business Services',
  alternates: {
    canonical: `${BASE_URL_FRONTEND}/business-services/annual-compliance-llp`,
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: 'index, follow',
  },
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

const AnnualComplianceForLLP = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Annual Compliance for Limited Liability Partnership | FileSure',
    description:
      'Get expert assistance for the annual compliance of your Limited Liability Partnership (LLP). Ensure timely filing of Form-8 and Form-11, complete KYC, and avoid penalties. Starting at ₹9,999/- only.',
    image: '${BASE_URL_FRONTEND}/assets/opengraph-image.png',
    brand: {
      '@type': 'Brand',
      name: 'FileSure',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      price: '9999',
      url: '${BASE_URL_FRONTEND}/business-services/annual-compliance-llp',
      availability: 'https://schema.org/InStock',
    },
    keywords:
      'LLP annual compliance, Form-8, Form-11, LLP KYC, LLP audit, limited liability partnership compliance, LLP filing services, LLP compliance services, business compliance India',
    category: 'Business Services',
    applicationCategory: 'Business Software',
    audience: {
      '@type': 'Audience',
      audienceType:
        'Limited Liability Partnerships, SMEs, Business Owners, Entrepreneurs',
    },
    provider: {
      '@type': 'Organization',
      name: 'FileSure India Private Limited',
      url: '${BASE_URL_FRONTEND}',
    },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '4.9',
        bestRating: '5',
      },
      author: {
        '@type': 'Person',
        name: 'Bhagyashree Katkar',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: '${BASE_URL_FRONTEND}/business-services/annual-compliance-llp',
      query: 'Annual Compliance for Limited Liability Partnership',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': '${BASE_URL_FRONTEND}/business-services/annual-compliance-llp',
    },
  };
  return (
    <div>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroWrapper className='h-14 overflow-hidden md:h-16'>
        <div></div>
      </HeroWrapper>
      <Hero />
      {/* <AnnualLLPPricing /> */}
      <AnnualComplianceLLPOverview />
      <AdvantagesLLP />
      <DocumentsRequired />
      <LLPPartnersKYC />
      <AnnualComplianceLLP />
      <ProcessAnnualLLP />
      <ProtectLLP />
      <PenaltyLLP />
      <ContentWriter />
    </div>
  );
};

export default AnnualComplianceForLLP;
