'use client';

import UpdateNowButton from '@/app/(root)/company/_components/UpdateNowButton';
import { useCompanyLastUpdatedInfoStore } from '@/app/(root)/company/_store/useCompanyLastUpdatedInfoStore';
import { formatDistanceToNowStrict } from 'date-fns';
import { RiBuildingFill } from 'react-icons/ri';
import { TCompanyMasterData } from '../_types/CompanyDetails';

type Props = {
  companyData: TCompanyMasterData;
};

const Hero = ({ companyData }: Props) => {
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
        {
          lastUpdatedAt ? (
            <p className='text-gray-400'>
              Last updated {formatDistanceToNowStrict(lastUpdatedAt)} ago
            </p>
          ) : (
            <p className='text-gray-400'>Click update now to get latest data</p>
          ) // TODO: Add message: if update not initiated yet
        }

        <div className='item-center flex justify-end gap-2 sm:mt-0'>
          <UpdateNowButton
            companyName={company}
            cinNo={cin}
            companyType={companyType}
            dateOfIncorporation={dateOfIncorporation}
            className='text-[10px] md:text-xs'
          />

          {/* <CheckUpdateStatus cin={cin} companyType={companyType} /> */}
        </div>
      </div>
    </div>
  );
};

export default Hero;
