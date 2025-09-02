import HeroWrapper from '@/components/shared/HeroWrapper';

import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata } from 'next';
import RefundPolicy from './_components/RefundPolicy';

export const revalidate = 600; // cache for 1 hour

export const metadata: Metadata = {
  metadataBase: new URL(`${BASE_URL_FRONTEND}/refund-policy`),
  title: 'Refund Policy | FileSure',
  description:
    'Learn about the conditions for refunds, the process for claiming a refund, and the timeframes for processing refunds at FileSure.',
  applicationName: 'FileSure',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'refund policy',
    'FileSure',
    'refund eligibility',
    'refund process',
    'customer satisfaction',
    'refund amount',
  ],

  // Open Graph metadata for social media
  openGraph: {
    siteName: 'FileSure',
    type: 'website', // Since this represents the site, use 'website'
    locale: 'en_US',
    title: 'Refund Policy | FileSure',
    description:
      'Learn about the conditions for refunds, the process for claiming a refund, and the timeframes for processing refunds at FileSure.',
    url: `${BASE_URL_FRONTEND}/refund-policy`,
  },

  alternates: {
    canonical: `${BASE_URL_FRONTEND}/refund-policy`,
  },

  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: 'index, follow', // Ensures Googlebot crawls and indexes the site
  },
};

const page = () => {
  return (
    <div>
      <HeroWrapper className='h-14 overflow-hidden md:h-16'>
        <div></div>
      </HeroWrapper>

      <RefundPolicy />
    </div>
  );
};

export default page;
