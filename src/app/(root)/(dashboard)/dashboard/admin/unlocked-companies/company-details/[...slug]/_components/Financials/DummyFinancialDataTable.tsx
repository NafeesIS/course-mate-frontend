'use client';

import DummyAsstAndLiabTable from '@/app/(root)/company/_components/Financials/DummyAsstAndLiabTable';
import DummyIncAndExpTable from '@/app/(root)/company/_components/Financials/DummyIncAndExpTable';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BarChart2 } from 'lucide-react';
import { useState } from 'react';
import { TCompanyMasterData } from '../../_types/CompanyDetails';
import { IFinancialDocsApiResponse } from '../../_types/FinancialDocsDataType';

type UnitType = 'raw' | 'lakhs' | 'crores';

export default function DummyFinancialDataTable({
  companyData,
  financialDocsData,
  isUnlocked = { isUnlocked: false, unlockType: null },
}: {
  companyData: TCompanyMasterData;
  financialDocsData: IFinancialDocsApiResponse;
  isUnlocked?: { isUnlocked: boolean; unlockType: string | null };
}) {
  const [unit, setUnit] = useState<UnitType>('raw');
  const years = Object.keys(financialDocsData.data).sort(
    (a, b) => Number(b) - Number(a)
  );

  return (
    <TooltipProvider>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <BarChart2 className='size-5 text-primary' />
          <h2 className='text-base font-bold text-gray-800 md:text-lg'>
            Financial Statement
          </h2>
        </div>
        <div className='flex items-center gap-2 md:gap-4'>
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
        </div>
      </div>

      {/* Statement of Assets and Liabilities */}
      <DummyAsstAndLiabTable
        companyData={companyData}
        financialDocsData={financialDocsData}
        years={years}
        isSamePage={true}
        isUnlocked={isUnlocked}
      />

      {/* Statement of Income and Expenditure */}
      <DummyIncAndExpTable
        companyData={companyData}
        financialDocsData={financialDocsData}
        years={years}
        isSamePage={true}
        isUnlocked={isUnlocked}
      />
    </TooltipProvider>
  );
}
