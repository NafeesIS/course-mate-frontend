import { TCompanyMasterData } from '@/app/(root)/company/_types/CompanyDetails';
import { BASE_URL_BACKEND } from '@/constants';
import { formatCompanyAge } from '@/lib/formatters';
import { cn, getStatusBadgeColor } from '@/lib/utils';
import { formatDistanceToNowStrict } from 'date-fns';
import { Building2 } from 'lucide-react';
import HeroWrapper from '../../../../components/shared/HeroWrapper';
import { getUpdateStatus } from '../_utils/checkUpdateStatus';
import UpdateNowButton from './UpdateNowButton';

type Props = {
  companyData: TCompanyMasterData;
  cinNo: string;
};

const getLastUpdatedAt = async (cinNo: string) => {
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/companies/getCompanyUpdateStatus?cin=${cinNo}`,
    { cache: 'no-store' }
  );
  if (!res.ok) {
    return null;
  }
  return res.json();
};

const Hero = async ({ companyData, cinNo }: Props) => {
  const {
    company,
    cin,
    companyType,
    dateOfIncorporation,
    status,
    registrationNumber,
    rocCode,
    incorporationAge,
  } = companyData.data || {};

  const lastUpdatedAt = await getLastUpdatedAt(cinNo);
  const { lastUpdatedOn } = lastUpdatedAt?.data || {};
  const { dataUpdateInitiated, dataUpdateFailed } = getUpdateStatus(
    lastUpdatedAt?.data,
    companyType
  );

  return (
    <>
      <HeroWrapper className='border-b bg-gradient-to-r from-blue-50 to-indigo-50 pb-6 pt-20 md:pb-6 md:pt-24'>
        <div className='w-full'>
          {/* Company info */}
          <div className='flex gap-4 md:items-center md:gap-6'>
            {/* Company avatar */}
            <div className='flex-shrink-0'>
              <div
                className='relative flex size-16 items-center justify-center overflow-hidden rounded-lg bg-sky-300 text-muted shadow
             md:size-20 lg:size-24'
              >
                {/* {companyInitials} */}
                <Building2 className='absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 opacity-80' />
              </div>
            </div>

            {/* Company details */}
            <div className='w-full space-y-2 md:space-y-4'>
              <div className='flex flex-col items-start justify-center md:flex-row md:justify-between md:gap-8'>
                {/* company name */}
                <h1 className='text-lg font-semibold text-gray-800 md:text-xl lg:text-3xl'>
                  {company}
                </h1>

                {/* LAST UPDATED AT */}
                <div className='flex items-center gap-2 text-[10px] text-gray-400 md:justify-end md:text-xs'>
                  {
                    lastUpdatedOn ? (
                      <p>
                        Last updated {formatDistanceToNowStrict(lastUpdatedOn)}{' '}
                        ago
                      </p>
                    ) : dataUpdateFailed ? (
                      '' // TODO: Add error message: if update failed
                    ) : dataUpdateInitiated ? (
                      '' // TODO: Add message: if update initiated
                    ) : (
                      <p>Click update now to get latest data</p>
                    ) // TODO: Add message: if update not initiated yet
                  }

                  <div className='flex items-center justify-end gap-2 sm:mt-0'>
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

              <div className='grid w-full grid-cols-1 gap-2 text-sm text-gray-700 md:grid-cols-3 md:divide-x md:text-sm lg:grid-cols-5'>
                {/* cin */}
                <div className='space-y-1'>
                  <h4 className='text-[10px] text-gray-600 md:text-xs'>
                    CIN/LLPIN
                  </h4>
                  <p className='font-medium'>{cin}</p>
                </div>

                {/* company status */}
                <div className='space-y-1 md:pl-4'>
                  <h4 className='text-[10px] text-gray-600 md:text-xs'>
                    Status
                  </h4>
                  <p className='flex items-center gap-1.5 font-medium'>
                    <span
                      className={cn(
                        'size-2 flex-shrink-0 rounded-full shadow md:size-3',
                        getStatusBadgeColor(status)
                      )}
                    ></span>
                    {status}
                  </p>
                </div>

                {/* registration number */}
                {companyType === 'Company' && (
                  <div className='hidden space-y-1 pl-4 md:inline-block'>
                    <h4 className='text-[10px] text-gray-600 md:text-xs'>
                      Registration Number
                    </h4>
                    <p className='font-medium'>
                      {' '}
                      {companyType === 'Company'
                        ? registrationNumber || '-'
                        : 'N/A'}
                    </p>
                  </div>
                )}

                {/* company age */}
                <div className='hidden space-y-1 md:pl-4 lg:inline-block'>
                  <h4 className='text-[10px] text-gray-600 md:text-xs'>
                    Company Age
                  </h4>
                  <p className='font-medium'>
                    {formatCompanyAge(incorporationAge, dateOfIncorporation)}
                  </p>
                </div>

                {/* roc name */}
                <div className='hidden space-y-1 pl-4 lg:inline-block'>
                  <h4 className='text-[10px] text-gray-600 md:text-xs'>
                    ROC Name
                  </h4>
                  <p className='font-medium'>{rocCode}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HeroWrapper>
    </>
  );
};

export default Hero;
