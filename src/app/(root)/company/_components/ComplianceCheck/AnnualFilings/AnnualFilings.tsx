'use client';

import {
  TAnnualFilings,
  TAnnualFilingsData,
} from '@/app/(root)/company/_types/CompanyDetails';
import useMediaQuery from '@/hooks/useMediaQuery';
import { getCurrentFY } from '@/lib/utils';
import { useEffect, useState } from 'react';
import TableLoader from '../TableLoader';
import Header from './Header';
import TableDesktopView from './TableDesktopView';
import TableMobileView from './TableMobileView';

type Props = {
  annualFilingsData: TAnnualFilings;
  companyType: string;
};

const AnnualFilings = ({ annualFilingsData, companyType }: Props) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [selectedViewOption, setSelectedViewOption] =
    useState('financial-year');
  const [financialYears, setFinancialYears] = useState<string[]>([]);
  const [formCodes, setFormCodes] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<TAnnualFilingsData[]>([]);

  const currentFinancialYear = financialYears.includes(getCurrentFY())
    ? getCurrentFY()
    : financialYears.sort((a, b) => a.localeCompare(b))[0];

  useEffect(() => {
    if (annualFilingsData.data) {
      const years = annualFilingsData.data.map(
        (filing) => filing.financialYear
      );
      const uniqueYears: string[] = Array.from(new Set(years)).sort((a, b) =>
        b.localeCompare(a)
      );
      setFinancialYears(uniqueYears);

      const codes = annualFilingsData.data.map((filing) => filing.formCode);
      const uniqueCodes: string[] = Array.from(new Set(codes)).sort();
      setFormCodes(uniqueCodes);
    }
  }, [annualFilingsData]);

  useEffect(() => {
    if (annualFilingsData.data) {
      let filteredData: TAnnualFilingsData[] = annualFilingsData.data.sort(
        (a, b) => a.financialYear.localeCompare(b.financialYear)
      );

      if (selectedViewOption === 'financial-year') {
        filteredData = filteredData.filter(
          (filing) => filing.financialYear === currentFinancialYear
        );
      } else if (selectedViewOption === 'form-code') {
        filteredData = filteredData.filter(
          (filing) => filing.formCode === formCodes[0]
        );
      }

      setFilteredData(filteredData);
    }
  }, [annualFilingsData, selectedViewOption, currentFinancialYear, formCodes]);

  return (
    <div>
      {filteredData && filteredData.length > 0 ? (
        <>
          <Header
            companyType={companyType}
            annualFilingsData={annualFilingsData}
            selectedViewOption={selectedViewOption}
            setSelectedViewOption={setSelectedViewOption}
            setFilteredData={setFilteredData}
            financialYears={financialYears}
            formCodes={formCodes}
          />
          {isDesktop ? (
            <TableDesktopView
              selectedViewOption={selectedViewOption}
              filteredData={filteredData}
              companyType={companyType}
            />
          ) : (
            <TableMobileView
              selectedViewOption={selectedViewOption}
              filteredData={filteredData}
              companyType={companyType}
            />
          )}

          {/* <DisclaimerTexts companyType={companyType} /> */}
        </>
      ) : (
        <TableLoader />
      )}
    </div>
  );
};

export default AnnualFilings;
