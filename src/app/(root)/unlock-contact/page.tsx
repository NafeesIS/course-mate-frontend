/* eslint-disable indent */
import BannerNewCompanyAlert1 from '@/components/custom-ad-banners/BannerNewCompanyAlert1';
import HeroWrapper from '@/components/shared/HeroWrapper';
import { BASE_URL_BACKEND, BASE_URL_FRONTEND } from '@/constants';
import { toCamelCase } from '@/lib/formatters';
import type { Metadata, Viewport } from 'next';
import BulkUnlockCTA from './_components/BulkUnlockCTA';
import SupportedPayOptions from './_components/SupportedPayOptions';
import UnlockContactMainSections from './_components/UnlockContactMainSections';

// Add this line to opt out of caching for all data requests in this route segment
export const dynamic = 'force-dynamic';

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

interface DirectorInfo {
  success: boolean;
  message: string;
  data: {
    din: string;
    fullName: string;
    gender?: string;
    nationality?: string;
    companyData?: any;
  } | null;
}

const getDirectorInfo = async (din: string): Promise<DirectorInfo> => {
  if (!din) {
    return {
      success: false,
      message: 'No DIN provided',
      data: null,
    };
  }

  try {
    const response = await fetch(
      `${BASE_URL_BACKEND}/api/v1/directors/directorInfo?din=${din}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch director info: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching director info:', error);
    return {
      success: false,
      message: 'Failed to fetch director information',
      data: null,
    };
  }
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const din = searchParams?.din as string;
  const queryString = din ? `?din=${din}` : '';

  // Fetch director information
  const directorInfo = await getDirectorInfo(din);

  // Extract director data for metadata
  const directorName = directorInfo?.data?.fullName || 'Director';
  const directorDin = directorInfo?.data?.din || din || '';
  const directorGender = directorInfo?.data?.gender || '';
  const directorNationality = directorInfo?.data?.nationality || '';

  // Get active company information if available
  const companies = directorInfo?.data?.companyData || [];

  // Filter for active companies (those without cessationDate or with empty cessationDate)
  const activeCompanies = companies.filter(
    (company: any) => !company.cessationDate || company.cessationDate === ''
  );

  // Get company names - prefer nameOfTheCompany, fallback to accountName
  const companyNames = activeCompanies
    .map((company: any) => company.nameOfTheCompany || company.accountName)
    .filter(Boolean)
    .join(', ');

  // Get unique designations
  const designations = [
    ...new Set(
      activeCompanies.map((company: any) => company.designation).filter(Boolean)
    ),
  ].join(', ');

  // Create dynamic title and description
  const title = `${din ? `${directorName} Contact Information | DIN: ${directorDin} | FileSure` : 'Unlock Director Contact Information | FileSure'}`;

  let description = `${din ? `Get instant access to mobile number and email at ₹399 of ${directorName} (DIN: ${directorDin})` : 'Get instant access to mobile number and email at ₹399 of directors'}`;

  if (directorGender || directorNationality) {
    const attributes = [
      directorGender && `${toCamelCase(directorGender)}`,
      directorNationality && `, ${toCamelCase(directorNationality)} national`,
    ]
      .filter(Boolean)
      .join(' ');

    if (attributes) {
      description += `, ${attributes}`;
    }
  }

  if (companyNames) {
    description += ` associated with ${companyNames}`;
  }

  if (designations) {
    description += ` serving as ${designations}`;
  }

  description += `. No hidden fees.`;

  // Generate keywords based on director info
  const dynamicKeywords = [
    `${directorName} contact`,
    `${directorName} mobile number`,
    `${directorName} email`,
    `${directorName} DIN ${directorDin}`,
  ];

  if (companyNames) {
    dynamicKeywords.push(`${directorName} ${companyNames}`);
    activeCompanies.forEach((company: any) => {
      const companyName = company.nameOfTheCompany || company.accountName;
      if (companyName) {
        dynamicKeywords.push(`${companyName} director contact`);
        dynamicKeywords.push(`${directorName} ${companyName}`);
      }
    });
  }

  const keywords = [
    ...dynamicKeywords,
    'unlock directors contacts',
    'get director contact information',
    'indian directors mobile number',
    'indian directors email',
    'indian company founders contact',
  ];

  return {
    metadataBase: new URL(`${BASE_URL_FRONTEND}/unlock-contact${queryString}`),
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
    openGraph: {
      siteName: 'FileSure',
      type: 'website',
      locale: 'en_US',
      title: title,
      description: description,
      url: `${BASE_URL_FRONTEND}/unlock-contact${queryString}`,
      images: [
        {
          url: `${BASE_URL_FRONTEND}/assets/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: `${directorName} Contact Information - FileSure`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@FileSure',
      creator: '@FileSure',
      title: title,
      description: description,
      images: [`${BASE_URL_FRONTEND}/assets/twitter-image.png`],
    },
    category: 'Business Intelligence',
    alternates: {
      canonical: `${BASE_URL_FRONTEND}/unlock-contact${queryString}`,
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
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

const Page = () => {
  return (
    <div className='mb-10'>
      <HeroWrapper className='mb-4 h-14 overflow-hidden md:h-16'>
        <div></div>
      </HeroWrapper>

      <section className='wrapper mb-4 hidden md:mb-6 md:block'>
        <BulkUnlockCTA />
      </section>

      <UnlockContactMainSections />

      <section className='wrapper mt-6'>
        <SupportedPayOptions />
      </section>

      <section className='wrapper mt-6 md:hidden'>
        <BulkUnlockCTA />
      </section>

      <section className='wrapper mt-10'>
        <BannerNewCompanyAlert1 />
      </section>
    </div>
  );
};

export default Page;
