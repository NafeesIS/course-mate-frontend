'use client';
import Image from 'next/image';
import { useState } from 'react';
import process from '../../../../../../public/assets/business-services/annual-compliance-llp/annual_process_llp.png';

const ProcessAnnualLLP = () => {
  const [openSection, setOpenSection] = useState('stepOne');

  const toggleSection = (section: any) => {
    setOpenSection(section);
  };
  return (
    <div className='wrapper mb-20 mt-16 h-full text-center'>
      <h2 className='mx-auto mb-6 px-4 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
        <span className='mr-1 italic text-primary'>Process</span> of Annual
        compliances{' '}
      </h2>
      <div className='flex h-full flex-col items-center gap-4 lg:flex-row'>
        <div
          className={
            'mx-auto h-full max-w-80 border-l-4 text-start sm:max-w-[620px] md:max-w-[750px] md:translate-x-5 lg:mr-auto lg:translate-x-0 xl:max-w-[680px]'
          }
        >
          <div
            className={`-translate-x-1 border-l-4 px-3 duration-300 md:px-4 ${openSection === 'stepOne' ? 'mb-5 h-[180px] border-l-primary sm:h-28 lg:h-[124px]' : 'mb-8 h-8 sm:mb-3'}`}
          >
            <p
              onClick={() => toggleSection('stepOne')}
              className='cursor-pointer pb-2 pt-1 text-base font-semibold xl:text-lg'
            >
              <span className='text-primary'>Step- 1:</span> Financial
              Statements and Audit Requirements for LLP
            </p>
            <p
              className={`${openSection === 'stepOne' ? 'h-28 sm:h-20' : 'h-0'}  text-muted-foreground-darker overflow-hidden text-xs duration-300 lg:text-sm`}
            >
              When the financial year ends, every LLP must prepare its Financial
              Statements. LLPs with a partner’s contribution exceeding ₹25 lakhs
              or a turnover exceeding ₹40 lakhs are required to have their
              accounts audited by a certified Auditor. However, even if an LLP
              does not meet these thresholds, the Partners can still choose to
              get the accounts audited voluntarily.
            </p>
          </div>
          <div
            className={`-translate-x-1 border-l-4 px-3 duration-300 md:px-4 ${openSection === 'stepTwo' ? 'mb-5 h-48 border-l-primary sm:h-28 md:h-24 lg:h-[132px]' : 'mb-8 h-8 sm:mb-3'}`}
          >
            <p
              onClick={() => toggleSection('stepTwo')}
              className='cursor-pointer pb-2 pt-1 text-base font-semibold xl:text-lg'
            >
              <span className='text-primary'>Step- 2:</span> Income Tax Return
              Filing for LLP
            </p>
            <p
              className={`${openSection === 'stepTwo' ? 'h-36 sm:h-24' : 'h-0'}  text-muted-foreground-darker flex flex-col justify-start gap-1.5 overflow-hidden text-xs duration-300 lg:text-sm`}
            >
              <span>
                Every LLP is required to file an Income Tax Return (ITR) to
                assess its tax liability and pay taxes to the Government of
                India. Even if an LLP has zero tax liability, it must still file
                its ITR by 31st July of the relevant assessment year.
              </span>
              <span className='lg:max-w-2xl'>
                {' '}
                If the LLP is required to undergo a mandatory audit, the date
                for filing the ITR is 30th September.
              </span>
            </p>
          </div>
          <div
            className={`-translate-x-1 border-l-4 px-3 duration-300 md:px-4 ${openSection === 'stepThree' ? 'h-[231px] border-l-primary sm:h-36 lg:h-[170px]' : 'h-8'}`}
          >
            <p
              onClick={() => toggleSection('stepThree')}
              className='cursor-pointer whitespace-nowrap pb-2 text-base font-semibold xl:text-lg'
            >
              <span className='text-primary'>Step- 3:</span> Annual ROC Filings
              for LLP
            </p>
            <p
              className={`${openSection === 'stepThree' ? 'h-52 sm:h-36' : 'h-0'}  text-muted-foreground-darker flex flex-col justify-start gap-1.5 overflow-hidden text-xs duration-300 lg:text-sm`}
            >
              <span>
                Every LLP must file an Annual Return in Form 11 with the
                Registrar of Companies (ROC) within 60 days from the end of the
                financial year.
              </span>
              <span>
                LLPs must also file a Statement of Accounts and Solvency in Form
                8 with the ROC within 30 days after the end of 6 months from the
                financial year.
              </span>
              <span className='font-medium italic'>
                This entire process ensures compliance with the legal
                obligations under the Limited Liability Act, 2008, and promotes
                transparency and accountability in the company’s financial
                reporting.
              </span>
            </p>
          </div>
        </div>
        <Image
          src={process}
          alt='process'
          className='object-cover sm:max-w-[550px] lg:max-w-[40%]'
        />
      </div>
    </div>
  );
};

export default ProcessAnnualLLP;
