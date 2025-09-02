import { TCompanyMasterData } from '@/app/(root)/company/_types/CompanyDetails';
import { formatCompanyAge } from '@/lib/formatters';
import { cn, getStatusBadgeColor } from '@/lib/utils';
import { Card, CardContent } from '../../../../../components/ui/card';

type Props = {
  companyData: TCompanyMasterData;
};

const Summary = ({ companyData }: Props) => {
  const {
    status,
    registrationNumber,
    rocCode,
    incorporationAge,
    companyType,
    dateOfIncorporation,
  } = companyData.data || {};

  return (
    <Card className='rounded'>
      <CardContent className='grid grid-cols-1 gap-4 divide-y p-4 text-center text-sm md:grid-cols-4 md:divide-x md:divide-y-0'>
        <div className='space-y-3'>
          <h4 className='font-semibold text-primary'>Company Status</h4>
          <p
            className={cn(
              'rounded bg-secondary p-2 font-medium',
              getStatusBadgeColor(status)
            )}
          >
            {status}
          </p>
        </div>
        <div className='space-y-3 pt-3 md:pt-0'>
          <h4 className='font-semibold text-primary'>Registration Number</h4>
          <p className='font-medium'>
            {companyType === 'Company' ? registrationNumber || '-' : 'N/A'}
          </p>
        </div>
        <div className='space-y-3 pt-3 md:pt-0'>
          <h4 className='font-semibold text-primary'>Company Age</h4>
          <p className='font-medium'>
            {formatCompanyAge(incorporationAge, dateOfIncorporation)}
          </p>
        </div>
        <div className='space-y-3 pt-3 md:pt-0'>
          <h4 className='font-semibold text-primary'>ROC Name</h4>
          <p className='font-medium'>{rocCode}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Summary;
