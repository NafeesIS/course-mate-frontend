/* eslint-disable indent */
import { TCompanyMasterData } from '@/app/(root)/company/_types/CompanyDetails';
import { formatCurrencyINR } from '@/lib/formatters';
import Image from 'next/image';
import noDataImg from '../../../../../../public/assets/company/no-data.jpg';
import {
  Card,
  CardContent,
  CardHeader,
} from '../../../../../components/ui/card';

import dynamic from 'next/dynamic';

const ChargesChart = dynamic(() => import('./ChargesChart'), {
  ssr: false,
});

type Props = {
  companyData: TCompanyMasterData;
};

// eslint-disable-next-line no-unused-vars
const Charges = ({ companyData }: Props) => {
  const { chargeData } = companyData.data || {};

  return (
    <Card className='overflow-hidden rounded-md shadow-sm'>
      <CardHeader className='bg-green-100 p-4 text-base font-normal'>
        Charges (Loans)
      </CardHeader>
      <CardContent className='space-y-3 divide-y p-4 md:space-y-4'>
        {chargeData?.totalLenders && chargeData?.totalLenders > 0 ? (
          <>
            <ChargesChart chargeData={chargeData} />
            <div className='grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4'>
              <h6 className='font-semibold text-primary'>
                Total No. of Lenders:
              </h6>
              <p>{chargeData.totalLenders}</p>
            </div>
            <div className='grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4'>
              <h6 className='font-semibold text-primary'>
                Last Charge Activity:
              </h6>
              <p>-</p>
            </div>
            <div className='grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4'>
              <h6 className='font-semibold text-primary'>Last Charge Date:</h6>
              <p>{chargeData.lastChargeDate}</p>
            </div>
            <div className='grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4'>
              <h6 className='font-semibold text-primary'>
                Last Charge Amount:
              </h6>
              <p>{formatCurrencyINR(chargeData.lastChargeAmount as string)}</p>
            </div>
          </>
        ) : (
          <div className='flex-col-center gap-4'>
            <Image
              src={noDataImg}
              alt='No Records Found'
              width={180}
              height={180}
              className='h-44 w-auto opacity-70'
            />
            <p className='rounded-md border bg-muted px-4 py-2 text-center text-sm'>
              {chargeData?.messageForNoCharge
                ? chargeData?.messageForNoCharge
                : 'No Data Found'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Charges;
