import HeroWrapper from '@/components/shared/HeroWrapper';
import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata, Viewport } from 'next';
import ComplianceChecklist from './_components/ComplianceChecklist';
import ContentWriter from './_components/ContentWriter';
import DifferenceLLpPlc from './_components/DifferenceLLpPlc';
import DocumentsRequiredLLP from './_components/DocumentsRequiredLLP';
import FilesureSimplify from './_components/FilesureSimplify';
import Hero from './_components/Hero';
import IncorporationLLP from './_components/IncorporationLLP';
import LLPOverview from './_components/LLPOverview';
import ProcessIncorporationLLP from './_components/ProcessIncorporationLLP';
import WhatsNextLLP from './_components/WhatsNextLLP';
import WhyIncorporateLLP from './_components/WhyIncorprateLLP';

export const metadata: Metadata = {
  metadataBase: new URL(
    `${BASE_URL_FRONTEND}/business-services/registration-llp`
  ),
  title: 'LLP Registration | Limited Liability Partnership in India | FileSure',
  description: `Start your LLP registration with expert assistance from FileSure. Enjoy a simple and secure online process for limited liability partnership registration in India. Get post-incorporation support and compliance services.`,
  applicationName: 'FileSure',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'llp registration',
    'limited liability partnership',
    'online llp registration',
    'incorporation of llp',
    'business registration',
    'register llp',
    'llp registration India',
    'limited liability protection',
    'business setup India',
    'corporate registration India',
    'llp incorporation',
    'startup registration',
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
      'LLP Registration | Limited Liability Partnership in India | FileSure',
    description:
      'Register your LLP in India with expert guidance from FileSure. Enjoy a hassle-free online process, post-incorporation support, and legal compliance assistance for your limited liability partnership.',
    url: `${BASE_URL_FRONTEND}/business-services/registration-llp`,
    images: [
      {
        url: `${BASE_URL_FRONTEND}/assets/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: 'LLP Registration with FileSure',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@FileSure',
    creator: '@FileSure',
    title: 'LLP Registration | Secure Your Business with FileSure',
    description:
      'Start your LLP registration process with FileSure. Get expert assistance, compliance support, and a seamless online process for limited liability partnership registration in India.',
    images: [`${BASE_URL_FRONTEND}/assets/twitter-image.png`],
  },
  category: 'Business Services',
  alternates: {
    canonical: `${BASE_URL_FRONTEND}/business-services/registration-llp`,
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

const LLPRegistrationPage = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Limited Liability Partnership (LLP) Registration | FileSure',
    description:
      'Get expert assistance for registering a Limited Liability Partnership (LLP) in India. Starting at ₹1499/- only, FileSure offers post-incorporation support and a simple, secure online process.',
    image: '${BASE_URL_FRONTEND}/assets/opengraph-image.png',
    brand: {
      '@type': 'Brand',
      name: 'FileSure',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      price: '1499',
      url: `${BASE_URL_FRONTEND}/business-services/registration-llp`,
    },
    keywords:
      'llp registration, limited liability partnership, company registration in India, business registration, startup registration, business entity formation, corporate compliance, post incorporation compliance',
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
      reviewCount: '180',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL_FRONTEND}/business-services/registration-llp`,
      query: 'LLP Registration',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL_FRONTEND}/business-services/registration-llp`,
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
      {/* <PricingCardsLLP /> */}
      <LLPOverview />
      <WhyIncorporateLLP />
      <IncorporationLLP />
      <DocumentsRequiredLLP />
      <ProcessIncorporationLLP />
      <FilesureSimplify />
      <WhatsNextLLP />
      <ComplianceChecklist />
      <DifferenceLLpPlc />
      <ContentWriter />
    </div>
  );
};

export default LLPRegistrationPage;
