'use client';

import { useUnlockedCompaniesList } from '@/app/(root)/(dashboard)/dashboard/unlock-companies/company-details/[...slug]/_hooks/useUnlockedCompaniesList';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BarChart2 } from 'lucide-react';
import { TCompanyMasterData } from '../../_types/CompanyDetails';
import { IFinancialDocsApiResponse } from '../../_types/FinancialDocsDataType';
import DummyAsstAndLiabTable from './DummyAsstAndLiabTable';
import DummyIncAndExpTable from './DummyIncAndExpTable';

// type UnitType = 'raw' | 'lakhs' | 'crores';

export default function FinancialDataTable({
  companyData,
  financialDocsData,
}: {
  companyData: TCompanyMasterData;
  financialDocsData: IFinancialDocsApiResponse;
}) {
  // const [unit, setUnit] = useState<UnitType>('raw');
  const years = Object.keys(financialDocsData.data).sort(
    (a, b) => Number(b) - Number(a)
  );

  // to check if company is already unlocked or not
  const { isCompanyUnlocked } = useUnlockedCompaniesList({
    enableCaching: true,
  });
  const isUnlocked = isCompanyUnlocked(companyData.data.cin as string);

  return (
    <TooltipProvider>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <BarChart2 className='h-6 w-6 text-primary' />
          <h2 className='text-lg font-bold text-gray-800 md:text-xl'>
            Financial Statement
          </h2>
        </div>
        {/* <div className='flex items-center gap-2 md:gap-4'>
          <Select
            value={unit}
            onValueChange={(value) => setUnit(value as UnitType)}
          >
            <SelectTrigger className='w-32 text-xs md:w-[180px]'>
              <SelectValue placeholder='Select unit' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='raw' className='text-xs'>
                In Rupees
              </SelectItem>
              <SelectItem value='lakhs' className='text-xs'>
                In Lakhs
              </SelectItem>
              <SelectItem value='crores' className='text-xs'>
                In Crores
              </SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>

      {/* Statement of Assets and Liabilities */}
      <DummyAsstAndLiabTable
        companyData={companyData}
        financialDocsData={financialDocsData}
        years={years}
        isUnlocked={isUnlocked}
      />

      {/* Statement of Income and Expenditure */}
      <DummyIncAndExpTable
        companyData={companyData}
        financialDocsData={financialDocsData}
        years={years}
        isUnlocked={isUnlocked}
      />

      {/* Statement of Assets and Liabilities */}
      {/* <AsstAndLiabTable
        companyData={companyData}
        financialDocsData={financialDocsData}
        unit={unit}
        years={years}
      /> */}

      {/* Statement of Income and Expenditure */}
      {/* <IncAndExpTable
        financialDocsData={financialDocsData}
        unit={unit}
        years={years}
      /> */}
    </TooltipProvider>
  );
}
