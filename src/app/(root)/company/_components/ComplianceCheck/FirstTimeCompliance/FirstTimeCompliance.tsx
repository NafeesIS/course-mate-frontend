'use client';

import { TOneTimeCompliance } from '@/app/(root)/company/_types/CompanyDetails';
import TableLoader from '../TableLoader';
import Header from './Header';
import TableDesktopView from './TableDesktopView';
import TableMobileView from './TableMobileView';

type Props = {
  oneTimeComplianceData: TOneTimeCompliance;
  companyType: string;
};

const FirstTimeCompliance = ({ oneTimeComplianceData, companyType }: Props) => {
  const filteredData = oneTimeComplianceData.data;

  return (
    <div className='mt-6'>
      {filteredData && filteredData.length > 0 ? (
        <>
          <Header companyType={companyType} />
          <TableDesktopView filteredData={filteredData} />
          <TableMobileView filteredData={filteredData} />
          {/* <DisclaimerTexts companyType={companyType} /> */}
        </>
      ) : (
        <TableLoader />
      )}
    </div>
  );
};

export default FirstTimeCompliance;
