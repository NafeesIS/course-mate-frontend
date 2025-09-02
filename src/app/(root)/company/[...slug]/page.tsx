/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import About from '@/app/(root)/company/_components/About/About';
import Charges from '@/app/(root)/company/_components/Charges/Charges';
import ComplianceAlert from '@/app/(root)/company/_components/ComplianceAlert';
import ComplianceCheck from '@/app/(root)/company/_components/ComplianceCheck/ComplianceCheck';
import Directors from '@/app/(root)/company/_components/Directors/Directors';
import NoDataFound from '@/app/(root)/company/_components/NoDataFound';
import { getAnnualFilingsData } from '@/app/(root)/company/_services/getAnnualFilingsData';
import { getChargeDetails } from '@/app/(root)/company/_services/getChargeDetails';
import { getCompanyDetailsData } from '@/app/(root)/company/_services/getCompanyDetailsData';
import { getGstDetails } from '@/app/(root)/company/_services/getGstinDetails';
import { getOneTimeComplianceData } from '@/app/(root)/company/_services/getOneTimeComplianceData';
import { TCompanyMasterData } from '@/app/(root)/company/_types/CompanyDetails';
import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';
import { BASE_URL_FRONTEND } from '@/constants';
import { formatToUrl, toCamelCase } from '@/lib/formatters';
import type { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';
import Financials from '../_components/Financials/Financials';
import FundingData from '../_components/FundingData/FundingData';
import PublicDocsTab from '../_components/PublicDocsTab/PublicDocsTab';
import { generateSingleCompanyJsonLd } from '../_utils/json_ld';
import { generateCompanyMetadataKeywords } from '../_utils/meta_data';
import Loading from './loading';

export const revalidate = 3600; // cache for 1 minute

type Props = {
  params: {
    slug: string[];
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const [name, cinNo] = params.slug;
  const pageData = await getCompanyDetailsData(cinNo);
  const { company, about } = pageData.data || {};
  const companyName = company ? company : name.split('-').join(' ');

  // Base URL without query parameters
  const baseUrl = `${BASE_URL_FRONTEND}/company/${formatToUrl(name)}/${cinNo}`;

  // If no tab is specified, use the base URL as canonical
  // This matches what Google initially sees before client-side JS runs
  const hasTabParam = !!searchParams.tab;
  const canonicalUrl = hasTabParam
    ? `${baseUrl}?tab=${searchParams.tab}`
    : baseUrl;

  const title = `${
    companyName.length > 0 ? toCamelCase(companyName) : '-'
  } - Company, Directors, Charges and Compliance details | FileSure`;
  const keywords =
    (pageData.data && generateCompanyMetadataKeywords(pageData)) || [];

  return {
    metadataBase: new URL(baseUrl),
    title: title,
    description: about || '',
    applicationName: 'FileSure',
    referrer: 'origin-when-cross-origin',
    keywords: keywords,
    openGraph: {
      siteName: 'FileSure',
      type: 'website',
      locale: 'en_US',
      title: title,
      description: about || '',
      url: canonicalUrl,
    },
    alternates: {
      canonical: canonicalUrl,
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

const page = async ({ params }: { params: { slug: string[] } }) => {
  const { slug } = params;
  const cinNo = slug[1];
  const companyData: TCompanyMasterData = await getCompanyDetailsData(cinNo);

  const {
    cin,
    dateOfIncorporation: incorporationDate,
    companyType,
    currentDirectors,
  } = companyData.data || {};

  const chargeDetails = await getChargeDetails(cin);

  const oneTimeComplianceData = await getOneTimeComplianceData(
    companyData.data
  );
  const annualFilingsData = await getAnnualFilingsData(companyData.data);

  const gstData = await getGstDetails(cin, incorporationDate);

  const companyJsonLd =
    (companyData.data && generateSingleCompanyJsonLd(companyData)) || {};

  return (
    <div>
      {/* JSONLD */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(companyJsonLd) }}
      />

      {/* COMPLIANCE ALERT MARQUEE */}
      <Suspense fallback={<Skeleton className='h-7 w-full' />}>
        <ComplianceAlert
          oneTimeComplianceData={oneTimeComplianceData}
          annualFilingsData={annualFilingsData}
        />
      </Suspense>

      <div className='wrapper pb-12 pt-2'>
        {/* ABOUT */}
        <TabsContent value='about'>
          <Suspense fallback={<Loading />}>
            <About companyData={companyData} />
          </Suspense>
        </TabsContent>

        {/* DIRECTORS */}
        <TabsContent value='directors'>
          <Suspense fallback={<Loading />}>
            {companyData.data === null || !currentDirectors ? (
              <NoDataFound component='directors' />
            ) : (
              <Directors companyData={companyData} />
            )}
          </Suspense>
        </TabsContent>

        {/* PUBLIC DOCS */}
        <TabsContent value='public-docs'>
          <Suspense fallback={<Loading />}>
            <PublicDocsTab companyData={companyData} />
          </Suspense>
        </TabsContent>

        {/* FINANCIALS */}
        <TabsContent value='financials'>
          <Suspense fallback={<Loading />}>
            <Financials companyData={companyData} />
          </Suspense>
        </TabsContent>

        {/* COMPLIANCE */}
        <TabsContent value='compliance'>
          <Suspense fallback={<Loading />}>
            <ComplianceCheck
              oneTimeComplianceData={oneTimeComplianceData}
              annualFilingsData={annualFilingsData}
              companyType={companyType}
              gstData={gstData}
            />
          </Suspense>
        </TabsContent>

        {/* CHARGES */}
        <TabsContent value='charges'>
          <Suspense fallback={<Loading />}>
            {chargeDetails === null ||
            (chargeDetails &&
              chargeDetails.data &&
              chargeDetails.data.length === 0) ? (
              <NoDataFound component='charges' companyData={companyData} />
            ) : (
              <Charges chargeDetails={chargeDetails} />
            )}
          </Suspense>
        </TabsContent>

        {/* FUNDING DATA */}
        <TabsContent value='funding'>
          <Suspense fallback={<Loading />}>
            <FundingData />
          </Suspense>
        </TabsContent>
      </div>
    </div>
  );
};

export default page;
