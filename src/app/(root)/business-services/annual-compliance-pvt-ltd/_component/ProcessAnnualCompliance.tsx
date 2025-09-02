'use client';
import Image from 'next/image';
import { useState } from 'react';
import process from '../../../../../../public/assets/business-services/annual-compliance-plc/process_annual.png';

const ProcessAnnualCompliance = () => {
  const [openSection, setOpenSection] = useState('stepOne');

  const toggleSection = (section: any) => {
    setOpenSection(section);
  };
  return (
    <div className='wrapper mb-20 mt-16 h-full text-center'>
      <h2 className='mx-auto mb-10 px-4 text-center text-2xl font-bold leading-snug md:text-3xl md:leading-snug'>
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
            className={`-translate-x-1 border-l-4 px-3 duration-300 md:px-4 ${openSection === 'stepOne' ? 'mb-5 h-[180px] border-l-primary sm:h-[88px] lg:h-[124px]' : 'mb-8 h-8 sm:mb-3'}`}
          >
            <p
              onClick={() => toggleSection('stepOne')}
              className='cursor-pointer pb-2 pt-1 text-base font-semibold xl:text-lg'
            >
              <span className='text-primary'>Step- 1:</span> Statutory Audit and
              Auditor’s Report
            </p>
            <p
              className={`${openSection === 'stepOne' ? 'h-28 sm:h-20' : 'h-0'}  text-muted-foreground-darker overflow-hidden text-xs duration-300 lg:text-sm`}
            >
              The statutory Auditor of the company is responsible for examining
              the company’s annual accounts to ensure they provide a true and
              fair view of the company’s financial position.After conducting the
              audit,the auditor prepares the Audit Report and provides his
              remarks in the report.
            </p>
          </div>
          <div
            className={` -translate-x-1 border-l-4 px-3 duration-300 md:px-4 ${openSection === 'stepTwo' ? 'mb-5 h-[200px] border-l-primary sm:h-[124px] md:h-20 lg:h-[148px]' : 'mb-[52px] h-8 sm:mb-9 md:mb-3 lg:mb-9'}`}
          >
            <p
              onClick={() => toggleSection('stepTwo')}
              className='cursor-pointer pb-2 text-base font-semibold xl:text-lg'
            >
              <span className='text-primary'>Step- 2:</span> Presentation and
              Approval of Financial Statements to Board of Directors
            </p>
            <p
              className={`${openSection === 'stepTwo' ? 'h-28 sm:h-20' : 'h-0'}  text-muted-foreground-darker overflow-hidden text-xs duration-300 lg:text-sm`}
            >
              The Audit Report and Financial Statements are presented to the
              company’s Board of Directors during a Board Meeting. The Board
              reviews the Audit Report and, if satisfied, approves the Financial
              Statements in the same meeting. These Financial Statements are
              signed by auditor, Board of Directors and Key Managerial Person,
              if any.
            </p>
          </div>
          <div
            className={`-translate-x-1 border-l-4 px-3 duration-300 md:px-4 ${openSection === 'stepThree' ? 'mb-5 h-[204px] border-l-primary sm:h-[120px] md:h-[104px] lg:h-[120px]' : 'mb-7 h-8 sm:mb-2'}`}
          >
            <p
              onClick={() => toggleSection('stepThree')}
              className='cursor-pointer pb-2 text-base font-semibold xl:text-lg'
            >
              <span className='text-primary'>Step- 3:</span> Preparation of the
              Board Report
            </p>
            <p
              className={`${openSection === 'stepThree' ? 'h-36 sm:h-20' : 'h-0'}  text-muted-foreground-darker overflow-hidden text-xs duration-300 lg:text-sm`}
            >
              In addition, a Board Report is prepared by the Directors, which
              contains important details of the company such as its financial
              position, changes in the administration policies, any changes in
              shareholding or debenture holdings, changes in accounting
              policies, the number of Board Meetings held, details of auditors,
              and any Related Party Transactions, etc. This report is signed by
              the Board of Directors.
            </p>
          </div>
          <div
            className={`-translate-x-1 border-l-4 px-3 duration-300 md:px-4 ${openSection === 'stepFour' ? 'mb-5 h-[188px] border-l-primary sm:h-[104px] lg:h-[136px] xl:h-[120px]' : 'mb-7 h-8 sm:mb-2'}`}
          >
            <p
              onClick={() => toggleSection('stepFour')}
              className='cursor-pointer pb-2 text-base font-semibold xl:text-lg'
            >
              <span className='text-primary'>Step- 4:</span> Deciding the Date
              for the AGM
            </p>
            <p
              className={`${openSection === 'stepFour' ? 'h-32 sm:h-24' : 'h-0'}  text-muted-foreground-darker overflow-hidden text-xs duration-300 lg:text-sm`}
            >
              In this Board Meeting, the directors also approve the date for
              convening the Annual General Meeting (AGM). Following this, a
              Notice for the AGM, along with the Auditor’s Report, Audited
              Financial Statements, and Board Report, is sent to the
              shareholders/members of the company. This ensures that the
              shareholders have all relevant information to make an informed
              decision
            </p>
          </div>
          <div
            className={`-translate-x-1 border-l-4 pl-3 duration-300 sm:pl-3 md:px-4 ${openSection === 'stepFive' ? 'mb-5 h-[188px] border-l-primary sm:h-[104px] lg:h-[140px]' : 'mb-7 h-8 sm:mb-2'}`}
          >
            <p
              onClick={() => toggleSection('stepFive')}
              className='cursor-pointer pb-2 text-base font-semibold xl:text-lg'
            >
              <span className='text-primary'>Step- 5:</span> Holding of AGM and
              transacting business
            </p>
            <p
              className={`${openSection === 'stepFive' ? 'h-32 sm:h-24' : 'h-0'}  text-muted-foreground-darker overflow-hidden text-xs duration-300 lg:text-sm`}
            >
              At an Annual General Meeting (AGM), shareholders or members review
              the company’s performance and transact ordinary business matters,
              which includes approving the Financial Statements, Auditor’s
              Report, and Board of Director’s Report. They may also declare
              dividends, appoint or regularise Directors, and appoint Auditors.
              If necessary, special business may also be transacted.
            </p>
          </div>
          <div
            className={`-translate-x-1 border-l-4 px-3 duration-300 md:px-4 ${openSection === 'stepSix' ? 'h-[152px] border-l-primary sm:h-[104px] md:h-[88px] lg:h-[124px]' : 'h-8'}`}
          >
            <p
              onClick={() => toggleSection('stepSix')}
              className='cursor-pointer whitespace-nowrap pb-2 text-base font-semibold xl:text-lg'
            >
              <span className='text-primary'>Step- 6:</span> Filing of AOC-4 and
              MGT-7A
            </p>
            <p
              className={`${openSection === 'stepSix' ? 'h-32 sm:h-20' : 'h-0'}  text-muted-foreground-darker overflow-hidden text-xs duration-300 lg:text-sm`}
            >
              Within 30 days from the conclusion of the AGM, the company is
              required to file AOC-4 with the Registrar of Companies (ROC) for
              the submission of Financial Statements. Additionally, within 60
              days from the conclusion of the AGM, the company must file MGT-7
              or MGT-7A (depending on its category) to submit the Annual Return.
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

export default ProcessAnnualCompliance;
