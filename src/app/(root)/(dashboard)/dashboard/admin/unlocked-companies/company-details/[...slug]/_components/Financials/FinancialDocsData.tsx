import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowUpRight, Mail } from 'lucide-react';
import { IFinancialDocsApiResponse } from '../../_types/FinancialDocsDataType';
import FinancialDocsTable from './FinancialDocsTable';

type FinancialDataTableProps = {
  financialDocsData: IFinancialDocsApiResponse;
};

const FinancialDocsData = ({ financialDocsData }: FinancialDataTableProps) => {
  if (
    !financialDocsData.data ||
    (financialDocsData.data && Object.keys(financialDocsData.data).length === 0)
  ) {
    return (
      <Card className='mx-auto mt-8 w-full max-w-3xl'>
        <CardHeader>
          <CardTitle>No Financial Data Available</CardTitle>
          <CardDescription>
            We couldn&apos;t find any financial data for this company.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>Possible reasons:</AlertTitle>
            <AlertDescription>
              <ul className='mt-2 list-inside list-disc'>
                <li>This might be a newly registered company</li>
                <li>The company hasn&apos;t filed its financial reports yet</li>
                <li>Our database might need an update</li>
              </ul>
            </AlertDescription>
          </Alert>
          <div className='mt-4 rounded-md bg-blue-50 p-4'>
            <p className='flex items-start text-xs text-blue-700'>
              <ArrowUpRight className='mr-2 h-4 w-4 flex-shrink-0' />
              You can try updating the data by clicking the &quot;Update
              Now&quot; button in the top right corner of the page.
            </p>
          </div>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <Button
            variant='outline'
            size='sm'
            className='w-full sm:w-auto'
            asChild
          >
            <a href='mailto:helpdesk@filesure.in'>
              <Mail className='mr-2 h-4 w-4' /> Contact Support
            </a>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return <FinancialDocsTable financialDocsData={financialDocsData} />;
};

export default FinancialDocsData;
