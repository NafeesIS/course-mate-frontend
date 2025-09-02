'use client';

import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { TabsContent } from '@/components/ui/tabs';
import { Suspense } from 'react';
import About from './_components/About/About';
import Financials from './_components/Financials/Financials';
import PublicDocsTab from './_components/PublicDocsTab/PublicDocsTab';

import { useCompanyDataStore } from './_store/companyDataStore';
import { useUnlockedCompaniesStore } from './_store/unlockedCompaniesStore';

const UnlockedCompanyPage = ({
  params: {
    // eslint-disable-next-line no-unused-vars
    slug: [company, cin],
  },
}: {
  params: { slug: string[] };
}) => {
  const companyData = useCompanyDataStore((state) => state.companyData);
  const isCompanyUnlocked = useUnlockedCompaniesStore(
    (state) => state.isCompanyUnlocked
  );

  if (!companyData) {
    return <LoadingWithSpinner className='min-h-[50vh]' />;
  }

  const isUnlocked = isCompanyUnlocked(cin as string);

  return (
    <>
      <TabsContent value='about'>
        <About companyData={companyData} isUnlocked={isUnlocked} />
      </TabsContent>

      <TabsContent value='financials'>
        <Suspense fallback={<LoadingWithSpinner />}>
          <Financials companyData={companyData} isUnlocked={isUnlocked} />
        </Suspense>
      </TabsContent>

      <TabsContent value='public-docs'>
        <Suspense fallback={<LoadingWithSpinner />}>
          <PublicDocsTab companyData={companyData} isUnlocked={isUnlocked} />
        </Suspense>
      </TabsContent>
    </>
  );
};

export default UnlockedCompanyPage;
