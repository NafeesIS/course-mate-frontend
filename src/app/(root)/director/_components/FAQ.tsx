import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../../components/ui/accordion';
import { getFirstAndLatestCompany } from '../_utils/helperFunctions';

type Props = {
  directorData: any;
  className?: string;
};

const DirectorFAQ: React.FC<Props> = ({ directorData, className }) => {
  const {
    fullName,
    gender,
    nationality,
    // dob,
    din,
    status,
    companyData,
    mcaSignatoryCessationMasterHistory,
  } = directorData || {};
  const directorName = fullName || '-';

  // Create a set of unique company names to ensure each company is counted only once
  const uniqueCompanyNames = new Set(
    companyData?.map((company: any) => company.nameOfTheCompany)
  );
  const totalCompanies = uniqueCompanyNames.size;

  // Get the first and latest company
  const { firstCompany, latestCompany } =
    (companyData && getFirstAndLatestCompany(companyData)) || {};
  const firstCompanyName = firstCompany?.nameOfTheCompany || '';
  const latestCompanyName = latestCompany?.nameOfTheCompany || '';

  // Get the unique and total designations
  const directorDesignations = companyData
    .map((company: any) => company.designation)
    .filter((designation: any) => designation);
  const uniqueDesignations = Array.from(new Set(directorDesignations));

  // Determine the role description
  let roleDescription = uniqueDesignations.join(', ');
  if (uniqueDesignations && uniqueDesignations.length > 1) {
    roleDescription = `${uniqueDesignations.slice(0, -1).join(', ')} and ${uniqueDesignations.slice(-1)}`;
  }

  // Determine the specific role in the latest company
  const latestRole =
    companyData.find(
      (company: any) => company.nameOfTheCompany === latestCompanyName
    )?.designation || '';

  // Create a set of unique past company names
  const uniquePastCompanyNames = new Set(
    mcaSignatoryCessationMasterHistory?.map(
      (company: any) => company.accountName
    )
  );
  const totalPastCompanies = uniquePastCompanyNames.size;

  // Get the unique and total past designations
  const pastDesignations = mcaSignatoryCessationMasterHistory
    ?.map((company: any) => company.designation)
    .filter((designation: any) => designation);
  const uniquePastDesignations = Array.from(new Set(pastDesignations));

  // Determine the past role description
  let pastRoleDescription = uniquePastDesignations.join(', ');
  if (uniqueDesignations && uniquePastDesignations.length > 1) {
    pastRoleDescription = `${uniquePastDesignations.slice(0, -1).join(', ')} and ${uniquePastDesignations.slice(-1)}`;
  }

  return (
    <div className={cn('wrapper', className)}>
      <h2 className='text-xl font-semibold md:text-2xl'>
        Frequently Asked Questions about {directorName}
      </h2>

      <div className='mt-4 space-y-2 px-2'>
        <QuestionAnswer
          question={`What is the DIN number of ${directorName}?`}
          answer={`The DIN number of ${directorName} is ${din || '-'}.`}
        />
        <QuestionAnswer
          question={`What is the current directorship status of ${directorName}?`}
          answer={`The current directorship status of ${directorName} is ${status || '-'}.`}
        />
        <QuestionAnswer
          question={`How many companies is ${directorName} associated with currently?`}
          answer={`${directorName} is currently associated with ${totalCompanies} compan${totalCompanies > 1 ? 'ies' : 'y'}.`}
        />
        <QuestionAnswer
          question={`How many past companies has ${directorName} been associated with?`}
          answer={`${directorName} has been associated with ${totalPastCompanies} past companies.`}
        />
        {totalCompanies > 0 && (
          <QuestionAnswer
            question={`Which companies is ${directorName} currently associated with?`}
            answer={`${directorName} is currently associated with the following companies: ${Array.from(uniqueCompanyNames).join(', ')}.`}
          />
        )}
        {totalPastCompanies > 0 && (
          <QuestionAnswer
            question={`Which past companies was ${directorName} associated with?`}
            answer={`${directorName} has previously been associated with the following companies: ${Array.from(uniquePastCompanyNames).join(', ')}.`}
          />
        )}
        {totalCompanies > 0 && (
          <QuestionAnswer
            question={`What roles does ${directorName} hold in the current companies?`}
            answer={`${directorName} holds the following roles in the current companies: ${companyData?.map((company: any) => (company.designation ? `${company.designation} at ${company.nameOfTheCompany}` : '-')).join(', ')}.`}
          />
        )}
        {totalPastCompanies > 0 && (
          <QuestionAnswer
            question={`What roles did ${directorName} hold in past companies?`}
            answer={`In past companies, ${directorName} held the following roles: ${mcaSignatoryCessationMasterHistory?.map((company: any) => (company.designation ? `${company.designation} at ${company.accountName}` : '-')).join(', ')}.`}
          />
        )}

        {/* <QuestionAnswer
          question={`When was ${directorName} born?`}
          answer={`${directorName} was born on ${dob || '-'}.`}
        /> */}
        <QuestionAnswer
          question={`What is ${directorName}'s gender and nationality?`}
          answer={`${directorName} is ${gender || '-'} and holds ${nationality || '-'} nationality.`}
        />
        {roleDescription && (
          <QuestionAnswer
            question={`What role and designation does ${directorName} currently hold in companies?`}
            answer={`${directorName} currently holds the role of ${roleDescription || '-'} in the associated companies.`}
          />
        )}
        {pastRoleDescription && (
          <QuestionAnswer
            question={`What role and designation did ${directorName} hold in companies?`}
            answer={`In past roles, ${directorName} held the following roles: ${pastRoleDescription || '-'} in various companies.`}
          />
        )}
        {firstCompanyName && (
          <QuestionAnswer
            question={`What is the name of the first company associated with ${directorName}?`}
            answer={`The first company associated with ${directorName} is ${firstCompanyName || '-'}.`}
          />
        )}
        {firstCompany?.roleEffectiveDate && (
          <QuestionAnswer
            question={`When did ${directorName} start their association with the first company?`}
            answer={`${directorName} started their association with ${firstCompanyName} on ${firstCompany?.roleEffectiveDate ? format(firstCompany?.roleEffectiveDate, 'dd-MMM-yyyy') : '-'}.`}
          />
        )}
        {latestCompanyName && (
          <>
            <QuestionAnswer
              question={`What is the name of the latest company associated with ${directorName}?`}
              answer={`The latest company associated with ${directorName} is ${latestCompanyName || '-'}.`}
            />
            <QuestionAnswer
              question={`When did ${directorName} start their association with the latest company?`}
              answer={`${directorName} started their association with ${latestCompanyName} on ${latestCompany?.roleEffectiveDate ? format(latestCompany?.roleEffectiveDate, 'dd-MMM-yyyy') : '-'}.`}
            />
            <QuestionAnswer
              question={`What is ${directorName}'s role in their latest company?`}
              answer={`${directorName}'s role in their latest company, ${latestCompanyName}, is ${latestRole || '-'}.`}
            />
          </>
        )}
      </div>
    </div>
  );
};

type QuestionAnswerProps = {
  question: string;
  answer: string | React.ReactNode;
};

const QuestionAnswer: React.FC<QuestionAnswerProps> = ({
  question,
  answer,
}) => (
  <div className='grid gap-4'>
    <Accordion type='multiple' className='w-full'>
      <AccordionItem value={question}>
        <AccordionTrigger className='text-left text-sm font-medium text-gray-800 md:text-base'>
          {question}
        </AccordionTrigger>
        <AccordionContent className='text-xs text-gray-700 md:text-sm'>
          {answer}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

export default DirectorFAQ;
