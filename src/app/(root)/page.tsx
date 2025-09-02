import Analysis from '@/app/(root)/_components/homepage/Analysis';
import ExploreDirectors from '@/app/(root)/_components/homepage/ExploreDirectors';
import FAQ from '@/app/(root)/_components/homepage/FAQ';
import Hero from '@/app/(root)/_components/homepage/Hero';
import PopularSearchesGlobal from '@/app/(root)/_components/homepage/PopularSearchesGlobal';
import RecentlyIncorporatedLoader, {
  PopularSearchesGlobalLoader,
} from '@/app/(root)/_components/homepage/RecentCompaniesLoader';
import RecentlyIncorporated from '@/app/(root)/_components/homepage/RecentlyIncorporated';
import { BASE_URL_FRONTEND } from '@/constants';
import { homepageJsonLd } from './_utils/json_ld';
import {
  HOME_META_DESCRIPTION,
  HOME_META_KEYWORDS,
  HOME_META_TITLE,
} from './_utils/meta_data';

import BannerNewCompanyAlert2 from '@/components/custom-ad-banners/BannerNewCompanyAlert2';
import BannerUnlockDirectorsContact2 from '@/components/custom-ad-banners/BannerUnlockDirectorsContact2';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const revalidate = 60; // cache for 1 minute

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL_FRONTEND),
  title: HOME_META_TITLE,
  description: HOME_META_DESCRIPTION,
  applicationName: 'FileSure',
  referrer: 'origin-when-cross-origin',
  keywords: HOME_META_KEYWORDS,
  authors: [{ name: 'FileSure Team', url: BASE_URL_FRONTEND }],
  creator: 'FileSure',
  publisher: 'FileSure',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: 'Business Intelligence',
  alternates: {
    canonical: BASE_URL_FRONTEND, // Canonical URL for the home page
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: 'index, follow', // Ensures Googlebot crawls and indexes the site
  },
  openGraph: {
    siteName: 'FileSure',
    type: 'website',
    locale: 'en_US',
    title: `${HOME_META_TITLE}`,
    description: `${HOME_META_DESCRIPTION}`,
    url: BASE_URL_FRONTEND,
    images: [
      {
        url: `${BASE_URL_FRONTEND}/assets/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: 'FileSure - Access Indian Company and Director Profiles',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@FileSure',
    creator: '@FileSure',
    title: `${HOME_META_TITLE}`,
    description: `${HOME_META_DESCRIPTION}`,
    images: [`${BASE_URL_FRONTEND}/assets/twitter-image.png`],
  },
};

const page = () => {
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />

      <Hero />

      <Suspense fallback={<RecentlyIncorporatedLoader />}>
        <RecentlyIncorporated />
      </Suspense>

      <section className='wrapper mb-8'>
        <BannerNewCompanyAlert2 />
      </section>

      <Suspense fallback={<PopularSearchesGlobalLoader />}>
        <PopularSearchesGlobal />
      </Suspense>

      <Analysis />

      {/* <Interested /> */}

      <ExploreDirectors />

      <section className='wrapper mb-8 mt-16'>
        <BannerUnlockDirectorsContact2 />
      </section>

      {/* <EssentialFeatures /> */}

      <FAQ />

      {/* <FindCompany /> */}

      {/* <GoogleAdUnit>
        <AdsBanner />
      </GoogleAdUnit> */}
    </>
  );
};

export default page;
