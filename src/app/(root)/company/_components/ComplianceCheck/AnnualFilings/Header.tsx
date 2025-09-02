'use client';

import {
  TAnnualFilings,
  TAnnualFilingsData,
} from '@/app/(root)/company/_types/CompanyDetails';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCurrentFY } from '@/lib/utils';

type Props = {
  companyType: string;
  annualFilingsData: TAnnualFilings;
  selectedViewOption: string;
  setSelectedViewOption: React.Dispatch<React.SetStateAction<string>>;
  setFilteredData: React.Dispatch<React.SetStateAction<TAnnualFilingsData[]>>;
  financialYears: string[];
  formCodes: string[];
};

const Header = ({
  companyType,
  annualFilingsData,
  selectedViewOption,
  setSelectedViewOption,
  setFilteredData,
  financialYears,
  formCodes,
}: Props) => {
  const currentFinancialYear = financialYears.includes(getCurrentFY())
    ? getCurrentFY()
    : financialYears.sort((a, b) => a.localeCompare(b))[0];

  const handleFinancialYearChange = (year: string) => {
    setFilteredData(
      annualFilingsData.data.filter((filing) => filing.financialYear === year)
    );
  };

  const handleFormCodeChange = (code: string) => {
    setFilteredData(
      annualFilingsData.data.filter((filing) => filing.formCode === code)
    );
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='space-y-3'>
        <h2 className='text-lg font-semibold'>Annual Filings</h2>
        {companyType === 'Company' ? (
          // for Company
          <p className='text-sm'>
            Annual compliance for a Company includes filing Form AOC-4, which
            reports the financial statements, and Form MGT-7, which contains the
            annual return with details about the company&apos;s structure and
            operations.
          </p>
        ) : (
          // for LLP
          <p className='text-sm'>
            Annual compliance for an LLP includes filing Form 8, which reports
            the LLP&apos;s financial position and solvency status, ensuring it
            can meet its obligations. Additionally, LLP Form 11 provides details
            about the LLP&apos;s partners and any changes, keeping the Registrar
            informed about its structure and operations.
          </p>
        )}
      </div>
      {/* FILTERS */}
      {annualFilingsData.data && (
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-6'>
          {/* TABS: VIEW BY */}
          <div>
            <p className='mb-1 text-sm'>View by</p>
            <Tabs
              value={selectedViewOption}
              onValueChange={setSelectedViewOption}
            >
              <TabsList className='h-fit rounded-md p-1'>
                <TabsTrigger value='financial-year' className='rounded py-1.5'>
                  Financial Year
                </TabsTrigger>
                <TabsTrigger value='form-code' className='rounded py-1.5'>
                  Form Code
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {/* FILTER: FINANCIAL YEAR */}
          {selectedViewOption === 'financial-year' && (
            <div>
              <p className='mb-1 text-sm'>Financial Year</p>
              <Select
                defaultValue={currentFinancialYear}
                onValueChange={(value) => handleFinancialYearChange(value)}
              >
                <SelectTrigger className='w-[200px] text-sm'>
                  <SelectValue placeholder={currentFinancialYear} />
                </SelectTrigger>
                <SelectContent>
                  {financialYears.map((year) => (
                    <SelectItem key={year} value={year} className='text-sm'>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {/* FILTER: FORM CODE */}
          {selectedViewOption === 'form-code' && (
            <div>
              <p className='mb-1 text-sm'>Form Code</p>
              <Select
                defaultValue={formCodes[0]}
                onValueChange={(value: string) => handleFormCodeChange(value)}
              >
                <SelectTrigger className='w-[200px] text-sm'>
                  <SelectValue placeholder={formCodes[0]} />
                </SelectTrigger>
                <SelectContent>
                  {formCodes.map((code) => (
                    <SelectItem key={code} value={code} className='text-sm'>
                      {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
