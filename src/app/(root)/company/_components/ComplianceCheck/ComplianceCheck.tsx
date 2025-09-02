/* eslint-disable indent */
import Loading from '@/app/(root)/company/[...slug]/loading';
import { ComplianceLeadBanner } from '@/components/shared/LeadForm/ComplianceLeadBanner';
import { GSTLeadBanner } from '@/components/shared/LeadForm/GSTLeadBanner';
import { Suspense } from 'react';
import DisclaimerTextsAnnual from './AnnualFilings/DisclaimerTexts';
import ComplianceDetails from './ComplianceDetails';
import DisclaimerTexts from './FirstTimeCompliance/DisclaimerTexts';
import GST from './GSTDetails/GST';

type Props = {
  oneTimeComplianceData: any;
  annualFilingsData: any;
  companyType: string;
  gstData: any;
};

const ComplianceCheck = async ({
  oneTimeComplianceData,
  annualFilingsData,
  companyType,
  gstData,
}: Props) => {
  // Default rendering if all data is available
  return (
    <div className='mt-8'>
      <ComplianceDetails
        oneTimeComplianceData={oneTimeComplianceData}
        annualFilingsData={annualFilingsData}
        companyType={companyType}
      />

      <ComplianceLeadBanner className='my-8' />

      <Suspense fallback={<Loading />}>
        <GST gstData={gstData} />
      </Suspense>

      <GSTLeadBanner className='my-8' />

      <DisclaimerTexts companyType={companyType} />
      <DisclaimerTextsAnnual companyType={companyType} />
    </div>
  );
};

export default ComplianceCheck;
