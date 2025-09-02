import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, FileSearch } from 'lucide-react';
import { TCompanyMasterData } from '../../_types/CompanyDetails';
import { IFinancialDocsApiResponse } from '../../_types/FinancialDocsDataType';
import FinancialDocsTable from './FinancialDocsTable';

type FinancialDataTableProps = {
  companyData: TCompanyMasterData;
  financialDocsData: IFinancialDocsApiResponse;
};

const FinancialDocsData = ({
  companyData,
  financialDocsData,
}: FinancialDataTableProps) => {
  return (
    <div>
      {!financialDocsData.success || !financialDocsData.data ? (
        <Card className='mt-10'>
          <CardContent className='flex flex-col items-center justify-center p-6 text-center'>
            <FileSearch className='mb-4 h-12 w-12 text-muted-foreground' />
            <h3 className='mb-2 text-lg font-semibold'>
              No Financial Data Found
            </h3>
            <p className='mb-4 text-sm text-muted-foreground'>
              We couldn&apos;t find any financial data for this company at the
              moment.
            </p>
            <div className='flex items-center justify-center space-x-2 text-sm'>
              <AlertCircle className='h-4 w-4 text-muted-foreground' />
              <p className='text-muted-foreground'>
                This could be due to recent incorporation or pending filings.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <FinancialDocsTable
          companyData={companyData}
          financialDocsData={financialDocsData}
        />
      )}
    </div>
  );
};

export default FinancialDocsData;
