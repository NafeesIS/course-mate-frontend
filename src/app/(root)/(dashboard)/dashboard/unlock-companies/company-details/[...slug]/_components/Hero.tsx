'use client';

import { useCompanyLastUpdatedInfoStore } from '@/app/(root)/company/_store/useCompanyLastUpdatedInfoStore';
import { formatDistanceToNowStrict } from 'date-fns';
import dynamic from 'next/dynamic';
import { RiBuildingFill } from 'react-icons/ri';
import { TCompanyMasterData } from '../_types/CompanyDetails';

const UnlockCompanyBtn = dynamic(
  () => import('@/components/shared/UnlockCompany/UnlockCompanyBtn'),
  { ssr: false }
);
const UpdateNowButton = dynamic(
  () => import('@/app/(root)/company/_components/UpdateNowButton'),
  { ssr: false }
);

type Props = {
  companyData: TCompanyMasterData;
  isUnlocked: { isUnlocked: boolean; unlockType: string | null };
};

const Hero = ({ companyData, isUnlocked }: Props) => {
  const { company, cin, companyType, dateOfIncorporation } =
    companyData.data || {};

  const { lastUpdatedAt } = useCompanyLastUpdatedInfoStore();

  return (
    <div className='flex justify-between gap-6 shadow-none md:items-center'>
      {/* left */}
      <div className='flex gap-2 md:items-center md:gap-4'>
        {/* company image / placeholder */}
        <div className='flex size-10 flex-shrink-0 items-center justify-center rounded bg-sky-200 md:size-14'>
          <RiBuildingFill className='size-6 text-white md:size-10' />
        </div>

        <div>
          <h1 className='text-balance text-sm font-semibold md:text-lg'>
            {company}
          </h1>

          <h2 className='mt-1 text-xs text-muted-foreground md:text-sm'>
            CIN: {cin}
          </h2>
        </div>
      </div>

      {/* right */}
      <div className='text-balance text-right text-[10px] md:text-xs'>
        {!isUnlocked.isUnlocked && (
          <UnlockCompanyBtn
            companyData={companyData}
            isSamePage={true}
            className='mb-2 ml-auto border border-gray-300 bg-sky-50 text-gray-800'
            btnText='Unlock'
          />
        )}

        {
          lastUpdatedAt ? (
            <p className='text-gray-400'>
              Last updated {formatDistanceToNowStrict(lastUpdatedAt)} ago
            </p>
          ) : (
            <p className='text-gray-400'>Click update now to get latest data</p>
          ) // TODO: Add message: if update not initiated yet
        }

        {cin && companyType && (
          <div className='flex items-center justify-end gap-2 sm:mt-0'>
            <UpdateNowButton
              companyName={company}
              cinNo={cin}
              companyType={companyType}
              dateOfIncorporation={dateOfIncorporation}
              className='text-[10px] md:text-xs'
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
