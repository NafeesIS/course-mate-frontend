import HeroWrapper from '@/components/shared/HeroWrapper';

import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata } from 'next';
import TermsConditions from './_components/TermsConditions';

export const revalidate = 600; // cache for 1 hour

export const metadata: Metadata = {
  metadataBase: new URL(`${BASE_URL_FRONTEND}/terms-and-conditions`),
  title: 'Terms and Conditions | FileSure',
  description: `Read the terms and conditions for using the FileSure platform. Learn about user accounts, content use, intellectual property, liability, and more.`,
  applicationName: 'FileSure',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'terms and conditions',
    'FileSure',
    'user account',
    'content',
    'intellectual property',
    'termination',
    'limitation of liability',
    'governing law',
  ],

  // Open Graph metadata for social media
  openGraph: {
    siteName: 'FileSure',
    type: 'website', // Since this represents the site, use 'website'
    locale: 'en_US',
    title: 'Terms and Conditions | FileSure',
    description: `Read the terms and conditions for using the FileSure platform. Learn about user accounts, content use, intellectual property, liability, and more.`,
    url: `${BASE_URL_FRONTEND}/terms-and-conditions`,
  },

  alternates: {
    canonical: `${BASE_URL_FRONTEND}/terms-and-conditions`, // Canonical URL for the home page
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

      <TermsConditions />
    </div>
  );
};

export default page;
