import HeroWrapper from '@/components/shared/HeroWrapper';
import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata, Viewport } from 'next';
import FeedbackForm from './_components/FeedbackForm';

export const metadata: Metadata = {
  metadataBase: new URL(`${BASE_URL_FRONTEND}/feedback`),
  title: 'Feedback | Share Your Experience | FileSure',
  description:
    'Provide your valuable feedback on FileSure services. Help us improve with your insights.',
  applicationName: 'FileSure',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'feedback',
    'customer feedback',
    'user feedback',
    'FileSure feedback',
    'service feedback',
    'improve services',
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
    title: 'Feedback | Share Your Experience | FileSure',
    description:
      'Provide your valuable feedback on FileSure services and help us improve.',
    url: `${BASE_URL_FRONTEND}/feedback`,
    images: [
      {
        url: `${BASE_URL_FRONTEND}/assets/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: 'FileSure Feedback Page',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@FileSure',
    creator: '@FileSure',
    title: 'Feedback | Share Your Experience | FileSure',
    description:
      'Provide your feedback to FileSure and help us improve our services.',
    images: [`${BASE_URL_FRONTEND}/assets/twitter-image.png`],
  },
  category: 'Business Intelligence',
  alternates: {
    canonical: `${BASE_URL_FRONTEND}/feedback`,
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

const FeedbackPage = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Feedback | Share Your Experience | FileSure',
    description:
      'Share your feedback on FileSure services to help us improve and better serve you.',
    image: '${BASE_URL_FRONTEND}/assets/opengraph-image.png',
    url: `${BASE_URL_FRONTEND}/feedback`,
    publisher: {
      '@type': 'Organization',
      name: 'FileSure',
    },
    mainEntityOfPage: `${BASE_URL_FRONTEND}/feedback`,
    potentialAction: {
      '@type': 'Action',
      target: `${BASE_URL_FRONTEND}/feedback`,
      actionStatus: 'ActiveActionStatus',
      name: 'Submit Feedback',
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
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroWrapper className='h-14 overflow-hidden md:h-16'>
        <div></div>
      </HeroWrapper>

      <FeedbackForm />
    </div>
  );
};

export default FeedbackPage;
