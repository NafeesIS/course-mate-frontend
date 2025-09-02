import HeroWrapper from '@/components/shared/HeroWrapper';
import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata } from 'next';
import PrivacyPolicy from './_components/PrivacyPolicy';

export const revalidate = 600; // cache for 1 hour

export const metadata: Metadata = {
  metadataBase: new URL(`${BASE_URL_FRONTEND}/privacy-policy`),
  title: 'Privacy Policy | FileSure',
  description:
    'Read our privacy policy to understand how we collect, use, and safeguard your personal information.',
  applicationName: 'FileSure',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'privacy policy',
    'FileSure',
    'data collection and use',
    'data sharing and disclosure',
    'cookie policy',
    'user rights',
    'intellectual property',
    'security',
    'data protection',
  ],
  openGraph: {
    siteName: 'FileSure',
    type: 'website',
    locale: 'en_US',
    title: 'Privacy Policy | FileSure',
    description:
      'Read our privacy policy to understand how we collect, use, and safeguard your personal information.',
    url: `${BASE_URL_FRONTEND}/privacy-policy`,
  },
  alternates: {
    canonical: `${BASE_URL_FRONTEND}/privacy-policy`,
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

const PrivacyPolicyPage = () => {
  return (
    <div>
      <HeroWrapper className='h-14 overflow-hidden md:h-16'>
        <div></div>
      </HeroWrapper>
      <PrivacyPolicy />
    </div>
  );
};

export default PrivacyPolicyPage;
