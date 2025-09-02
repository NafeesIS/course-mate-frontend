'use client';

import UpgradeToReport from '@/app/(root)/(dashboard)/dashboard/unlock-companies/_components/UpgradeToReport';
import { useUnlockedCompaniesList } from '@/app/(root)/(dashboard)/dashboard/unlock-companies/company-details/[...slug]/_hooks/useUnlockedCompaniesList';
import UnlockCompanyBtn from '@/components/shared/UnlockCompany/UnlockCompanyBtn';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatToUrl } from '@/lib/formatters';
import { ArrowUpCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { RiArrowDownLine, RiArrowUpLine } from 'react-icons/ri';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TCompanyMasterData } from '../../_types/CompanyDetails';

interface PnlChartData {
  category: string;
  value: number;
  percentage: number;
  color: string;
}

const data: PnlChartData[] = [
  { category: 'Revenue', value: 36.68, percentage: 116.79, color: '#3B82F6' },
  {
    category: 'Profit/Loss',
    value: -35.48,
    percentage: -156.66,
    color: '#8B5CF6',
  },
  {
    category: 'Cash & Bank Balance',
    value: 103.29,
    percentage: 7459.29,
    color: '#EF4444',
  },
  {
    category: 'Net Worth',
    value: 107.45,
    percentage: 226.07,
    color: '#10B981',
  },
  { category: 'Assets', value: 123.97, percentage: 193.32, color: '#F59E0B' },
  {
    category: "Outsiders' Liabilities",
    value: 16.52,
    percentage: 77.42,
    color: '#6B7280',
  },
];

// const offerItems = [
//   {
//     title: 'Financial Statements',
//     icon: <RiFileTextLine className='text-blue-500' />,
//   },
//   {
//     title: 'Auditor Information',
//     icon: <RiUserLine className='text-green-500' />,
//   },
//   {
//     title: 'Shareholding Patterns',
//     icon: <RiBarChartBoxLine className='text-purple-500' />,
//   },
//   {
//     title: "Directors' Details",
//     icon: <RiTeamLine className='text-orange-500' />,
//   },
//   {
//     title: 'Securities Allotment',
//     icon: <RiFileTextLine className='text-indigo-500' />,
//   },
//   {
//     title: 'Related Corporates',
//     icon: <RiBuildingLine className='text-teal-500' />,
//   },
// ];

const FinancialsChart = ({
  companyData,
}: {
  companyData: TCompanyMasterData;
}) => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  // to check if company is already unlocked or not
  const { isCompanyUnlocked } = useUnlockedCompaniesList({
    enableCaching: true,
  });
  const isUnlocked = isCompanyUnlocked(companyData.data.cin as string);

  return (
    <div className='relative'>
      <div title='dummy data' className='gap-8 overflow-hidden blur lg:flex'>
        <ResponsiveContainer width='100%' height={360}>
          <BarChart
            data={data}
            margin={{
              top: 0,
              right: 10,
              left: -10,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='category'
              interval={0}
              angle={-45}
              textAnchor='end'
              height={120}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip />
            <ReferenceLine y={0} stroke='#000' />
            <Bar dataKey='value' fill='#3B82F6' />
          </BarChart>
        </ResponsiveContainer>
        {/* Legends */}
        <div className='w-fit space-y-3 whitespace-nowrap md:flex md:flex-wrap md:gap-8 md:space-y-0 md:px-4 lg:block lg:space-y-4 lg:px-0'>
          {data.map((entry, index) => (
            <div key={index} className='space-y-2 text-sm'>
              <span className='flex items-center gap-2'>
                <strong>{entry.category}</strong> - &#8377; subscribe to get
                details
              </span>
              {entry.percentage < 0 ? (
                <Badge variant='destructive'>
                  <RiArrowDownLine className='mr-1 text-base' /> subscribe to
                  get details
                </Badge>
              ) : (
                <Badge variant='secondary'>
                  <RiArrowUpLine className='mr-1 text-base' /> subscribe to get
                  details
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      {companyData.data.companyType === 'LLP' &&
      isUnlocked.isUnlocked &&
      isUnlocked.unlockType === 'documents' ? (
        <UpgradeToReport
          companyId={companyData.data.cin}
          companyName={companyData.data.company}
          customButton={
            <button
              className={`absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2 rounded border border-gray-400 bg-yellow-300 px-4 py-2 text-[10px] font-medium text-gray-800 transition-colors hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 md:w-auto md:text-sm`}
            >
              <ArrowUpCircle className='size-4' />
              Upgrade to Report
            </button>
          }
        />
      ) : isUnlocked.isUnlocked && isUnlocked.unlockType === 'report' ? (
        <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
          <p className='mb-1 text-[10px]'>Already unlocked!</p>
          <Button
            variant='secondary'
            className='flex w-full items-center gap-1.5 rounded-md bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 md:text-sm lg:w-fit'
            onClick={() =>
              router.push(
                `/dashboard/unlock-companies/company-details/${formatToUrl(companyData.data.company)}/${companyData.data.cin}?tab=financials`
              )
            }
          >
            <CheckCircle className='size-4' />
            View Complete Report
          </Button>
        </div>
      ) : (
        <UnlockCompanyBtn
          btnText='Access Details'
          companyData={companyData}
          className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-2 bg-primary px-4 py-2 text-white ring-4'
        />
      )}

      {/* CTA - Access Details */}
      {/* <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button
            variant='default'
            size='lg'
            className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-2 ring-4'
          >
            <RiLockUnlockLine className='text-base' />
            Access Details
          </Button>
        </DialogTrigger>
        <DialogContent className='p-4 sm:max-w-[800px] md:p-8'>
          <div className='grid sm:grid-cols-2 sm:gap-6'>
            <div>
              <h2 className='text-xl font-bold text-primary md:text-2xl'>
                Get Financial Data
              </h2>
              <Separator className='my-3' />
              <p className='hidden text-sm text-muted-foreground sm:block md:text-base'>
                Gain access to in-depth financial data and insights that will
                empower your business decisions.
              </p>
              <ul className='mt-4 hidden flex-wrap gap-3 sm:flex md:gap-4'>
                {offerItems.map((item, index) => (
                  <li key={index} className='flex items-center gap-2'>
                    {item.icon}
                    <span className='text-xs font-medium md:text-sm'>
                      {item.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className='space-y-4'>
              <FinancialDataLeadForm
                source='company page financial data cta'
                serviceTypes={['Financial Data']}
                onSuccessfulSubmission={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default FinancialsChart;
