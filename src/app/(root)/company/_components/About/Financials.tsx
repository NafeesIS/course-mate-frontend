/* eslint-disable indent */
import { TCompanyMasterData } from '@/app/(root)/company/_types/CompanyDetails';
import { formatCurrencyINR } from '@/lib/formatters';
import {
  Card,
  CardContent,
  CardHeader,
} from '../../../../../components/ui/card';

// const FinancialsChart = dynamic(() => import('./FinancialsChart'), {
//   ssr: false,
// });

type Props = {
  companyData: TCompanyMasterData;
  className?: string;
};

const Financials = ({ companyData, className }: Props) => {
  const {
    authorizedCapital,
    paidUpCapital,
    chargeData,
    companyType,
    totalObligationOfContribution,
  } = companyData.data || {};

  const llpTotalObligationOfContribution = totalObligationOfContribution
    ? formatCurrencyINR(parseInt(totalObligationOfContribution))
    : '-';

  return (
    <div className={className}>
      <Card className='overflow-hidden rounded-md shadow-sm'>
        <CardHeader className='bg-green-100 p-4 text-base font-normal'>
          Financials
        </CardHeader>
        <CardContent className='p-4'>
          <div className='space-y-3 divide-y md:space-y-4'>
            <div className='grid grid-cols-1 gap-2 text-sm md:grid-cols-2'>
              <h6 className='font-semibold text-primary'>Financial Year:</h6>
              <p>2023-2024</p>
            </div>

            {companyType === 'Company' && (
              <>
                {/* Authorized Capital */}
                <div className='grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4'>
                  <h6 className='font-semibold text-primary'>
                    Authorized Capital:
                  </h6>
                  <p>
                    <strong>{formatCurrencyINR(authorizedCapital)}</strong>
                  </p>
                </div>
                {/* Paid Up Capital */}
                <div className='grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4'>
                  <h6 className='font-semibold text-primary'>
                    Paid Up Capital:
                  </h6>
                  <p>
                    <strong>{formatCurrencyINR(paidUpCapital)}</strong>
                  </p>
                </div>
              </>
            )}

            {companyType === 'LLP' && (
              <div className='grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4'>
                <h6 className='font-semibold text-primary'>
                  Obligation of Contribution:
                </h6>
                <p>
                  <strong>{llpTotalObligationOfContribution}</strong>
                </p>
              </div>
            )}

            <div className='grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4'>
              <h6 className='font-semibold text-primary'>Sum of Charges:</h6>
              <p>
                <strong>
                  {chargeData?.totalOpenCharges
                    ? formatCurrencyINR(chargeData.totalOpenCharges)
                    : '-'}
                </strong>
              </p>
            </div>
            <div className='grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4'>
              <h6 className='font-semibold text-primary'>
                Date of Balance Sheet:
              </h6>
              <p>-</p>
            </div>
            <div className='grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4'>
              <h6 className='font-semibold text-primary'>Date of AGM:</h6>
              <p>-</p>
            </div>
            <div className='grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4'>
              <h6 className='font-semibold text-primary'>
                Latest Annual return:
              </h6>
              <p>-</p>
            </div>
          </div>

          {/* <div className='md:col-span-2'>
            <FinancialsChart companyData={companyData} />
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Financials;
