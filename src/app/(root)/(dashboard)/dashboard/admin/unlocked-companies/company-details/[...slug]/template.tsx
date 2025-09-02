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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import CompanyDetailsTabs from './_components/CompanyDetailsTab';
import Hero from './_components/Hero';
import { useCompanyDataStore } from './_store/companyDataStore';
import { TCompanyMasterData } from './_types/CompanyDetails';

export default function Template({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const queryClient = useQueryClient();
  const [, cin] = params.slug as string[];
  const companyData = useCompanyDataStore((state) => state.companyData);
  const setCompanyData = useCompanyDataStore((state) => state.setCompanyData);
  const clearCompanyData = useCompanyDataStore(
    (state) => state.clearCompanyData
  );

  // Reset company data when navigating to a new company page
  useEffect(() => {
    clearCompanyData();
    queryClient.invalidateQueries({ queryKey: ['companyData', cin] });
  }, [cin, clearCompanyData, queryClient]);

  const { isLoading: isCompanyDataLoading, data: fetchedCompanyData } =
    useQuery<TCompanyMasterData, Error>({
      queryKey: ['companyData', cin],
      queryFn: async () => {
        const response = await fetch(
          `${BASE_URL_BACKEND}/api/v1/companies/companyInfo?cin=${cin}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch company data');
        }
        return await response.json();
      },
      enabled: !!cin,
      refetchOnWindowFocus: false,
      staleTime: 0, // Consider the data stale immediately
    });

  // Update the store with the fetched data
  useEffect(() => {
    if (fetchedCompanyData) {
      setCompanyData(fetchedCompanyData);
    }
  }, [fetchedCompanyData, setCompanyData]);

  if (isCompanyDataLoading) {
    return <LoadingWithSpinner className='min-h-[80vh]' />;
  }

  // Use the fetched data instead of the store data
  const currentCompanyData = fetchedCompanyData || companyData;

  if (!currentCompanyData || currentCompanyData.data === null) {
    return <CompanyNotFound />;
  }

  return (
    <div className='min-h-screen'>
      <Breadcrumb className='mb-4'>
        <BreadcrumbList className='text-[10px] md:text-xs'>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/dashboard/admin'>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/dashboard/admin/unlocked-companies'>
                Unlocked Companies
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{currentCompanyData.data.company}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Hero companyData={currentCompanyData} />

      <CompanyDetailsTabs companyData={currentCompanyData}>
        {children}
      </CompanyDetailsTabs>
    </div>
  );
}
