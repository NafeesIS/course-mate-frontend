'use client';

import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useQuery } from '@tanstack/react-query';
import { getFinancialsData } from '../../_services/getFinancialsData';
import { TCompanyMasterData } from '../../_types/CompanyDetails';
import FinancialDocsData from './FinancialDocsData';

const Financials = ({
  companyData,
  userId,
}: {
  companyData: TCompanyMasterData;
  userId: string;
}) => {
  const cin = companyData.data.cin;
  const isLLP = companyData.data.companyType === 'LLP';

  const {
    data: financialDocsData,
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
    enabled: isLLP && !!userId && !!cin,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

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

  return <LoadingWithSpinner className='h-[50vh]' />;
};

export default Financials;
