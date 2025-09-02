'use client';

import UnlockCompanyBtn from '@/components/shared/UnlockCompany/UnlockCompanyBtn';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TAllServiceCatalogs,
  TServiceCatalog,
} from '@/types/ServiceCatalogTypes';
import { ArrowUpCircle, AtSign, Check, CheckCircle } from 'lucide-react';

import UpgradeToReport from '@/app/(root)/(dashboard)/dashboard/unlock-companies/_components/UpgradeToReport';
import { useUnlockedCompaniesList } from '@/app/(root)/(dashboard)/dashboard/unlock-companies/company-details/[...slug]/_hooks/useUnlockedCompaniesList';
import { formatToUrl } from '@/lib/formatters';
import { PieChart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CreditPackagesCTA from '../../../../../components/shared/UnlockCompany/CreditPackagesCTA';
import { TCompanyMasterData } from '../../_types/CompanyDetails';

const CompanyReportsCTA = ({
  companyData,
  serviceCatalogFromDB,
  serviceCatalogFromDBPending,
  companyUnlock,
  source,
}: {
  companyData: TCompanyMasterData;
  serviceCatalogFromDB: TAllServiceCatalogs | null;
  serviceCatalogFromDBPending: boolean;
  companyUnlock: TServiceCatalog | undefined;
  source?: string;
}) => {
  const router = useRouter();
  // to check if company is already unlocked or not
  const { isCompanyUnlocked, isLoading: isUnlockedListLoading } =
    useUnlockedCompaniesList({ enableCaching: true });
  const isUnlocked = isCompanyUnlocked(companyData.data.cin as string);

  return (
    <div className='relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-700 to-blue-500 shadow-md'>
      <div className='relative z-10 p-4 text-white'>
        <div className='flex w-fit items-center gap-2 rounded bg-white/20 px-2 py-1'>
          <PieChart className='size-6' />
          <h3 className='text-sm font-semibold drop-shadow md:text-base'>
            Complete {companyData.data.companyType} Report + Documents
          </h3>
        </div>
        <p className='mt-4 text-xs drop-shadow'>
          All-in-one {companyData.data.companyType} intelligence package
        </p>
        <ul className='mt-2 space-y-1.5 text-xs'>
          <li className='flex items-center gap-2 drop-shadow'>
            <Check className='size-4 text-purple-300' />
            <span>In-depth financial analysis & performance trends</span>
          </li>
          <li className='flex items-center gap-2 drop-shadow'>
            <Check className='size-4 text-purple-300' />
            <span>All documents filed on both V2 & V3 MCA portal</span>
          </li>
          <li className='flex items-center gap-2 drop-shadow'>
            <Check className='size-4 text-purple-300' />
            <span>Year-wise insights with interactive charts</span>
          </li>
        </ul>
        <div className='mt-4'>
          {serviceCatalogFromDBPending ||
          !serviceCatalogFromDB ||
          isUnlockedListLoading ? (
            <Skeleton className='h-10 w-full max-w-48 bg-white' />
          ) : isUnlocked.isUnlocked && isUnlocked.unlockType === 'report' ? (
            <div>
              <p className='mb-1 text-[10px]'>Already unlocked!</p>
              <Button
                variant='secondary'
                className='flex w-full items-center gap-1.5 rounded-md bg-sky-50 text-xs font-semibold text-foreground text-purple-700 hover:bg-sky-300 md:text-sm lg:w-fit'
                onClick={() =>
                  router.push(
                    `/dashboard/unlock-companies/company-details/${formatToUrl(companyData.data.company)}/${companyData.data.cin}?tab=financials`
                  )
                }
              >
                <CheckCircle className='size-4' />
                View Complete Report
              </Button>
            </div>
          ) : isUnlocked.isUnlocked && isUnlocked.unlockType === 'documents' ? (
            <UpgradeToReport
              companyId={companyData.data.cin}
              companyName={companyData.data.company}
              source={source}
              customButton={
                <button
                  className={`flex w-full items-center justify-center gap-2 rounded bg-yellow-300 px-4 py-2 text-[10px] font-medium text-gray-800 transition-colors hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 md:w-auto md:text-sm`}
                >
                  <ArrowUpCircle className='size-4' />
                  Upgrade to Report
                </button>
              }
            />
          ) : (
            <UnlockCompanyBtn
              companyData={companyData}
              source={source}
              dialogTrigger={
                <Button
                  variant='secondary'
                  className='w-full text-purple-700 lg:w-fit'
                >
                  <span className='mr-1.5 font-semibold'>Unlock</span>
                  <AtSign className='mr-1.5 size-4' />
                  <span className='text-lg font-bold'>
                    {companyUnlock?.companyUnlockPricing?.currency === 'INR'
                      ? '₹'
                      : '$'}
                    {companyUnlock?.companyUnlockPricing?.singleUnlock.price}
                    {/* <span className='ml-1 text-xs font-normal'>
                      (excl. GST)
                    </span> */}
                  </span>
                </Button>
              }
            />
          )}
        </div>

        <p className='mt-2 text-center text-[10px] italic drop-shadow-sm lg:max-w-[60%] lg:text-left'>
          Or Enjoy up to 50% discount with our credit packages <br />
          <CreditPackagesCTA
            source={source}
            dialogTrigger={
              <button className='text-muted underline hover:text-white'>
                view credit packages
              </button>
            }
          />
        </p>
      </div>

      <div className='absolute left-[65%] top-24 z-[5] hidden h-[190px] w-[260px] overflow-hidden rounded-tl-lg border border-gray-300 shadow-2xl lg:block'>
        <Image
          alt='Financials Table'
          src='/assets/company/financials-ss.png'
          width={360}
          height={272}
          quality={100}
          className='h-full w-full object-cover object-left-top'
        />
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

export default CompanyReportsCTA;
