'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TAllServiceCatalogs,
  TServiceCatalog,
} from '@/types/ServiceCatalogTypes';
import { AtSign, Check, CheckCircle } from 'lucide-react';

import { useUnlockedCompaniesList } from '@/app/(root)/(dashboard)/dashboard/unlock-companies/company-details/[...slug]/_hooks/useUnlockedCompaniesList';
import UnlockPublicDocsBtn from '@/components/shared/UnlockCompany/UnlockPublicDocsBtn';
import { formatToUrl } from '@/lib/formatters';
import { FileText } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { RiShining2Fill } from 'react-icons/ri';
import { TCompanyMasterData } from '../../_types/CompanyDetails';

const OnlyPublicDocsCTA = ({
  companyData,
  serviceCatalogFromDB,
  serviceCatalogFromDBPending,
  vpdUnlock,
  source,
}: {
  companyData: TCompanyMasterData;
  serviceCatalogFromDB: TAllServiceCatalogs | null;
  serviceCatalogFromDBPending: boolean;
  vpdUnlock: TServiceCatalog | undefined;
  source?: string;
}) => {
  const router = useRouter();
  // to check if company is already unlocked or not
  const { isCompanyUnlocked, isLoading: isUnlockedListLoading } =
    useUnlockedCompaniesList({ enableCaching: true });
  const isUnlocked = isCompanyUnlocked(companyData.data.cin as string);

  return (
    <div className='relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-sky-400 shadow-md'>
      <div className='relative z-10 p-4 text-white'>
        <div className='flex w-fit items-center gap-2 rounded bg-white/20 px-2 py-1'>
          <FileText className='size-6' />
          <h3 className='text-sm font-semibold drop-shadow md:text-base'>
            MCA Documents Access
          </h3>
        </div>
        <p className='mt-4 text-xs drop-shadow'>
          Quick access to all public filings
        </p>
        <ul className='mt-2 space-y-1.5 text-xs'>
          <li className='flex items-center gap-2 drop-shadow'>
            <Check className='size-4 text-purple-300' />
            <span>All documents filed on both V2 & V3 MCA portal</span>
          </li>
          <li className='flex items-center gap-2 drop-shadow'>
            <Check className='size-4 text-purple-300' />
            <span>
              PNL, balance sheets, and{' '}
              {companyData.data.companyType === 'Company'
                ? 'annual reports'
                : 'LLP agreement'}{' '}
              included
            </span>
          </li>
          <li className='flex items-center gap-2 drop-shadow'>
            <Check className='size-4 text-purple-300' />
            <span>Bulk download available as ZIP files</span>
          </li>
        </ul>
        <div className='mt-4'>
          {serviceCatalogFromDBPending ||
          !serviceCatalogFromDB ||
          isUnlockedListLoading ? (
            <Skeleton className='h-10 w-full max-w-48 bg-white' />
          ) : isUnlocked.isUnlocked ? (
            <div>
              <p className='mb-1 text-[10px]'>Already unlocked!</p>
              <Button
                variant='secondary'
                className='flex w-full items-center gap-1.5 rounded-md bg-sky-50 text-xs font-semibold text-foreground text-purple-700 hover:bg-sky-300 md:text-sm lg:w-fit'
                onClick={() =>
                  router.push(
                    `/dashboard/unlock-companies/company-details/${formatToUrl(companyData.data.company)}/${companyData.data.cin}?tab=public-docs`
                  )
                }
              >
                <CheckCircle className='size-4' />
                View Public Docs
              </Button>
            </div>
          ) : (
            <UnlockPublicDocsBtn
              companyData={companyData}
              source={source}
              dialogTrigger={
                <Button
                  variant='secondary'
                  className='relative w-full text-purple-700 lg:w-fit'
                >
                  <span className='mr-1.5 font-semibold'>Get Documents</span>
                  <AtSign className='mr-1.5 size-4' />
                  <span className='text-lg font-bold'>
                    {vpdUnlock?.vpdUnlockPricing?.currency === 'INR'
                      ? '₹'
                      : '$'}
                    {vpdUnlock?.vpdUnlockPricing?.singleUnlock.price}
                    {/* <span className='ml-1 text-xs font-normal'>
                      (excl. GST)
                    </span> */}
                  </span>

                  {companyData.data.companyType === 'Company' && (
                    <RiShining2Fill className='absolute -right-2 -top-2 size-5 rotate-12 text-yellow-400' />
                  )}
                </Button>
              }
            />
          )}
        </div>

        <p className='mt-2 text-center text-[10px] italic drop-shadow-sm lg:text-left'>
          * Upgrade to full report for in-depth financial analysis
        </p>
      </div>

      <div className='absolute left-[60%] top-16 hidden h-60 w-72 overflow-hidden rounded-tl-lg border border-gray-300 shadow-md lg:block'>
        <Image
          alt='Public Docs Table'
          src='/assets/company/public-docs-ss.png'
          width={420}
          height={340}
          quality={100}
          priority
          className='h-full w-full object-cover object-left-top'
        />
      </div>
    </div>
  );
};

export default OnlyPublicDocsCTA;
