import HeroWrapper from '@/components/shared/HeroWrapper';
import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata, Viewport } from 'next';
import ContentWriter from '../registration-llp/_components/ContentWriter';
import Advantages from './_component/Advantages';
import AnnualCompliance from './_component/AnnualCompliance';
import AnnualComplianceOverview from './_component/AnnualComplianceOverview';
import ConveningAnnualMeeting from './_component/ConveningAnnualMeeting';
import DirectorsKYC from './_component/DirectorsKYC';
import DocumentsRequired from './_component/DocumentsRequired';
import Hero from './_component/Hero';
import Penalty from './_component/Penalty';
import ProcessAnnualCompliance from './_component/ProcessAnnualCompliance';
import ReturnDeposit from './_component/ReturnDeposit';
import StayCompliant from './_component/StayCompliant';

export const metadata: Metadata = {
  metadataBase: new URL(
    `${BASE_URL_FRONTEND}/business-services/annual-compliance-pvt-ltd`
  ),
  title:
    'Annual Compliance for Private Limited Companies | Stay Compliant with FileSure',
  description:
    'Ensure your Private Limited Company stays compliant with the Companies Act, 2013. FileSure offers annual compliance services starting at ₹9,999/- with a simple and secure online process.',
  applicationName: 'FileSure',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'annual compliance private limited company',
    'company compliance India',
    'private limited company annual return',
    'ROC filing private limited company',
    'business compliance India',
    'company audit services',
    'statutory audit compliance',
    'file company annual return',
    'corporate compliance',
    'business setup India',
    'compliance services',
    'annual return filing',
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
    title:
      'Annual Compliance for Private Limited Companies | Stay Compliant with FileSure',
    description:
      'Ensure your Private Limited Company complies with the Companies Act, 2013. Get expert support with FileSure’s annual compliance services, including filing returns and maintaining transparency.',
    url: `${BASE_URL_FRONTEND}/business-services/annual-compliance-pvt-ltd`,
    images: [
      {
        url: `${BASE_URL_FRONTEND}/assets/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: 'Annual Compliance with FileSure',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@FileSure',
    creator: '@FileSure',
    title:
      'Annual Compliance for Private Limited Companies | Stay Penalty-Free with FileSure',
    description:
      'Get expert guidance and avoid penalties with FileSure’s annual compliance services for Private Limited Companies in India. Simple, fast, and reliable service starting at ₹9,999/- only.',
    images: [`${BASE_URL_FRONTEND}/assets/twitter-image.png`],
  },
  category: 'Business Services',
  alternates: {
    canonical: `${BASE_URL_FRONTEND}/business-services/annual-compliance-pvt-ltd`,
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

const AnnualComplianceForPLC = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Annual Compliance for Private Limited Companies | FileSure',
    description:
      'Get expert assistance with annual compliance for Private Limited Companies in India. Ensure timely filing of returns, conduct AGM, and avoid penalties with FileSure. Starting at ₹9,999/-.',
    image: '${BASE_URL_FRONTEND}/assets/opengraph-image.png',
    brand: {
      '@type': 'Brand',
      name: 'FileSure',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      price: '9999',
      url: '${BASE_URL_FRONTEND}/business-services/annual-compliance-pvt-ltd',
      availability: 'https://schema.org/InStock',
    },
    keywords:
      'annual compliance, private limited company compliance, company annual returns, financial statements filing, AOC-4, MGT-7, AGM compliance, statutory audit, business compliance services',
    category: 'Business Services',
    applicationCategory: 'Business Software',
    audience: {
      '@type': 'Audience',
      audienceType: 'Private Limited Companies, Startups, SMEs, Entrepreneurs',
    },
    provider: {
      '@type': 'Organization',
      name: 'FileSure India Private Limited',
      url: `${BASE_URL_FRONTEND}`,
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
      target:
        '${BASE_URL_FRONTEND}/business-services/annual-compliance-pvt-ltd',
      query: 'Annual Compliance for Private Limited Companies',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': '${BASE_URL_FRONTEND}/business-services/annual-compliance-pvt-ltd',
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
      {/* <AnnualPvtPricing /> */}
      <AnnualComplianceOverview />
      <Advantages />
      <DocumentsRequired />
      <ReturnDeposit />
      <DirectorsKYC />
      <ConveningAnnualMeeting />
      <AnnualCompliance />
      <ProcessAnnualCompliance />
      <StayCompliant />
      <Penalty />
      <ContentWriter />
    </div>
  );
};

export default AnnualComplianceForPLC;
