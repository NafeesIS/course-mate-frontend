import Loading from '@/app/(root)/company/[...slug]/loading';
import { Separator } from '@/components/ui/separator';
import { Suspense } from 'react';
import { RiErrorWarningLine, RiRefreshLine } from 'react-icons/ri';
import AnnualFilings from './AnnualFilings/AnnualFilings';
import FirstTimeCompliance from './FirstTimeCompliance/FirstTimeCompliance';
import Header from './FirstTimeCompliance/Header';

type Props = {
  oneTimeComplianceData: any;
  annualFilingsData: any;
  companyType: string;
};

const ComplianceDetails = ({
  oneTimeComplianceData,
  annualFilingsData,
  companyType,
}: Props) => {
  const isOneTimeMissing =
    oneTimeComplianceData === null ||
    !oneTimeComplianceData.data ||
    oneTimeComplianceData.data.length === 0;

  const isAnnualMissing =
    annualFilingsData === null ||
    !annualFilingsData.data ||
    annualFilingsData.data.length === 0;

  const isFirstTimeUpdate =
    (annualFilingsData &&
      annualFilingsData.data &&
      annualFilingsData.data[0].isFirstTimeUpdate) ||
    (oneTimeComplianceData &&
      oneTimeComplianceData.data &&
      oneTimeComplianceData.data[0].isFirstTimeUpdate);

  // Message when both are missing
  if (isAnnualMissing && isOneTimeMissing) {
    return (
      <div className='mb-28 rounded-r-md border-l-4 border-orange-400 bg-muted p-6 text-sm text-orange-800 dark:text-orange-100'>
        <div className='flex items-center'>
          <RiErrorWarningLine className='mr-3 size-10' />
          <h2 className='text-base font-semibold md:text-lg'>
            Compliance Data Unavailable
          </h2>
        </div>
        <p className='mt-2'>
          We&apos;re unable to retrieve the annual filings and one-time
          compliance data for this company. This could be due to recent
          incorporation or other factors. Please check back later or contact
          support if the issue persists.
        </p>
      </div>
    );
  }

  // Default rendering if all data is available
  return (
    <>
      {isFirstTimeUpdate ? (
        <div className='mb-28 rounded-r-md border-l-4 border-sky-400 bg-muted p-6 text-sm text-sky-800 dark:text-sky-100'>
          <div className='flex items-center'>
            <RiRefreshLine className='mr-3 size-10 animate-spin md:size-6' />
            <h2 className='text-base font-semibold md:text-lg'>
              Data Update in Progress
            </h2>
          </div>
          <p className='mt-2'>
            We&apos;re currently updating the compliance data for this company.
            This may take a few moments. Please check back soon for the latest
            information. We appreciate your patience while we ensure that the
            data is accurate and up-to-date.
          </p>
        </div>
      ) : (
        <>
          <Suspense fallback={<Loading />}>
            {isOneTimeMissing && companyType === 'LLP' ? (
              // LLP Form 3 doc is temporarily unavailable
              // TODO: Remove this once LLP form 3 data is available
              <>
                <Header companyType={companyType} />
                <div className='mb-8 mt-6 rounded-r-md border-l-4 border-primary/80 bg-muted p-6 text-sm text-primary'>
                  <div className='flex items-center'>
                    <RiErrorWarningLine className='mr-3 size-10' />
                    <h2 className='text-base font-semibold md:text-lg'>
                      LLP Form 3 doc is temporarily unavailable.
                    </h2>
                  </div>
                  <p className='mt-2'>
                    MCA is upgrading to v3 and some of the public documents are
                    temporarily unavailable. Hence, the data from these
                    documents will not be updated till the availability for the
                    same is restored. All other data will be available as usual.
                  </p>
                </div>
              </>
            ) : isOneTimeMissing ? (
              // One-Time Compliance data is unavailable
              <>
                <Header companyType={companyType} />
                <div className='mb-8 rounded-r-md border-l-4 border-orange-400 bg-muted p-6 text-sm text-orange-800 dark:text-orange-100'>
                  <div className='flex items-center'>
                    <RiErrorWarningLine className='mr-3 size-10' />
                    <h2 className='text-base font-semibold md:text-lg'>
                      One-Time Compliance Data Unavailable
                    </h2>
                  </div>
                  <p className='mt-2'>
                    We&apos;re unable to retrieve the one-time compliance data
                    for this company. This might be due to recent incorporation
                    or other factors. Please check back later or contact support
                    if the issue persists.
                  </p>
                </div>
              </>
            ) : (
              // One-Time Compliance data is available
              <FirstTimeCompliance
                oneTimeComplianceData={oneTimeComplianceData}
                companyType={companyType}
              />
            )}
          </Suspense>

          <Separator className='mb-4 mt-10' />

          {/* <ComplianceLeadBanner /> */}

          <Suspense fallback={<Loading />}>
            {isAnnualMissing ? (
              // Annual Filings data is unavailable
              <div className='mb-28 rounded-r-md border-l-4 border-orange-400 bg-muted p-6 text-sm text-orange-800 dark:text-orange-100'>
                <div className='flex items-center'>
                  <RiErrorWarningLine className='mr-3 size-10' />
                  <h2 className='text-base font-semibold md:text-lg'>
                    Annual Filings Data Unavailable
                  </h2>
                </div>
                <p className='mt-2'>
                  We&apos;re unable to retrieve the annual filings data for this
                  company. This might be due to recent incorporation or other
                  factors. Please check back later or contact support if the
                  issue persists.
                </p>
              </div>
            ) : (
              // Annual Filings data is available
              <AnnualFilings
                annualFilingsData={annualFilingsData}
                companyType={companyType}
              />
            )}
          </Suspense>
        </>
      )}
    </>
  );
};

export default ComplianceDetails;
