import AssociatedDirectors from '@/app/(root)/director/_components/AssociatedDirectors';
import DirectorNotFound from '@/app/(root)/director/_components/DirectorNotFound';
import DirectorFAQ from '@/app/(root)/director/_components/FAQ';
import Hero from '@/app/(root)/director/_components/Hero';
import Overview from '@/app/(root)/director/_components/Overview';
import ProfileDetails from '@/app/(root)/director/_components/ProfileDetails';
import Timeline from '@/app/(root)/director/_components/Timeline';
import { BASE_URL_FRONTEND } from '@/constants';
import { formatName, formatToUrl, toCamelCase } from '@/lib/formatters';
import { generateSingleDirectorJsonLd } from '../_utils/json_ld';
import {
  generateDirectorMetadataDescription,
  generateDirectorMetadataKeywords,
} from '../_utils/meta_data';

import type { Metadata } from 'next';
import BuyContactDetailsCTA from '../../company/_components/About/BuyContactDetails';
import { getDirectorDetailsData } from '../_services/getDirectorDetailsData';

export const revalidate = 3600; // cache for 1 hour

type Props = {
  params: {
    slug: string[];
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [name, dinNo] = params.slug;
  const pageData: any = await getDirectorDetailsData(dinNo);
  const { fullName } = pageData.data || {};
  const directorName = fullName
    ? toCamelCase(formatName(fullName))
    : toCamelCase(name.split('-').join(' '));
  const title = `${directorName} - Director Insights, Profile, and Associated Companies | FileSure`;
  const description = pageData.data
    ? generateDirectorMetadataDescription(pageData.data)
    : '';
  const keywords = pageData.data
    ? generateDirectorMetadataKeywords(pageData.data)
    : [];

  return {
    metadataBase: new URL(
      `${BASE_URL_FRONTEND}/director/${formatToUrl(name)}/${dinNo}`
    ),
    title: title,
    description: description,
    applicationName: 'FileSure',
    referrer: 'origin-when-cross-origin',
    keywords: keywords,
    authors: [{ name: 'FileSure Team', url: BASE_URL_FRONTEND }],
    creator: 'FileSure',
    publisher: 'FileSure',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    category: 'Business Intelligence',
    openGraph: {
      siteName: 'FileSure',
      type: 'website', // Since this represents the site, use 'website'
      locale: 'en_US',
      title: title,
      description: description,
      url: `${BASE_URL_FRONTEND}/director/${formatToUrl(name)}/${dinNo}`,
      images: [
        {
          url: `${BASE_URL_FRONTEND}/assets/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: 'FileSure - Access Indian Company and Director Profiles',
        },
      ],
    },
    alternates: {
      canonical: `${BASE_URL_FRONTEND}/director/${formatToUrl(name)}/${dinNo}`,
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
}

const page = async ({ params }: { params: { slug: string[] } }) => {
  // eslint-disable-next-line no-unused-vars
  const [name, din] = params.slug;
  const directorData = await getDirectorDetailsData(din);
  const directorJsonLd =
    (directorData.data && generateSingleDirectorJsonLd(directorData)) || {};

  return (
    <div className='min-h-screen overflow-hidden pb-12'>
      {directorData.data === null ? (
        <DirectorNotFound />
      ) : (
        <>
          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{ __html: JSON.stringify(directorJsonLd) }}
          />

          <Hero directorData={directorData.data} />
          <Overview directorData={directorData.data} />

          <div className='wrapper'>
            <BuyContactDetailsCTA din={din} className='rounded-md' />
          </div>

          <Timeline
            directorData={directorData.data}
            className='mt-8 md:mt-10'
          />

          <ProfileDetails
            directorData={directorData.data}
            className='mt-8 md:mt-10'
          />
          <AssociatedDirectors din={din} className='mt-8 md:mt-10' />
          <DirectorFAQ
            directorData={directorData.data}
            className='mt-8 md:mt-10'
          />
        </>
      )}
    </div>
  );
};

export default page;
