'use client';

import CTAUnlockCompanyData from '@/app/(root)/company/_components/CTA/CTAUnlockCompanyData';
import { DUMMY_DATA } from '@/app/(root)/company/_components/Financials/utils/dummy-data';
import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUserSignInDetails } from '@/store/userStore';
import { useQuery } from '@tanstack/react-query';
import { getFinancialsData } from '../../_services/getFinancialsData';
import { TCompanyMasterData } from '../../_types/CompanyDetails';
import DummyFinancialDataTable from './DummyFinancialDataTable';
import FinancialDocsData from './FinancialDocsData';

const Financials = ({
  companyData,
  isUnlocked,
}: {
  companyData: TCompanyMasterData;
  isUnlocked: { isUnlocked: boolean; unlockType: string | null };
}) => {
  const cin = companyData.data.cin;
  const isLLP = companyData.data.companyType === 'LLP';

  const {
    userSignInDetails,
    userSignInDetailsLoading,
    userSignInDetailsError,
  } = useUserSignInDetails();
  const userId = userSignInDetails?.data?._id;

  const {
    data: financialDocsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['llpFinancialDocsData', userId, cin],
    queryFn: () =>
      userId
        ? getFinancialsData(cin, userId)
        : Promise.resolve({
            success: false,
            message: 'User not authenticated',
            data: {},
          }),
    enabled:
      !!isUnlocked.isUnlocked &&
      isUnlocked.unlockType === 'report' &&
      isLLP &&
      !!userId &&
      !!cin,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  if (userSignInDetailsLoading || isLoading) {
    return (
      <LoadingWithSpinner
        className='min-h-[50vh]'
        text='Loading Financials...'
      />
    );
  }

  if (userSignInDetailsError) {
    return (
      <Alert variant='destructive'>
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>
          There was an error with your authentication. Please try signing in
          again.
        </AlertDescription>
      </Alert>
    );
  }

  if (isError) {
    return (
      <Alert variant='destructive'>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {(error as Error).message ||
            'An error occurred while fetching financial data.'}
        </AlertDescription>
      </Alert>
    );
  }

  if (financialDocsData?.success) {
    return (
      <div className='mt-4 bg-gray-100 pb-10'>
        {/* Financial Data Table */}
        <FinancialDocsData financialDocsData={financialDocsData} />
      </div>
    );
  }

  return (
    <div className='mt-8 bg-gray-100 pb-10'>
      {!isUnlocked.isUnlocked && (
        <CTAUnlockCompanyData
          companyData={companyData}
          source={`financials-tab`}
        />
      )}

      <DummyFinancialDataTable
        companyData={companyData}
        financialDocsData={DUMMY_DATA}
        isUnlocked={isUnlocked}
      />
    </div>
  );
};

export default Financials;
