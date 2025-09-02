import { TCompanyMasterData } from '@/app/(root)/company/_types/CompanyDetails';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { formatCompanyAge, formatCurrencyINR } from '@/lib/formatters';
import React from 'react';

type Props = {
  companyData: TCompanyMasterData;
  className?: string;
};

const FAQ: React.FC<Props> = ({ companyData, className }) => {
  const {
    company,
    registrationNumber,
    dateOfIncorporation,
    category,
    address,
    currentDirectors,
    pastDirectors,
    executiveTeam,
    chargeData,
    status,
    state,
    classOfCompany,
    companyOrigin,
    companySubcategory,
    rocCode,
    incorporationAge,
    authorizedCapital,
    paidUpCapital,
    listingStatus,
  } = companyData.data || {};

  const registeredAddress = address?.registeredAddress ?? '';
  const city = address?.city ?? '';
  const pinCode = address?.pinCode ?? '';

  return (
    <div className={className}>
      <h2 className='text-xl font-semibold md:text-2xl'>
        Frequently Asked Questions about {company}
      </h2>
      <div className='mt-4 space-y-2 px-2'>
        <QuestionAnswer
          question={`What is ${company} registered as?`}
          answer={`It is registered as a ${category} with the registration number ${registrationNumber}.`}
        />
        <QuestionAnswer
          question={`When was ${company} incorporated?`}
          answer={`It was incorporated on ${dateOfIncorporation}.`}
        />
        <QuestionAnswer
          question={`What is the status of ${company}?`}
          answer={`The company is currently ${status}.`}
        />
        {registeredAddress && (
          <QuestionAnswer
            question={`Where is ${company} located?`}
            answer={`It is located at ${registeredAddress}, ${city}, ${pinCode}.`}
          />
        )}
        {state && (
          <QuestionAnswer
            question={`In which state is ${company} registered?`}
            answer={`The company is registered in the state of ${state}.`}
          />
        )}
        <QuestionAnswer
          question={`What is the class of ${company}?`}
          answer={`It is classified as a ${classOfCompany}.`}
        />
        <QuestionAnswer
          question={`What is the origin of ${company}?`}
          answer={`The company is of ${companyOrigin} origin.`}
        />
        <QuestionAnswer
          question={`How long has ${company} been incorporated?`}
          answer={`The company has been incorporated for ${incorporationAge && formatCompanyAge(incorporationAge, dateOfIncorporation)}.`}
        />
        <QuestionAnswer
          question={`What is the authorized capital of ${company}?`}
          answer={`The authorized capital is ${formatCurrencyINR(authorizedCapital)}.`}
        />
        <QuestionAnswer
          question={`What is the paid-up capital of ${company}?`}
          answer={`The paid-up capital is ${formatCurrencyINR(paidUpCapital)}.`}
        />
        <QuestionAnswer
          question={`Is ${company} listed?`}
          answer={`The company is ${listingStatus === 'Y' ? 'listed' : 'not listed'}.`}
        />
        <QuestionAnswer
          question={`Who are the current directors of ${company}?`}
          answer={
            currentDirectors && currentDirectors.length > 0 ? (
              <div>
                <p>
                  {company} currently has{' '}
                  {currentDirectors && currentDirectors.length} current
                  director(s). Here is the list:
                </p>
                <ul className='mt-2 pl-6 md:pl-8'>
                  {currentDirectors.map((director: any, index: number) => (
                    <li key={index} className='list-disc'>
                      {director.fullName} ({director.din}) -{' '}
                      {director.designation}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              'There are no current directors in this CIN/LLP as per our records.'
            )
          }
        />
        <QuestionAnswer
          question={`Who were the past directors of ${company}?`}
          answer={
            pastDirectors && pastDirectors.length > 0 ? (
              <div>
                <p>
                  {company} currently has {pastDirectors.length} past
                  director(s). Here is the list:
                </p>
                <ul className='mt-2 pl-6 md:pl-8'>
                  {pastDirectors.map((director: any, index: number) => (
                    <li key={index} className='list-disc'>
                      {director.fullName} ({director.din})
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              'There are no past directors in this CIN/LLP as per our records.'
            )
          }
        />
        <QuestionAnswer
          question={`Who are the members of the executive team at ${company}?`}
          answer={
            executiveTeam && executiveTeam.length > 0 ? (
              <div>
                <p>
                  {company} currently has {executiveTeam.length} member(s) at
                  executive team. Here is the list:
                </p>
                <ul className='mt-2 pl-6 md:pl-8'>
                  {executiveTeam.map((director: any, index: number) => (
                    <li key={index} className='list-disc'>
                      {director.fullName} ({director.din}) -{' '}
                      {director.designation}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              'There are no members in the executive team in this CIN/LLP as per our records.'
            )
          }
        />
        <QuestionAnswer
          question={`What is the company type of ${company}?`}
          answer={`It is a ${category}.`}
        />
        <QuestionAnswer
          question={`What is the company subcategory of ${company}?`}
          answer={`It is a ${companySubcategory}.`}
        />
        <QuestionAnswer
          question={`Does ${company} have any charges registered against it?`}
          answer={
            chargeData.totalOpenCharges ? (
              <div>
                <p>
                  Yes, there are charges registered against the CIN/LLP. Here
                  are some details:
                </p>
                <ul className='mt-2 pl-6 md:pl-8'>
                  <li className='list-disc'>
                    Total Open Charges: {chargeData.totalOpenCharges}
                  </li>
                  <li className='list-disc'>
                    Total Satisfied Charges: {chargeData.totalSatisfiedCharges}
                  </li>
                  <li className='list-disc'>
                    Total Lenders: {chargeData.totalLenders}
                  </li>
                  <li className='list-disc'>
                    Last Charge Date: {chargeData.lastChargeDate}
                  </li>
                  <li className='list-disc'>
                    Last Charge Amount: {chargeData.lastChargeAmount}
                  </li>
                </ul>
              </div>
            ) : (
              chargeData.messageForNoCharge ||
              'There are no Charges registered against the CIN/LLP as per our records.'
            )
          }
        />
        <QuestionAnswer
          question={`What is the ROC code of ${company}?`}
          answer={`The ROC code is ${rocCode}.`}
        />
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

export default FAQ;
