import { PartnersDataTable } from '@/app/(root)/partners/_components/PartnerDataTable';
import { getPartnersData } from '@/app/(root)/partners/_services/getPartnersData';
import HeroWrapper from '@/components/shared/HeroWrapper';
import { BASE_URL_FRONTEND } from '@/constants';
import { Metadata } from 'next';

export const revalidate = 600; // cache for 1 hour

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Company Secretary Directory | FileSure - Partners';
  const description =
    'Explore the Company Secretary Directory at FileSure. Find top professionals and their contact details.';
  const keywords = [
    'Company Secretaries',
    'Company Secretary Directory',
    'Partners',
    'Professional Directory',
    'CS Partners',
    'FileSure',
    'Partner List',
  ];

  // Open Graph metadata for social media sharing
  const openGraph = {
    title,
    description,
    type: 'website', // This page represents a list/directory, not a profile
    url: `${BASE_URL_FRONTEND}/partners`,
  };

  return {
    title,
    description,
    keywords,
    openGraph,
    alternates: {
      canonical: `${BASE_URL_FRONTEND}/partners`, // Canonical link for SEO
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

const page = async () => {
  const partnersData = await getPartnersData();

  return (
    <div className='pb-10'>
      <HeroWrapper className='overflow-hidden pb-16 pt-20'>
        <div className='text-center'>
          <h1 className='text-xl font-semibold md:text-2xl'>
            Company Secretary Directory
          </h1>
        </div>
      </HeroWrapper>

      <PartnersDataTable partnersData={partnersData.data || []} />

      {/* <GoogleAdUnit>
        <AdsBanner />
      </GoogleAdUnit> */}
    </div>
  );
};

export default page;
