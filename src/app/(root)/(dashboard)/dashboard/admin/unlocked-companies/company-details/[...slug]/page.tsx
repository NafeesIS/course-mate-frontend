'use client';

import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { TabsContent } from '@/components/ui/tabs';
import { Suspense } from 'react';
import About from '../../../../unlock-companies/company-details/[...slug]/_components/About/About';
import Financials from './_components/Financials/Financials';
import PublicDocsTab from './_components/PublicDocsTab/PublicDocsTab';

import { useCompanyDataStore } from './_store/companyDataStore';

const UnlockedCompanyPage = ({
  params: {
    // eslint-disable-next-line no-unused-vars
    slug: [company, cin, userId],
  },
}: {
  params: { slug: string[] };
}) => {
  const companyData = useCompanyDataStore((state) => state.companyData);

  if (!companyData) {
    return <LoadingWithSpinner className='min-h-[50vh]' />;
  }

  return (
    <>
      <TabsContent value='about'>
        <About
          companyData={companyData}
          isUnlocked={{ isUnlocked: true, unlockType: null }}
        />
      </TabsContent>

      <TabsContent value='financials'>
        <Suspense fallback={<LoadingWithSpinner />}>
          <Financials companyData={companyData} userId={userId} />
        </Suspense>
      </TabsContent>

      <TabsContent value='public-docs'>
        <Suspense fallback={<LoadingWithSpinner />}>
          <PublicDocsTab companyData={companyData} userId={userId} />
        </Suspense>
      </TabsContent>
    </>
  );
};

export default UnlockedCompanyPage;
