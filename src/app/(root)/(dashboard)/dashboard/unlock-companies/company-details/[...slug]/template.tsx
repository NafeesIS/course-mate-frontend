'use client';

import CompanyNotFound from '@/app/(root)/company/_components/CompanyNotFound';
import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { BASE_URL_BACKEND } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { memo, useEffect } from 'react';
import CompanyDetailsTabs from './_components/CompanyDetailsTab';
import Hero from './_components/Hero';
import { useUnlockedCompaniesList } from './_hooks/useUnlockedCompaniesList';
import { useCompanyDataStore } from './_store/companyDataStore';
import { TCompanyMasterData } from './_types/CompanyDetails';

// Memoize static components
const BreadcrumbNav = memo(({ companyName }: { companyName: string }) => (
  <Breadcrumb className='mb-4'>
    <BreadcrumbList className='text-[10px] md:text-xs'>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href='/dashboard'>Home</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href='/dashboard/unlock-companies'>Unlock Companies</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>{companyName}</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
));
BreadcrumbNav.displayName = 'BreadcrumbNav';

// Fetch company data
const fetchCompanyData = async (cin: string): Promise<TCompanyMasterData> => {
  const response = await axios.get(
    `${BASE_URL_BACKEND}/api/v1/companies/companyInfo`,
    { params: { cin } }
  );
  return response.data;
};

function Template({ children }: { children: React.ReactNode }) {
  const [, cin] = useParams().slug as string[];

  const companyData = useCompanyDataStore((state) => state.companyData);
  const setCompanyData = useCompanyDataStore((state) => state.setCompanyData);
  const clearCompanyData = useCompanyDataStore(
    (state) => state.clearCompanyData
  );

  const { isCompanyUnlocked, isLoading: isUnlockedListLoading } =
    useUnlockedCompaniesList();

  const { isLoading: isCompanyDataLoading, data: fetchedCompanyData } =
    useQuery<TCompanyMasterData, Error>({
      queryKey: ['companyData', cin],
      queryFn: () => fetchCompanyData(cin),
      enabled: Boolean(cin),
      refetchOnWindowFocus: false,
      staleTime: 0,
    });

  // Handle store updates separately
  useEffect(() => {
    if (cin) {
      clearCompanyData();
    }
  }, [cin, clearCompanyData]);

  useEffect(() => {
    if (fetchedCompanyData && setCompanyData) {
      setCompanyData(fetchedCompanyData);
    }
  }, [fetchedCompanyData, setCompanyData]);

  if (isCompanyDataLoading || isUnlockedListLoading) {
    return <LoadingWithSpinner className='min-h-[80vh]' />;
  }

  const currentCompanyData = fetchedCompanyData || companyData;

  if (!currentCompanyData?.data) {
    return <CompanyNotFound />;
  }

  const isUnlocked = isCompanyUnlocked(cin);

  return (
    <div className='min-h-screen'>
      <BreadcrumbNav companyName={currentCompanyData.data.company} />

      <Hero companyData={currentCompanyData} isUnlocked={isUnlocked} />

      <CompanyDetailsTabs
        companyData={currentCompanyData}
        isUnlocked={isUnlocked}
      >
        {children}
      </CompanyDetailsTabs>
    </div>
  );
}

export default memo(Template);
