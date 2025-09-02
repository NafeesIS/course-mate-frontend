import { Card, CardContent } from '@/components/ui/card';
import {
  RiBarChartBoxLine,
  RiBuildingLine,
  RiDatabase2Line,
  RiFileTextLine,
  RiLineChartLine,
  RiPieChartLine,
  RiTeamLine,
  RiUserLine,
} from 'react-icons/ri';
import { TCompanyMasterData } from '../../_types/CompanyDetails';
import { IFinancialDocsApiResponse } from '../../_types/FinancialDocsDataType';
import FinancialsChart from '../About/FinancialsChart';
import CTAUnlockCompanyData from '../CTA/CTAUnlockCompanyData';
import FinancialDocsData from './FinancialDocsData';
import { DUMMY_DATA } from './utils/dummy-data';

export const offerItems = [
  {
    title: 'Financial Statements',
    icon: <RiFileTextLine className='text-primary' />,
    description:
      'Comprehensive balance sheets, income statements, and cash flow reports',
  },
  {
    title: 'Auditor Information',
    icon: <RiUserLine className='text-primary' />,
    description: 'Detailed auditor profiles and audit report summaries',
  },
  {
    title: 'Shareholding Patterns',
    icon: <RiBarChartBoxLine className='text-primary' />,
    description:
      'In-depth analysis of ownership structure and major shareholders',
  },
  {
    title: "Directors' Details",
    icon: <RiTeamLine className='text-primary' />,
    description: 'Profiles and shareholding information of company directors',
  },
  {
    title: 'Securities Allotment',
    icon: <RiPieChartLine className='text-primary' />,
    description: 'Detailed records of share issuances and allotments',
  },
  {
    title: 'Related Corporates',
    icon: <RiBuildingLine className='text-primary' />,
    description:
      'Information on parent companies, subsidiaries, and associated entities',
  },
  {
    title: 'Financial Ratios',
    icon: <RiLineChartLine className='text-primary' />,
    description: 'Key performance indicators and financial health metrics',
  },
  {
    title: 'Historical Data',
    icon: <RiDatabase2Line className='text-primary' />,
    description: 'Multi-year financial data for trend analysis',
  },
];

const Financials = async ({
  companyData,
}: {
  companyData: TCompanyMasterData;
}) => {
  // const cin = companyData.data?.cin;
  // const financialDocsData: IFinancialDocsApiResponse =
  //   await getFinancialDocsData(cin);

  const financialDocsData: IFinancialDocsApiResponse = DUMMY_DATA;

  return (
    <div className='mt-10'>
      <CTAUnlockCompanyData companyData={companyData} source='financials-tab' />

      <div className='mt-8 pb-10'>
        {companyData.data.companyType === 'LLP' ? (
          <FinancialDocsData
            companyData={companyData}
            financialDocsData={financialDocsData}
          />
        ) : (
          <>
            <div className='mt-10'>
              <h2 className='text-lg font-bold md:text-xl'>
                Unlock Comprehensive Financial Intelligence
              </h2>
              <p className='mt-4 text-balance text-sm leading-relaxed text-gray-700 md:text-base'>
                Empower your investment decisions with our in-depth financial
                analysis and corporate insights. Get access to the critical data
                you need to stay ahead in the market.
              </p>
            </div>

            <div className='mt-8'>
              <div className='rounded-lg border bg-primary/5 p-10 shadow'>
                <FinancialsChart companyData={companyData} />
              </div>

              <div className='mt-10'>
                <h2 className='text-lg font-semibold text-gray-800'>
                  What We Offer
                </h2>
                <div className='mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
                  {offerItems.map((item, index) => (
                    <Card
                      key={index}
                      className='rounded-md border-t-4 border-primary bg-white shadow-sm transition-all hover:shadow-md'
                    >
                      <CardContent className='flex flex-col p-6'>
                        <div className='rounded-md bg-primary/10 text-3xl'>
                          {item.icon}
                        </div>
                        <h3 className='mt-3 text-sm font-semibold text-gray-900'>
                          {item.title}
                        </h3>
                        <p className='mt-2 text-xs text-gray-600'>
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Financials;
