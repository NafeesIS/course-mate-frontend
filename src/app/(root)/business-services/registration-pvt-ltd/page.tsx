import HeroWrapper from '@/components/shared/HeroWrapper';
import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata, Viewport } from 'next';
import ContentWriter from '../registration-llp/_components/ContentWriter';
import DocumentsRequired from './_components/DocumentsRequired';
import Hero from './_components/Hero';
import IncorporationPrivateCompany from './_components/IncorporationPrivateCompany';
import Overview from './_components/Overview';
import PostIncorporation from './_components/PostIncorporation';
import ProcessIncorporation from './_components/ProcessIncorporation';
import WhatsNext from './_components/WhatsNext';
import WhyIncorporate from './_components/WhyIncorporate';

export const metadata: Metadata = {
  metadataBase: new URL(
    `${BASE_URL_FRONTEND}/business-services/registration-pvt-ltd`
  ),
  title:
    'Private Limited Company Registration | Register Your Business in India | FileSure',
  description: `Start your Private Limited Company registration with expert assistance from FileSure. Enjoy a simple and secure online process. Get post-incorporation support for a successful business launch.`,
  applicationName: 'FileSure',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'private limited company registration',
    'company registration India',
    'online company registration',
    'incorporation of private limited company',
    'business registration',
    'register private limited company',
    'startup registration India',
    'post incorporation compliance',
    'business setup India',
    'corporate registration India',
    'company incorporation',
    'limited liability protection',
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
      'Private Limited Company Registration | Secure Your Business in India | FileSure',
    description:
      'Register your Private Limited Company in India with expert guidance from FileSure. Get post-incorporation support and legal compliance assistance.',
    url: `${BASE_URL_FRONTEND}/business-services/registration-pvt-ltd`,
    images: [
      {
        url: `${BASE_URL_FRONTEND}/assets/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: 'Private Limited Company Registration with FileSure',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@FileSure',
    creator: '@FileSure',
    title: 'Private Limited Company Registration | Fast & Simple | FileSure',
    description:
      'Start your Private Limited Company with FileSure. Get expert guidance, compliance support, and a smooth online process for business registration.',
    images: [`${BASE_URL_FRONTEND}/assets/twitter-image.png`],
  },
  category: 'Business Services',
  alternates: {
    canonical: `${BASE_URL_FRONTEND}/business-services/registration-pvt-ltd`,
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

const PrivateCompanyRegistrationPage = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Private Limited Company Registration | Filesure',
    description:
      'Get expert assistance for registering a Private Limited Company in India. Starting at ₹999/- only, Filesure offers post-incorporation support and a simple, secure online process.',
    image: '${BASE_URL_FRONTEND}/assets/opengraph-image.png',
    brand: {
      '@type': 'Brand',
      name: 'FileSure',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      price: '999',
      url: `${BASE_URL_FRONTEND}/business-services/registration-pvt-ltd`,
    },
    keywords:
      'private limited company registration, company registration in India, business registration, startup registration, limited liability company, company incorporation, post incorporation compliance, business entity formation, corporate compliance',
    category: 'Business Services',
    applicationCategory: 'Business Software',
    audience: {
      '@type': 'Audience',
      audienceType: 'Startups, Entrepreneurs, Business Owners, Corporate',
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
      reviewCount: '200',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL_FRONTEND}/business-services/registration-pvt-ltd`,
      query: 'Private Limited Company Registration',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL_FRONTEND}/business-services/registration-pvt-ltd`,
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
      {/* <PricingCardsPLC /> */}
      <Overview />
      <WhyIncorporate />
      <IncorporationPrivateCompany />
      <DocumentsRequired />
      <ProcessIncorporation />
      <WhatsNext />
      <PostIncorporation />
      <ContentWriter />
    </div>
  );
};

export default PrivateCompanyRegistrationPage;
