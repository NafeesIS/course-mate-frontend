import FilterBadges from '@/app/(root)/search/_components/company/FilterBadges';
import FilterSection from '@/app/(root)/search/_components/company/FilterSection';
import SearchResults from '@/app/(root)/search/_components/company/SearchResults';
import { TCompanySearchParams } from '@/types/CompanySearchTypes';
import { Suspense } from 'react';
import { SearchResultsSkeleton } from '../loading';

import { BASE_URL_FRONTEND } from '@/constants';
import type { Metadata } from 'next';
import { META_KEYWORDS } from '../../_utils/meta_data';

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const title = `${searchParams?.query ? `Search: ${searchParams?.query}` : 'Company Search'}`;
  const description = `Search for companies using our advanced search engine. We help you find the right company for your business. Get started today!`;
  // Convert searchParams to a query string
  const params = new URLSearchParams(
    searchParams as Record<string, string>
  ).toString();
  const url = `${BASE_URL_FRONTEND}/search/company${params ? `?${params}` : ''}`;

  return {
    title: title,
    description: description,
    applicationName: 'FileSure',
    referrer: 'origin-when-cross-origin',
    keywords: META_KEYWORDS,

    // Open Graph metadata for social media
    openGraph: {
      siteName: 'FileSure',
      type: 'website', // Since this represents the site, use 'website'
      locale: 'en_US',
      title: title,
      description: description,
      url: url,
    },

    alternates: {
      canonical: url, // Canonical URL for the home page
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

const Page = async ({
  searchParams = {},
}: {
  searchParams?: TCompanySearchParams;
}) => {
  return (
    <>
      {/* <Hero searchTerm={searchParams?.query} /> */}

      <section className='mb-8'>
        <div className='wrapper mt-2 gap-8 md:mt-6 md:flex'>
          {/* FILTERS */}
          <FilterSection searchParams={searchParams} />

          {searchParams?.query ? (
            <div className='flex w-full flex-col gap-2 md:gap-6'>
              {/* FILTERS BADGES */}
              <FilterBadges
                searchParams={searchParams}
                className='hidden md:block'
              />
              {/* SEARCH RESULTS */}
              <Suspense fallback={<SearchResultsSkeleton />}>
                <SearchResults searchParams={searchParams} />
              </Suspense>
            </div>
          ) : (
            <div className='my-8 flex flex-col'>
              <h1 className='text-center text-lg font-semibold text-foreground md:text-left md:text-2xl'>
                Welcome to Company Search!
              </h1>
              <p className='mt-4 text-sm text-foreground md:text-base'>
                To find companies, try entering a search term above. You can
                refine your search using filters on the left.
              </p>
              <ul className='p-2 text-sm text-foreground md:text-base'>
                <li className='list-inside list-disc'>
                  Enter a search term above to find companies.
                </li>
                <li className='list-inside list-disc'>
                  Refine your search using filters on the left.
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Page;
